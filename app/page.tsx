import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-xl">auto_awesome</span>
            </div>
            <h2 className="text-xl font-black tracking-tighter">APEX</h2>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="#">Product</Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="#">Features</Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="#">Pricing</Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="#">About</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block px-4 py-2 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Log In</Link>
            <Link href="/onboarding" className="bg-primary hover:bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-primary/20">
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {/* Hero Section */}
        <section className="max-w-[1200px] mx-auto px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full w-fit">
                <span className="material-symbols-outlined text-sm">bolt</span>
                <span className="text-xs font-bold uppercase tracking-wider">AI-Powered Learning</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white">
                Turn your lecture notes into a <span className="text-primary">personal tutor.</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-[500px] leading-relaxed">
                Upload your PDFs and let APEX generate interactive quizzes, summaries, and personalized study paths in seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard" className="bg-primary hover:bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-2 group">
                  Start Studying for Free
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                </Link>
                <button className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 py-4 rounded-xl text-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  Watch Demo
                </button>
              </div>
              <div className="flex items-center gap-4 text-slate-500 text-sm">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-background-dark bg-slate-300" data-alt="Student user avatar 1"></div>
                  <div className="w-8 h-8 rounded-full border-2 border-background-dark bg-slate-400" data-alt="Student user avatar 2"></div>
                  <div className="w-8 h-8 rounded-full border-2 border-background-dark bg-slate-500" data-alt="Student user avatar 3"></div>
                </div>
                <span>Joined by 10,000+ students this week</span>
              </div>
            </div>
            {/* Split Screen Visual */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[400px]">
                {/* Left: Static PDF */}
                <div className="w-full md:w-1/2 p-6 bg-slate-200/50 dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-700 flex flex-col">
                  <div className="flex items-center gap-2 mb-4 opacity-50">
                    <span className="material-symbols-outlined text-sm">description</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Static PDF</span>
                  </div>
                  <div className="space-y-3 opacity-30">
                    <div className="h-4 bg-slate-400 dark:bg-slate-600 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-400 dark:bg-slate-600 rounded w-full"></div>
                    <div className="h-3 bg-slate-400 dark:bg-slate-600 rounded w-5/6"></div>
                    <div className="h-40 bg-slate-400 dark:bg-slate-600 rounded-lg w-full mt-4"></div>
                    <div className="h-3 bg-slate-400 dark:bg-slate-600 rounded w-full"></div>
                    <div className="h-3 bg-slate-400 dark:bg-slate-600 rounded w-4/5"></div>
                  </div>
                  <div className="mt-auto pt-4 flex justify-center">
                    <div className="text-[10px] text-slate-500 italic">&quot;Too much text to digest...&quot;</div>
                  </div>
                </div>
                {/* Right: AI Lesson */}
                <div className="w-full md:w-1/2 p-6 bg-white dark:bg-slate-900 flex flex-col relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary">APEX Lesson</span>
                    </div>
                    <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="bg-primary w-2/3 h-full"></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-3 flex gap-3">
                      <span className="material-symbols-outlined text-primary">psychology</span>
                      <div className="space-y-2">
                        <div className="h-2 bg-primary/30 rounded w-16"></div>
                        <div className="h-2.5 bg-slate-300 dark:bg-slate-600 rounded w-32"></div>
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3 border border-slate-100 dark:border-slate-800">
                      <p className="text-[11px] font-bold text-slate-500">Quick Quiz:</p>
                      <p className="text-xs font-semibold">What is the primary function of Mitochondria?</p>
                      <div className="grid gap-2">
                        <div className="p-2 border border-primary bg-primary/5 rounded-lg text-[10px] flex justify-between items-center">
                          <span>Powerhouse of the cell</span>
                          <span className="material-symbols-outlined text-primary text-[14px]">check_circle</span>
                        </div>
                        <div className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px]">Protein Synthesis</div>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="animate-pulse bg-primary/20 text-primary text-[10px] px-3 py-1 rounded-full font-bold">AI is generating flashcards...</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Social Proof Section */}
        <section className="border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 py-10">
          <div className="max-w-[1200px] mx-auto px-6">
            <p className="text-center text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-8">Trusted by students from</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">school</span>
                <span className="font-bold">Stanford</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">account_balance</span>
                <span className="font-bold">MIT</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">menu_book</span>
                <span className="font-bold">Harvard</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">history_edu</span>
                <span className="font-bold">Oxford</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">architecture</span>
                <span className="font-bold">Berkeley</span>
              </div>
            </div>
          </div>
        </section>
        {/* Feature Section (How it works) */}
        <section className="max-w-[1200px] mx-auto px-6 py-24">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-black tracking-tight">Simple. Efficient. Effective.</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">We&#39;ve automated the heavy lifting of studying so you can focus on mastering the material.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col gap-6 hover:border-primary transition-colors group">
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-3xl">upload_file</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">1. Upload Notes</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Drag and drop your lecture PDFs, PowerPoint slides, or raw text files directly into the platform.</p>
              </div>
            </div>
            {/* Step 2 */}
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col gap-6 hover:border-primary transition-colors group">
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-3xl">query_stats</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">2. AI Analysis</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Our advanced AI identifies core concepts, key terms, and complex relationships within your material.</p>
              </div>
            </div>
            {/* Step 3 */}
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col gap-6 hover:border-primary transition-colors group">
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-3xl">emoji_events</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">3. Master Material</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Engage with generated quizzes, summaries, and personalized study paths tailored to your weak spots.</p>
              </div>
            </div>
          </div>
        </section>
        {/* Call to Action Section */}
        <section className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="relative rounded-[2rem] bg-primary overflow-hidden p-12 lg:p-20 text-center flex flex-col items-center gap-8 shadow-2xl shadow-primary/40">
            {/* Abstract Pattern Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            <h2 className="text-4xl lg:text-6xl font-black text-white leading-tight">Ready to ace your next exam?</h2>
            <p className="text-blue-100 text-lg max-w-xl">Join thousands of students who have transformed their study habits with APEX. No credit card required.</p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 relative z-10">
              <button className="bg-white text-primary px-10 py-5 rounded-2xl text-xl font-black hover:bg-slate-50 transition-all shadow-xl">
                Start Studying for Free
              </button>
              <button className="bg-primary/20 backdrop-blur-sm border border-white/30 text-white px-10 py-5 rounded-2xl text-xl font-black hover:bg-primary/40 transition-all">
                Browse Courses
              </button>
            </div>
            <div className="flex items-center gap-2 text-blue-100 text-sm mt-4">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span>14-day free trial on Pro features</span>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark py-16">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="col-span-2 md:col-span-1 space-y-6">
            <div className="flex items-center gap-2">
              <div className="size-6 bg-primary rounded flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
              </div>
              <h2 className="text-lg font-black tracking-tighter">APEX</h2>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              The world&#39;s most advanced AI study partner. Built by educators for the next generation of learners.
            </p>
            <div className="flex gap-4">
              <Link className="text-slate-400 hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">public</span></Link>
              <Link className="text-slate-400 hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">hub</span></Link>
              <Link className="text-slate-400 hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">alternate_email</span></Link>
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400">Product</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link className="hover:text-primary transition-colors" href="#">AI Quizzer</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">Summary Engine</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">Flashcards</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">Chrome Extension</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400">Company</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link className="hover:text-primary transition-colors" href="#">About Us</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">Careers</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">Blog</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">Privacy Policy</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400">Support</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link className="hover:text-primary transition-colors" href="#">Help Center</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">Contact Us</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">Status</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">API Docs</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto px-6 mt-16 pt-8 border-t border-slate-100 dark:border-slate-900 text-center text-slate-500 text-xs">
          © 2024 APEX Learning Technologies Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
