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
1. ✅ **Content Ingestion (RAG)**: Upload PDF, PPTX, TXT files.
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
│                    B2C ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────┘

                    FRONTEND (Single Page App)
┌─────────────────────────────────────────────────────────────┐
│  Next.js 14 + React 18 + TypeScript                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Study     │  │    Upload    │  │    APEX      │      │
│  │   Dashboard  │  │   Manager    │  │   Player     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API + WebSocket
                         ▼
                    BACKEND (API Server)
┌─────────────────────────────────────────────────────────────┐
│  Node.js + Express + TypeScript                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Ingestion  │  │   Gamify     │  │    AML       │      │
│  │   Service    │  │   Engine     │  │   Compiler   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         RAG Orchestration Service                    │  │
│  │     (Retrieval Augmented Generation pipeline)        │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
┌─────────────┐  ┌─────────────┐  ┌──────────────┐
│  PostgreSQL │  │ Vector DB   │  │  OpenAI API  │
│  (Supabase) │  │ (pgvector)  │  │ (GPT-4-Turbo)│
└─────────────┘  └─────────────┘  └──────────────┘
         │                               │
         │                               │
         ▼                               ▼
┌─────────────┐                 ┌──────────────┐
│   Stripe    │                 │   S3/R2      │
│  (Payment)  │                 │  (Raw Docs)  │
└─────────────┘                 └──────────────┘
```

-----

# 4. COMPLETE IMPLEMENTATION GUIDE

## 4.1 Database Schema (B2C Focused)

```sql
-- Core Tables for B2C MVP

-- Users (Students)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255), -- Or Supabase Auth ID
  full_name VARCHAR(100),
  university VARCHAR(255),
  major VARCHAR(100),
  subscription_status VARCHAR(50) DEFAULT 'free', -- 'free', 'pro', 'cancelled'
  stripe_customer_id VARCHAR(255),
  current_streak INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Courses (Created by Students)
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL, -- e.g. "Biology 101"
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Content Uploads (Raw Materials)
CREATE TABLE uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id),
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50), -- 'pdf', 'pptx', 'txt'
  processing_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  token_count INTEGER,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Learning Paths (The AI Generated Curriculum)
CREATE TABLE learning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id),
  title VARCHAR(255),
  modules JSONB, -- Array of topics/concepts derived from uploads
  generated_at TIMESTAMP DEFAULT NOW()
);

-- Sessions (Active Study Sessions)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  course_id UUID REFERENCES courses(id),
  topic_focus VARCHAR(255),
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  conversation_history JSONB, -- Stores the chat/AML history
  context_sources JSONB -- References to specific chunks in uploads used here
);

-- Gamification / Achievements
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type VARCHAR(100), -- '7_day_streak', '1000_xp', 'first_upload'
  unlocked_at TIMESTAMP DEFAULT NOW()
);

-- Vector Store (pgvector extension in Supabase)
-- CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE document_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  upload_id UUID REFERENCES uploads(id),
  content TEXT, -- The text chunk
  embedding vector(1536), -- OpenAI embeddings dimension
  metadata JSONB -- Page number, slide number, etc.
);
```

## 4.2 Ingestion & RAG Pipeline

Instead of pre-written lessons, content is generated dynamically.

```typescript
// services/ingestion-service.ts

import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

export class IngestionService {
  async processUpload(uploadId: string, fileUrl: string, fileType: string) {
    // 1. Download File
    const blob = await fetch(fileUrl).then(r => r.blob());

    // 2. Extract Text
    let text = "";
    if (fileType === 'pdf') {
       const loader = new PDFLoader(blob);
       const docs = await loader.load();
       text = docs.map(d => d.pageContent).join("\n");
    }
    // ... handle other formats

    // 3. Chunk Text
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const chunks = await splitter.createDocuments([text], { uploadId });

    // 4. Generate Embeddings & Store
    await SupabaseVectorStore.fromDocuments(
      chunks,
      new OpenAIEmbeddings(),
      {
        client: supabaseClient,
        tableName: "document_embeddings",
        queryName: "match_documents",
      }
    );

    // 5. Generate Course Structure (Table of Contents)
    await this.generateCourseStructure(uploadId, text);
  }

  async generateCourseStructure(uploadId: string, fullText: string) {
    // Call LLM to summarize and create a learning path
    // Save to 'learning_paths' table
  }
}
```

## 4.3 LLM Service (Context Aware)

The `LLMService` needs to retrieve context before generating AML.

```typescript
// services/llm-service.ts

export class LLMService {
  // ... existing setup ...

