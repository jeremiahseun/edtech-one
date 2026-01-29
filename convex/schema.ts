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
      title: v.string(),
      description: v.string(),
      sourceUploadIds: v.array(v.id("uploads")),
      isCompleted: v.boolean(),
    })),
  }).index("by_course", ["courseId"]),

  // Sessions (Active Study Sessions)
  sessions: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    topic: v.string(),
    startTime: v.number(),
    history: v.array(v.object({
      role: v.string(), // 'user' | 'assistant'
      content: v.string(),
      timestamp: v.number(),
    })),
  }).index("by_user", ["userId"]),

  // Vector Embeddings
  documents: defineTable({
    uploadId: v.id("uploads"),
    text: v.string(),
    embedding: v.array(v.number()), // Vector for semantic search
    metadata: v.any(),
  }).vectorIndex("by_embedding", {
    vectorField: "embedding",
    dimensions: 768, // Depends on embedding model (e.g., Gemini text-embedding)
  }),
});
