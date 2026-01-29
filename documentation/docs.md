# APEX: Complete Technical Documentation

## From MVP to Production-Ready Platform

-----

# TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
1. [MVP Definition & Scope](#mvp-definition--scope)
1. [MVP Technical Architecture](#mvp-technical-architecture)
1. [Complete Implementation Guide](#complete-implementation-guide)
1. [Web & Mobile Integration](#web--mobile-integration)
1. [Pre-Recorded Video Experience](#pre-recorded-video-experience)
1. [Technology Stack & Costs](#technology-stack--costs)
1. [Development Phases & Timeline](#development-phases--timeline)
1. [Monetization Strategy](#monetization-strategy)
1. [Testing & Iteration Plan](#testing--iteration-plan)
1. [Deployment & Scaling](#deployment--scaling)

-----

# 1. EXECUTIVE SUMMARY

**What We’re Building**: A real-time, AI-powered educational content delivery system that feels like watching a professional instructional video but adapts to each student instantly.

**MVP Goal**: Launch a working product in 6-8 weeks that schools can pay for immediately.

**Revenue Target**: $5K-$20K MRR within 3 months of MVP launch.

**Core Value Proposition**: Schools get unlimited, adaptive educational content for less than the cost of producing a single professional video.

-----

# 2. MVP DEFINITION & SCOPE

## 2.1 What’s IN the MVP

### Must-Have Features:

1. ✅ **Single Subject Focus**: Mathematics (Grades 3-8)
1. ✅ **Web-Only Interface**: Desktop & tablet browsers
1. ✅ **Core AML Renderer**: Text, shapes, basic animations
1. ✅ **LLM Integration**: OpenAI GPT-4 or Anthropic Claude
1. ✅ **Interactive Checkpoints**: Students can ask questions
1. ✅ **Session Management**: Start, pause, resume lessons
1. ✅ **Teacher Portal**: Upload curriculum, view basic analytics
1. ✅ **3 Complete Lesson Templates**: Ready-to-use content
1. ✅ **Student Progress Tracking**: Basic completion metrics
1. ✅ **Payment Integration**: Stripe for subscriptions

### Success Criteria:

- A teacher can assign a lesson in <5 minutes
- A student can complete a 10-minute adaptive lesson
- System responds to questions in <3 seconds
- Works on 95% of school computers (Chrome, Safari, Edge)
- Can handle 50 concurrent students per instance

## 2.2 What’s NOT in MVP (Post-MVP)

- ❌ Mobile native apps (web works on mobile browser)
- ❌ Advanced avatar system (using abstract placeholder)
- ❌ Voice interaction (text only)
- ❌ Multiple subjects (math only)
- ❌ Advanced analytics/AI insights
- ❌ White-labeling
- ❌ API for third-party integration
- ❌ Offline mode
- ❌ Real-time collaboration

## 2.3 MVP User Stories

**As a Teacher:**

- I can create a class and add students
- I can assign pre-built math lessons to students
- I can see which students completed lessons
- I can review questions students asked

**As a Student:**

- I can log in and see my assigned lessons
- I can watch/interact with an adaptive math lesson
- I can ask questions when confused
- I can pause and resume lessons
- The system feels like watching a video with a tutor

**As a School Admin:**

- I can subscribe and pay monthly
- I can add/remove teacher accounts
- I can see usage metrics

-----

# 3. MVP TECHNICAL ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                    MVP ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────┘

                    FRONTEND (Single Page App)
┌─────────────────────────────────────────────────────────────┐
│  Next.js 14 + React 18 + TypeScript                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Student    │  │   Teacher    │  │    APEX      │      │
│  │   Portal     │  │   Portal     │  │   Player     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API + WebSocket
                         ▼
                    BACKEND (API Server)
┌─────────────────────────────────────────────────────────────┐
│  Node.js + Express + TypeScript                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Auth       │  │   Session    │  │    AML       │      │
│  │   Service    │  │   Manager    │  │   Compiler   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         LLM Orchestration Service                    │  │
│  │         (Handles prompts, streaming, caching)        │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
┌─────────────┐  ┌─────────────┐  ┌──────────────┐
│  PostgreSQL │  │   Redis     │  │  OpenAI API  │
│  (Supabase) │  │   (Cache)   │  │  or Claude   │
└─────────────┘  └─────────────┘  └──────────────┘
         │                               │
         │                               │
         ▼                               ▼
┌─────────────┐                 ┌──────────────┐
│   Stripe    │                 │   S3/R2      │
│  (Payment)  │                 │   (Assets)   │
└─────────────┘                 └──────────────┘
```

-----

# 4. COMPLETE IMPLEMENTATION GUIDE

## 4.1 Database Schema

```sql
-- Core Tables for MVP

-- Organizations (Schools)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  subdomain VARCHAR(100) UNIQUE,
  stripe_customer_id VARCHAR(255),
  subscription_status VARCHAR(50) DEFAULT 'trial',
  subscription_tier VARCHAR(50) DEFAULT 'basic',
  max_students INTEGER DEFAULT 100,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Users (Teachers & Students)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL, -- 'teacher', 'student', 'admin'
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  grade_level INTEGER, -- for students
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

-- Lessons (Content Templates)
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  grade_level INTEGER NOT NULL,
  description TEXT,
  learning_objectives JSONB,
  initial_prompt TEXT NOT NULL, -- The prompt that starts the lesson
  estimated_duration INTEGER, -- minutes
  created_by UUID REFERENCES users(id),
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sessions (Active Learning Sessions)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id),
  student_id UUID REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'in_progress', -- 'in_progress', 'paused', 'completed'
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  last_activity TIMESTAMP DEFAULT NOW(),
  current_sequence_index INTEGER DEFAULT 0,
  total_sequences INTEGER DEFAULT 0,
  student_model JSONB, -- Stores adaptive learning data
  conversation_history JSONB, -- Stores the AML and interactions
  metadata JSONB
);

-- Interactions (Student Questions/Responses)
CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id),
  sequence_index INTEGER,
  interaction_type VARCHAR(50), -- 'question', 'checkpoint_response', 'pause', 'resume'
  student_input TEXT,
  llm_response TEXT,
  aml_generated TEXT, -- The AML that was generated
  timestamp TIMESTAMP DEFAULT NOW(),
  metadata JSONB
);

-- Analytics (Basic Tracking)
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id),
  event_type VARCHAR(100), -- 'lesson_start', 'checkpoint_reached', 'question_asked', 'lesson_complete'
  event_data JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Assignments
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id),
  teacher_id UUID REFERENCES users(id),
  student_id UUID REFERENCES users(id), -- NULL for class assignments
  class_id UUID, -- For future class grouping
  due_date TIMESTAMP,
  assigned_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'assigned'
);

-- Indexes for performance
CREATE INDEX idx_sessions_student ON sessions(student_id);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_interactions_session ON interactions(session_id);
CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_assignments_student ON assignments(student_id);
```

## 4.2 AML Specification (MVP Version)

```typescript
// AML TypeScript Definitions

interface AMLDocument {
  version: string;
  sessionId: string;
  sequences: AMLSequence[];
}

interface AMLSequence {
  id: string;
  duration?: number; // seconds, optional
  actions: AMLAction[];
  checkpoint?: AMLCheckpoint;
}

interface AMLAction {
  at: number | string; // timestamp or "+2s" for relative
  type: 'instructor' | 'board' | 'animate' | 'audio';
  content: InstructorAction | BoardAction | AnimateAction;
}

interface InstructorAction {
  mode: 'avatar-simple' | 'abstract';
  emotion?: 'neutral' | 'friendly' | 'excited' | 'thoughtful';
  speak: string;
  gesture?: 'wave' | 'point' | 'nod' | 'thinking';
}

interface BoardAction {
  zone?: 'left' | 'center' | 'right' | 'full';
  elements: BoardElement[];
}

interface BoardElement {
  id: string;
  type: 'text' | 'shape' | 'equation' | 'diagram';
  position: Position;
  style?: StyleProperties;
  content: any;
}

interface AnimateAction {
  target: string; // element ID
  duration: number;
  animation: Animation;
}

interface Animation {
  type: 'fadeIn' | 'fadeOut' | 'slide' | 'scale' | 'rotate' | 'highlight' | 'draw';
  properties: Record<string, any>;
}

interface AMLCheckpoint {
  id: string;
  type: 'comprehension' | 'question' | 'practice';
  prompt: string;
  acceptInput: boolean;
  options?: string[]; // for multiple choice
}

interface Position {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

interface StyleProperties {
  fontSize?: number;
  color?: string;
  fontWeight?: string;
  backgroundColor?: string;
  borderRadius?: number;
  padding?: number;
}
```

### AML Parser Implementation

```typescript
// aml-parser.ts

export class AMLParser {
  parse(amlString: string): AMLDocument {
    try {
      // For MVP, we use JSON format (simpler than XML)
      const doc = JSON.parse(amlString);
      this.validate(doc);
      return doc;
    } catch (error) {
      console.error('AML Parse Error:', error);
      // Return fallback content
      return this.getFallbackDocument();
    }
  }

  validate(doc: any): void {
    if (!doc.version || !doc.sessionId || !doc.sequences) {
      throw new Error('Invalid AML: missing required fields');
    }

    // Validate each sequence
    doc.sequences.forEach((seq: AMLSequence, idx: number) => {
      if (!seq.actions || !Array.isArray(seq.actions)) {
        throw new Error(`Invalid sequence ${idx}: missing actions`);
      }
    });
  }

  getFallbackDocument(): AMLDocument {
    return {
      version: '1.0',
      sessionId: 'fallback',
      sequences: [{
        id: 'error-seq',
        actions: [{
          at: 0,
          type: 'instructor',
          content: {
            mode: 'avatar-simple',
            speak: 'I encountered an error. Please try again.',
            emotion: 'neutral'
          }
        }]
      }]
    };
  }
}
```

## 4.3 The APEX Renderer Engine

```typescript
// apex-renderer.ts

export class APEXRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private currentSequence: AMLSequence | null = null;
  private animationFrame: number = 0;
  private startTime: number = 0;
  private isPaused: boolean = false;
  private assetLibrary: AssetLibrary;
  private audioEngine: AudioEngine;

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d')!;
    this.assetLibrary = new AssetLibrary();
    this.audioEngine = new AudioEngine();
    this.setupCanvas();
  }

  private setupCanvas(): void {
    // High DPI support
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    this.ctx.scale(dpr, dpr);

    // Set canvas display size
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
  }

  async playSequence(sequence: AMLSequence): Promise<void> {
    this.currentSequence = sequence;
    this.startTime = Date.now();
    this.isPaused = false;

    await this.renderLoop();
  }

  private async renderLoop(): Promise<void> {
    if (this.isPaused) return;

    const elapsedTime = (Date.now() - this.startTime) / 1000; // seconds

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw background
    this.drawBackground();

    // Process actions for current time
    if (this.currentSequence) {
      const activeActions = this.getActiveActions(elapsedTime);

      for (const action of activeActions) {
        await this.renderAction(action);
      }
    }

    // Continue loop
    this.animationFrame = requestAnimationFrame(() => this.renderLoop());
  }

  private getActiveActions(elapsedTime: number): AMLAction[] {
    if (!this.currentSequence) return [];

    return this.currentSequence.actions.filter(action => {
      const actionTime = this.parseActionTime(action.at);
      return actionTime <= elapsedTime;
    });
  }

  private parseActionTime(at: number | string): number {
    if (typeof at === 'number') return at;

    // Parse relative time like "+2s"
    if (at.startsWith('+')) {
      const seconds = parseFloat(at.slice(1, -1));
      return this.startTime + seconds;
    }

    return 0;
  }

  private async renderAction(action: AMLAction): Promise<void> {
    switch (action.type) {
      case 'instructor':
        this.renderInstructor(action.content as InstructorAction);
        break;
      case 'board':
        this.renderBoard(action.content as BoardAction);
        break;
      case 'animate':
        await this.renderAnimation(action.content as AnimateAction);
        break;
    }
  }

  private renderInstructor(instructor: InstructorAction): void {
    // For MVP: Simple avatar representation
    const x = 100;
    const y = this.canvas.height / 2;
    const radius = 40;

    // Draw circle avatar
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fillStyle = this.getEmotionColor(instructor.emotion);
    this.ctx.fill();

    // Draw emotion emoji
    this.ctx.font = '30px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(this.getEmotionEmoji(instructor.emotion), x, y);

    // Render speech (handled by separate text-to-speech or text display)
    this.audioEngine.speak(instructor.speak);
  }

  private renderBoard(board: BoardAction): void {
    const boardX = 250;
    const boardY = 50;
    const boardWidth = this.canvas.width - 300;
    const boardHeight = this.canvas.height - 100;

    // Draw board background
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(boardX, boardY, boardWidth, boardHeight);
    this.ctx.strokeStyle = '#333333';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(boardX, boardY, boardWidth, boardHeight);

    // Render board elements
    board.elements.forEach(element => {
      this.renderBoardElement(element, boardX, boardY);
    });
  }

  private renderBoardElement(element: BoardElement, offsetX: number, offsetY: number): void {
    const x = offsetX + element.position.x;
    const y = offsetY + element.position.y;

    switch (element.type) {
      case 'text':
        this.renderText(element.content, x, y, element.style);
        break;
      case 'shape':
        this.renderShape(element.content, x, y, element.style);
        break;
      case 'equation':
        this.renderEquation(element.content, x, y);
        break;
    }
  }

  private renderText(text: string, x: number, y: number, style?: StyleProperties): void {
    this.ctx.font = `${style?.fontWeight || 'normal'} ${style?.fontSize || 20}px Arial`;
    this.ctx.fillStyle = style?.color || '#000000';
    this.ctx.fillText(text, x, y);
  }

  private renderShape(shape: any, x: number, y: number, style?: StyleProperties): void {
    if (shape.type === 'circle') {
      this.ctx.beginPath();
      this.ctx.arc(x, y, shape.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = style?.color || '#4A90E2';
      this.ctx.fill();
    } else if (shape.type === 'rectangle') {
      this.ctx.fillStyle = style?.color || '#4A90E2';
      this.ctx.fillRect(x, y, shape.width, shape.height);
    }
    // Add more shapes as needed
  }

  private renderEquation(equation: string, x: number, y: number): void {
    // For MVP: Simple text rendering
    // Post-MVP: Use MathJax or KaTeX
    this.ctx.font = '24px "Courier New"';
    this.ctx.fillStyle = '#000000';
    this.ctx.fillText(equation, x, y);
  }

  private async renderAnimation(animate: AnimateAction): Promise<void> {
    // Simple animation implementation
    // For MVP: Basic transitions
    // Post-MVP: Complex animation library
  }

  private drawBackground(): void {
    // Gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#F0F4F8');
    gradient.addColorStop(1, '#E1E8ED');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private getEmotionColor(emotion?: string): string {
    const colors = {
      'neutral': '#6C757D',
      'friendly': '#28A745',
      'excited': '#FFC107',
      'thoughtful': '#17A2B8'
    };
    return colors[emotion as keyof typeof colors] || colors.neutral;
  }

  private getEmotionEmoji(emotion?: string): string {
    const emojis = {
      'neutral': '😊',
      'friendly': '😄',
      'excited': '🤩',
      'thoughtful': '🤔'
    };
    return emojis[emotion as keyof typeof emojis] || emojis.neutral;
  }

  pause(): void {
    this.isPaused = true;
    this.audioEngine.pause();
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  resume(): void {
    this.isPaused = false;
    this.audioEngine.resume();
    this.renderLoop();
  }

  destroy(): void {
    this.pause();
    this.audioEngine.cleanup();
  }
}

// Simple Audio Engine
class AudioEngine {
  private utterance: SpeechSynthesisUtterance | null = null;

  speak(text: string): void {
    // Use Web Speech API for MVP
    if ('speechSynthesis' in window) {
      this.utterance = new SpeechSynthesisUtterance(text);
      this.utterance.rate = 0.9;
      this.utterance.pitch = 1.0;
      speechSynthesis.speak(this.utterance);
    }
  }

  pause(): void {
    if ('speechSynthesis' in window) {
      speechSynthesis.pause();
    }
  }

  resume(): void {
    if ('speechSynthesis' in window) {
      speechSynthesis.resume();
    }
  }

  cleanup(): void {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }
}

// Asset Library (Placeholder for MVP)
class AssetLibrary {
  // Pre-loaded shapes and assets
  // For MVP: Keep minimal
}
```

## 4.4 LLM Integration Service

```typescript
// llm-service.ts

import OpenAI from 'openai';

export class LLMService {
  private client: OpenAI;
  private systemPrompt: string;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
    this.systemPrompt = this.buildSystemPrompt();
  }

  private buildSystemPrompt(): string {
    return `You are an educational content generator for the APEX system.
Your output must be valid AML (APEX Markup Language) in JSON format.

AML Structure:
{
  "version": "1.0",
  "sessionId": "unique-id",
  "sequences": [
    {
      "id": "seq-1",
      "actions": [
        {
          "at": 0,
          "type": "instructor",
          "content": {
            "mode": "avatar-simple",
            "emotion": "friendly",
            "speak": "Hello! Let's learn about fractions.",
            "gesture": "wave"
          }
        },
        {
          "at": 2,
          "type": "board",
          "content": {
            "elements": [
              {
                "id": "text-1",
                "type": "text",
                "position": {"x": 50, "y": 50},
                "style": {"fontSize": 32, "color": "#000000"},
                "content": "What is 1/2?"
              }
            ]
          }
        }
      ],
      "checkpoint": {
        "id": "cp-1",
        "type": "comprehension",
        "prompt": "Does this make sense so far?",
        "acceptInput": true
      }
    }
  ]
}

RULES:
1. Each sequence should be 20-60 seconds of content
2. Always include checkpoints for interaction
3. Use simple, clear language appropriate for the grade level
4. Include visual elements (board) for every key concept
5. Adapt based on student responses
6. Keep emotions varied (friendly, excited, thoughtful)

AVAILABLE BOARD ELEMENTS:
- text: Display text
- shape: circle, rectangle (with radius/width/height)
- equation: Mathematical expressions

RESPOND ONLY WITH VALID JSON. NO MARKDOWN, NO EXPLANATIONS.`;
  }

  async generateLesson(params: {
    subject: string;
    topic: string;
    gradeLevel: number;
    sessionId: string;
    context?: string;
  }): Promise<AMLDocument> {
    const userPrompt = `Generate a lesson introduction for:
Subject: ${params.subject}
Topic: ${params.topic}
Grade Level: ${params.gradeLevel}
${params.context ? `Context: ${params.context}` : ''}

Create the first sequence that introduces the topic in an engaging way.`;

    const completion = await this.client.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const amlString = completion.choices[0].message.content || '{}';
    return JSON.parse(amlString);
  }

  async continueLesson(params: {
    sessionId: string;
    conversationHistory: any[];
    studentInput: string;
    currentTopic: string;
  }): Promise<AMLDocument> {
    const userPrompt = `Student asked: "${params.studentInput}"

Current topic: ${params.currentTopic}

Generate the next sequence that:
1. Addresses the student's question directly
2. Continues the lesson smoothly
3. Includes a new checkpoint

Remember: Respond with valid AML JSON only.`;

    const messages = [
      { role: 'system', content: this.systemPrompt },
      ...params.conversationHistory,
      { role: 'user', content: userPrompt }
    ];

    const completion = await this.client.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages,
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const amlString = completion.choices[0].message.content || '{}';
    return JSON.parse(amlString);
  }

  async streamLesson(params: any, onChunk: (chunk: string) => void): Promise<void> {
    // For real-time streaming (Post-MVP enhancement)
    // Use OpenAI streaming API
  }
}
```

## 4.5 Backend API Implementation

```typescript
// server.ts - Main Express Server

import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import { sessionRouter } from './routes/sessions';
import { authRouter } from './routes/auth';
import { lessonsRouter } from './routes/lessons';
import { SessionManager } from './services/session-manager';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/lessons', lessonsRouter);
app.use('/api/sessions', sessionRouter);

// WebSocket for real-time session updates
const sessionManager = new SessionManager();

wss.on('connection', (ws, req) => {
  const sessionId = new URL(req.url!, `http://${req.headers.host}`).searchParams.get('sessionId');

  if (!sessionId) {
    ws.close(1008, 'Session ID required');
    return;
  }

  // Register connection
  sessionManager.registerConnection(sessionId, ws);

  ws.on('message', async (message) => {
    const data = JSON.parse(message.toString());

    if (data.type === 'student_input') {
      // Student asked a question or responded to checkpoint
      await sessionManager.handleStudentInput(sessionId, data.input);
    }
  });

  ws.on('close', () => {
    sessionManager.unregisterConnection(sessionId);
  });
});

server.listen(3000, () => {
  console.log('APEX Server running on port 3000');
});
```

```typescript
// services/session-manager.ts

import { WebSocket } from 'ws';
import { LLMService } from './llm-service';
import { supabase } from '../lib/supabase';
import { AMLParser } from './aml-parser';

export class SessionManager {
  private connections: Map<string, WebSocket> = new Map();
  private llmService: LLMService;
  private amlParser: AMLParser;

  constructor() {
    this.llmService = new LLMService(process.env.OPENAI_API_KEY!);
    this.amlParser = new AMLParser();
  }

  registerConnection(sessionId: string, ws: WebSocket): void {
    this.connections.set(sessionId, ws);
  }

  unregisterConnection(sessionId: string): void {
    this.connections.delete(sessionId);
  }

  async startSession(sessionId: string, lessonId: string, studentId: string): Promise<void> {
    // Get lesson details
    const { data: lesson } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single();

    if (!lesson) throw new Error('Lesson not found');

    // Generate initial content from LLM
    const aml = await this.llmService.generateLesson({
      subject: lesson.subject,
      topic: lesson.title,
      gradeLevel: lesson.grade_level,
      sessionId
    });

    // Save to database
    await supabase
      .from('sessions')
      .update({
        conversation_history: { sequences: [aml] },
        total_sequences: 1
      })
      .eq('id', sessionId);

    // Send to client
    this.sendToClient(sessionId, {
      type: 'aml_sequence',
      data: aml
    });
  }

  async handleStudentInput(sessionId: string, input: string): Promise<void> {
    // Get session data
    const { data: session } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (!session) throw new Error('Session not found');

    // Record interaction
    await supabase
      .from('interactions')
      .insert({
        session_id: sessionId,
        sequence_index: session.current_sequence_index,
        interaction_type: 'question',
        student_input: input,
        timestamp: new Date().toISOString()
      });

    // Generate response from LLM
    const aml = await this.llmService.continueLesson({
      sessionId,
      conversationHistory: session.conversation_history?.sequences || [],
      studentInput: input,
      currentTopic: session.lesson_id
    });

    // Update session
    const updatedHistory = {
      sequences: [...(session.conversation_history?.sequences || []), aml]
    };

    await supabase
      .from('sessions')
      .update({
        conversation_history: updatedHistory,
        current_sequence_index: session.current_sequence_index + 1,
        total_sequences: session.total_sequences + 1
      })
      .eq('id', sessionId);

    // Send to client
    this.sendToClient(sessionId, {
      type: 'aml_sequence',
      data: aml
    });
  }

  private sendToClient(sessionId: string, message: any): void {
    const ws = this.connections.get(sessionId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }
}
```

## 4.6 Frontend Implementation (React)

```typescript
// components/APEXPlayer.tsx

import React, { useEffect, useRef, useState } from 'react';
import { APEXRenderer } from '../lib/apex-renderer';
import { AMLDocument } from '../types/aml';

interface APEXPlayerProps {
  sessionId: string;
  onComplete?: () => void;
}

export const APEXPlayer: React.FC<APEXPlayerProps> = ({ sessionId, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<APEXRenderer | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const [isPaused, setIsPaused] = useState(false);
  const [isCheckpoint, setIsCheckpoint] = useState(false);
  const [checkpointPrompt, setCheckpointPrompt] = useState('');
  const [studentInput, setStudentInput] = useState('');

  useEffect(() => {
    // Initialize renderer
    if (canvasRef.current && !rendererRef.current) {
      rendererRef.current = new APEXRenderer(canvasRef.current);
    }

    // Setup WebSocket connection
    const ws = new WebSocket(`ws://localhost:3000?sessionId=${sessionId}`);
    wsRef.current = ws;

    ws.onmessage = async (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'aml_sequence') {
        const aml: AMLDocument = message.data;

        // Play each sequence
        for (const sequence of aml.sequences) {
          if (rendererRef.current) {
            await rendererRef.current.playSequence(sequence);
          }

          // Check for checkpoint
          if (sequence.checkpoint) {
            setIsCheckpoint(true);
            setCheckpointPrompt(sequence.checkpoint.prompt);
            rendererRef.current?.pause();
          }
        }
      }
    };

    return () => {
      ws.close();
      rendererRef.current?.destroy();
    };
  }, [sessionId]);

  const handlePause = () => {
    rendererRef.current?.pause();
    setIsPaused(true);
  };

  const handleResume = () => {
    rendererRef.current?.resume();
    setIsPaused(false);
  };

  const handleSubmitInput = () => {
    if (wsRef.current && studentInput.trim()) {
      wsRef.current.send(JSON.stringify({
        type: 'student_input',
        input: studentInput
      }));

      setStudentInput('');
      setIsCheckpoint(false);
      rendererRef.current?.resume();
    }
  };

  return (
    <div className="apex-player">
      <canvas
        ref={canvasRef}
        className="apex-canvas"
        style={{ width: '100%', height: '600px', border: '1px solid #ccc' }}
      />

      <div className="apex-controls">
        {!isPaused && !isCheckpoint && (
          <button onClick={handlePause}>Pause</button>
        )}
        {isPaused && !isCheckpoint && (
          <button onClick={handleResume}>Resume</button>
        )}
      </div>

      {isCheckpoint && (
        <div className="apex-checkpoint">
          <p>{checkpointPrompt}</p>
          <input
            type="text"
            value={studentInput}
            onChange={(e) => setStudentInput(e.target.value)}
            placeholder="Type your answer or question..."
            onKeyPress={(e) => e.key === 'Enter' && handleSubmitInput()}
          />
          <button onClick={handleSubmitInput}>Continue</button>
        </div>
      )}
    </div>
  );
};
```

-----

# 5. WEB & MOBILE INTEGRATION

## 5.1 Web Integration

### Responsive Design Strategy

```typescript
// The APEX Player adapts to screen size automatically

// apex-responsive.scss
.apex-player {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;

  .apex-canvas {
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;

    @media (max-width: 768px) {
      aspect-ratio: 4 / 3;
    }
  }

  .apex-controls {
    display: flex;
    justify-content: center;
    gap: 1rem;
    padding: 1rem;

    button {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        transform: scale(1.05);
      }
    }
  }

  .apex-checkpoint {
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
    margin-top: 1rem;

    input {
      width: 100%;
      padding: 0.75rem;
      font-size: 1rem;
      border: 2px solid #dee2e6;
      border-radius: 4px;
      margin: 1rem 0;
    }
  }
}
```

### Embedding in Existing Websites

```html
<!-- Easy embed via iframe (for schools with existing LMS) -->
<iframe
  src="https://apex.yourplatform.com/embed/session/abc123"
  width="100%"
  height="600px"
  frameborder="0"
  allow="microphone"
></iframe>

<!-- Or via JavaScript widget -->
<div id="apex-container"></div>
<script src="https://apex.yourplatform.com/widget.js"></script>
<script>
  APEX.init({
    container: '#apex-container',
    sessionId: 'abc123',
    theme: 'light'
  });
</script>
```

## 5.2 Mobile Integration

### Progressive Web App (PWA) for MVP

```json
// manifest.json
{
  "name": "APEX Learning",
  "short_name": "APEX",
  "description": "Adaptive AI-Powered Educational Experience",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4A90E2",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Touch Optimization

```typescript
// Mobile-specific enhancements

class MobileAPEXPlayer extends APEXRenderer {
  setupMobileInteractions() {
    // Touch gestures
    this.canvas.addEventListener('touchstart', this.handleTouchStart);
    this.canvas.addEventListener('touchend', this.handleTouchEnd);

    // Prevent zoom
    this.canvas.style.touchAction = 'none';

    // Optimize for mobile performance
    this.enableMobileOptimizations();
  }

  enableMobileOptimizations() {
    // Reduce animation complexity on mobile
    // Lower frame rate if battery is low
    // Preload next sequence for smoother transitions
  }
}
```

### React Native (Post-MVP)

```typescript
// For native mobile apps (Phase 2)
// react-native/APEXPlayer.tsx

import React from 'react';
import { View } from 'react-native';
import { Canvas } from '@shopify/react-native-skia';

export const NativeAPEXPlayer: React.FC = () => {
  // Use Skia for native canvas rendering
  // Exact same AML engine
  // Native performance
};
```

-----

# 6. PRE-RECORDED VIDEO EXPERIENCE

## 6.1 Creating the Illusion of Pre-Recorded Video

### Key Techniques:

**1. Smooth Timing Control**

```typescript
class VideoLikeRenderer extends APEXRenderer {
  private playbackSpeed: number = 1.0;
  private timeline: Timeline;

  // Make it feel like a video timeline
  createTimeline(sequences: AMLSequence[]): Timeline {
    const timeline = new Timeline();
    let currentTime = 0;

    sequences.forEach(seq => {
      const duration = this.calculateSequenceDuration(seq);
      timeline.addMarker({
        time: currentTime,
        type: 'sequence',
        data: seq
      });
      currentTime += duration;
    });

    return timeline;
  }

  // Seek to specific time (like video scrubbing)
  seekTo(time: number): void {
    const marker = this.timeline.getMarkerAt(time);
    this.jumpToSequence(marker.data);
  }
}
```

**2. Progress Bar with Scrubbing**

```typescript
// Video-like controls
const VideoControls: React.FC = () => {
  return (
    <div className="video-controls">
      <button onClick={togglePlay}>
        {isPlaying ? '⏸' : '▶️'}
      </button>

      <div className="progress-bar">
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          className="timeline-slider"
        />
        <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
      </div>

      <select value={speed} onChange={handleSpeedChange}>
        <option value="0.5">0.5x</option>
        <option value="1">1x</option>
        <option value="1.5">1.5x</option>
        <option value="2">2x</option>
      </select>
    </div>
  );
};
```

**3. Buffering Simulation**

```typescript
// Show loading states like video players
class BufferingManager {
  private nextSequenceBuffer: AMLSequence[] = [];

  async preloadNextSequences(count: number = 2): Promise<void> {
    // Fetch next sequences from LLM
    // Show buffering indicator if taking too long
    if (this.isBuffering) {
      this.showBufferingSpinner();
    }
  }

  isReadyToPlay(): boolean {
    return this.nextSequenceBuffer.length > 0;
  }
}
```

**4. Thumbnail Preview**

```typescript
// Generate thumbnails for progress bar hovering
async function generateThumbnail(sequence: AMLSequence): Promise<string> {
  const offscreenCanvas = document.createElement('canvas');
  const renderer = new APEXRenderer(offscreenCanvas);

  await renderer.playSequence(sequence);
  renderer.pause();

  return offscreenCanvas.toDataURL('image/png');
}
```

## 6.2 Handling Adaptivity While Maintaining Video Feel

**The Challenge**: Real videos are linear; our content adapts.

**The Solution**: “Branching Video” Pattern

```typescript
class AdaptiveVideoExperience {
  private mainPath: AMLSequence[];
  private branches: Map<string, AMLSequence[]>;

  async handleInteraction(input: string): Promise<void> {
    // Smoothly transition to branch
    this.fadeOut();

    // Get adaptive content
    const branchSequences = await this.generateBranch(input);

    // Transition back to main path
    this.fadeIn();
    this.appendToTimeline(branchSequences);

    // Update progress bar to show new total duration
    this.updateTimeline();
  }

  // Key: User sees seamless continuation
  // Behind scenes: We've inserted new content
}
```

**Visual Indicators**:

```typescript
// Show when content is adaptive vs pre-determined
<div className="content-indicator">
  {isAdaptive ? (
    <span className="badge adaptive">
      🤖 Adapting to your question...
    </span>
  ) : (
    <span className="badge standard">
      📹 Standard lesson
    </span>
  )}
</div>
```

-----

# 7. TECHNOLOGY STACK & COSTS

## 7.1 Complete Stack for MVP

### Frontend

|Technology      |Purpose         |Cost|Why                       |
|----------------|----------------|----|--------------------------|
|**Next.js 14**  |React framework |Free|SSR, routing, optimization|
|**TypeScript**  |Type safety     |Free|Catch bugs early          |
|**Tailwind CSS**|Styling         |Free|Fast, responsive design   |
|**Zustand**     |State management|Free|Simple, lightweight       |
|**SWR**         |Data fetching   |Free|Caching, revalidation     |

**Bundle size target**: <150KB (gzipped)

### Backend

|Technology    |Purpose    |Cost|Why                      |
|--------------|-----------|----|-------------------------|
|**Node.js**   |Runtime    |Free|JavaScript everywhere    |
|**Express**   |API server |Free|Simple, proven           |
|**TypeScript**|Type safety|Free|Consistency with frontend|
|**ws**        |WebSocket  |Free|Real-time updates        |

### Database & Storage

|Service          |Purpose          |Cost (MVP)|Why                            |
|-----------------|-----------------|----------|-------------------------------|
|**Supabase**     |PostgreSQL + Auth|$25/mo    |All-in-one, free tier available|
|**Redis Cloud**  |Caching          |Free tier |Fast session data              |
|**Cloudflare R2**|Asset storage    |~$1/mo    |Cheaper than S3                |

### AI/ML

|Service                 |Purpose           |Cost (MVP) |Why                  |
|------------------------|------------------|-----------|---------------------|
|**OpenAI GPT-4**        |Content generation|~$200/mo   |Best quality         |
|**Alternative: Claude** |Content generation|~$150/mo   |Cheaper, good quality|
|**Alternative: Llama 2**|Self-hosted option|Server cost|No per-token cost    |

**Estimated per-lesson cost**: $0.10-0.30 (20-30 min lesson)
**With 100 students, 5 lessons/week**: ~$150-450/mo

### Infrastructure

|Service       |Purpose         |Cost  |Why                      |
|--------------|----------------|------|-------------------------|
|**Vercel**    |Frontend hosting|$20/mo|Easy deploy, edge network|
|**Railway**   |Backend hosting |$20/mo|Simple, auto-scaling     |
|**Cloudflare**|CDN + DNS       |Free  |Fast, global             |

### Payments & Analytics

|Service    |Purpose       |Cost      |Why                   |
|-----------|--------------|----------|----------------------|
|**Stripe** |Payments      |2.9% + 30¢|Industry standard     |
|**PostHog**|Analytics     |Free tier |Self-hosted option    |
|**Sentry** |Error tracking|Free tier |Critical for stability|

## 7.2 Total MVP Cost Breakdown

**Fixed Monthly Costs**:

- Supabase: $25
- Vercel: $20
- Railway: $20
- Total: **$65/month**

**Variable Costs** (based on usage):

- LLM API: $0.10-0.30 per lesson
- With 100 students, 20 lessons/month each: $200-600/mo

**Total Monthly Operating Cost (100 students)**: **$265-665**

**With pricing at $10/student/month**: **$1,000 revenue**
**Net profit margin**: **35-75%**

## 7.3 Cost Optimization Strategies

**1. Caching**

```typescript
// Cache common lesson introductions
const cache = new Map<string, AMLDocument>();

async function getCachedOrGenerate(key: string): Promise<AMLDocument> {
  if (cache.has(key)) {
    return cache.get(key)!;
  }

  const aml = await llmService.generateLesson(...);
  cache.set(key, aml);
  return aml;
}
```

**2. Prompt Optimization**

```typescript
// Shorter prompts = lower costs
// Use function calling instead of long instructions
const functions = [{
  name: 'generate_sequence',
  parameters: {
    type: 'object',
    properties: {
      actions: { type: 'array' },
      checkpoint: { type: 'object' }
    }
  }
}];
```

**3. Model Selection**

```typescript
// Use GPT-3.5 for simple continuations
// Use GPT-4 only for complex adaptations
if (isSimpleContinuation) {
  model = 'gpt-3.5-turbo'; // 10x cheaper
} else {
  model = 'gpt-4-turbo-preview';
}
```

-----

# 8. DEVELOPMENT PHASES & TIMELINE

## Phase 0: Foundation (Week 1)

**Goal**: Set up development environment and core infrastructure

### Tasks:

- [ ] Initialize Next.js + TypeScript project
- [ ] Set up Supabase database
- [ ] Create database schema
- [ ] Set up authentication (email/password)
- [ ] Deploy basic app to Vercel
- [ ] Set up GitHub repo with CI/CD

**Deliverable**: Empty app with auth working

-----

## Phase 1: Core Renderer (Weeks 2-3)

**Goal**: Build the APEX rendering engine

### Week 2:

- [ ] Implement AML parser (JSON version)
- [ ] Build basic canvas renderer
- [ ] Implement instructor avatar (simple mode)
- [ ] Implement board rendering (text + shapes)
- [ ] Add basic animations (fade, slide)

### Week 3:

- [ ] Add audio engine (Web Speech API)
- [ ] Implement playback controls (pause/resume)
- [ ] Add progress bar
- [ ] Test on different screen sizes
- [ ] Performance optimization (60fps target)

**Deliverable**: Renderer that can play hardcoded AML

-----

## Phase 2: LLM Integration (Week 4)

**Goal**: Connect to LLM and generate content

### Tasks:

- [ ] Set up OpenAI API integration
- [ ] Write system prompts for math lessons
- [ ] Implement lesson generation endpoint
- [ ] Implement continuation/adaptation logic
- [ ] Add error handling and fallbacks
- [ ] Test with 10 different math topics

**Deliverable**: System generates valid AML from prompts

-----

## Phase 3: Session Management (Week 5)

**Goal**: Full student session lifecycle

### Tasks:

- [ ] Implement WebSocket server
- [ ] Build session manager
- [ ] Connect frontend to backend
- [ ] Implement checkpoint handling
- [ ] Add student input processing
- [ ] Store interactions in database

**Deliverable**: Students can complete full adaptive lessons

-----

## Phase 4: Teacher Portal (Week 6)

**Goal**: Teachers can manage lessons and students

### Tasks:

- [ ] Build teacher dashboard UI
- [ ] Implement class management
- [ ] Add assignment system
- [ ] Create 3 template lessons (fractions, decimals, multiplication)
- [ ] Build basic analytics view
- [ ] Add CSV student import

**Deliverable**: Teachers can assign lessons and track completion

-----

## Phase 5: Polish & Testing (Week 7)

**Goal**: Production-ready MVP

### Tasks:

- [ ] UI/UX refinement
- [ ] Mobile responsive testing
- [ ] Load testing (100 concurrent sessions)
- [ ] Security audit
- [ ] Add loading states and error messages
- [ ] Write user documentation
- [ ] Create demo video

**Deliverable**: Production-ready application

-----

## Phase 6: Launch Prep (Week 8)

**Goal**: Go to market

### Tasks:

- [ ] Set up Stripe billing
- [ ] Create pricing tiers
- [ ] Build landing page
- [ ] Set up customer support (Intercom/Help Scout)
- [ ] Beta test with 2-3 schools
- [ ] Fix critical bugs
- [ ] Deploy to production

**Deliverable**: **LAUNCHED MVP** 🚀

-----

## Post-MVP Roadmap

### Phase 7: Expansion (Months 2-3)

- [ ] Add 2 more subjects (Science, Language Arts)
- [ ] Advanced student analytics
- [ ] Teacher collaboration features
- [ ] Mobile app (React Native)
- [ ] Improved avatars

### Phase 8: Scale (Months 4-6)

- [ ] Multi-language support
- [ ] Custom branding for schools
- [ ] API for LMS integration
- [ ] Advanced assessment tools
- [ ] Parent dashboard

-----

# 9. MONETIZATION STRATEGY

## 9.1 Pricing Tiers

### Tier 1: Starter ($9/student/month)

- Up to 30 students
- 3 subjects (Math, Science, Language Arts)
- Basic analytics
- Email support
- **Target**: Small schools, tutoring centers

### Tier 2: Professional ($7/student/month)

- 31-100 students
- All subjects
- Advanced analytics
- Priority support
- Custom branding
- **Target**: Medium schools, districts

### Tier 3: Enterprise (Custom pricing)

- Unlimited students
- All features
- Dedicated support
- API access
- On-premise option
- Training included
- **Target**: Large districts, institutions

## 9.2 Revenue Projections

**Conservative Scenario** (First 6 months):

|Month|Schools|Avg Students|MRR    |Costs |Profit |
|-----|-------|------------|-------|------|-------|
|1    |2      |30          |$540   |$400  |$140   |
|2    |5      |40          |$1,800 |$800  |$1,000 |
|3    |10     |50          |$4,500 |$1,500|$3,000 |
|4    |15     |60          |$8,100 |$2,200|$5,900 |
|5    |20     |70          |$12,600|$3,000|$9,600 |
|6    |25     |80          |$18,000|$4,000|$14,000|

**Optimistic Scenario** (First 6 months):

|Month|Schools|Avg Students|MRR    |Costs  |Profit |
|-----|-------|------------|-------|-------|-------|
|1    |5      |40          |$1,800 |$600   |$1,200 |
|2    |15     |50          |$6,750 |$1,500 |$5,250 |
|3    |30     |60          |$16,200|$3,000 |$13,200|
|4    |50     |70          |$31,500|$5,000 |$26,500|
|5    |75     |80          |$54,000|$8,000 |$46,000|
|6    |100    |90          |$81,000|$12,000|$69,000|

## 9.3 Go-to-Market Strategy

### Month 1: Beta Launch

- Recruit 2-3 pilot schools (free for 3 months)
- Gather intensive feedback
- Create case studies and testimonials
- Build referral program

### Month 2-3: Early Adopters

- Launch paid plans
- Content marketing (blog, YouTube)
- Education conferences
- Partnership with curriculum providers

### Month 4-6: Growth

- Paid advertising (Facebook, Google)
- Sales team (1-2 people)
- Partner with school technology vendors
- International expansion prep

-----

# 10. TESTING & ITERATION PLAN

## 10.1 Testing Strategy

### Unit Tests

```typescript
// Example: Testing AML Parser
describe('AMLParser', () => {
  it('should parse valid AML JSON', () => {
    const parser = new AMLParser();
    const aml = parser.parse(validAMLString);
    expect(aml.version).toBe('1.0');
    expect(aml.sequences).toHaveLength(1);
  });

  it('should handle invalid AML gracefully', () => {
    const parser = new AMLParser();
    const aml = parser.parse('invalid json');
    expect(aml.sequences[0].actions[0].content.speak).toContain('error');
  });
});
```

### Integration Tests

```typescript
// Test full session flow
describe('Session Flow', () => {
  it('should complete a full lesson', async () => {
    const session = await createSession(lessonId, studentId);
    const ws = connectWebSocket(session.id);

    // Should receive initial sequence
    const initialMsg = await waitForMessage(ws);
    expect(initialMsg.type).toBe('aml_sequence');

    // Simulate checkpoint response
    ws.send({ type: 'student_input', input: 'I understand' });

    // Should receive continuation
    const nextMsg = await waitForMessage(ws);
    expect(nextMsg.type).toBe('aml_sequence');
  });
});
```

### Load Testing

```bash
# Using k6 for load testing
k6 run --vus 100 --duration 5m load-test.js

# Target metrics:
# - 100 concurrent sessions
# - <2s response time
# - <1% error rate
```

### User Testing Protocol

**Week 1-2**: Internal testing

- Developers test all features
- Fix critical bugs

**Week 3-4**: Alpha testing

- 10 teachers from pilot schools
- Structured feedback sessions
- Iterate on UX issues

**Week 5-6**: Beta testing

- 50 students + 5 teachers
- Real classroom usage
- Monitor analytics closely

**Week 7-8**: Pre-launch refinement

- Address all blocking issues
- Polish UI/UX
- Prepare support docs

## 10.2 Feedback Loops

### In-App Feedback

```typescript
// Quick feedback widget
<FeedbackWidget>
  <button onClick={() => sendFeedback('positive')}>👍</button>
  <button onClick={() => sendFeedback('negative')}>👎</button>
  <textarea placeholder="Tell us more..." />
</FeedbackWidget>
```

### Analytics to Track

- Lesson completion rate
- Average session duration
- Questions per lesson (engagement)
- Checkpoint pass rate
- Browser/device distribution
- Error rates by feature

### Weekly Review Metrics

- New signups
- Active users (DAU/MAU)
- Revenue (MRR/ARR)
- Churn rate
- NPS score
- Support tickets

-----

# 11. DEPLOYMENT & SCALING

## 11.1 MVP Deployment Architecture

```
Internet
    │
    ▼
┌─────────────────┐
│  Cloudflare CDN │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────────┐ ┌──────────┐
│ Vercel  │ │ Railway  │
│ (Next)  │ │ (API)    │
└────┬────┘ └────┬─────┘
     │           │
     │      ┌────┴────┐
     │      │         │
     │      ▼         ▼
     │  ┌────────┐ ┌────────┐
     │  │Supabase│ │ Redis  │
     │  └────────┘ └────────┘
     │
     └─────────────┐
                   ▼
              ┌─────────┐
              │OpenAI API│
              └─────────┘
```

## 11.2 Deployment Checklist

### Environment Variables

```bash
# .env.production
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_WS_URL=wss://api.yourapp.com
NEXT_PUBLIC_APP_URL=https://app.yourapp.com
```

### CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Run tests
        run: npm test

      - name: Deploy frontend
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}

      - name: Deploy backend
        run: railway up
```

### Monitoring Setup

```typescript
// Sentry for error tracking
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV
});

// Custom monitoring
export function trackMetric(name: string, value: number) {
  // Send to analytics
  posthog.capture('metric', { name, value });

  // Alert if threshold exceeded
  if (name === 'llm_response_time' && value > 5000) {
    alertOps('Slow LLM response detected');
  }
}
```

## 11.3 Scaling Strategy

### When to Scale

**Trigger 1**: Response time > 3 seconds
**Action**: Add Redis caching, optimize queries

**Trigger 2**: 500+ concurrent sessions
**Action**: Horizontal scaling (add server instances)

**Trigger 3**: LLM costs > $2000/month
**Action**: Implement aggressive caching, consider self-hosted models

### Database Scaling

```sql
-- Add read replicas for analytics queries
-- Connection pooling
CREATE EXTENSION pg_stat_statements;

-- Index optimization
CREATE INDEX CONCURRENTLY idx_sessions_active
ON sessions(student_id, status)
WHERE status = 'in_progress';
```

### Caching Strategy

```typescript
// Multi-layer caching
class CacheManager {
  // L1: In-memory (fastest)
  private memCache = new Map();

  // L2: Redis (shared across instances)
  private redis: Redis;

  // L3: Database (permanent)
  private db: Supabase;

  async get(key: string): Promise<any> {
    // Check L1
    if (this.memCache.has(key)) return this.memCache.get(key);

    // Check L2
    const redisValue = await this.redis.get(key);
    if (redisValue) {
      this.memCache.set(key, redisValue);
      return redisValue;
    }

    // Check L3
    const dbValue = await this.db.from('cache').select().eq('key', key);
    if (dbValue) {
      this.redis.set(key, dbValue);
      this.memCache.set(key, dbValue);
      return dbValue;
    }

    return null;
  }
}
```

-----

# 12. LAUNCH CHECKLIST

## Pre-Launch (Week 8)

### Technical

- [ ] All MVP features working
- [ ] Load tested (100+ concurrent users)
- [ ] Security audit completed
- [ ] SSL certificates configured
- [ ] Backup system in place
- [ ] Monitoring and alerts active
- [ ] Error tracking configured

### Content

- [ ] 3 complete lesson templates ready
- [ ] LLM prompts refined and tested
- [ ] User documentation written
- [ ] Help center articles published
- [ ] Demo video created
- [ ] Tutorial videos recorded

### Business

- [ ] Stripe account verified
- [ ] Pricing finalized
- [ ] Terms of Service written
- [ ] Privacy Policy written
- [ ] Support email configured
- [ ] Customer support process documented

### Marketing

- [ ] Landing page live
- [ ] Social media accounts created
- [ ] Press kit prepared
- [ ] Launch email drafted
- [ ] Beta testimonials collected
- [ ] Product Hunt launch scheduled

## Launch Day

- [ ] Deploy to production
- [ ] Announce on social media
- [ ] Email existing waitlist
- [ ] Post on Product Hunt
- [ ] Monitor for issues
- [ ] Respond to early feedback

## Post-Launch (Week 9-12)

- [ ] Daily metrics review
- [ ] Weekly user interviews
- [ ] Bug fix releases
- [ ] Content creation (blog posts)
- [ ] Feature iteration based on feedback
- [ ] Begin Phase 7 development

-----

# APPENDIX A: Quick Start Guide

## For Developers

```bash
# Clone and setup
git clone https://github.com/yourorg/apex
cd apex
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your keys

# Start database
npx supabase start

# Run migrations
npx supabase db push

# Start development servers
npm run dev        # Frontend (localhost:3000)
npm run dev:api    # Backend (localhost:4000)

# Run tests
npm test

# Build for production
npm run build
```

## For Non-Technical Stakeholders

**What is APEX?**
A platform that uses AI to create adaptive, personalized learning experiences that feel like watching a professional instructional video.

**What makes it special?**

- Content adapts to each student in real-time
- Feels like a high-quality pre-recorded video
- Costs a fraction of traditional video production
- Works on any device

**Timeline to Revenue**

- Week 1-7: Build MVP
- Week 8: Launch with first paying schools
- Month 2-3: Reach profitability
- Month 6: $18K+ MRR (conservative)

**Investment Needed**

- $5K-10K for MVP development (if hiring)
- $500/month operating costs initially
- Break-even at ~100 students

-----

# APPENDIX B: Code Repository Structure

```
apex/
├── frontend/              # Next.js application
│   ├── components/
│   │   ├── APEXPlayer.tsx
│   │   ├── TeacherDashboard.tsx
│   │   └── StudentPortal.tsx
│   ├── lib/
│   │   ├── apex-renderer.ts
│   │   ├── aml-parser.ts
│   │   └── websocket.ts
│   ├── pages/
│   │   ├── index.tsx
│   │   ├── lesson/[id].tsx
│   │   └── api/
│   └── styles/
│
├── backend/               # Express API
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── lessons.ts
│   │   └── sessions.ts
│   ├── services/
│   │   ├── llm-service.ts
│   │   ├── session-manager.ts
│   │   └── analytics.ts
│   ├── middleware/
│   └── server.ts
│
├── database/
│   ├── migrations/
│   └── seeds/
│
├── shared/                # Shared types
│   └── types/
│       ├── aml.ts
│       └── session.ts
│
├── scripts/
│   ├── deploy.sh
│   └── test-load.js
│
└── docs/
    ├── API.md
    ├── AML-SPEC.md
    └── DEPLOYMENT.md
```

-----

# FINAL THOUGHTS

This documentation provides everything needed to build APEX from scratch. The MVP is **ambitious but achievable in 6-8 weeks** with focused development.

**Key Success Factors**:

1. **Start small**: MVP has limited scope
1. **Test early**: Get real users involved by week 4
1. **Iterate fast**: Weekly releases
1. **Focus on UX**: It must feel magical, not complicated
1. **Monitor costs**: LLM expenses can spiral

**The Opportunity**:
Educational content is expensive to produce and static. APEX makes it cheap and adaptive. The market is enormous (millions of students), and the technology is ready.

**Next Steps**:

1. Set up development environment (Day 1)
1. Build basic renderer (Week 1-2)
1. Integrate LLM (Week 3)
1. Test with real students (Week 5)
1. Launch with 2-3 pilot schools (Week 8)

You have a clear path to a working, revenue-generating product in **under 2 months**.

**Ready to build? Let’s go! 🚀**
