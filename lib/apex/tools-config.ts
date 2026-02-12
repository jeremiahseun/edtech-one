export const GEMINI_TOOLS_DECLARATION = [
    {
        functionDeclarations: [
            {
                name: "updateBoard",
                description: "Updates the whiteboard with text, equations, diagrams, or shapes. Use this to visually explain concepts.",
                parameters: {
                    type: "object",
                    properties: {
                        clear: { type: "boolean", description: "Whether to clear the board first" },
                        zone: { type: "string", enum: ["left", "center", "right", "full"] },
                        elements: {
                            type: "array",
                            description: "List of visual elements to add",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "string" },
                                    type: { type: "string", enum: ["text", "equation", "shape", "diagram", "code"] },
                                    position: {
                                        type: "object",
                                        properties: {
                                            x: { type: "number" },
                                            y: { type: "number" },
                                            width: { type: "number" },
                                            height: { type: "number" }
                                        }
                                    },
                                    content: { type: "object", description: "Content object specific to type (text, latex, shape, etc)" },
                                    style: { type: "object", description: "Style properties (fill, stroke, fontSize, etc)" }
                                }
                            }
                        }
                    }
                }
            },
            {
                name: "triggerCheckpoint",
                description: "Pauses the lesson to ask the student a formal multiple-choice or open-ended question.",
                parameters: {
                    type: "object",
                    properties: {
                        prompt: { type: "string" },
                        correctAnswer: { type: "string" },
                        options: { type: "array", items: { type: "string" } },
                        xpReward: { type: "number" }
                    },
                    required: ["prompt", "correctAnswer"]
                }
            },
            {
                name: "reportLearningInsight",
                description: "Logs an observation about the student's current learning state (confusion, mastery, etc).",
                parameters: {
                    type: "object",
                    properties: {
                        type: { type: "string", enum: ["confusion", "mastery", "engagement", "frustration", "curiosity"] },
                        topic: { type: "string" },
                        observation: { type: "string" },
                        confidence: { type: "number" }
                    },
                    required: ["type", "topic", "observation"]
                }
            },
            {
                name: "searchCourseMaterial",
                description: "Searches the course's uploaded documents for relevant information to answer student questions.",
                parameters: {
                    type: "object",
                    properties: {
                        query: { type: "string" }
                    },
                    required: ["query"]
                }
            }
        ]
    }
];

export const SYSTEM_INSTRUCTION = `
You are an expert AI tutor named "Apex".
1. Teach dynamically using the whiteboard (updateBoard). NEVER talk for more than 2 sentences without drawing something.
2. MONITOR the student's understanding. If they ask a question, answer it visually.
3. If they seem confused, log 'confusion' using reportLearningInsight, then explain simpler.
4. Keep the tone encouraging, energetic, and concise.
5. Use "searchCourseMaterial" if you need specific facts from the uploaded content.
`;
