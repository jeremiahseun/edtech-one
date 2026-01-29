import Link from 'next/link';

export default function QuizPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-slate-900 dark:text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark sticky top-0 z-10">
        <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <span className="material-symbols-outlined">close</span>
            </Link>
            <h1 className="font-bold text-lg hidden sm:block">Unit 4: Neural Networks Quiz</h1>
        </div>
        <div className="flex-1 max-w-md mx-4">
            <div className="flex justify-between text-xs font-medium mb-1 text-slate-500">
                <span>Question 3/10</span>
                <span>30%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[30%] rounded-full"></div>
            </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500 rounded-lg font-bold text-sm">
            <span className="material-symbols-outlined text-lg">timer</span>
            <span>14:59</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full">
        <div className="w-full space-y-8">
            <div className="space-y-4">
                <span className="text-primary font-bold uppercase tracking-widest text-xs bg-primary/10 px-3 py-1 rounded-full">Multiple Choice</span>
                <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                    Which activation function is commonly used in the hidden layers of a deep neural network to mitigate the vanishing gradient problem?
                </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {/* Option 1 */}
                <div className="p-6 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1c1f27] hover:border-primary/50 cursor-pointer transition-all group">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-lg group-hover:text-primary">A. Sigmoid</span>
                        <div className="size-6 rounded-full border-2 border-slate-300 dark:border-slate-600 group-hover:border-primary"></div>
                    </div>
                </div>
                 {/* Option 2 (Selected) */}
                 <div className="p-6 rounded-xl border-2 border-primary bg-primary/5 dark:bg-primary/10 cursor-pointer transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-lg text-primary">B. ReLU (Rectified Linear Unit)</span>
                        <div className="size-6 rounded-full border-2 border-primary bg-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-sm">check</span>
                        </div>
                    </div>
                </div>
                 {/* Option 3 */}
                 <div className="p-6 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1c1f27] hover:border-primary/50 cursor-pointer transition-all group">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-lg group-hover:text-primary">C. Tanh</span>
                        <div className="size-6 rounded-full border-2 border-slate-300 dark:border-slate-600 group-hover:border-primary"></div>
                    </div>
                </div>
                 {/* Option 4 */}
                 <div className="p-6 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1c1f27] hover:border-primary/50 cursor-pointer transition-all group">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-lg group-hover:text-primary">D. Softmax</span>
                        <div className="size-6 rounded-full border-2 border-slate-300 dark:border-slate-600 group-hover:border-primary"></div>
                    </div>
                </div>
            </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-background-dark">
        <div className="max-w-4xl mx-auto w-full flex justify-between items-center">
            <button className="px-6 py-3 font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors">
                Skip Question
            </button>
            <Link href="/lesson/1/summary" className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
                Submit Answer
                <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
        </div>
      </footer>
    </div>
  )
}
