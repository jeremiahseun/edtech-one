/**
 * AML Generation Service
 *
 * Handles AML (Adaptive Markup Language) generation for the APEX Player.
 * - Free users: Pre-generated AML (cached in learningPaths)
 * - Pro users: On-demand generation with RAG personalization
 */

import { action, mutation, query, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// ============================================================================
// Queries
// ============================================================================

/**
 * Get session with AML history for the player
 */
export const getSession = query({
    args: { sessionId: v.id("sessions") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        const session = await ctx.db.get(args.sessionId);
        if (!session) return null;

        // Verify ownership
        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (!user || session.userId !== user._id) return null;

        return session;
    },
});

/**
 * Get pre-generated AML for a module (free tier)
 */
export const getPreGeneratedAML = query({
    args: {
        courseId: v.id("courses"),
        moduleId: v.string(),
    },
    handler: async (ctx, args) => {
        const learningPath = await ctx.db
            .query("learningPaths")
            .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
            .unique();

        const module = learningPath?.modules.find((m) => m.id === args.moduleId);
        return module?.preGeneratedAML ?? null;
    },
});

/**
 * Get Gemini API Key for client-side WebSocket connection
 * SECURITY WARNING: This exposes the API key to authenticated users.
 * For production, use a proxy or ephemeral tokens.
 */
export const getGeminiAPIKey = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");
        return process.env.GEMINI_API_KEY || "";
    },
});

// ============================================================================
// Actions (LLM Calls)
// ============================================================================

/**
 * Generate AML sequence on-demand (Pro users)
 * Uses RAG to fetch relevant context from uploaded documents
 */
export const generateAMLSequence = action({
    args: {
        courseId: v.id("courses"),
        moduleId: v.string(),
        topic: v.string(),
        userContext: v.optional(v.string()), // Additional context from user
    },
    handler: async (ctx, args) => {
        // 1. Get relevant document chunks via vector search
        const relevantChunks = await fetchRelevantChunks(ctx, args.courseId, args.topic);

        // 2. Build the AML generation prompt
        const prompt = buildAMLPrompt(args.topic, relevantChunks, args.userContext);

        // 3. Call LLM to generate AML
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // 4. Parse and validate AML
        const amlSequences = parseAMLResponse(responseText);

        return amlSequences;
    },
});

/**
 * Handle adaptive interrupt (student asks question mid-lesson)
 */
export const handleAdaptiveInterrupt = action({
    args: {
        sessionId: v.id("sessions"),
        question: v.string(),
        currentSequenceId: v.string(),
        currentTimestamp: v.number(),
    },
    handler: async (ctx, args) => {
        // 1. Get session context
        const session = await ctx.runQuery(internal.aml.getSessionInternal, {
            sessionId: args.sessionId,
        });

        if (!session) throw new Error("Session not found");

        // 2. Get relevant document chunks for the question
        const relevantChunks = await fetchRelevantChunks(
            ctx,
            session.courseId,
            args.question
        );

        // 3. Build correction/explanation prompt
        const prompt = buildInterruptPrompt(
            args.question,
            relevantChunks,
            session.topic
        );

        // 4. Generate explanation sequence
        let model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (e) {
            console.log("Gemini 2.5 failed, falling back to gemini-pro");
            model = genAI.getGenerativeModel({ model: "gemini-pro" });
            result = await model.generateContent(prompt);
        }
        const responseText = result.response.text();

        // 5. Parse response into AML sequence
        const explanationSequence = parseAMLResponse(responseText);

        // 6. Update session with the interrupt
        // 6. Update session with the interrupt
        await ctx.runMutation(internal.aml.addInterruptToHistory, {
            sessionId: args.sessionId,
            question: args.question,
            amlSequence: explanationSequence[0],
            pausedAt: {
                sequenceId: args.currentSequenceId,
                timestamp: args.currentTimestamp,
            },
        });

        return explanationSequence;
    },
});

/**
 * Search course materials (RAG) for Gemini Live
 */
export const search = action({
    args: {
        query: v.string(),
        courseId: v.id("courses")
    },
    handler: async (ctx, args) => {
        return await fetchRelevantChunks(ctx, args.courseId, args.query);
    }
});
// RETHINK: The frontend hook knows courseId.
// callback: searchContent: (query) => api.aml.search({ query, courseId })
// So I should update the action to take courseId.


