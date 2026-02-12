'use client';

/**
 * APEX Player Component
 *
 * Main player component that wraps the canvas renderer and integrates with Convex.
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { useMutation, useAction, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { APEXPlayer as Player, createAPEXPlayer } from '@/lib/apex/player';
import type { AMLSequence, AMLCheckpoint } from '@/lib/aml/types';
import { useAPEXStore } from '@/app/store/useAPEXStore';
import { Id } from '@/convex/_generated/dataModel';

// ============================================================================
// Types
// ============================================================================

interface APEXPlayerProps {
    courseId: Id<"courses">;
    moduleId: string;
    topic: string;
    initialSequences?: AMLSequence[];
    onSessionCreated?: (sessionId: Id<"sessions">) => void;
}

// ============================================================================
// Component
// ============================================================================

export function APEXPlayerComponent({
    courseId,
    moduleId,
    topic,
    initialSequences = [],
    onSessionCreated,
}: APEXPlayerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<Player | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 800, height: 450 });

    // Store
    const {
        setPlayerState,
        showCheckpoint,
        hideCheckpoint,
        showXPEarned,
        addToTranscript,
        setSession,
        checkpointActive,
        activeCheckpoint,
        checkpointAnswer,
    } = useAPEXStore();

    // Convex mutations/actions
    const createSession = useMutation(api.aml.createSession);
    const updateProgress = useMutation(api.aml.updateSessionProgress);
    const addSequenceToHistory = useMutation(api.aml.addSequenceToHistory);
    const awardXP = useMutation(api.aml.awardXP);
    const generateAML = useAction(api.aml.generateAMLSequence);
    const handleInterrupt = useAction(api.aml.handleAdaptiveInterrupt);

    // Session state
    const [sessionId, setSessionId] = useState<Id<"sessions"> | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // --------------------------------------------------------------------------
    // Initialization
    // --------------------------------------------------------------------------

    useEffect(() => {
        if (!containerRef.current) return;

        const updateDimensions = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setDimensions({
                    width: rect.width,
                    height: Math.min(rect.width * (9 / 16), 600),
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);

        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
        if (!canvasRef.current || isInitialized) return;

        const player = createAPEXPlayer({
            canvas: canvasRef.current,
            width: dimensions.width,
            height: dimensions.height,
            onStateChange: (state) => {
                setPlayerState(state);
            },
            onCheckpoint: handleCheckpointTriggered,
            onSequenceComplete: handleSequenceComplete,
            onXPEarned: handleXPEarned,
            onError: (error) => console.error('Player error:', error),
        });

        player.initialize();
        playerRef.current = player;
        setIsInitialized(true);

        return () => {
            player.destroy();
            playerRef.current = null;
        };
    }, [dimensions, isInitialized]);

    // --------------------------------------------------------------------------
    // Session Setup
    // --------------------------------------------------------------------------

    useEffect(() => {
        const initSession = async () => {
            try {
                const id = await createSession({ courseId, moduleId, topic });
                setSessionId(id);
                setSession(id, courseId, moduleId);
                onSessionCreated?.(id);

                // Load initial sequences or generate new ones
                if (initialSequences.length > 0) {
                    playerRef.current?.loadSequences(initialSequences);
                } else {
                    await generateAndLoadSequences();
                }
            } catch (error) {
                console.error('Failed to create session:', error);
            }
        };

        initSession();
    }, [courseId, moduleId, topic]);

    // --------------------------------------------------------------------------
    // AML Generation
    // --------------------------------------------------------------------------

    const generateAndLoadSequences = useCallback(async () => {
        if (!playerRef.current) return;

        setIsGenerating(true);
        try {
            const sequences = await generateAML({
                courseId,
                moduleId,
                topic,
            });

            if (sequences && Array.isArray(sequences)) {
                playerRef.current.loadSequences(sequences as AMLSequence[]);
            }
        } catch (error) {
            console.error('Failed to generate AML:', error);
        } finally {
            setIsGenerating(false);
        }
    }, [courseId, moduleId, topic, generateAML]);

    // --------------------------------------------------------------------------
    // Event Handlers
    // --------------------------------------------------------------------------

    const handleCheckpointTriggered = useCallback((checkpoint: AMLCheckpoint, onAnswer: (answer: string) => void) => {
        showCheckpoint(checkpoint);

        // Store the answer callback for later use
        (window as any).__checkpointAnswerCallback = onAnswer;
    }, [showCheckpoint]);

    const handleSequenceComplete = useCallback(async (sequenceId: string) => {
        if (!sessionId || !playerRef.current) return;

        const sequence = playerRef.current.getCurrentSequence();
        if (sequence) {
            // Save to history
            await addSequenceToHistory({
                sessionId,
                amlSequence: sequence,
                role: 'assistant',
            });

            // Update progress
            const state = playerRef.current.getSessionState();
            await updateProgress({
                sessionId,
                currentSequenceId: state.currentSequenceId || '',
                currentTimestamp: state.currentTimestamp,
                status: 'active',
            });
        }
    }, [sessionId, addSequenceToHistory, updateProgress]);

    const handleXPEarned = useCallback(async (amount: number, reason: string) => {
        showXPEarned(amount, reason);

        try {
            await awardXP({ amount, reason });
        } catch (error) {
            console.error('Failed to award XP:', error);
        }

        // Auto-hide toast after 3 seconds
        setTimeout(() => {
            useAPEXStore.getState().hideXPToast();
        }, 3000);
    }, [awardXP, showXPEarned]);

    // --------------------------------------------------------------------------
    // Checkpoint Submission
    // --------------------------------------------------------------------------

    const submitCheckpoint = useCallback(async () => {
        const callback = (window as any).__checkpointAnswerCallback;
        if (callback && checkpointAnswer) {
            callback(checkpointAnswer);
            delete (window as any).__checkpointAnswerCallback;
        }
        hideCheckpoint();
    }, [checkpointAnswer, hideCheckpoint]);

    // --------------------------------------------------------------------------
    // Adaptive Interrupt (Ask Question)
    // --------------------------------------------------------------------------

    const askQuestion = useCallback(async (question: string) => {
        if (!sessionId || !playerRef.current) return;

        const player = playerRef.current;
        player.pause();

        // Get current position
        const state = player.getState();

        try {
            // Generate explanation sequence
            const explanationSequences = await handleInterrupt({
                sessionId,
                question,
                currentSequenceId: state.currentSequenceId || '',
                currentTimestamp: state.currentTime,
            });

            if (explanationSequences && Array.isArray(explanationSequences)) {
                // Insert at front of queue
                (explanationSequences as AMLSequence[]).forEach(seq => {
                    player.insertSequence(seq);
                });
            }

            // Resume playback with new sequence
            player.play();

            // Add to transcript
            addToTranscript(`You: ${question}`);
        } catch (error) {
            console.error('Failed to handle question:', error);
            player.resume();
        }
    }, [sessionId, handleInterrupt, addToTranscript]);

    // --------------------------------------------------------------------------
    // Playback Controls
    // --------------------------------------------------------------------------

    const play = useCallback(() => {
        playerRef.current?.play();
    }, []);

    const pause = useCallback(() => {
        playerRef.current?.pause();
    }, []);

    const seek = useCallback((time: number) => {
        playerRef.current?.seek(time);
    }, []);

    const skipNext = useCallback(() => {
        playerRef.current?.skipToNext();
    }, []);

    // --------------------------------------------------------------------------
    // Render
    // --------------------------------------------------------------------------

    return (
        <div ref={containerRef} className="relative w-full rounded-xl overflow-hidden bg-[#1a1c23]">
            {/* Canvas */}
            <canvas
                ref={canvasRef}
                width={dimensions.width}
                height={dimensions.height}
                className="w-full"
                style={{ aspectRatio: '16 / 9' }}
            />

            {/* Loading Overlay */}
            {isGenerating && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-white text-center">
                        <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-sm">Generating your personalized lesson...</p>
                    </div>
                </div>
            )}

            {/* Live Indicator */}
            <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded text-xs font-medium border border-white/10 flex items-center gap-2 text-white">
                <div className="size-2 rounded-full bg-red-500 animate-pulse" />
                LIVE LESSON
            </div>

            {/* Checkpoint Overlay */}
            {checkpointActive && activeCheckpoint && (
                <CheckpointOverlay
                    checkpoint={activeCheckpoint}
                    answer={checkpointAnswer}
                    onAnswerChange={(v) => useAPEXStore.getState().setCheckpointAnswer(v)}
                    onSubmit={submitCheckpoint}
                />
            )}

            {/* Controls are rendered by parent component */}
        </div>
    );
}

