import { action, internalMutation, mutation, query, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const getLearningPath = query({
    args: { courseId: v.id("courses") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("learningPaths")
            .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
            .unique();
    },
});

export const generateStudyPlan = action({
    args: { courseId: v.id("courses") },
    handler: async (ctx, args) => {
        // 1. Fetch all completed uploads for this course
        const uploads = await ctx.runQuery(api.courses.getUploads, { courseId: args.courseId });
        const completedUploads = uploads.filter(u => u.processingStatus === "completed");

        if (completedUploads.length === 0) {
            throw new Error("No processed files found. Please upload and process files first.");
        }

        // 2. Fetch a sample of text from each upload to understand content
        // For a full syllabus, we ideally want titles/headers, but for now we'll take the first few chunks
        let context = "";
        for (const upload of completedUploads) {
            const docs = await ctx.runQuery(internal.curriculum.getUploadChunks, { uploadId: upload._id });
            const sampleText = docs.slice(0, 3).map((d: any) => d.text).join("\n");
            context += `\n\nFile: ${upload.fileName}\nContent Sample:\n${sampleText}`;
        }

        // 3. Ask Gemini to create a syllabus/learning path
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `
            You are an expert curriculum designer. Based on the following course materials, create a structured learning path.
            The learning path should be a sequence of modules that progressively teach the material.

            COURSE MATERIALS:
            ${context}

            OUTPUT FORMAT (JSON array of modules):
            [
              {
                "title": "Module Title",
                "description": "Short description of what the student will learn",
                "estimatedDuration": 30, // in minutes
                "sourceUploadIds": [] // MUST be an array of string IDs from the provided uploads
              }
            ]

            Available Upload IDs:
            ${completedUploads.map(u => `${u._id} (${u.fileName})`).join("\n")}

            Rules:
            1. Create 3-7 modules depending on the depth of the material.
            2. Ensure each module title is catchy and educational.
            3. Each module must link to at least one sourceUploadId.
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Parse the JSON from Gemini
        let modules = [];
        try {
            const jsonMatch = responseText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                modules = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("Could not parse syllabus from AI response");
            }
        } catch (e) {
            console.error("AI Sync Error:", responseText);
            throw new Error("Failed to generate a valid study plan. Please try again.");
        }

        // 4. Save the learning path
        await ctx.runMutation(internal.curriculum.saveLearningPath, {
            courseId: args.courseId,
            modules: modules.map((m: any, index: number) => ({
                id: `mod_${index}`,
                title: m.title,
                description: m.description,
                sourceUploadIds: m.sourceUploadIds,
                isCompleted: false,
                order: index,
                estimatedDuration: m.estimatedDuration || 30,
            }))
        });

        return { success: true };
    }
});

export const getUploadChunks = internalQuery({
    args: { uploadId: v.id("uploads") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("documents")
            .withIndex("by_upload", (q) => q.eq("uploadId", args.uploadId))
            .take(10);
    }
});

export const saveLearningPath = internalMutation({
    args: {
        courseId: v.id("courses"),
        modules: v.array(v.any())
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("learningPaths")
            .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, { modules: args.modules });
        } else {
            await ctx.db.insert("learningPaths", {
                courseId: args.courseId,
                modules: args.modules
            });
        }
    }
});
