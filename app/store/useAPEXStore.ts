/**
 * APEX Player Zustand Store
 *
 * Manages global player state for React components.
 */

import { create } from 'zustand';
import type { AMLSequence, AMLCheckpoint } from '@/lib/aml/types';
import type { PlayerState } from '@/lib/apex/player';

// ============================================================================
// Types
// ============================================================================

interface APEXStoreState {
    // Player state
    isPlaying: boolean;
    isPaused: boolean;
    currentTime: number;
    duration: number;
    currentSequenceIndex: number;
    totalSequences: number;
    currentSequenceId: string | null;
    isSpeaking: boolean;

    // UI state
    activeTab: 'chat' | 'notes' | 'transcript';
    checkpointActive: boolean;
    activeCheckpoint: AMLCheckpoint | null;
    checkpointAnswer: string;
    isAskingQuestion: boolean;
    userQuestion: string;

    // Session
    sessionId: string | null;
    courseId: string | null;
    moduleId: string | null;

    // Gamification
    xpEarned: number;
    showXPToast: boolean;
    xpToastReason: string;

    // Transcript
    transcript: Array<{ text: string; timestamp: number }>;

    // Notes
    notes: string;
}

interface APEXStoreActions {
    // Player controls
    setPlayerState: (state: Partial<PlayerState>) => void;
    play: () => void;
    pause: () => void;
    seek: (time: number) => void;

    // UI
    setActiveTab: (tab: 'chat' | 'notes' | 'transcript') => void;

    // Checkpoint
    showCheckpoint: (checkpoint: AMLCheckpoint) => void;
    submitCheckpointAnswer: () => void;
    setCheckpointAnswer: (answer: string) => void;
    hideCheckpoint: () => void;

    // Question
    startAskingQuestion: () => void;
    cancelQuestion: () => void;
    setUserQuestion: (question: string) => void;
    submitQuestion: () => Promise<void>;

    // Session
    setSession: (sessionId: string, courseId: string, moduleId: string) => void;
    clearSession: () => void;

    // XP
    showXPEarned: (amount: number, reason: string) => void;
    hideXPToast: () => void;

    // Transcript
    addToTranscript: (text: string) => void;

    // Notes
    setNotes: (notes: string) => void;

    // Reset
    reset: () => void;
}

// ============================================================================
// Initial State
// ============================================================================

const initialState: APEXStoreState = {
    isPlaying: false,
    isPaused: false,
    currentTime: 0,
    duration: 0,
    currentSequenceIndex: 0,
    totalSequences: 0,
    currentSequenceId: null,
    isSpeaking: false,

    activeTab: 'chat',
    checkpointActive: false,
    activeCheckpoint: null,
    checkpointAnswer: '',
    isAskingQuestion: false,
    userQuestion: '',

    sessionId: null,
    courseId: null,
    moduleId: null,

    xpEarned: 0,
    showXPToast: false,
    xpToastReason: '',

    transcript: [],
    notes: '',
};

// ============================================================================
// Store
// ============================================================================

export const useAPEXStore = create<APEXStoreState & APEXStoreActions>((set, get) => ({
    ...initialState,

    // Player controls
    setPlayerState: (state) => set((prev) => ({
        isPlaying: state.isPlaying ?? prev.isPlaying,
        isPaused: state.isPaused ?? prev.isPaused,
        currentTime: state.currentTime ?? prev.currentTime,
        duration: state.duration ?? prev.duration,
        currentSequenceIndex: state.currentSequenceIndex ?? prev.currentSequenceIndex,
        totalSequences: state.totalSequences ?? prev.totalSequences,
        currentSequenceId: state.currentSequenceId ?? prev.currentSequenceId,
        isSpeaking: state.isSpeaking ?? prev.isSpeaking,
    })),

    play: () => set({ isPlaying: true, isPaused: false }),
    pause: () => set({ isPlaying: false, isPaused: true }),
    seek: (time) => set({ currentTime: time }),

    // UI
    setActiveTab: (tab) => set({ activeTab: tab }),

    // Checkpoint
    showCheckpoint: (checkpoint) => set({
        checkpointActive: true,
        activeCheckpoint: checkpoint,
        checkpointAnswer: '',
    }),

    submitCheckpointAnswer: () => {
        const { activeCheckpoint, checkpointAnswer } = get();
        // The actual submission is handled by the player component
        // This just closes the UI
        set({ checkpointActive: false, activeCheckpoint: null, checkpointAnswer: '' });
    },

    setCheckpointAnswer: (answer) => set({ checkpointAnswer: answer }),

    hideCheckpoint: () => set({
        checkpointActive: false,
        activeCheckpoint: null,
        checkpointAnswer: '',
    }),

    // Question
    startAskingQuestion: () => set({ isAskingQuestion: true }),
    cancelQuestion: () => set({ isAskingQuestion: false, userQuestion: '' }),
    setUserQuestion: (question) => set({ userQuestion: question }),

    submitQuestion: async () => {
        const { userQuestion } = get();
        if (!userQuestion.trim()) return;

        // The actual submission is handled by the player component
        // This just adds to transcript
        set((prev) => ({
            transcript: [...prev.transcript, { text: userQuestion, timestamp: Date.now() }],
            isAskingQuestion: false,
            userQuestion: '',
        }));
    },

    // Session
    setSession: (sessionId, courseId, moduleId) => set({ sessionId, courseId, moduleId }),
    clearSession: () => set({ sessionId: null, courseId: null, moduleId: null }),

    // XP
    showXPEarned: (amount, reason) => set((prev) => ({
        xpEarned: prev.xpEarned + amount,
        showXPToast: true,
        xpToastReason: reason,
    })),

    hideXPToast: () => set({ showXPToast: false }),

    // Transcript
    addToTranscript: (text) => set((prev) => ({
        transcript: [...prev.transcript, { text, timestamp: Date.now() }],
    })),

    // Notes
    setNotes: (notes) => set({ notes }),

    // Reset
    reset: () => set(initialState),
}));

// ============================================================================
// Selectors
// ============================================================================

export const selectProgress = (state: APEXStoreState) =>
    state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

export const selectFormattedTime = (state: APEXStoreState) => {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return `${formatTime(state.currentTime)} / ${formatTime(state.duration)}`;
};
