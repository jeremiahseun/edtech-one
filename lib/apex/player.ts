/**
 * APEX Player Controller
 *
 * Manages sequence queue, playback state, and coordinates between
 * the renderer, Convex backend, and React UI.
 */

import type { AMLSequence, AMLCheckpoint } from '../aml/types';
import { APEXRenderer, RendererConfig } from './renderer';

// ============================================================================
// Types
// ============================================================================

export interface PlayerConfig {
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    onStateChange?: (state: PlayerState) => void;
    onCheckpoint?: (checkpoint: AMLCheckpoint, onAnswer: (answer: string) => void) => void;
    onSequenceComplete?: (sequenceId: string) => void;
    onXPEarned?: (amount: number, reason: string) => void;
    onError?: (error: Error) => void;
}

export interface PlayerState {
    isPlaying: boolean;
    isPaused: boolean;
    currentTime: number;
    duration: number;
    currentSequenceIndex: number;
    totalSequences: number;
    currentSequenceId: string | null;
    queueLength: number;
    isSpeaking: boolean;
    checkpointActive: boolean;
}

export type PlayerEventType =
    | 'play'
    | 'pause'
    | 'stop'
    | 'seek'
    | 'sequenceStart'
    | 'sequenceEnd'
    | 'checkpointStart'
    | 'checkpointEnd'
    | 'queueUpdate';

export interface PlayerEvent {
    type: PlayerEventType;
    data?: any;
}

// ============================================================================
// APEX Player Class
// ============================================================================

export class APEXPlayer {
    private renderer: APEXRenderer | null = null;
    private config: PlayerConfig;
    private state: PlayerState;
    private sequences: AMLSequence[] = [];
    private sequenceQueue: AMLSequence[] = [];
    private currentSequenceIndex: number = 0;
    private eventListeners: Map<PlayerEventType, Array<(event: PlayerEvent) => void>> = new Map();
    private pendingCheckpointResolver: ((answer: string) => void) | null = null;

    constructor(config: PlayerConfig) {
        this.config = config;
        this.state = {
            isPlaying: false,
            isPaused: false,
            currentTime: 0,
            duration: 0,
            currentSequenceIndex: 0,
            totalSequences: 0,
            currentSequenceId: null,
            queueLength: 0,
            isSpeaking: false,
            checkpointActive: false,
        };
    }

    // --------------------------------------------------------------------------
    // Initialization
    // --------------------------------------------------------------------------

    initialize(): void {
        if (this.renderer) return;

        const rendererConfig: RendererConfig = {
            canvas: this.config.canvas,
            width: this.config.width,
            height: this.config.height,
            onCheckpoint: this.handleCheckpoint.bind(this),
            onSequenceComplete: this.handleSequenceComplete.bind(this),
            onTimeUpdate: this.handleTimeUpdate.bind(this),
            onSpeechStart: this.handleSpeechStart.bind(this),
            onSpeechEnd: this.handleSpeechEnd.bind(this),
        };

        this.renderer = new APEXRenderer(rendererConfig);
    }

    // --------------------------------------------------------------------------
    // Queue Management
    // --------------------------------------------------------------------------

    loadSequences(sequences: AMLSequence[]): void {
        this.sequences = sequences;
        this.sequenceQueue = [...sequences];
        this.currentSequenceIndex = 0;

        this.updateState({
            totalSequences: sequences.length,
            queueLength: sequences.length,
        });

        this.emit('queueUpdate', { sequences });
    }

    /**
     * Insert a sequence at the front of the queue (for adaptive interrupts)
     */
    insertSequence(sequence: AMLSequence): void {
        this.sequenceQueue.unshift(sequence);
        this.updateState({ queueLength: this.sequenceQueue.length });
        this.emit('queueUpdate', { inserted: sequence });
    }