  async generateLessonFromContext(params: {
    userQuery: string;
    courseId: string;
    history: any[];
  }): Promise<AMLDocument> {

    // 1. Retrieve relevant chunks (RAG)
    const vectorStore = await SupabaseVectorStore.fromExistingIndex(...);
    const results = await vectorStore.similaritySearch(params.userQuery, 3, {
      filter: { course_id: params.courseId } // conceptual filter
    });

    const contextString = results.map(r => r.pageContent).join("\n---\n");

    // 2. Build System Prompt with Context
    const systemPrompt = `
      You are an expert university tutor.
      Use the following SOURCE MATERIAL to answer the student's request.
      Do not hallucinate facts outside the source material.

      SOURCE MATERIAL:
      ${contextString}

      Output format: Valid AML JSON.
      Tone: Professional, academic but encouraging.
      Target: Undergraduate student.
    `;

    // 3. Generate AML
    // ... call OpenAI ...
  }
}
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

# 6. MONETIZATION STRATEGY

## 6.1 Pricing Models (B2C)

**Freemium (The Hook)**
- 1 Course Limit
- 50MB Upload Limit
- 5 AI Explanations / Day
- No "Deep Search" (Basic RAG)

**Semester Pass ($39 / 4 months)**
- *One-time payment option popular with students*
- Unlimited Courses
- Unlimited Uploads
- Advanced RAG (GPT-4)
- Exam Prep Mode

**Pro Monthly ($12 / month)**
- Same as Semester Pass but monthly billing.

**Pro Yearly ($99 / year)**
- Best value (~$8.25/mo).

## 6.2 Revenue Projections (B2C)

**Assumption**: Viral growth via campus networks.

| Month | Active Users | Conversion (3%) | Revenue (Avg $12) |
|-------|--------------|-----------------|-------------------|
| 1     | 500          | 15              | $180              |
| 3     | 5,000        | 150             | $1,800            |
| 6     | 50,000       | 1,500           | $18,000           |
| 12    | 250,000      | 7,500           | $90,000           |

*Note: B2C requires higher volume than B2B, but CAC (Customer Acquisition Cost) can be lower if product-led growth (sharing notes) works.*

-----

# 7. DEVELOPMENT PHASES & TIMELINE

## Phase 0: Foundation (Week 1)
- Setup Next.js & Supabase.
- Enable `pgvector` extension.
- **Crucial**: Build robust Auth (Magic Links preferred for students).

## Phase 1: The "Knowledge Base" (Weeks 2-3)
- Build File Upload UI (Drag & Drop).
- Implement Ingestion Pipeline (PDF -> Text -> Vector).
- *Deliverable*: User uploads a PDF and can see a "Summary" of it.

## Phase 2: The APEX Player (Weeks 4-5)
- Implement the AML Renderer (Canvas).
- Connect LLM to Vector Store (RAG).
- *Deliverable*: User asks a question about the PDF, Avatar explains it visually.

## Phase 3: Gamification & Polish (Week 6)
- Add XP, Streaks, Levels.
- Build "Study Dashboard".
- *Deliverable*: The loop "Upload -> Study -> Reward" is complete.

## Phase 4: Launch Prep (Week 7-8)
- Stripe Integration.
- Landing Page (Targeting specific majors like Engineering/Pre-med).
- Beta Launch at 1-2 Campuses.

-----

# 8. DEPLOYMENT & SCALING

## 8.1 Vector Search Scaling
As users upload thousands of PDFs, the vector store will grow huge.
- **Strategy**: Use Supabase for MVP (up to ~100k vectors).
- **Scale-up**: Migrate to Pinecone or Milvus if performance degrades > 1M vectors.

## 8.2 Cost Management (OpenAI)
B2C users can be spammy.
- **Limit**: Rate limit "Pro" users to 500 messages/day.
- **Optimization**: Use `gpt-3.5-turbo` for summarization and simple chat; reserve `gpt-4` for complex "Teach Me" moments.
- **Caching**: Aggressively cache answers to common questions within the same document.

-----

# APPENDIX: AML for University Level

The "Instructor" tone should be different for B2C University students.

**Example AML Sequence:**

```json
{
  "actions": [
    {
      "type": "instructor",
      "content": {
        "mode": "avatar-professional",
        "emotion": "neutral",
        "speak": "Based on the lecture notes you uploaded, the Professor emphasizes the 'Central Limit Theorem'. Let's break down the three conditions required for it to hold."
      }
    },
    {
      "type": "board",
      "content": {
        "elements": [
          { "type": "text", "content": "1. Randomization" },
          { "type": "text", "content": "2. Independence" },
          { "type": "text", "content": "3. 10% Condition" }
        ]
      }
    }
  ]
}
```
