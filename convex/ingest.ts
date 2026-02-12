import { action, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { internal } from "./_generated/api";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const processPdf = action({
    args: { uploadId: v.id("uploads"), storageId: v.id("_storage") },
    handler: async (ctx, args) => {
        // 1. Fetch file URL from Convex Storage
        const fileUrl = await ctx.storage.getUrl(args.storageId);
        if (!fileUrl) throw new Error("File not found");

        // 2. Fetch the file content
        const response = await fetch(fileUrl);
        const arrayBuffer = await response.arrayBuffer();

        // Convert ArrayBuffer to base64 without Node.js Buffer (Convex uses V8, not Node)
        const uint8Array = new Uint8Array(arrayBuffer);
        let binary = '';
        for (let i = 0; i < uint8Array.length; i++) {
            binary += String.fromCharCode(uint8Array[i]);
        }
        const base64Data = btoa(binary);

        // 3. Update status to processing
        await ctx.runMutation(internal.ingest.updateStatus, {
            uploadId: args.uploadId,
            status: "processing"
        });

        try {
            // 4. Use Gemini 1.5 Flash to extract text
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            // We prompt Gemini to be a PDF extractor
            const prompt = "Extract all the text from this document. Preserve structure where possible. Be concise.";

            const result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        data: base64Data,
                        mimeType: "application/pdf",
                    },
                },
            ]);

            const text = result.response.text();

            // 5. Chunk and Embed the extracted text
            // (Simple chunking for now)
            const chunkSize = 1000;
            const chunks = [];
            for (let i = 0; i < text.length; i += chunkSize) {
                chunks.push(text.slice(i, i + chunkSize));
            }

            const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });

            for (const chunk of chunks) {
                const embedResult = await embeddingModel.embedContent(chunk);
                const embedding = embedResult.embedding.values;

                await ctx.runMutation(internal.ingest.storeEmbedding, {
                    uploadId: args.uploadId,
                    text: chunk,
                    embedding: embedding
                });
            }

            // 6. Complete
            await ctx.runMutation(internal.ingest.updateStatus, {
                uploadId: args.uploadId,
                status: "completed"
            });

        } catch (error) {
            console.error("Processing failed", error);
            await ctx.runMutation(internal.ingest.updateStatus, {
                uploadId: args.uploadId,
                status: "failed"
            });
            throw error;
        }
    }
});

// Internal mutations for the action to call
export const storeEmbedding = internalMutation({
    args: { uploadId: v.id("uploads"), text: v.string(), embedding: v.array(v.number()) },
    handler: async (ctx, args) => {
        await ctx.db.insert("documents", {
            uploadId: args.uploadId,
            text: args.text,
            embedding: args.embedding,
            metadata: {},
        });
    },
});

export const updateStatus = internalMutation({
    args: {
        uploadId: v.id("uploads"),
        status: v.union(
            v.literal('pending'),
            v.literal('processing'),
            v.literal('completed'),
            v.literal('failed')
        )
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.uploadId, { processingStatus: args.status });
    },
});

// Helpers (Mock implementations for now)
async function extractTextFromPdf(blob: Blob): Promise<string> {
    // TODO: Implement actual PDF parsing (e.g. pdf-parse or similar)
    return "Mock text content from PDF";
}

function chunkText(text: string): string[] {
    // TODO: Implement actual chunking
    return [text];
}
