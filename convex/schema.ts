import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // Users (Students)
    users: defineTable({
        email: v.string(),
        tokenIdentifier: v.string(), // Clerk ID
        fullName: v.string(),
        university: v.optional(v.string()),
        major: v.optional(v.string()),
        studyStruggle: v.optional(v.string()),
        subscriptionStatus: v.union(v.literal('free'), v.literal('pro')),
        stripeCustomerId: v.optional(v.string()),
        currentStreak: v.number(),
        totalXp: v.number(),
        lastStudyDate: v.optional(v.string()), // ISO date for streak calc
        onboardingCompleted: v.optional(v.boolean()),
    })
        .index("by_email", ["email"])
        .index("by_token", ["tokenIdentifier"]),

    // Courses (Created by Students)
    courses: defineTable({
        userId: v.id("users"),
        title: v.string(),
        description: v.optional(v.string()),
        colorTheme: v.optional(v.string()), // For UI customization
    }).index("by_user", ["userId"]),

    // Content Uploads (Raw Materials)
    uploads: defineTable({
        courseId: v.id("courses"),
        fileName: v.string(),
        storageId: v.id("_storage"), // Convex Storage ID
        fileType: v.string(),
        processingStatus: v.union(
            v.literal('pending'),
            v.literal('processing'),
            v.literal('completed'),
            v.literal('failed')
        ),
        summary: v.optional(v.string()),
    }).index("by_course", ["courseId"]),

    // Learning Paths (The AI Generated Curriculum)
    learningPaths: defineTable({
        courseId: v.id("courses"),
        modules: v.array(v.object({
            id: v.string(), // Unique identifier for the module
            title: v.string(),
            description: v.string(),
            sourceUploadIds: v.array(v.id("uploads")),
            isCompleted: v.boolean(),
            order: v.number(), // Order in the learning path
            estimatedDuration: v.optional(v.number()), // Estimated time in minutes
            // Pre-generated AML for free tier users (cached)
            preGeneratedAML: v.optional(v.any()), // AMLSequence[]
            preGeneratedAt: v.optional(v.number()), // Timestamp when generated
        })),
    }).index("by_course", ["courseId"]),

    // Sessions (Active Study Sessions)
    sessions: defineTable({
        userId: v.id("users"),
        courseId: v.id("courses"),
        moduleId: v.optional(v.string()), // Which module in learning path
        topic: v.string(),
        startTime: v.number(),
        // Playback state for session resumption
        currentSequenceId: v.optional(v.string()),
        currentTimestamp: v.optional(v.number()), // Playback position in seconds
        status: v.optional(v.union(
            v.literal('active'),
            v.literal('paused'),
            v.literal('completed')
        )),
        // Full history with AML sequences
        history: v.array(v.object({
            role: v.string(), // 'user' | 'assistant'
            content: v.string(),
            amlSequence: v.optional(v.any()), // Generated AML sequence (for recent entries)
            timestamp: v.number(),
        })),
        // Compressed history for older sequences (summarized)
        compressedHistory: v.optional(v.array(v.object({
            id: v.string(),
            title: v.optional(v.string()),
            summary: v.string(),
            duration: v.number(),
            checkpointPassed: v.boolean(),
            timestamp: v.number(),
        }))),
    })
        .index("by_user", ["userId"])
        .index("by_course", ["courseId"]),

    // Daily Goals
    dailyGoals: defineTable({
        userId: v.id("users"),
        date: v.string(), // YYYY-MM-DD
        goals: v.array(v.object({
            id: v.string(),
            title: v.string(),
            xpReward: v.number(),
            isCompleted: v.boolean(),
            type: v.string(), // 'quiz', 'review', 'summary', etc.
        })),
    }).index("by_user_date", ["userId", "date"]),

    // Live Learning Insights (Gemini Observations)
    insights: defineTable({
        sessionId: v.id("sessions"),
        courseId: v.id("courses"),
        type: v.string(), // 'confusion', 'mastery', 'engagement', 'frustration', 'curiosity'
        topic: v.string(),
        confidence: v.optional(v.number()), // 0.0 to 1.0
        observation: v.string(),
        timestamp: v.number(),
    })
        .index("by_session", ["sessionId"])
        .index("by_course_type", ["courseId", "type"]),

    // Vector Embeddings
    documents: defineTable({
        uploadId: v.id("uploads"),
        text: v.string(),
        embedding: v.array(v.number()), // Vector for semantic search
        metadata: v.any(),
    })
        .index("by_upload", ["uploadId"])
        .vectorIndex("by_embedding", {
            vectorField: "embedding",
            dimensions: 768, // Depends on embedding model (e.g., Gemini text-embedding)
        }),
});
