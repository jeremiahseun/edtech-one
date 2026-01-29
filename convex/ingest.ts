import { action, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { internal } from "./_generated/api";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const processPdf = action({
  args: { uploadId: v.id("uploads"), storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    // 1. Fetch file from Convex Storage
    const fileUrl = await ctx.storage.getUrl(args.storageId);
    if (!fileUrl) throw new Error("File not found");

    const response = await fetch(fileUrl);
    const blob = await response.blob();

    // 2. Extract Text (Placeholder - needs specific PDF parser)
    const text = await extractTextFromPdf(blob);

    // 3. Generate Embeddings
    const model = genAI.getGenerativeModel({ model: "embedding-001" });
    const chunks = chunkText(text);

    for (const chunk of chunks) {
      const result = await model.embedContent(chunk);
      const embedding = result.embedding.values;

      // 4. Store in Convex Vector DB
      await ctx.runMutation(internal.ingest.storeEmbedding, {
        uploadId: args.uploadId,
        text: chunk,
        embedding: embedding
      });
    }

    // 5. Update Status
    await ctx.runMutation(internal.ingest.completeUpload, { uploadId: args.uploadId });
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

export const completeUpload = internalMutation({
  args: { uploadId: v.id("uploads") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.uploadId, { processingStatus: "completed" });
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
