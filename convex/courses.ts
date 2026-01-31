import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createCourse = mutation({
    args: {
        title: v.string(),
        description: v.optional(v.string()),
        colorTheme: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (!user) throw new Error("User not found");

        const courseId = await ctx.db.insert("courses", {
            userId: user._id,
            title: args.title,
            description: args.description,
            colorTheme: args.colorTheme,
        });

        return courseId;
    },
});

export const generateUploadUrl = mutation({
    args: {},
    handler: async (ctx) => {
        return await ctx.storage.generateUploadUrl();
    },
});

export const saveUpload = mutation({
    args: {
        storageId: v.id("_storage"),
        fileName: v.string(),
        fileType: v.string(),
        courseId: v.id("courses"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const uploadId = await ctx.db.insert("uploads", {
            courseId: args.courseId,
            fileName: args.fileName,
            storageId: args.storageId,
            fileType: args.fileType,
            processingStatus: "pending",
        });

        return uploadId;
    },
});

export const getUploads = query({
    args: { courseId: v.id("courses") },
    handler: async (ctx, args) => {
        const uploads = await ctx.db
            .query("uploads")
            .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
            .collect();
        return uploads;
    }
});

export const getCourse = query({
    args: { courseId: v.id("courses") },
    handler: async (ctx, args) => {
        const course = await ctx.db.get(args.courseId);
        return course;
    }
});
