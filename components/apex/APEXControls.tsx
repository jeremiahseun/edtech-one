'use client';

/**
 * APEX Controls Component
 *
 * Playback control bar for the APEX Player.
 */

import { useAPEXStore, selectProgress, selectFormattedTime } from '@/app/store/useAPEXStore';

interface APEXControlsProps {
    onPlay: () => void;
    onPause: () => void;
    onSeek: (time: number) => void;
    onSkipNext: () => void;
    onAskQuestion: () => void;
}

export function APEXControls({
    onPlay,
    onPause,
    onSeek,
    onSkipNext,
    onAskQuestion,
}: APEXControlsProps) {
    const {
        isPlaying,
        isPaused,
        currentTime,
        duration,
    } = useAPEXStore();

    const progress = useAPEXStore(selectProgress);
    const formattedTime = useAPEXStore(selectFormattedTime);

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = x / rect.width;
        const newTime = percent * duration;
        onSeek(newTime);
    };

    const togglePlayPause = () => {
        if (isPlaying) {
            onPause();
        } else {
            onPlay();
        }
    };

    return (
        <div className="w-full px-6 pb-6">
            <div className="max-w-5xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
                {/* Progress Section */}
                <div className="flex flex-col gap-2 mb-3">
                    {/* Progress Bar */}
                    <div
                        className="group relative h-1.5 w-full bg-slate-700 rounded-full cursor-pointer"
                        onClick={handleProgressClick}
                    >
                        <div
                            className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 size-4 bg-white rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform" />
                        </div>
                    </div>

                    {/* Time Display */}
                    <div className="flex items-center justify-between px-1">
                        <span className="text-xs text-slate-400 font-medium">{formattedTime}</span>
                        <div className="flex gap-4">
                            <span className="text-xs text-slate-400 font-medium">Auto-scroll: On</span>
                            <span className="text-xs text-slate-400 font-medium">Speed: 1.0x</span>
                        </div>
                    </div>
                </div>

                {/* Actions Section */}
                <div className="flex items-center justify-between">
                    {/* Left Controls */}
                    <div className="flex items-center gap-1">
                        {/* Play/Pause */}
                        <button
                            onClick={togglePlayPause}
                            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <span
                                className="material-symbols-outlined"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                                {isPlaying ? 'pause' : 'play_arrow'}
                            </span>
                        </button>

                        {/* Skip Next */}
                        <button
                            onClick={onSkipNext}
                            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <span className="material-symbols-outlined">skip_next</span>
                        </button>

                        <div className="w-[1px] h-6 bg-white/10 mx-2" />

                        {/* Volume */}
                        <button className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
                            <span className="material-symbols-outlined">volume_up</span>
                        </button>

                        {/* Captions */}
                        <button className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
                            <span className="material-symbols-outlined">closed_caption</span>
                        </button>
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="hidden sm:flex items-center bg-white/5 border border-white/10 rounded-lg px-3 py-1">
                            <span className="material-symbols-outlined text-sm text-slate-400 mr-2">search</span>
                            <input
                                className="bg-transparent border-none text-sm focus:ring-0 p-0 text-white placeholder-slate-500 w-32 focus:outline-none"
                                placeholder="Search in lesson..."
                                type="text"
                            />
                        </div>

                        {/* Ask Question Button */}
                        <button
                            onClick={onAskQuestion}
                            className="flex items-center justify-center overflow-hidden rounded-xl h-10 bg-primary hover:bg-primary/90 text-white gap-2 text-sm font-bold px-5 shadow-lg shadow-primary/20 transition-all"
                        >
                            <span
                                className="material-symbols-outlined text-[20px]"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                                auto_awesome
                            </span>
                            <span className="truncate">Ask Question</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default APEXControls;