/**
 * Validate checkpoint answer using LLM (for complex answers)
 */
export const validateCheckpointAnswer = action({
    args: {
        checkpointPrompt: v.string(),
        correctAnswer: v.optional(v.string()),
        userAnswer: v.string(),
        courseId: v.id("courses"),
    },
    handler: async (ctx, args) => {
        // For simple answers, try local validation first
        if (args.correctAnswer) {
            const normalizedCorrect = args.correctAnswer.toLowerCase().trim();
            const normalizedUser = args.userAnswer.toLowerCase().trim();

            if (normalizedUser === normalizedCorrect) {
                return { isCorrect: true, feedback: "Correct!" };
            }

            // Check for close matches (within edit distance)
            if (isCloseMatch(normalizedUser, normalizedCorrect)) {
                return { isCorrect: true, feedback: "Correct! (minor typo detected)" };
            }
        }

        // Fall back to LLM validation for complex/essay answers
        const prompt = `
You are evaluating a student's answer to a comprehension question.

Question: ${args.checkpointPrompt}
${args.correctAnswer ? `Expected Answer: ${args.correctAnswer}` : ''}
Student's Answer: ${args.userAnswer}

Evaluate if the student's answer is correct. Consider:
1. Core concept understanding (most important)
2. Terminology accuracy
3. Completeness of explanation

Respond in JSON format:
{
  "isCorrect": boolean,
  "feedback": "Brief, encouraging feedback",
  "partialCredit": number (0-100)
}
`;

        // Fall back to LLM validation for complex/essay answers
        let model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (e) {
            model = genAI.getGenerativeModel({ model: "gemini-pro" });
            result = await model.generateContent(prompt);
        }
        const responseText = result.response.text();

        try {
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch {
            // Fallback if JSON parsing fails
        }

        return {
            isCorrect: false,
            feedback: "Let's review this concept together.",
            partialCredit: 50,
        };
    },
});

// ============================================================================
// Mutations
// ============================================================================

/**
 * Create or resume a study session
 */
export const createSession = mutation({
    args: {
        courseId: v.id("courses"),
        moduleId: v.string(),
        topic: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (!user) throw new Error("User not found");

        // Check for existing active session
        const existingSessions = await ctx.db
            .query("sessions")
            .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
            .collect();

        const activeSession = existingSessions.find(
            (s) => s.userId === user._id && s.moduleId === args.moduleId && s.status !== 'completed'
        );

        if (activeSession) {
            // Resume existing session
            await ctx.db.patch(activeSession._id, { status: 'active' });
            return activeSession._id;
        }

        // Create new session
        const sessionId = await ctx.db.insert("sessions", {
            userId: user._id,
            courseId: args.courseId,
            moduleId: args.moduleId,
            topic: args.topic,
            startTime: Date.now(),
            status: 'active',
            history: [],
            compressedHistory: [],
        });

        return sessionId;
    },
});

/**
 * Update session playback progress
 */
export const updateSessionProgress = mutation({
    args: {
        sessionId: v.id("sessions"),
        currentSequenceId: v.string(),
        currentTimestamp: v.number(),
        status: v.optional(v.union(
            v.literal('active'),
            v.literal('paused'),
            v.literal('completed')
        )),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        await ctx.db.patch(args.sessionId, {
            currentSequenceId: args.currentSequenceId,
            currentTimestamp: args.currentTimestamp,
            status: args.status,
        });
    },
});

/**
 * Add AML sequence to session history
 */
export const addSequenceToHistory = mutation({
    args: {
        sessionId: v.id("sessions"),
        amlSequence: v.any(),
        role: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const session = await ctx.db.get(args.sessionId);
        if (!session) throw new Error("Session not found");

        const newHistory = [
            ...session.history,
            {
                role: args.role,
                content: args.amlSequence.title || 'Sequence',
                amlSequence: args.amlSequence,
                timestamp: Date.now(),
            },
        ];

        // Compress old history if it's getting too long
        if (newHistory.length > 10) {
            const toCompress = newHistory.slice(0, newHistory.length - 5);
            const compressed = toCompress
                .filter((h) => h.amlSequence)
                .map((h) => ({
                    id: h.amlSequence.id || String(h.timestamp),
                    title: h.amlSequence.title,
                    summary: h.content,
                    duration: h.amlSequence.duration || 0,
                    checkpointPassed: true,
                    timestamp: h.timestamp,
                }));

            await ctx.db.patch(args.sessionId, {
                history: newHistory.slice(-5),
                compressedHistory: [...(session.compressedHistory || []), ...compressed],
            });
        } else {
            await ctx.db.patch(args.sessionId, { history: newHistory });
        }
    },
});

/**
 * Award XP for completing a sequence or checkpoint
 */
export const awardXP = mutation({
    args: {
        amount: v.number(),
        reason: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (!user) throw new Error("User not found");

        // Update XP
        await ctx.db.patch(user._id, {
            totalXp: (user.totalXp || 0) + args.amount,
        });

        // Update streak if needed
        const today = new Date().toISOString().split("T")[0];
        if (user.lastStudyDate !== today) {
            const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
            const newStreak = user.lastStudyDate === yesterday ? user.currentStreak + 1 : 1;

            await ctx.db.patch(user._id, {
                currentStreak: newStreak,
                lastStudyDate: today,
            });
        }

        return { newXp: (user.totalXp || 0) + args.amount };
    },
});

// ============================================================================
// Internal Functions
// ============================================================================

export const getSessionInternal = internalQuery({
    args: { sessionId: v.id("sessions") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.sessionId);
    },
});