// ============================================================================
// Checkpoint Overlay
// ============================================================================

interface CheckpointOverlayProps {
    checkpoint: AMLCheckpoint;
    answer: string;
    onAnswerChange: (answer: string) => void;
    onSubmit: () => void;
}

function CheckpointOverlay({ checkpoint, answer, onAnswerChange, onSubmit }: CheckpointOverlayProps) {
    return (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-8">
            <div className="bg-surface-dark border border-white/10 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">quiz</span>
                    </div>
                    <div>
                        <h3 className="text-white font-bold">Checkpoint</h3>
                        <p className="text-white/60 text-sm">Let&apos;s check your understanding</p>
                    </div>
                </div>

                <p className="text-white text-lg mb-6">{checkpoint.prompt}</p>

                {checkpoint.options ? (
                    <div className="space-y-2 mb-6">
                        {checkpoint.options.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => onAnswerChange(opt.text)}
                                className={`w-full text-left p-4 rounded-xl border transition-all ${answer === opt.text
                                        ? 'bg-primary/20 border-primary text-white'
                                        : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                                    }`}
                            >
                                {opt.text}
                            </button>
                        ))}
                    </div>
                ) : (
                    <textarea
                        value={answer}
                        onChange={(e) => onAnswerChange(e.target.value)}
                        placeholder="Type your answer..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/40 resize-none mb-6"
                        rows={3}
                    />
                )}

                <button
                    onClick={onSubmit}
                    disabled={!answer.trim()}
                    className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined">check</span>
                    Submit Answer
                </button>

                {checkpoint.hints && checkpoint.hints.length > 0 && (
                    <p className="text-white/40 text-sm mt-4 text-center">
                        💡 Hint: {checkpoint.hints[0]}
                    </p>
                )}
            </div>
        </div>
    );
}

export default APEXPlayerComponent;
