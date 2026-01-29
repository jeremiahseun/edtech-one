import Link from 'next/link';

export default function LessonSummary() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen">
      {/* Confetti Simulation Layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
        <div className="absolute w-[10px] h-[10px] opacity-70" style={{ left: '10%', transform: 'rotate(45deg)', background: '#135bec', top: '20%' }}></div>
        <div className="absolute w-[10px] h-[10px] opacity-70" style={{ left: '25%', transform: 'rotate(15deg)', background: '#fbbf24', top: '40%' }}></div>
        <div className="absolute w-[10px] h-[10px] opacity-70" style={{ left: '40%', transform: 'rotate(80deg)', background: '#ec4899', top: '15%' }}></div>
        <div className="absolute w-[10px] h-[10px] opacity-70" style={{ left: '60%', transform: 'rotate(110deg)', background: '#135bec', top: '50%' }}></div>
        <div className="absolute w-[10px] h-[10px] opacity-70" style={{ left: '75%', transform: 'rotate(30deg)', background: '#10b981', top: '30%' }}></div>
        <div className="absolute w-[10px] h-[10px] opacity-70" style={{ left: '90%', transform: 'rotate(200deg)', background: '#fbbf24', top: '45%' }}></div>
      </div>
      <div className="layout-container flex h-full grow flex-col">
        {/* Top Navigation */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-[#282e39] px-10 py-3 bg-background-light dark:bg-background-dark">
          <div className="flex items-center gap-4">
            <div className="size-8 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.1288 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z" fill="currentColor"></path>
                <path clipRule="evenodd" d="M10.4485 13.8519C10.4749 13.9271 10.6203 14.246 11.379 14.7361C12.298 15.3298 13.7492 15.9145 15.6717 16.3735C18.0007 16.9296 20.8712 17.2655 24 17.2655C27.1288 17.2655 29.9993 16.9296 32.3283 16.3735C34.2508 15.9145 35.702 15.3298 36.621 14.7361C37.3796 14.246 37.5251 13.9271 37.5515 13.8519C37.5287 13.7876 37.4333 13.5973 37.0635 13.2931C36.5266 12.8516 35.6288 12.3647 34.343 11.9175C31.79 11.0295 28.1333 10.4437 24 10.4437C19.8667 10.4437 16.2099 11.0295 13.657 11.9175C12.3712 12.3647 11.4734 12.8516 10.9365 13.2931C10.5667 13.5973 10.4713 13.7876 10.4485 13.8519ZM37.5563 18.7877C36.3176 19.3925 34.8502 19.8839 33.2571 20.2642C30.5836 20.9025 27.3973 21.2655 24 21.2655C20.6027 21.2655 17.4164 20.9025 14.7429 20.2642C13.1498 19.8839 11.6824 19.3925 10.4436 18.7877V34.1275C10.4515 34.1545 10.5427 34.4867 11.379 35.027C12.298 35.6207 13.7492 36.2054 15.6717 36.6644C18.0007 37.2205 20.8712 37.5564 24 37.5564C27.1288 37.5564 29.9993 37.2205 32.3283 36.6644C34.2508 36.2054 35.702 35.6207 36.621 35.027C37.4573 34.4867 37.5485 34.1546 37.5563 34.1275V18.7877ZM41.5563 13.8546V34.1455C41.5563 36.1078 40.158 37.5042 38.7915 38.3869C37.3498 39.3182 35.4192 40.0389 33.2571 40.5551C30.5836 41.1934 27.3973 41.5564 24 41.5564C20.6027 41.5564 17.4164 41.1934 14.7429 40.5551C12.5808 40.0389 10.6502 39.3182 9.20848 38.3869C7.84205 37.5042 6.44365 36.1078 6.44365 34.1455L6.44365 13.8546C6.44365 12.2684 7.37223 11.0454 8.39581 10.2036C9.43325 9.3505 10.8137 8.67141 12.343 8.13948C15.4203 7.06909 19.5418 6.44366 24 6.44366C28.4582 6.44366 32.5797 7.06909 35.657 8.13948C37.1863 8.67141 38.5667 9.3505 39.6042 10.2036C40.6278 11.0454 41.5563 12.2684 41.5563 13.8546Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">APEX</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <Link className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="/dashboard">Dashboard</Link>
              <Link className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="/lesson/1">Lessons</Link>
              <Link className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="/quiz/1">Quizzes</Link>
              <Link className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="/courses/manage">Library</Link>
            </div>
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary/20" data-alt="User profile avatar" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCgre4tONusaLUu40yTlipgpTcMohxHS6fEmNGyIFbiiYDdZ0kcbNo0DARDAZZ69A_IW13X9k9btjHOzr5vnLvBE2ZgJ8FUecemruy-tHQy6mxHH_9kFq2LmkAPy68wqJrIsiwgPdvP41BOQA1eHdjHy4nQgEEUhqJXAwkrB-Yss9mjlISMrMdgwpCJbRmsmUKcmVhsz8VHBpJYCNcC2wuqw7cXr0U2wRZ1ZJH5sc_nhRV2G3ym_hQu1iSF_JxlMm6XTIeOs91NVNk")' }}></div>
          </div>
        </header>
        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center py-12 px-4">
          <div className="max-w-[800px] w-full flex flex-col items-center">
            {/* Hero Section */}
            <div className="text-center mb-8 relative">
              <div className="inline-flex items-center justify-center size-20 bg-primary/10 rounded-full mb-6">
                <span className="material-symbols-outlined text-primary text-5xl">auto_awesome</span>
              </div>
              <h1 className="text-slate-900 dark:text-white tracking-tight text-[42px] font-bold leading-tight mb-2">Lesson Complete!</h1>
              <p className="text-slate-500 dark:text-[#9da6b9] text-lg font-normal">Great work, Alex! You&apos;ve mastered &quot;Introduction to Quantum Mechanics&quot;.</p>
            </div>
            {/* Stats Badges */}
            <div className="flex flex-wrap gap-6 w-full mb-10">
              <div className="flex-1 flex flex-col items-center justify-center gap-2 rounded-xl p-8 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 shadow-sm transition-transform hover:scale-[1.02]">
                <span className="material-symbols-outlined text-primary text-3xl mb-1">stars</span>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Total XP Earned</p>
                <p className="text-slate-900 dark:text-white tracking-tight text-4xl font-black">+50 XP</p>
                <p className="text-[#0bda5e] text-sm font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  Daily Goal: 80% Complete
                </p>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center gap-2 rounded-xl p-8 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 shadow-sm transition-transform hover:scale-[1.02]">
                <span className="material-symbols-outlined text-orange-500 text-3xl mb-1">local_fire_department</span>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Current Streak</p>
                <p className="text-slate-900 dark:text-white tracking-tight text-4xl font-black">7 Days</p>
                <p className="text-orange-500 text-sm font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">bolt</span>
                  Streak Extended!
                </p>
              </div>
            </div>
            {/* Content Breakdown */}
            <div className="w-full bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm mb-10">
              <div className="px-8 py-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h2 className="text-slate-900 dark:text-white text-[22px] font-bold tracking-tight">Key Concepts Learned</h2>
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-widest">Mastery Level: High</span>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex gap-4 items-start p-4 rounded-lg bg-background-light dark:bg-background-dark/50 border border-transparent hover:border-primary/20 transition-all">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">Wave-Particle Duality</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Understanding how light and matter exhibit both wave and particle properties.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start p-4 rounded-lg bg-background-light dark:bg-background-dark/50 border border-transparent hover:border-primary/20 transition-all">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">Schrödinger Equation</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Fundamental laws governing the behavior of quantum systems over time.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start p-4 rounded-lg bg-background-light dark:bg-background-dark/50 border border-transparent hover:border-primary/20 transition-all">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">Heisenberg Principle</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">The inherent limit to the precision of measuring physical properties.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start p-4 rounded-lg bg-background-light dark:bg-background-dark/50 border border-transparent hover:border-primary/20 transition-all">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">Quantum Superposition</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">How systems can exist in multiple states simultaneously until measured.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-4">
              <Link href="/quiz/1" className="flex-1 max-w-[300px] h-14 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 group">
                Start Quiz
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
              <Link href="/dashboard" className="flex-1 max-w-[300px] h-14 rounded-xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-lg flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                <span className="material-symbols-outlined">dashboard</span>
                Back to Dashboard
              </Link>
            </div>
            {/* Footer Stats */}
            <div className="mt-12 flex gap-8 text-slate-500 dark:text-slate-400 text-sm font-medium">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">schedule</span>
                Time spent: 18m 42s
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">verified</span>
                Accuracy: 94%
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
