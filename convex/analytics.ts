import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const logInsight = mutation({
    args: {
        sessionId: v.id("sessions"),
        type: v.string(),
        topic: v.string(),
        observation: v.string(),
        confidence: v.optional(v.number())
    },
    handler: async (ctx, args) => {
        const session = await ctx.db.get(args.sessionId);
        if (!session) return; // Should we throw? For analytics, better to silently fail than crash the lesson.

        await ctx.db.insert("insights", {
            ...args,
            courseId: session.courseId,
            timestamp: Date.now(),
        });
    }
});