export const addInterruptToHistory = internalMutation({
    args: {
        sessionId: v.id("sessions"),
        question: v.string(),
        amlSequence: v.any(),
        pausedAt: v.object({
            sequenceId: v.string(),
            timestamp: v.number(),
        }),
    },
    handler: async (ctx, args) => {
        const session = await ctx.db.get(args.sessionId);
        if (!session) throw new Error("Session not found");

        const newHistory = [
            ...session.history,
            {
                role: 'user',
                content: args.question,
                timestamp: Date.now(),
            },
            {
                role: 'assistant',
                content: 'Adaptive explanation',
                amlSequence: args.amlSequence,
                timestamp: Date.now(),
            },
        ];

        await ctx.db.patch(args.sessionId, {
            history: newHistory,
            currentSequenceId: args.pausedAt.sequenceId,
            currentTimestamp: args.pausedAt.timestamp,
        });
    },
});

// ============================================================================
// Helper Functions
// ============================================================================

async function fetchRelevantChunks(
    ctx: any,
    courseId: string,
    query: string
): Promise<string[]> {
    try {
        // Get embeddings for the query
        const model = genAI.getGenerativeModel({ model: "embedding-001" });
        const result = await model.embedContent(query);
        const queryEmbedding = result.embedding.values;

        // Search vector index
        const results = await ctx.vectorSearch("documents", "by_embedding", {
            vector: queryEmbedding,
            limit: 5,
        });

        // Filter to only documents from this course's uploads
        const uploads = await ctx.runQuery(internal.aml.getUploadsForCourse, { courseId });
        const uploadIds = new Set(uploads.map((u: any) => u._id));

        const relevantDocs = results
            .filter((r: any) => uploadIds.has(r.uploadId))
            .map((r: any) => r.text);

        return relevantDocs;
    } catch (error) {
        console.error("Error fetching relevant chunks:", error);
        return [];
    }
}

export const getUploadsForCourse = internalQuery({
    args: { courseId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("uploads")
            .withIndex("by_course", (q) => q.eq("courseId", args.courseId as any))
            .collect();
    },
});

