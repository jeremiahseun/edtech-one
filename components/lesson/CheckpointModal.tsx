'use client';

import { useState } from 'react';

export interface CheckpointData {
    prompt: string;
    options: string[];
    correctAnswer: string;
}

interface CheckpointModalProps {
    checkpoint: CheckpointData;
    onAnswer: (selectedOption: string, isCorrect: boolean) => void;
    onClose: () => void;
}

export function CheckpointModal({ checkpoint, onAnswer, onClose }: CheckpointModalProps) {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleSubmit = () => {
        if (!selectedOption) return;

        const correct = selectedOption === checkpoint.correctAnswer;
        setIsCorrect(correct);
        setIsSubmitted(true);

        // Delay to show feedback, then call onAnswer
        setTimeout(() => {
            onAnswer(selectedOption, correct);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-surface-dark border border-white/10 rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="size-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">quiz</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">Knowledge Check</h3>
                        <p className="text-sm text-slate-400">Test your understanding</p>
                    </div>
                </div>

                {/* Question */}
                <div className="mb-6">
                    <p className="text-white text-lg leading-relaxed">{checkpoint.prompt}</p>
                </div>

                {/* Options */}
                <div className="space-y-3 mb-6">
                    {checkpoint.options.map((option, index) => {
                        const isSelected = selectedOption === option;
                        const showCorrect = isSubmitted && option === checkpoint.correctAnswer;
                        const showIncorrect = isSubmitted && isSelected && !isCorrect;

                        return (
                            <button
                                key={index}
                                onClick={() => !isSubmitted && setSelectedOption(option)}
                                disabled={isSubmitted}
                                className={`w-full p-4 rounded-xl border text-left transition-all duration-200 ${showCorrect
                                        ? 'bg-green-500/20 border-green-500 text-green-400'
                                        : showIncorrect
                                            ? 'bg-red-500/20 border-red-500 text-red-400'
                                            : isSelected
                                                ? 'bg-primary/20 border-primary text-white'
                                                : 'bg-slate-800/50 border-white/10 text-slate-300 hover:bg-slate-700/50 hover:border-white/20'
                                    } ${isSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`size-6 rounded-full border-2 flex items-center justify-center ${showCorrect
                                            ? 'border-green-500 bg-green-500'
                                            : showIncorrect
                                                ? 'border-red-500 bg-red-500'
                                                : isSelected
                                                    ? 'border-primary bg-primary'
                                                    : 'border-slate-500'
                                        }`}>
                                        {showCorrect && (
                                            <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                                        )}
                                        {showIncorrect && (
                                            <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>close</span>
                                        )}
                                        {isSelected && !isSubmitted && (
                                            <div className="size-2 bg-white rounded-full" />
                                        )}
                                    </div>
                                    <span className="font-medium">{option}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Submit Button or Feedback */}
                {!isSubmitted ? (
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedOption}
                        className="w-full py-3 px-6 bg-primary hover:bg-primary/90 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold rounded-xl transition-colors disabled:cursor-not-allowed"
                    >
                        Submit Answer
                    </button>
                ) : (
                    <div className={`w-full py-4 px-6 rounded-xl flex items-center justify-center gap-3 ${isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {isCorrect ? 'celebration' : 'lightbulb'}
                        </span>
                        <span className="font-semibold">
                            {isCorrect ? 'Excellent! +10 XP' : 'Not quite right. Keep learning!'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