    /**
     * Add a sequence to the end of the queue
     */
    enqueueSequence(sequence: AMLSequence): void {
        this.sequenceQueue.push(sequence);
        this.updateState({ queueLength: this.sequenceQueue.length });
        this.emit('queueUpdate', { enqueued: sequence });
    }

    // --------------------------------------------------------------------------
    // Playback Control
    // --------------------------------------------------------------------------

    async play(): Promise<void> {
        if (!this.renderer) {
            this.initialize();
        }

        if (this.state.isPaused) {
            this.resume();
            return;
        }

        if (this.sequenceQueue.length === 0) {
            console.warn('No sequences to play');
            return;
        }

        this.updateState({ isPlaying: true, isPaused: false });
        this.emit('play', {});

        await this.playNextSequence();
    }

    private async playNextSequence(): Promise<void> {
        if (this.sequenceQueue.length === 0) {
            this.updateState({ isPlaying: false });
            return;
        }

        const sequence = this.sequenceQueue.shift()!;
        this.currentSequenceIndex = this.sequences.findIndex(s => s.id === sequence.id);

        this.updateState({
            currentSequenceId: sequence.id,
            currentSequenceIndex: this.currentSequenceIndex >= 0 ? this.currentSequenceIndex : 0,
            queueLength: this.sequenceQueue.length,
        });

        this.emit('sequenceStart', { sequence });

        try {
            await this.renderer!.playSequence(sequence);
        } catch (error) {
            this.config.onError?.(error as Error);
        }
    }

    pause(): void {
        if (!this.renderer || !this.state.isPlaying) return;

        this.renderer.pause();
        this.updateState({ isPaused: true, isPlaying: false });
        this.emit('pause', {});
    }

    resume(): void {
        if (!this.renderer || !this.state.isPaused) return;

        this.renderer.resume();
        this.updateState({ isPaused: false, isPlaying: true });
        this.emit('play', {});
    }

    stop(): void {
        if (!this.renderer) return;

        this.renderer.stop();
        this.updateState({
            isPlaying: false,
            isPaused: false,
            currentTime: 0,
        });
        this.emit('stop', {});
    }

    seek(time: number): void {
        if (!this.renderer) return;

        this.renderer.seek(time);
        this.updateState({ currentTime: time });
        this.emit('seek', { time });
    }

    skipToNext(): void {
        if (!this.renderer) return;

        this.renderer.stop();
        this.playNextSequence();
    }

    skipToPrevious(): void {
        if (this.currentSequenceIndex <= 0 || this.sequences.length === 0) return;

        const prevSequence = this.sequences[this.currentSequenceIndex - 1];
        if (prevSequence) {
            this.sequenceQueue.unshift(this.sequences[this.currentSequenceIndex]);
            this.sequenceQueue.unshift(prevSequence);
            this.renderer?.stop();
            this.playNextSequence();
        }
    }

    // --------------------------------------------------------------------------
    // Event Handlers
    // --------------------------------------------------------------------------

    private handleCheckpoint(checkpoint: AMLCheckpoint): void {
        this.updateState({ checkpointActive: true });
        this.emit('checkpointStart', { checkpoint });

        // Create answer handler
        const onAnswer = async (answer: string) => {
            this.updateState({ checkpointActive: false });

            // Award XP if correct (local validation)
            if (checkpoint.correctAnswer) {
                const isCorrect = this.validateAnswer(answer, checkpoint.correctAnswer);
                if (isCorrect && checkpoint.xpReward) {
                    this.config.onXPEarned?.(checkpoint.xpReward, 'Checkpoint correct');
                }
            }

            this.emit('checkpointEnd', { checkpoint, answer });

            // Resume playback
            this.renderer?.resume();

            // Continue to next sequence if this one is done
            if (this.sequenceQueue.length > 0) {
                await this.playNextSequence();
            }
        };

        this.config.onCheckpoint?.(checkpoint, onAnswer);
    }

