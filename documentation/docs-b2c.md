# APEX B2C: Technical Documentation (University Edition)

## From AI Tutor to Personal Study Companion

-----

# TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
1. [MVP Definition & Scope](#mvp-definition--scope)
1. [MVP Technical Architecture](#mvp-technical-architecture)
1. [Complete Implementation Guide](#complete-implementation-guide)
1. [RAG & Content Ingestion](#rag--content-ingestion)
1. [Gamification & Retention](#gamification--retention)
1. [Technology Stack & Costs](#technology-stack--costs)
1. [Development Phases & Timeline](#development-phases--timeline)
1. [User Interface & Screen Flows](#user-interface--screen-flows)
1. [Monetization Strategy](#monetization-strategy)
1. [Testing & Iteration Plan](#testing--iteration-plan)
1. [Deployment & Scaling](#deployment--scaling)

-----

# 1. EXECUTIVE SUMMARY

**What We’re Building**: The ultimate AI study companion for university students. Users upload their course materials (PDFs, slides, notes), and APEX converts them into interactive, "video-like" adaptive lessons, effectively replacing passive reading with active, personalized tutoring.

**MVP Goal**: Launch a direct-to-consumer (B2C) web platform in 6-8 weeks targeting undergraduates.

**Target Audience**: Undergraduate students in STEM and Humanities who struggle with complex course material or want to optimize their study time.

**Core Value Proposition**: "Don't just read your lecture notes—watch them." APEX turns dry PDFs into an engaging, interactive tutor that answers your specific questions.

-----

# 2. MVP DEFINITION & SCOPE

## 2.1 What’s IN the MVP

### Must-Have Features:

1. ✅ **Personalized Dashboard**: Student-centric view of courses and progress.
1. ✅ **Content Ingestion (RAG)**: Upload PDF, PPTX, TXT files via Convex File Storage.
1. ✅ **Curriculum Generation**: AI builds a "Study Path" based on uploaded files.
1. ✅ **Core APEX Player**: The "Video-like" renderer (adapted for older students).
1. ✅ **Adaptive Explanations**: Concepts explained at university level.
1. ✅ **Gamification Engine**: Streaks, XP, Daily Goals.
1. ✅ **Interactive Checkpoints**: Quizzes generated from *user's own content*.
1. ✅ **Note Taking**: Integrated notes alongside the player.
1. ✅ **Payment Integration**: Stripe (Monthly/Semester/Yearly).

### Success Criteria:

- A student can upload a 50-page PDF and start a lesson in <2 minutes.
- The AI correctly identifies key concepts from uploaded materials.
- System maintains context across a semester-long course.
- Mobile-responsive (students study on phones/tablets).
- < 1% hallucination rate on factual queries (grounded in uploaded docs).

## 2.2 What’s NOT in MVP (Post-MVP)

- ❌ Social/Community features (Study groups).
- ❌ Official University Integrations (Canvas/Blackboard).
- ❌ Live Human Tutoring.
- ❌ Native Mobile Apps (Web only initially).
- ❌ Complex Equation Editors (LaTex rendering only).
- ❌ Peer-to-Peer sharing of notes.

## 2.3 MVP User Stories

**As a Student:**

- I can sign up and create a "Course" (e.g., "Intro to Linear Algebra").
- I can upload my professor's lecture slides or a textbook chapter.
- I can click "Teach Me This" and watch an AI avatar explain the concepts.
- I can interrupt the explanation to ask, "How does this relate to the previous slide?"
- I earn XP and maintain a streak for studying every day.

**As the System:**

- I ingest documents, chunk them, and store embeddings (Vector DB).
- I generate a "Table of Contents" (Learning Path) from the raw data.
- I dynamically generate scripts (AML) grounded in the source material.

-----

# 3. MVP TECHNICAL ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│               B2C ARCHITECTURE (Convex Stack)               │
└─────────────────────────────────────────────────────────────┘

                    FRONTEND (Single Page App)
┌─────────────────────────────────────────────────────────────┐
│  Next.js 16 + React 19 + TypeScript                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Study     │  │    Upload    │  │    APEX      │      │
│  │   Dashboard  │  │   Manager    │  │   Player     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │ Convex Client (WebSocket/HTTP)
                         ▼
                    BACKEND (Serverless)
┌─────────────────────────────────────────────────────────────┐
│  Convex (The Backend-as-a-Service)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Database   │  │   Actions    │  │    Vector    │      │
│  │  (Documents) │  │ (3rd Party)  │  │    Search    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         ▲               │               │                   │
│         │               │               ▼                   │
│         │               │      ┌─────────────────┐          │
│         │               │      │  DeepSeek-V3    │          │
│         │               │      │  (Reasoning)    │          │
│         │               │      └─────────────────┘          │
│         │               ▼                                   │
│         │      ┌─────────────────┐  ┌─────────────────┐     │
│         │      │  Google Gemini  │  │  Convex Storage │     │
│         │      │  2.5 Flash      │  │  (Files)        │     │
│         │      └─────────────────┘  └─────────────────┘     │
└─────────┼───────────────────────────────────────────────────┘
          │
          ▼
    ┌─────────────┐
    │   Stripe    │
    │  (Payment)  │
    └─────────────┘
```

-----

# 4. COMPLETE IMPLEMENTATION GUIDE

## 4.1 Convex Database Schema

Convex uses a document-oriented schema defined in TypeScript.

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users (Students)
  users: defineTable({
    email: v.string(),
    fullName: v.string(),
    university: v.optional(v.string()),
    major: v.optional(v.string()),
    subscriptionStatus: v.union(v.literal('free'), v.literal('pro')),
    stripeCustomerId: v.optional(v.string()),
    currentStreak: v.number(),
    totalXp: v.number(),
    lastStudyDate: v.optional(v.string()), // ISO date for streak calc
  }).index("by_email", ["email"]),

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
```

## 4.2 Ingestion & RAG Pipeline (Convex + Gemini)

Convex Actions allow us to run long-running jobs (like calling LLMs).

```typescript
// convex/ingest.ts
import { action, internalMutation } from "./_generated/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const processPdf = action({
  args: { uploadId: v.id("uploads"), storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    // 1. Fetch file from Convex Storage
    const fileUrl = await ctx.storage.getUrl(args.storageId);
    if (!fileUrl) throw new Error("File not found");

    const response = await fetch(fileUrl);
    const blob = await response.blob();

    // 2. Extract Text (or send to Gemini if multimodal)
    // For cost/speed, we might use a lightweight PDF parser here
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
```

## 4.3 LLM Service (DeepSeek & Gemini Strategy)

We use a hybrid approach:
- **Gemini 2.5 Flash**: Fast, cheap, multimodal (can "see" diagrams in PDFs).
- **DeepSeek-V3**: Excellent reasoning for complex math/logic questions, extremely cheap.

```typescript
// convex/llm.ts
import { action } from "./_generated/server";

export const generateExplanation = action({
  args: {
    query: v.string(),
    contextDocs: v.array(v.string())
  },
  handler: async (ctx, args) => {
    // Construct prompt
    const context = args.contextDocs.join("\n\n");
    const prompt = `Context:\n${context}\n\nQuestion: ${args.query}`;

    // CHOICE: Use DeepSeek for complex reasoning
    if (isComplexQuery(args.query)) {
      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "deepseek-chat", // V3
          messages: [{ role: "user", content: prompt }]
        })
      });
      return await response.json();
    }

    // DEFAULT: Use Gemini 2.5 Flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  }
});
```

-----

# 5. GAMIFICATION & RETENTION

Since there is no teacher enforcement, the system must intrinsically motivate the student.

## 5.1 The "Study Streak"

- **Mechanic**: User must complete at least one "Concept Block" (5-10 min session) every 24 hours.
- **UI**: Fire icon in top right with number of days.
- **Freeze**: Premium users get 1 "Streak Freeze" per month.

## 5.2 XP and Levels

- **Action** -> **XP Reward**
  - Uploading a document -> 50 XP
  - Watching a sequence -> 10 XP
  - Answering a checkpoint correctly -> 20 XP
  - Completing a module -> 100 XP
- **Levels**: "Novice", "Scholar", "Researcher", "Professor", "Dean".

## 5.3 Daily Goals

- System suggests 3 tasks per day:
  1. "Review Linear Regression" (Spaced Repetition)
  2. "Learn new topic: Eigenvalues"
  3. "Quiz: Chapter 4"

-----

# 6. TECHNOLOGY STACK & COSTS

## 6.1 Core Stack

| Component | Technology | Why |
|-----------|------------|-----|
| **Frontend** | Next.js 16 + Tailwind | Standard, fast, responsive |
| **Backend** | **Convex** | Real-time, serverless, built-in vector search |
| **Database** | **Convex** | Seamless type safety, reactive |
| **Storage** | **Convex File Storage** | Built-in, easy integration (Transition to R2 later) |
| **Primary LLM** | **Gemini 2.5 Flash** | Fast, multimodal, cutting edge |
| **Reasoning LLM**| **DeepSeek-V3** | "Stupid cheap" (~$0.14/1M tokens), GPT-4 class logic |
| **Auth** | Clerk or Convex Auth | Simple, secure |
| **Payments** | Stripe | Industry standard |

## 6.2 Cost Estimates (B2C Scale)

**Scenario**: 1,000 active students.
- **Convex**: $0 (Generous free tier initially) -> then usage based.
- **Storage**: Convex includes storage.
- **DeepSeek**: 1M input tokens = $0.14. If avg student uses 50k tokens/month -> $0.007/student.
- **Gemini**: Free tier covers significant usage (15 RPM).

**Total Cost per User**: < $0.10/month (excluding stripe fees).
**Revenue per User**: $12.00/month.
**Margin**: > 95%.

-----

# 7. DEVELOPMENT PHASES & TIMELINE

## Phase 0: Foundation (Week 1)
- Setup Next.js & Convex project.
- Configure Convex Auth (with Clerk).
- Setup Convex Storage.

## Phase 1: The "Knowledge Base" (Weeks 2-3)
- Build File Upload UI (Direct upload to Convex Storage).
- Implement Ingestion Action (Gemini Embedding -> Convex Vector).
- *Deliverable*: User uploads a PDF and can see a "Summary" of it.

## Phase 2: The APEX Player (Weeks 4-5)
- Implement the AML Renderer (Canvas).
- Connect DeepSeek/Gemini to generate AML scripts.
- *Deliverable*: User asks a question about the PDF, Avatar explains it visually.

## Phase 3: Gamification & Polish (Week 6)
- Add XP, Streaks, Levels (Convex tables).
- Build "Study Dashboard".
- *Deliverable*: The loop "Upload -> Study -> Reward" is complete.

## Phase 4: Launch Prep (Week 7-8)
- Stripe Integration.
- Landing Page.
- Beta Launch.

-----

# 9. USER INTERFACE & SCREEN FLOWS

**Design Philosophy**: "Clean, Focus-Oriented, Gamified." Think *Duolingo* meets *Notion*.
**Platform**: Desktop First (Web).

## Flow 1: Onboarding & Auth
*Goal: Get the user to sign up and understand the value prop instantly.*

**Screen 1.1: Landing Page**
- **Hero Section**: "Turn your lecture notes into a personal tutor."
- **Visual**: Split screen showing a boring PDF on left transforming into an animated APEX lesson on right.
- **CTA**: "Start Studying for Free".
- **Social Proof**: "Used by students at [University Logos]".

**Screen 1.2: Auth Modal (Clerk/Convex)**
- **Features**: Google Login, Email/Password.
- **Context**: Appears over the landing page (dimmed background).

**Screen 1.3: Onboarding Questionnaire**
- **Question 1**: "What's your major?" (Dropdown: CS, Biology, History...)
- **Question 2**: "What's your biggest study struggle?" (Options: "Procrastination", "Hard concepts", "Boring reading").
- **Result**: "We've customized your experience for [Major]."

## Flow 2: Student Dashboard (Home)
*Goal: Overview of progress and quick entry to study.*

**Screen 2.1: The Dashboard**
- **Top Bar**:
  - **Streak Counter**: Fire icon + "5 Days" (Animated).
  - **XP Bar**: "Level 3 Scholar" (Progress bar to Level 4).
  - **Profile**: Avatar.
- **Main Content**:
  - **"Continue Studying"**: Large card for the most recent course (e.g., "Linear Algebra"). Button: "Resume Module 3".
  - **"My Courses" Grid**: Cards for each course with a progress ring (%).
  - **"Add Course" Card**: Dotted border, center plus icon.
  - **Daily Goals Widget**: Checklist of 3 tasks (e.g., "Complete 1 lesson", "Upload 1 file").

## Flow 3: Course Management
*Goal: Organize materials and generate the curriculum.*

**Screen 3.1: Course View**
- **Header**: Course Title, Edit Button, Overall Progress.
- **Left Sidebar**: "Syllabus" (The AI-generated modules).
- **Main Area**: "Course Materials" (Grid of uploaded files).
- **Action**: "Upload Material" button (Floating or prominent).

**Screen 3.2: Upload Overlay**
- **Drop Zone**: Large area to drag PDFs/PPTs.
- **List**: Shows files queueing, uploading, and "Processing..." (with spinner).
- **Convex Integration**: Progress bar showing direct upload speed.

## Flow 4: The Study Experience (The Core)
*Goal: Deep engagement with the content.*

**Screen 4.1: The APEX Player (Lesson Mode)**
- **Layout**: "Cinema Mode" (Dark backdrop).
- **Center Stage**: The Canvas Renderer (Avatar + Whiteboard).
- **Bottom Control Bar**: Play/Pause, Scrubber, "Ask Question" button.
- **Right Sidebar (Collapsible)**:
  - **Tab A: Chat**: History of questions asked during this session.
  - **Tab B: Notes**: Markdown editor to take notes while watching.
  - **Tab C: Transcript**: Rolling text of what the avatar is saying.

**Screen 4.2: Interaction Overlay**
- **Trigger**: Click "Ask Question" or AI stops at a checkpoint.
- **UI**: The video pauses/dims. A chat input appears near the avatar.
- **AI Response**:
  - **Text**: Appears in a bubble.
  - **Visual**: The avatar points to the board or draws a new diagram to explain.
- **Feedback**: "Did this help?" (Thumbs up/down).

**Screen 4.3: Lesson Complete / Summary**
- **Visual**: Confetti animation!
- **Stats**: "+50 XP", "Streak Extended".
- **Summary**: "Key concepts learned: [List]".
- **Next Step**: "Start Quiz" or "Back to Dashboard".

## Flow 5: Payment
*Goal: Conversion.*

**Screen 5.1: Upgrade Modal**
- **Trigger**: Uploading the 2nd file (if on Free tier).
- **Comparison Table**: Free vs Pro ($12/mo).
- **Highlight**: "Unlimited RAG", "DeepSeek Reasoning", "Streak Freeze".
- **Payment Form**: Stripe Elements (embedded).

-----

# 10. MONETIZATION STRATEGY

## 10.1 Pricing Models (B2C)

**Freemium (The Hook)**
- 1 Course Limit
- 50MB Upload Limit
- 5 AI Explanations / Day
- No "Deep Search" (Basic RAG)

**Semester Pass ($39 / 4 months)**
- *One-time payment option popular with students*
- Unlimited Courses
- Unlimited Uploads
- Advanced RAG (DeepSeek/Gemini)
- Exam Prep Mode

**Pro Monthly ($12 / month)**
- Same as Semester Pass but monthly billing.

**Pro Yearly ($99 / year)**
- Best value (~$8.25/mo).

## 10.2 Revenue Projections (B2C)

**Assumption**: Viral growth via campus networks.

| Month | Active Users | Conversion (3%) | Revenue (Avg $12) |
|-------|--------------|-----------------|-------------------|
| 1     | 500          | 15              | $180              |
| 3     | 5,000        | 150             | $1,800            |
| 6     | 50,000       | 1,500           | $18,000           |
| 12    | 250,000      | 7,500           | $90,000           |

*Note: B2C requires higher volume than B2B, but CAC (Customer Acquisition Cost) can be lower if product-led growth (sharing notes) works.*

-----

# 11. TESTING & ITERATION PLAN

## 11.1 Testing Strategy

### Unit Tests
- Convex functions can be tested using `convex-test`.

### Integration Tests
- Test the full RAG pipeline: Upload -> Convex Storage -> Trigger -> Embed -> Vector DB.

### User Testing Protocol
- **Paper Prototype**: Print the "Screen Flows" and test nav.
- **Beta Group**: 50 students from one university.

-----

# 12. DEPLOYMENT & SCALING

## 12.1 Deployment Architecture

```
Internet
    │
    ▼
┌─────────────────┐
│  Vercel (Edge)  │
│  (Next.js App)  │
└────────┬────────┘
         │
    ┌────┴────────────┐
    │                 │
    ▼                 ▼
┌──────────────┐  ┌──────────────┐
│ Convex Cloud │  │ Convex Cloud │
│ (Backend/DB) │  │ (Storage)    │
└────────┬─────┘  └──────────────┘
         │
    ┌────┴─────────────────┐
    │                      │
    ▼                      ▼
┌─────────────────┐  ┌─────────────────┐
│  DeepSeek API   │  │  Google Gemini  │
└─────────────────┘  └─────────────────┘
```

## 12.2 Launch Checklist

### Pre-Launch
- [ ] Convex Schema finalized.
- [ ] DeepSeek & Gemini Keys secured.
- [ ] Stripe Webhooks tested.

### Post-Launch
- [ ] Monitor Convex dashboard for slow queries.
- [ ] Track AI costs per user.
