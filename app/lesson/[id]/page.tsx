import Link from 'next/link';

export default function LessonPlayer() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 h-screen flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between border-b border-solid border-slate-200 dark:border-border-dark px-6 py-3 bg-white dark:bg-background-dark z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-2">
                <div className="size-8 bg-primary rounded flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-xl">school</span>
                </div>
                <h2 className="text-lg font-bold leading-tight tracking-tight">APEX</h2>
            </Link>
          </div>
          {/* Breadcrumbs */}
          <nav className="hidden md:flex items-center gap-2 text-sm">
            <Link className="text-slate-500 dark:text-[#9da6b9] hover:text-primary transition-colors font-medium" href="/courses/manage">Advanced Machine Learning</Link>
            <span className="text-slate-400 dark:text-[#9da6b9]">/</span>
            <span className="font-medium">Lesson 4: Neural Architecture</span>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button className="flex items-center justify-center rounded-lg h-9 w-9 bg-slate-100 dark:bg-surface-dark hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <span className="material-symbols-outlined text-xl">settings</span>
            </button>
            <button className="flex items-center justify-center rounded-lg h-9 w-9 bg-slate-100 dark:bg-surface-dark hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <span className="material-symbols-outlined text-xl">notifications</span>
            </button>
          </div>
          <div className="h-8 w-[1px] bg-slate-200 dark:border-border-dark"></div>
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 border border-slate-200 dark:border-border-dark" data-alt="User profile avatar" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDRxJCMHJI4XD6-efb1R0kT0roYlCVm0MmWHqUYANrJjQ8ViMTgB2yQbI2c4HB_uhxtp9kPHA1SqqDp0f76UO519JI7SzrAMSOnXfQRS4rAz6Wv1eGMnS_bcxwXLhx_YyBQ-SryEkl0JQHVdMdkN641m3cVzfT9dL_kNMQr2BKMOaZi8Q2E5yUoWxB_dmsDHTRkWN1JLFlp-UWSHt0TBdQ52HDy7nedbAK_XTxjSWtG2IB4gof53XnxnvdKKxVuKW1my7IxV_uzS2s")' }}></div>
        </div>
      </header>
      <main className="flex flex-1 overflow-hidden relative">
        {/* Center Stage (Canvas Area) */}
        <div className="flex-1 flex flex-col relative bg-black">
          {/* Lesson Environment */}
          <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden items-center justify-center">
            <div className="relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl group">
              {/* AI Avatar Layer */}
              <div className="absolute bottom-6 right-6 w-48 aspect-square rounded-full border-4 border-primary/40 overflow-hidden z-10 shadow-xl bg-surface-dark">
                <img className="w-full h-full object-cover" alt="AI Instructor avatar speaking" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMQqyHub2BWyki5DQ4qB3j9qSrh9Xye43JCbigPgjHj4nsZqkzWlgkYPIJ08HmiRo0uY3thp70JmFLFd3POFMM9b8L3_xcQxQUCWyFnpWyisMJ7Vguope6vHpc2ErSqCAnVe3049YY8ejhzD0LFSVaLOLDSbucoP1ybECgvzpS1AaPeqNoRQJoVy5xG38DLM4-Ytov-DaJHN3HOpE7DsGMLLd4dzFcmXHIKVp4CcK0e0yr_pYfzWG3lV5-i2nDf2noVXsjaH3HmmM" />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary animate-pulse"></div>
              </div>
              {/* Digital Whiteboard Canvas */}
              <div className="w-full h-full bg-[#1a1c23] flex items-center justify-center relative p-8">
                <div className="w-full h-full border border-dashed border-slate-700 rounded-lg flex flex-col p-10">
                  <h1 className="text-3xl font-bold text-slate-400 mb-8 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">draw</span>
                    Neural Network Layers
                  </h1>
                  <div className="grid grid-cols-3 gap-8 flex-1">
                    <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                      <div className="size-12 rounded-full bg-primary flex items-center justify-center mb-2">
                        <span className="material-symbols-outlined text-white">input</span>
                      </div>
                      <p className="font-bold">Input Layer</p>
                      <p className="text-xs text-slate-500">784 Nodes</p>
                    </div>
                    <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4 flex flex-col items-center justify-center text-center relative">
                      <div className="size-12 rounded-full bg-indigo-500 flex items-center justify-center mb-2">
                        <span className="material-symbols-outlined text-white">layers</span>
                      </div>
                      <p className="font-bold">Hidden Layer</p>
                      <p className="text-xs text-slate-500">128 Nodes (ReLU)</p>
                      <div className="absolute -right-4 top-1/2 -translate-y-1/2">
                        <span className="material-symbols-outlined text-slate-600">arrow_forward</span>
                      </div>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                      <div className="size-12 rounded-full bg-emerald-500 flex items-center justify-center mb-2">
                        <span className="material-symbols-outlined text-white">output</span>
                      </div>
                      <p className="font-bold">Output Layer</p>
                      <p className="text-xs text-slate-500">10 Nodes (Softmax)</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Overlays & HUD */}
              <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded text-xs font-medium border border-white/10 flex items-center gap-2">
                <div className="size-2 rounded-full bg-red-500 animate-pulse"></div>
                LIVE LESSON
              </div>
            </div>
          </div>
          {/* Bottom Control Bar */}
          <div className="w-full px-6 pb-6">
            <div className="max-w-5xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
              {/* Progress Section */}
              <div className="flex flex-col gap-2 mb-3">
                <div className="group relative h-1.5 w-full bg-slate-700 rounded-full cursor-pointer">
                  <div className="absolute top-0 left-0 h-full bg-primary rounded-full" style={{ width: '45%' }}>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 size-4 bg-white rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs text-slate-400 font-medium">12:45 / 28:00</span>
                  <div className="flex gap-4">
                    <span className="text-xs text-slate-400 font-medium">Auto-scroll: On</span>
                    <span className="text-xs text-slate-400 font-medium">Speed: 1.25x</span>
                  </div>
                </div>
              </div>
              {/* Actions Section */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                  </button>
                  <button className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
                    <span className="material-symbols-outlined">skip_next</span>
                  </button>
                  <div className="w-[1px] h-6 bg-white/10 mx-2"></div>
                  <button className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
                    <span className="material-symbols-outlined">volume_up</span>
                  </button>
                  <button className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
                    <span className="material-symbols-outlined">closed_caption</span>
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center bg-white/5 border border-white/10 rounded-lg px-3 py-1">
                    <span className="material-symbols-outlined text-sm text-slate-400 mr-2">search</span>
                    <input className="bg-transparent border-none text-sm focus:ring-0 p-0 text-white placeholder-slate-500 w-32" placeholder="Search in lesson..." type="text" />
                  </div>
                  <Link href="/lesson/1/interactive" className="flex items-center justify-center overflow-hidden rounded-xl h-10 bg-primary hover:bg-primary/90 text-white gap-2 text-sm font-bold px-5 shadow-lg shadow-primary/20 transition-all">
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                    <span className="truncate">Ask Question</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Collapsible Sidebar */}
        <aside className="w-96 bg-white dark:bg-surface-dark border-l border-slate-200 dark:border-border-dark flex flex-col z-10 shadow-2xl">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-border-dark">
            <button className="flex-1 py-4 text-sm font-bold border-b-2 border-primary text-primary flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">forum</span>
              Chat
            </button>
            <button className="flex-1 py-4 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">article</span>
              Notes
            </button>
            <button className="flex-1 py-4 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              Transcript
            </button>
          </div>
          {/* Tab Content: Chat */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 hide-scrollbar">
            {/* AI Message */}
            <div className="flex gap-3">
              <div className="size-8 rounded bg-primary/20 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">smart_toy</span>
              </div>
              <div className="flex flex-col gap-1 max-w-[85%]">
                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg rounded-tl-none">
                  <p className="text-sm leading-relaxed">Hello! I&apos;m your AI tutor. I noticed we&apos;re covering Neural Architectures today. Would you like me to explain the backpropagation process in this specific model?</p>
                </div>
                <span className="text-[10px] text-slate-500 px-1">APEX Tutor • 12:45 PM</span>
              </div>
            </div>
            {/* User Message */}
            <div className="flex gap-3 flex-row-reverse">
              <div className="size-8 rounded bg-slate-200 dark:bg-slate-700 text-slate-500 flex items-center justify-center shrink-0 overflow-hidden">
                <img alt="User avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWban7tphEZ4lnXqTu7DiJPz8eUrsF1UYk3Xux2Qj-S_RLzGqygXRZTAzx2k5esaLjERrtmOMpuRkR72vVGJ7DzXEHZsYzpnwvXWOhuuTiMxEN14dt-KJQLm1YRLuqEMySli1GCh5P8t6k0oiUYizfE8eGICSrje5ol2FakAFdh0CSk70m6_hy32p0oscyci72U32n2tSiSAiwo2S8ZsBBDkJanGZrgzwVLROa1fAtCOSzniSbcEbWvs8iSTnFjs5xf_KKEbu25ZU" />
              </div>
              <div className="flex flex-col gap-1 items-end max-w-[85%]">
                <div className="bg-primary text-white p-3 rounded-lg rounded-tr-none">
                  <p className="text-sm leading-relaxed">Yes please. How does the ReLU activation function affect the hidden layer gradient?</p>
                </div>
                <span className="text-[10px] text-slate-500 px-1">You • 12:46 PM</span>
              </div>
            </div>
            {/* AI Message (Typing) */}
            <div className="flex gap-3">
              <div className="size-8 rounded bg-primary/20 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">smart_toy</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg rounded-tl-none flex gap-1 items-center">
                  <div className="size-1 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="size-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="size-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
          {/* Chat Input Area */}
          <div className="p-4 border-t border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark">
            <div className="relative">
              <textarea className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-primary focus:ring-1 resize-none pr-12 p-3 placeholder-slate-500" placeholder="Type a message..." rows={2}></textarea>
              <button className="absolute right-2 bottom-2 size-8 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors shadow-lg">
                <span className="material-symbols-outlined text-lg">send</span>
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">info</span>
                AI can make mistakes
              </span>
              <span>12/500</span>
            </div>
          </div>
        </aside>
      </main>
      {/* Floating Toast for Progress */}
      <div className="fixed bottom-24 right-96 mr-6 bg-slate-900 border border-white/10 rounded-lg px-4 py-2 flex items-center gap-3 shadow-2xl animate-fade-in z-30">
        <div className="size-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
          <span className="material-symbols-outlined text-sm font-bold">check</span>
        </div>
        <div>
          <p className="text-[11px] font-bold text-white leading-none">Checkpoint Reached</p>
          <p className="text-[10px] text-slate-400">Architecture Fundamentals</p>
        </div>
        <button className="ml-2 text-slate-500 hover:text-white">
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>
    </div>
  );
}