    private handleSequenceComplete(): void {
        const sequenceId = this.state.currentSequenceId;

        this.emit('sequenceEnd', { sequenceId });
        this.config.onSequenceComplete?.(sequenceId || '');

        // Award XP for completing sequence
        this.config.onXPEarned?.(10, 'Sequence completed');

        // Play next sequence
        if (this.sequenceQueue.length > 0 && this.state.isPlaying) {
            this.playNextSequence();
        } else {
            this.updateState({ isPlaying: false });
        }
    }

    private handleTimeUpdate(currentTime: number, duration: number): void {
        this.updateState({ currentTime, duration });
    }

    private handleSpeechStart(text: string): void {
        this.updateState({ isSpeaking: true });
    }

    private handleSpeechEnd(): void {
        this.updateState({ isSpeaking: false });
    }

    // --------------------------------------------------------------------------
    // Validation
    // --------------------------------------------------------------------------

    private validateAnswer(userAnswer: string, correctAnswer: string | string[]): boolean {
        const normalized = userAnswer.toLowerCase().trim();

        if (Array.isArray(correctAnswer)) {
            return correctAnswer.some(ans => ans.toLowerCase().trim() === normalized);
        }

        return correctAnswer.toLowerCase().trim() === normalized;
    }

    // --------------------------------------------------------------------------
    // State Management
    // --------------------------------------------------------------------------

    private updateState(partial: Partial<PlayerState>): void {
        this.state = { ...this.state, ...partial };
        this.config.onStateChange?.(this.state);
    }

    getState(): PlayerState {
        return { ...this.state };
    }

    getCurrentSequence(): AMLSequence | null {
        if (this.currentSequenceIndex < 0 || this.currentSequenceIndex >= this.sequences.length) {
            return null;
        }
        return this.sequences[this.currentSequenceIndex];
    }

    // --------------------------------------------------------------------------
    // Event Emitter
    // --------------------------------------------------------------------------

    on(event: PlayerEventType, callback: (event: PlayerEvent) => void): void {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event)!.push(callback);
    }

    off(event: PlayerEventType, callback: (event: PlayerEvent) => void): void {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            const index = listeners.indexOf(callback);
            if (index >= 0) {
                listeners.splice(index, 1);
            }
        }
    }

    private emit(type: PlayerEventType, data: any): void {
        const event: PlayerEvent = { type, data };
        const listeners = this.eventListeners.get(type);
        if (listeners) {
            listeners.forEach(callback => callback(event));
        }
    }

    // --------------------------------------------------------------------------
    // Session State (for persistence)
    // --------------------------------------------------------------------------

    getSessionState(): {
        currentSequenceId: string | null;
        currentTimestamp: number;
        queuedSequenceIds: string[];
    } {
        return {
            currentSequenceId: this.state.currentSequenceId,
            currentTimestamp: this.state.currentTime,
            queuedSequenceIds: this.sequenceQueue.map(s => s.id),
        };
    }

    restoreFromSession(
        sequences: AMLSequence[],
        currentSequenceId: string,
        currentTimestamp: number
    ): void {
        this.loadSequences(sequences);

        // Find and seek to the saved position
        const sequenceIndex = sequences.findIndex(s => s.id === currentSequenceId);
        if (sequenceIndex >= 0) {
            // Remove already-played sequences from queue
            this.sequenceQueue = sequences.slice(sequenceIndex);
            this.currentSequenceIndex = sequenceIndex;

            // Start at the saved position
            this.play().then(() => {
                this.seek(currentTimestamp);
            });
        }
    }

    // --------------------------------------------------------------------------
    // Cleanup
    // --------------------------------------------------------------------------

    destroy(): void {
        this.stop();
        this.renderer?.destroy();
        this.renderer = null;
        this.eventListeners.clear();
    }
}

// ============================================================================
// Factory Function
// ============================================================================

export function createAPEXPlayer(config: PlayerConfig): APEXPlayer {
    const player = new APEXPlayer(config);
    return player;
}
