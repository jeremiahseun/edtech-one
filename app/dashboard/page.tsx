import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-solid border-slate-200 dark:border-[#282e39] bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 md:px-10 py-3">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-primary dark:text-white">
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-xl">database</span>
              </div>
              <h2 className="text-xl font-bold leading-tight tracking-tight">APEX</h2>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link className="text-slate-600 dark:text-white text-sm font-medium hover:text-primary transition-colors" href="/dashboard">Home</Link>
              <Link className="text-slate-600 dark:text-[#9da6b9] text-sm font-medium hover:text-primary transition-colors" href="/courses/manage">Library</Link>
              <Link className="text-slate-600 dark:text-[#9da6b9] text-sm font-medium hover:text-primary transition-colors" href="/lesson/1">AI Tutor</Link>
              <Link className="text-slate-600 dark:text-[#9da6b9] text-sm font-medium hover:text-primary transition-colors" href="/settings">Settings</Link>
            </nav>
          </div>
          <div className="flex flex-1 justify-end items-center gap-4">
            <label className="hidden lg:flex flex-col min-w-40 h-10 max-w-64">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-slate-100 dark:bg-[#282e39]">
                <div className="text-slate-400 dark:text-[#9da6b9] flex items-center justify-center pl-4">
                  <span className="material-symbols-outlined text-lg">search</span>
                </div>
                <input className="form-input w-full border-none bg-transparent focus:ring-0 text-sm placeholder:text-slate-400 dark:placeholder:text-[#9da6b9]" placeholder="Search courses..." defaultValue="" />
              </div>
            </label>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500 rounded-lg font-bold text-sm">
              <span className="material-symbols-outlined text-lg fill-1" style={{fontVariationSettings: "'FILL' 1"}}>flare</span>
              <span>7</span>
            </div>
            <div className="bg-slate-200 dark:bg-slate-700 aspect-square bg-cover rounded-full size-10 border-2 border-primary" data-alt="User profile avatar" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC461Zt8-1X4KV6i2_e6W5q1zLUuZFmxYQ7BCMGf6KOTV1jR2THnCMAjCVp_gWmkcZBzlH6dCIocXtdX8UL48fUB_3MvM45K5cCMcwpZZrE8rFbTKKLzbtMpVTDIDmLirNG_13dKbqyN2K-e_cs5cs-yjTK1PRrY5kzxRtES9coCi_C0AWw5Zne2_8lbF9qlQldQzYWOeq3HH8jJKJdjrVBFUU5tPHnJAVgFk5BUKLZrPTLCkktZ8hJKKyLUo_3_IfK7ZSxpEAUns4")' }}></div>
          </div>
        </div>
      </header>
      <main className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Main Dashboard */}
          <div className="flex-1 flex flex-col gap-8">
            {/* Gamification: XP Progress Bar */}
            <div className="bg-white dark:bg-[#1c1f27] rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex flex-col gap-3">
                <div className="flex gap-6 justify-between items-end">
                  <div>
                    <h3 className="text-slate-500 dark:text-[#9da6b9] text-xs font-bold uppercase tracking-wider">Current Rank</h3>
                    <p className="text-slate-900 dark:text-white text-lg font-bold leading-normal">Level 3 Scholar</p>
                  </div>
                  <p className="text-slate-600 dark:text-white text-sm font-medium leading-normal">1,250 <span className="text-slate-400 dark:text-[#9da6b9]">/ 2,000 XP</span></p>
                </div>
                <div className="rounded-full bg-slate-100 dark:bg-[#3b4354] h-2.5 w-full overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: '62.5%' }}></div>
                </div>
                <p className="text-slate-400 dark:text-[#9da6b9] text-xs font-normal">750 XP remaining to unlock Level 4 Master</p>
              </div>
            </div>
            {/* Featured Section: Continue Studying */}
            <section>
              <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight mb-4">Continue Studying</h2>
              <div className="group relative overflow-hidden rounded-xl bg-white dark:bg-[#1c1f27] border border-slate-100 dark:border-slate-800 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-2/5 h-48 md:h-auto bg-center bg-no-repeat bg-cover" data-alt="Abstract mathematical patterns representing linear algebra" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCY7ZKV8DDV4puXct6APMEaUO8Vcbu1EURsBgtlVzmLoBPxLReArm0xxhN3oXvVzHX0hUYUnGXPrVCHlWjbwwUG_B_beV5Ay05Boo_uzcb-Mi_6eKMyoiyKZecz_qFBPB5PGFrf9MDe_L1U2enDx1W41MgiNUcxpSLjL0Zb0qNDosv_cvk-IFiLH3mzxgr8e2mUUPWvV1l3s9DfcjGILPAgk2Qi3tXQCcINsLjCvXsmg4B5TnjzpyYQAzp57_6pBfYyoOG5cSAJh10")' }}>
                    <div className="w-full h-full bg-primary/10 backdrop-brightness-75 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-white text-5xl">play_circle</span>
                    </div>
                  </div>
                  <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">Mathematics</span>
                      <span className="text-slate-400 dark:text-slate-500 material-symbols-outlined">auto_awesome</span>
                    </div>
                    <h3 className="text-slate-900 dark:text-white text-2xl font-bold mb-2">Linear Algebra</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="text-primary font-bold text-lg">65%</div>
                        <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full">
                          <div className="h-full bg-primary rounded-full" style={{ width: '65%' }}></div>
                        </div>
                      </div>
                      <p className="text-slate-500 dark:text-[#9da6b9] text-sm">Next Lesson: <span className="text-slate-700 dark:text-white font-medium">Eigenvalues &amp; Eigenvectors</span></p>
                      <Link href="/lesson/linear-algebra" className="w-full md:w-auto px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold text-sm transition-all transform active:scale-95 flex items-center justify-center gap-2">
                        Resume Lesson
                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* Course Grid: My Courses */}
            <section>
              <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight">My Courses</h2>
                <Link className="text-primary text-sm font-semibold hover:underline" href="/courses/manage">View All</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Course 1 */}
                <Link href="/courses/manage" className="bg-white dark:bg-[#1c1f27] border border-slate-100 dark:border-slate-800 rounded-xl p-4 hover:border-primary/50 transition-colors cursor-pointer group">
                  <div className="relative w-full aspect-video rounded-lg mb-4 overflow-hidden" data-alt="Psychology book and brain illustration" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC75M5rnOwkAuL3IauNUyOzXtIHKFZzzYuID5oQBRa0sUDV2BZNeKJCWaKX2LHjJYMDUfnlQTyiF-ITW1vV4vi9dyDmIzY7FRppfKW1xMjSft5yDHzdEU6HymqGyp7V5f0Z7GC5gPztBwZJl3u65GyDAZtpfTfwhwAkToCw6HeJetLGohZEYSHRjCu7cCKMaaDHwNbZQ_p5t9vt5leRFHL6DeC33i3IMRZ4x5LOOUCkCNaL1u481RsRKHw1TsHZsIbHs82HCMC92sw")' }}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                    <div className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-[#1c1f27]/90 rounded-full flex">
                      <svg className="w-8 h-8" viewBox="0 0 36 36">
                        <path className="stroke-slate-200 dark:stroke-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3"></path>
                        <path className="stroke-primary progress-ring__circle" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeDasharray="20, 100" strokeLinecap="round" strokeWidth="3"></path>
                      </svg>
                    </div>
                  </div>
                  <h4 className="text-slate-900 dark:text-white font-bold text-base mb-1">Intro to Psychology</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-[#9da6b9] text-xs">20% Complete</span>
                    <span className="text-slate-400 dark:text-[#9da6b9] text-[10px]">2h ago</span>
                  </div>
                </Link>
                {/* Course 2 */}
                <div className="bg-white dark:bg-[#1c1f27] border border-slate-100 dark:border-slate-800 rounded-xl p-4 hover:border-primary/50 transition-colors cursor-pointer group">
                  <div className="relative w-full aspect-video rounded-lg mb-4 overflow-hidden" data-alt="Organic chemistry molecular structure" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAMFzfj3YRsCnhJzVR70ftsrohI4EnhwfJStrKnbnPsB_DjOzJHGFtew8VgXg5LHCVhaTSS8VzENo2FEdzuhCZaDQBma3YDkBa5Co4p9B3WtdTjGxvEjYbzNpkVbB0ewMcfPPfE98ZWbHfH_5PTZaZwH0hkKxjDyF3Q-hcJQZ3UqfxWS5nBHSsh_Rq_Cfsf5WKFhXkyA2rztb3gDPo2lM-UbU9HFQudgY_oswbiG_Pr7lbb9BFSR_v6OMrFOPokESb4uKgg6fE7qRc")' }}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                    <div className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-[#1c1f27]/90 rounded-full flex">
                      <svg className="w-8 h-8" viewBox="0 0 36 36">
                        <path className="stroke-slate-200 dark:stroke-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3"></path>
                        <path className="stroke-primary progress-ring__circle" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeDasharray="85, 100" strokeLinecap="round" strokeWidth="3"></path>
                      </svg>
                    </div>
                  </div>
                  <h4 className="text-slate-900 dark:text-white font-bold text-base mb-1">Organic Chemistry</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-[#9da6b9] text-xs">85% Complete</span>
                    <span className="text-slate-400 dark:text-[#9da6b9] text-[10px]">1d ago</span>
                  </div>
                </div>
                {/* Course 3 */}
                <div className="bg-white dark:bg-[#1c1f27] border border-slate-100 dark:border-slate-800 rounded-xl p-4 hover:border-primary/50 transition-colors cursor-pointer group">
                  <div className="relative w-full aspect-video rounded-lg mb-4 overflow-hidden" data-alt="Stock market chart representing macroeconomics" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAH80MYZTaZyHeCEd_ux9dwDL0ffuZ5H4L0zpOY5obNNjy1S9GWCA0f9V6plwDscS5Ig2a8YvYtnFu-v8tHt6pbl34GSo7N9KNM_-aV8_Ie2EqpfwP8jgbQ8Mzx9aPvYuPZck608gPbHndSPb5nVpAQnBn8MPCLQq8DLlhnQhFCpXzUpJw0kubJLlE8HwpVaBY-P0uirPh-wPyODkHsv5ZG72RKRFjLcDPVy1ODiEseWdq_GZRpmvqhbc9M9H5zlhiwOygOfLUwO8I")' }}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                    <div className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-[#1c1f27]/90 rounded-full flex">
                      <svg className="w-8 h-8" viewBox="0 0 36 36">
                        <path className="stroke-slate-200 dark:stroke-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3"></path>
                        <path className="stroke-primary progress-ring__circle" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeDasharray="40, 100" strokeLinecap="round" strokeWidth="3"></path>
                      </svg>
                    </div>
                  </div>
                  <h4 className="text-slate-900 dark:text-white font-bold text-base mb-1">Macroeconomics</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-[#9da6b9] text-xs">40% Complete</span>
                    <span className="text-slate-400 dark:text-[#9da6b9] text-[10px]">3h ago</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
          {/* Right Column: Sidebar Widgets */}
          <aside className="w-full lg:w-[320px] flex flex-col gap-6">
            {/* Daily Goals Widget */}
            <div className="bg-white dark:bg-[#1c1f27] rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-slate-900 dark:text-white font-bold text-lg">Daily Goals</h3>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-[#9da6b9] px-2 py-1 rounded">2/3 Done</span>
              </div>
              <div className="space-y-4">
                <label className="flex items-center gap-3 group cursor-pointer">
                  <div className="relative flex items-center justify-center">
                    <input defaultChecked className="peer appearance-none size-5 rounded border-2 border-slate-300 dark:border-slate-600 checked:bg-primary checked:border-primary transition-all cursor-pointer" type="checkbox" />
                    <span className="material-symbols-outlined absolute text-white text-sm opacity-0 peer-checked:opacity-100 pointer-events-none">check</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors line-through decoration-slate-400 dark:decoration-slate-500 opacity-60">Complete 1 Quiz</span>
                    <span className="text-[10px] text-slate-400 dark:text-[#9da6b9]">+150 XP</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 group cursor-pointer">
                  <div className="relative flex items-center justify-center">
                    <input defaultChecked className="peer appearance-none size-5 rounded border-2 border-slate-300 dark:border-slate-600 checked:bg-primary checked:border-primary transition-all cursor-pointer" type="checkbox" />
                    <span className="material-symbols-outlined absolute text-white text-sm opacity-0 peer-checked:opacity-100 pointer-events-none">check</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors line-through decoration-slate-400 dark:decoration-slate-500 opacity-60">Review 5 Flashcards</span>
                    <span className="text-[10px] text-slate-400 dark:text-[#9da6b9]">+50 XP</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 group cursor-pointer">
                  <div className="relative flex items-center justify-center">
                    <input className="peer appearance-none size-5 rounded border-2 border-slate-300 dark:border-slate-600 checked:bg-primary checked:border-primary transition-all cursor-pointer" type="checkbox" />
                    <span className="material-symbols-outlined absolute text-white text-sm opacity-0 peer-checked:opacity-100 pointer-events-none">check</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors">Generate Summary</span>
                    <span className="text-[10px] text-primary font-bold">BONUS: 2x XP</span>
                  </div>
                </label>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-500 dark:text-[#9da6b9]">Daily Progress</span>
                  <span className="text-slate-900 dark:text-white font-bold">66%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '66%' }}></div>
                </div>
              </div>
            </div>
            {/* Streak Motivation */}
            <div className="bg-gradient-to-br from-primary to-blue-700 rounded-xl p-6 text-white shadow-lg overflow-hidden relative">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined fill-1 text-orange-400" style={{fontVariationSettings: "'FILL' 1"}}>workspace_premium</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-100">Hot Streak</span>
                </div>
                <h3 className="text-xl font-bold mb-1">7 Days Strong!</h3>
                <p className="text-sm text-blue-100 mb-4">You&apos;re in the top 5% of learners this week. Keep it up!</p>
                <button className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-bold transition-colors">
                  View Leaderboard
                </button>
              </div>
              <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-9xl opacity-10 rotate-12 pointer-events-none">flare</span>
            </div>
            {/* Quick AI Actions */}
            <div className="bg-white dark:bg-[#1c1f27] rounded-xl p-6 border border-slate-100 dark:border-slate-800">
              <h3 className="text-slate-900 dark:text-white font-bold text-base mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">auto_fix_high</span>
                AI Quick Help
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <span className="material-symbols-outlined text-primary mb-1">summarize</span>
                  <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 text-center">Summarize Note</span>
                </button>
                <Link href="/quiz/demo" className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <span className="material-symbols-outlined text-primary mb-1">quiz</span>
                  <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 text-center">Mock Quiz</span>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
