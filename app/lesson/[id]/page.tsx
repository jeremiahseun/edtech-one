'use client';

import { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useAction, useConvexAuth } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import Link from 'next/link';
import { useGeminiLive } from '@/hooks/useGeminiLive';
import { GEMINI_TOOLS_DECLARATION, SYSTEM_INSTRUCTION } from '@/lib/apex/tools-config';
import { APEXRenderer } from '@/lib/apex/renderer';
import { CheckpointModal, CheckpointData } from '@/components/lesson/CheckpointModal';

// ============================================================================
// Types
// ============================================================================

interface TeachingSegment {
    id: string;
    speech: string;
    boardContent?: {
        title?: string;
        points?: string[];
        equation?: string;
        diagram?: string;
    };
    duration: number; // in seconds
}

// ============================================================================
// Main Page Wrapper (for Suspense)
// ============================================================================

export default function LessonPlayerPage() {
    return (
        <Suspense fallback={<LoadingScreen />}>
            <LessonPlayerContent />
        </Suspense>
    );
}

function LoadingScreen() {
    return (
        <div className="bg-background-dark min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
                <p className="text-slate-400 text-sm">Loading lesson...</p>
            </div>
        </div>
    );
}

// ============================================================================
// Main Content
// ============================================================================

function LessonPlayerContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const courseId = params.id as Id<"courses">;
    const moduleId = searchParams.get('moduleId') || 'mod_0';

    // Convex data
    const course = useQuery(api.courses.getCourse, { courseId });
    const learningPath = useQuery(api.curriculum.getLearningPath, { courseId });

    // Get current module
    const currentModule = learningPath?.modules.find((m: any) => m.id === moduleId);
    const moduleIndex = learningPath?.modules.findIndex((m: any) => m.id === moduleId) ?? 0;

    // UI State
    const [activeTab, setActiveTab] = useState<'notes' | 'transcript'>('notes');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [notes, setNotes] = useState('');
    const [transcript, setTranscript] = useState<Array<{ time: number; text: string }>>([]);;

    // Player state
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showXPToast, setShowXPToast] = useState(false);
    const [xpAmount, setXpAmount] = useState(0);

    // Teaching state
    const [teachingSegments, setTeachingSegments] = useState<TeachingSegment[]>([]);
    const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
    const [currentBoardContent, setCurrentBoardContent] = useState<TeachingSegment['boardContent'] | null>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isWaitingForSpeech, setIsWaitingForSpeech] = useState(false);
    const [checkpointData, setCheckpointData] = useState<CheckpointData | null>(null);

    // Convex actions
    const generateAML = useAction(api.aml.generateAMLSequence);
    const handleInterrupt = useAction(api.aml.handleAdaptiveInterrupt);
    const createSession = useMutation(api.aml.createSession);
    const awardXP = useMutation(api.aml.awardXP);
    const logInsight = useMutation(api.analytics.logInsight);
    const searchContent = useAction(api.aml.search);

    // Live API State
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [rendererInstance, setRendererInstance] = useState<APEXRenderer | null>(null);
    const serverGeminiKey = useQuery(api.aml.getGeminiAPIKey);

    const live = useGeminiLive(
        {
            apiKey: serverGeminiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
            model: "models/gemini-2.5-flash-native-audio-preview-12-2025",
            responseModalities: ["audio"],
            // Note: system instruction for websocket is handled during setup message
            systemInstruction: SYSTEM_INSTRUCTION,
            tools: GEMINI_TOOLS_DECLARATION
        },
        rendererInstance,
        {
            logInsight: async (args) => {
                if (sessionId) {
                    await logInsight({ ...args, sessionId });
                }
            },
            searchContent: async (query) => {
                // Pass courseId to the action as required
                return await searchContent({ query, courseId });
            },
            showCheckpoint: (args) => {
                console.log("Checkpoint triggered:", args);
                setCheckpointData(args);
            }
        }
    );

    // Initialize Renderer
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const renderer = new APEXRenderer({
            canvas,
            width: 1024,
            height: 576,
        });
        setRendererInstance(renderer);

        // Cleanup: dispose canvas when component unmounts
        return () => {
            renderer.destroy();
            setRendererInstance(null);
        };
    }, []); // Empty deps - only run once on mount

    // Session management
    const [sessionId, setSessionId] = useState<Id<"sessions"> | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // Refs for cleanup and control - using refs to avoid stale closures
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const segmentsRef = useRef<TeachingSegment[]>([]);
    const segmentIndexRef = useRef(0);
    const isPlayingRef = useRef(false);
    const isPausedRef = useRef(false);

    // ============================================================================
    // Teaching Flow - Using refs to avoid stale closures
    // ============================================================================

    // Keep refs in sync with state
    useEffect(() => {
        segmentsRef.current = teachingSegments;
    }, [teachingSegments]);

    useEffect(() => {
        segmentIndexRef.current = currentSegmentIndex;
    }, [currentSegmentIndex]);

    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    useEffect(() => {
        isPausedRef.current = isPaused;
    }, [isPaused]);

    const playSegmentAtIndex = useCallback((index: number) => {
        const segments = segmentsRef.current;
        if (index >= segments.length) {
            // Lesson complete
            setIsPlaying(false);
            isPlayingRef.current = false;
            setXpAmount(25);
            setShowXPToast(true);
            setTimeout(() => setShowXPToast(false), 3000);
            awardXP({ amount: 25, reason: 'Completed lesson' }).catch(console.error);
            return;
        }

        const segment = segments[index];
        setCurrentSegmentIndex(index);
        segmentIndexRef.current = index;

        // Update board content
        setCurrentBoardContent(segment.boardContent || null);

        // Add to transcript
        setTranscript(prev => [...prev, { time: Date.now(), text: segment.speech }]);

        // With Live API, audio comes from Gemini - no local TTS needed
        // Auto-advance after segment duration (or use Live API events)
        setTimeout(() => {
            if (isPlayingRef.current && !isPausedRef.current) {
                playSegmentAtIndex(segmentIndexRef.current + 1);
            }
        }, segment.duration * 1000);
    }, [awardXP]);

    // Update time counter
    useEffect(() => {
        if (!isPlaying || isPaused) return;

        timerRef.current = setInterval(() => {
            setCurrentTime(prev => prev + 1);
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPlaying, isPaused]);

    // ============================================================================
    // Generate Teaching Content
    // ============================================================================

    const generateTeachingContent = useCallback(async (topic: string): Promise<TeachingSegment[]> => {
        // This creates structured teaching segments from the topic
        // In production, this would come from the AML generator
        const segments: TeachingSegment[] = [
            {
                id: 'intro',
                speech: `Welcome to today's lesson on ${topic}. Let's dive into this fascinating subject together. I'll guide you through the key concepts step by step.`,
                boardContent: {
                    title: topic,
                    points: ['Introduction', 'Core Concepts', 'Examples', 'Practice'],
                },
                duration: 15,
            },
            {
                id: 'concept1',
                speech: `First, let's understand the fundamental principles. ${topic} is built on several important ideas that we'll explore together. Pay attention to how these concepts connect with each other.`,
                boardContent: {
                    title: 'Fundamental Principles',
                    points: [
                        'Core idea and definition',
                        'Historical context',
                        'Why this matters',
                    ],
                },
                duration: 20,
            },
            {
                id: 'concept2',
                speech: `Now, let's look at how this works in practice. Understanding the application of these principles is just as important as knowing the theory. Here's a practical example to help you visualize it better.`,
                boardContent: {
                    title: 'Practical Application',
                    points: [
                        'Real-world example',
                        'Step-by-step breakdown',
                        'Common mistakes to avoid',
                    ],
                },
                duration: 25,
            },
            {
                id: 'summary',
                speech: `Let's summarize what we've learned. Remember the key points we covered: the fundamentals, how to apply them, and why they're important. Do you have any questions about what we've discussed?`,
                boardContent: {
                    title: 'Key Takeaways',
                    points: [
                        'Main concept understood',
                        'Practical application learned',
                        'Ready for practice exercises',
                    ],
                },
                duration: 15,
            },
        ];

        return segments;
    }, []);

    // ============================================================================
    // Start Lesson
    // ============================================================================

    const startLesson = useCallback(async () => {
        if (!currentModule || !course) return;

        setIsGenerating(true);
        try {
            // Create session
            const id = await createSession({
                courseId,
                moduleId,
                topic: currentModule.title,
            });
            setSessionId(id);

            // GEMINI LIVE MODE (checking server key too)
            if (serverGeminiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || live.isConnected) {
                console.log("Starting Gemini Live Session...");
                await live.connect();
                await live.startRecording();
                setIsPlaying(true);
                setIsGenerating(false);
                return;
            }


            // Generate structured teaching content
            // For now, use local content with guaranteed board visuals
            // TODO: Parse AML properly when AML generation includes board elements
            try {
                // Just trigger AML generation for future use / logging
                generateAML({
                    courseId,
                    moduleId,
                    topic: currentModule.title,
                }).then(result => console.log('AML generated (for future use):', result)).catch(() => { });
            } catch {
                // Ignore AML errors
            }

            // Use local teaching content with proper board visuals
            const segments = await generateTeachingContent(currentModule.title);
            setTeachingSegments(segments);
            segmentsRef.current = segments; // Set ref immediately
            setDuration(segments.reduce((acc, s) => acc + s.duration, 0));

            setIsPlaying(true);
            isPlayingRef.current = true;
            playSegmentAtIndex(0);

        } catch (error) {
            console.error('Failed to start lesson:', error);
        } finally {
            setIsGenerating(false);
        }
    }, [currentModule, course, courseId, moduleId, createSession, generateAML, generateTeachingContent, playSegmentAtIndex, live, serverGeminiKey]);

    // ============================================================================
    // Player Controls
    // ============================================================================

    const togglePlayPause = useCallback(() => {
        if (isPaused) {
            setIsPaused(false);
            // Resume speech if there was one (client-only component)
            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
            }
        } else {
            setIsPaused(true);
            // Pause speech (client-only component)
            window.speechSynthesis.pause();
        }
    }, [isPaused]);

    // ============================================================================
    // Cleanup on Unmount
    // ============================================================================

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    // ============================================================================
    // Helpers
    // ============================================================================

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    // Handle checkpoint answer
    const handleCheckpointAnswer = async (selectedOption: string, isCorrect: boolean) => {
        setCheckpointData(null); // Close modal

        if (isCorrect) {
            // Award XP for correct answer
            setXpAmount(10);
            setShowXPToast(true);
            setTimeout(() => setShowXPToast(false), 3000);

            try {
                await awardXP({ amount: 10, reason: 'Checkpoint correct answer' });
            } catch (error) {
                console.error('Failed to award XP:', error);
            }
        }
    };

    const goToNextModule = () => {
        if (!learningPath || moduleIndex >= learningPath.modules.length - 1) return;
        const nextModule = learningPath.modules[moduleIndex + 1];
        router.push(`/lesson/${courseId}?moduleId=${nextModule.id}`);
    };

    const goToPrevModule = () => {
        if (!learningPath || moduleIndex <= 0) return;
        const prevModule = learningPath.modules[moduleIndex - 1];
        router.push(`/lesson/${courseId}?moduleId=${prevModule.id}`);
    };

    // Loading state
    if (!course || !learningPath) {
        return <LoadingScreen />;
    }

    return (
        <div className="bg-background-dark text-slate-100 h-screen flex flex-col overflow-hidden">
            {/* Top Navigation Bar */}
            <header className="flex items-center justify-between border-b border-border-dark px-6 py-3 bg-background-dark z-20">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <div className="size-8 bg-primary rounded flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-xl">school</span>
                        </div>
                        <h2 className="text-lg font-bold leading-tight tracking-tight">APEX</h2>
                    </Link>
                    <nav className="hidden md:flex items-center gap-2 text-sm">
                        <Link className="text-[#9da6b9] hover:text-primary transition-colors font-medium" href={`/courses/${courseId}`}>
                            {course.title}
                        </Link>
                        <span className="text-[#9da6b9]">/</span>
                        <span className="font-medium">{currentModule?.title || 'Lesson'}</span>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 bg-surface-dark rounded-lg px-3 py-1.5">
                        <button onClick={goToPrevModule} disabled={moduleIndex <= 0} className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                            <span className="material-symbols-outlined text-lg">chevron_left</span>
                        </button>
                        <span className="text-sm font-medium text-slate-400">{moduleIndex + 1} / {learningPath.modules.length}</span>
                        <button onClick={goToNextModule} disabled={moduleIndex >= learningPath.modules.length - 1} className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                            <span className="material-symbols-outlined text-lg">chevron_right</span>
                        </button>
                    </div>
                    <div className="h-8 w-[1px] bg-border-dark"></div>
                    <Link href={`/courses/${courseId}`} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-lg">close</span>
                        <span className="hidden sm:inline">Exit Lesson</span>
                    </Link>
                </div>
            </header>

            <main className="flex flex-1 overflow-hidden relative">
                {/* Center Stage */}
                <div className="flex-1 flex flex-col relative bg-black">
                    <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden items-center justify-center">
                        <div className="relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl group">
                            {/* AI Avatar */}
                            <div className="absolute bottom-6 right-6 z-10">
                                <div className={`relative size-28 rounded-full border-4 ${isSpeaking ? 'border-primary' : 'border-slate-700'} transition-colors overflow-hidden bg-surface-dark shadow-xl`}>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className={`size-16 rounded-full bg-primary/80 ${isSpeaking ? 'animate-pulse' : ''}`}></div>
                                        <div className={`absolute size-20 rounded-full border-2 border-primary/40 ${isSpeaking ? 'animate-ping' : 'opacity-50'}`}></div>
                                    </div>
                                    {isSpeaking && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-blue-400 to-primary animate-gradient bg-300%"></div>
                                    )}
                                </div>
                                <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold ${isSpeaking ? 'bg-primary text-white' : isPaused ? 'bg-amber-600 text-white' : isPlaying ? 'bg-slate-600 text-slate-300' : 'bg-slate-700 text-slate-400'}`}>
                                    {isSpeaking ? 'Speaking...' : isPaused ? 'Paused' : isPlaying ? 'Teaching' : 'Ready'}
                                </div>
                            </div>

                            {/* Digital Whiteboard */}
                            <div className="w-full h-full bg-[#1a1c23] flex items-center justify-center relative">
                                {/* Live Canvas Layer */}
                                <canvas
                                    ref={canvasRef}
                                    width={1024}
                                    height={576}
                                    className={`absolute inset-0 w-full h-full object-contain z-10 transition-opacity duration-300 ${live.isConnected ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                                />
                                {isGenerating ? (
                                    <div className="absolute inset-0 flex items-center justify-center z-20">
                                        <div className="text-center">
                                            <div className="size-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                            <p className="text-slate-400 font-medium">Preparing your personalized lesson...</p>
                                            <p className="text-sm text-slate-500 mt-2">This may take a moment</p>
                                        </div>
                                    </div>
                                ) : !isPlaying && currentTime === 0 ? (
                                    <div className="text-center">
                                        <div className="size-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <span className="material-symbols-outlined text-primary text-5xl">play_circle</span>
                                        </div>
                                        <h2 className="text-2xl font-bold mb-2">{currentModule?.title}</h2>
                                        <p className="text-slate-400 mb-8 max-w-md">{currentModule?.description}</p>
                                        <button onClick={startLesson} className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-primary/30 hover:scale-105">
                                            Start Lesson
                                        </button>
                                    </div>
                                ) : (
                                    // Active lesson - Show board content
                                    <div className="w-full h-full p-8">
                                        <div className="bg-slate-900/50 border border-slate-700 rounded-lg h-full p-8 flex flex-col">
                                            {currentBoardContent ? (
                                                <>
                                                    <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                                                        <span className="material-symbols-outlined text-primary">draw</span>
                                                        {currentBoardContent.title || currentModule?.title}
                                                    </h1>
                                                    {currentBoardContent.points && (
                                                        <div className="flex-1 space-y-4">
                                                            {currentBoardContent.points.map((point, idx) => (
                                                                <div key={idx} className="flex items-start gap-4 animate-fade-in" style={{ animationDelay: `${idx * 0.2}s` }}>
                                                                    <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                                                                        <span className="text-primary font-bold text-sm">{idx + 1}</span>
                                                                    </div>
                                                                    <p className="text-xl text-slate-200">{point}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {currentBoardContent.equation && (
                                                        <div className="mt-8 p-6 bg-slate-800 rounded-lg text-center">
                                                            <p className="text-2xl font-mono text-white">{currentBoardContent.equation}</p>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="flex-1 flex items-center justify-center">
                                                    <div className="text-center">
                                                        <div className="size-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                                            <span className="material-symbols-outlined text-primary text-3xl">auto_awesome</span>
                                                        </div>
                                                        <p className="text-slate-400">Lesson in progress...</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {isPlaying && (
                                <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded text-xs font-medium border border-white/10 flex items-center gap-2">
                                    <div className={`size-2 rounded-full ${isPaused ? 'bg-amber-500' : 'bg-red-500 animate-pulse'}`}></div>
                                    {isPaused ? 'PAUSED' : 'LIVE LESSON'}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom Control Bar */}
                    <div className="w-full px-6 pb-6">
                        <div className="max-w-5xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
                            <div className="flex flex-col gap-2 mb-3">
                                <div className="group relative h-1.5 w-full bg-slate-700 rounded-full cursor-pointer">
                                    <div className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }}>
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 size-4 bg-white rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform"></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between px-1">
                                    <span className="text-xs text-slate-400 font-medium">{formatTime(currentTime)} / {formatTime(duration || 60)}</span>
                                    <span className="text-xs text-slate-400 font-medium">
                                        Segment {currentSegmentIndex + 1} / {teachingSegments.length || 1}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <button onClick={isPlaying ? togglePlayPause : startLesson} className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
                                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                                            {!isPlaying ? 'play_arrow' : isPaused ? 'play_arrow' : 'pause'}
                                        </span>
                                    </button>
                                    <button onClick={goToNextModule} disabled={moduleIndex >= learningPath.modules.length - 1} className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30">
                                        <span className="material-symbols-outlined">skip_next</span>
                                    </button>
                                    <div className="w-[1px] h-6 bg-white/10 mx-2"></div>
                                    <button
                                        onClick={live.toggleMute}
                                        className={`p-2 rounded-lg transition-colors ${live.isMuted ? 'bg-red-500/20 text-red-400' : 'text-white hover:bg-white/10'}`}
                                        title={live.isMuted ? 'Unmute microphone' : 'Mute microphone'}
                                    >
                                        <span className="material-symbols-outlined">{live.isMuted ? 'mic_off' : 'mic'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <aside className={`${isSidebarCollapsed ? 'w-0' : 'w-96'} bg-surface-dark border-l border-border-dark flex flex-col z-10 shadow-2xl transition-all duration-300 overflow-hidden`}>
                    <div className="flex border-b border-border-dark shrink-0">
                        <button onClick={() => setActiveTab('notes')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'notes' ? 'border-b-2 border-primary text-primary' : 'text-slate-400 hover:text-slate-200'}`}>
                            <span className="material-symbols-outlined text-[18px]">article</span>Notes
                        </button>
                        <button onClick={() => setActiveTab('transcript')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'transcript' ? 'border-b-2 border-primary text-primary' : 'text-slate-400 hover:text-slate-200'}`}>
                            <span className="material-symbols-outlined text-[18px]">receipt_long</span>Transcript
                        </button>
                    </div>

                    <div className="flex-1 overflow-hidden flex flex-col">
                        {activeTab === 'notes' && (
                            <div className="flex-1 p-4 flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-sm text-slate-400">Your Notes</h3>
                                    <span className="text-xs text-slate-500">{notes.length}/5000</span>
                                </div>
                                <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                                    className="flex-1 w-full bg-slate-800 border-none rounded-xl text-sm focus:ring-primary focus:ring-1 resize-none p-4 placeholder-slate-500"
                                    placeholder="Take notes during the lesson..." maxLength={5000} />
                                <p className="text-xs text-slate-500 mt-2">💡 Notes are saved locally. Export them anytime.</p>
                            </div>
                        )}

                        {activeTab === 'transcript' && (
                            <div className="flex-1 overflow-y-auto p-4">
                                {transcript.length > 0 ? (
                                    <div className="space-y-4">
                                        {transcript.map((item, idx) => (
                                            <div key={idx} className="flex gap-3">
                                                <span className="text-xs text-slate-500 font-mono shrink-0">{formatTime(item.time)}</span>
                                                <p className="text-sm text-slate-300">{item.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-slate-500">
                                        <span className="material-symbols-outlined text-4xl mb-4 block">receipt_long</span>
                                        <p className="text-sm">Transcript will appear as the lesson progresses</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </aside>

                {isSidebarCollapsed && (
                    <button onClick={() => setIsSidebarCollapsed(false)} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-surface-dark border border-border-dark rounded-l-lg px-2 py-4 hover:bg-slate-700 transition-colors">
                        <span className="material-symbols-outlined text-slate-400">chevron_left</span>
                    </button>
                )}
            </main>

            {/* Checkpoint Modal */}
            {checkpointData && (
                <CheckpointModal
                    checkpoint={checkpointData}
                    onAnswer={handleCheckpointAnswer}
                    onClose={() => setCheckpointData(null)}
                />
            )}

            {showXPToast && (
                <div className="fixed bottom-24 right-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl px-6 py-4 flex items-center gap-4 shadow-2xl animate-slide-in-right z-50">
                    <div className="size-12 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-2xl">stars</span>
                    </div>
                    <div>
                        <p className="text-white font-bold text-lg">+{xpAmount} XP</p>
                        <p className="text-white/80 text-sm">Great job!</p>
                    </div>
                </div>
            )}

            {/* Error Banner */}
            {live.error && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-surface-dark border border-red-500/30 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="size-12 bg-red-500/20 rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-red-400 text-2xl">
                                    {live.error.type === 'microphone' ? 'mic_off' : 'wifi_off'}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">
                                    {live.error.type === 'microphone' ? 'Microphone Access Required' :
                                        live.error.type === 'connection' ? 'Connection Failed' :
                                            'Connection Error'}
                                </h3>
                                <p className="text-sm text-red-400">
                                    {live.error.type === 'microphone' ? 'Voice interaction unavailable' : 'Please try again'}
                                </p>
                            </div>
                        </div>

                        <p className="text-slate-300 mb-6 leading-relaxed">
                            {live.error.message}
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={live.clearError}
                                className="flex-1 py-2.5 px-4 border border-white/10 rounded-xl text-slate-300 hover:bg-white/5 transition-colors"
                            >
                                Dismiss
                            </button>
                            <button
                                onClick={async () => {
                                    live.clearError();
                                    if (live.error?.type === 'microphone') {
                                        await live.startRecording();
                                    } else {
                                        await live.connect();
                                    }
                                }}
                                className="flex-1 py-2.5 px-4 bg-primary hover:bg-primary/90 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-lg">refresh</span>
                                Retry
                            </button>
                        </div>

                        {live.error.type === 'microphone' && (
                            <p className="mt-4 text-xs text-slate-500 text-center">
                                Tip: Click the lock or camera icon in your browser&apos;s address bar to manage permissions.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