function buildAMLPrompt(
    topic: string,
    contextChunks: string[],
    userContext?: string
): string {
    const context = contextChunks.join("\n\n---\n\n");

    return `
You are an expert AI tutor creating an interactive lesson using AML (Adaptive Markup Language).

    TOPIC: ${topic}
${userContext ? `STUDENT CONTEXT: ${userContext}` : ''}

RELEVANT COURSE MATERIAL:
${context || 'No specific context provided - use general knowledge'}

Generate an engaging, educational AML sequence that explains this topic.The sequence should:
1. Start with a friendly introduction
2. Break down the concept into digestible parts
3. Use visual elements on the whiteboard
4. Include equations where relevant(use LaTeX format)
5. End with a comprehension checkpoint

OUTPUT FORMAT(JSON array of AMLSequence):
[
    {
        "id": "unique-id",
        "title": "Sequence Title",
        "duration": 120,
        "actions": [
            {
                "at": 0,
                "type": "instructor",
                "content": {
                    "mode": "abstract",
                    "emotion": "friendly",
                    "speak": "Welcome! Today we're going to explore...",
                    "gesture": "wave"
                }
            },
            {
                "at": 5,
                "type": "board",
                "content": {
                    "zone": "center",
                    "elements": [
                        {
                            "id": "title-1",
                            "type": "text",
                            "position": { "x": 400, "y": 50 },
                            "style": { "fontSize": 32, "fontWeight": "bold" },
                            "content": { "text": "Topic Title" },
                            "animation": { "type": "fadeIn", "duration": 500 }
                        }
                    ]
                }
            },
            {
                "at": 30,
                "type": "board",
                "content": {
                    "zone": "center",
                    "elements": [
                        {
                            "id": "equation-1",
                            "type": "equation",
                            "position": { "x": 400, "y": 200 },
                            "content": { "latex": "E = mc^2" },
                            "animation": { "type": "draw", "duration": 1000 }
                        }
                    ]
                }
            }
        ],
        "checkpoint": {
            "id": "checkpoint-1",
            "type": "comprehension",
            "prompt": "What is the key concept we just learned?",
            "acceptInput": true,
            "options": ["Option A", "Option B", "Option C"],
            "correctAnswer": "Option B",
            "xpReward": 20
        }
    }
]

IMPORTANT:
- Use timestamps(in seconds) for the "at" field
    - Keep speak text conversational and encouraging
        - Use LaTeX for any mathematical expressions(\\frac{ a }{ b }, \\sqrt{ x }, etc.)
            - Include visual animations to keep engagement high
                - The checkpoint should test genuine understanding

Generate the AML sequence now:
`;
}

function buildInterruptPrompt(
    question: string,
    contextChunks: string[],
    currentTopic: string
): string {
    const context = contextChunks.join("\n\n---\n\n");

    return `
You are an AI tutor responding to a student's question during a lesson.

CURRENT TOPIC: ${currentTopic}
STUDENT'S QUESTION: ${question}

RELEVANT MATERIAL:
${context || 'Use your knowledge to help the student'}

Generate a brief, focused AML sequence that directly answers the student's question.
Keep it concise(30 - 60 seconds) and return to the main lesson flow afterward.

OUTPUT FORMAT(JSON array with single AMLSequence):
[
    {
        "id": "explanation-${Date.now()}",
        "title": "Answer: ${question.slice(0, 30)}...",
        "actions": [
            {
                "at": 0,
                "type": "instructor",
                "content": {
                    "mode": "abstract",
                    "emotion": "thoughtful",
                    "speak": "Great question! Let me explain...",
                    "gesture": "thinking"
                }
            }
            // Add board elements as needed
        ]
    }
]

Generate the explanation sequence:
`;
}

function parseAMLResponse(responseText: string): any[] {
    try {
        // Try to extract JSON from the response
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return Array.isArray(parsed) ? parsed : [parsed];
        }
    } catch (error) {
        console.error("Error parsing AML response:", error);
    }

    // Return a fallback sequence if parsing fails
    return [
        {
            id: `fallback - ${Date.now()} `,
            title: "Generated Lesson",
            actions: [
                {
                    at: 0,
                    type: "instructor",
                    content: {
                        mode: "abstract",
                        emotion: "friendly",
                        speak: responseText.slice(0, 500),
                        gesture: "nod",
                    },
                },
            ],
        },
    ];
}

function isCloseMatch(str1: string, str2: string): boolean {
    // Simple Levenshtein distance check for close matches
    if (Math.abs(str1.length - str2.length) > 3) return false;

    let differences = 0;
    const minLength = Math.min(str1.length, str2.length);

    for (let i = 0; i < minLength; i++) {
        if (str1[i] !== str2[i]) differences++;
        if (differences > 2) return false;
    }

    return differences + Math.abs(str1.length - str2.length) <= 2;
}
