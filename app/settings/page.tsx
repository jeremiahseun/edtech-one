import Link from 'next/link';

export default function SettingsPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-[#282e39] bg-background-light dark:bg-background-dark px-10 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-4 text-slate-900 dark:text-white">
            <div className="size-6 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.1288 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z" fill="currentColor"></path>
                <path clipRule="evenodd" d="M10.4485 13.8519C10.4749 13.9271 10.6203 14.246 11.379 14.7361C12.298 15.3298 13.7492 15.9145 15.6717 16.3735C18.0007 16.9296 20.8712 17.2655 24 17.2655C27.1288 17.2655 29.9993 16.9296 32.3283 16.3735C34.2508 15.9145 35.702 15.3298 36.621 14.7361C37.3796 14.246 37.5251 13.9271 37.5515 13.8519C37.5287 13.7876 37.4333 13.5973 37.0635 13.2931C36.5266 12.8516 35.6288 12.3647 34.343 11.9175C31.79 11.0295 28.1333 10.4437 24 10.4437C19.8667 10.4437 16.2099 11.0295 13.657 11.9175C12.3712 12.3647 11.4734 12.8516 10.9365 13.2931C10.5667 13.5973 10.4713 13.7876 10.4485 13.8519ZM37.5563 18.7877C36.3176 19.3925 34.8502 19.8839 33.2571 20.2642C30.5836 20.9025 27.3973 21.2655 24 21.2655C20.6027 21.2655 17.4164 20.9025 14.7429 20.2642C13.1498 19.8839 11.6824 19.3925 10.4436 18.7877V34.1275C10.4515 34.1545 10.5427 34.4867 11.379 35.027C12.298 35.6207 13.7492 36.2054 15.6717 36.6644C18.0007 37.2205 20.8712 37.5564 24 37.5564C27.1288 37.5564 29.9993 37.2205 32.3283 36.6644C34.2508 36.2054 35.702 35.6207 36.621 35.027C37.4573 34.4867 37.5485 34.1546 37.5563 34.1275V18.7877ZM41.5563 13.8546V34.1455C41.5563 36.1078 40.158 37.5042 38.7915 38.3869C37.3498 39.3182 35.4192 40.0389 33.2571 40.5551C30.5836 41.1934 27.3973 41.5564 24 41.5564C20.6027 41.5564 17.4164 41.1934 14.7429 40.5551C12.5808 40.0389 10.6502 39.3182 9.20848 38.3869C7.84205 37.5042 6.44365 36.1078 6.44365 34.1455L6.44365 13.8546C6.44365 12.2684 7.37223 11.0454 8.39581 10.2036C9.43325 9.3505 10.8137 8.67141 12.343 8.13948C15.4203 7.06909 19.5418 6.44366 24 6.44366C28.4582 6.44366 32.5797 7.06909 35.657 8.13948C37.1863 8.67141 38.5667 9.3505 39.6042 10.2036C40.6278 11.0454 41.5563 12.2684 41.5563 13.8546Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-xl font-black leading-tight tracking-[-0.015em]">APEX</h2>
          </Link>
        </div>
        <div className="flex flex-1 justify-end gap-6 items-center">
          <nav className="flex items-center gap-8">
            <Link className="text-slate-600 dark:text-[#9da6b9] hover:text-primary dark:hover:text-white text-sm font-medium transition-colors" href="/dashboard">Dashboard</Link>
            <Link className="text-slate-600 dark:text-[#9da6b9] hover:text-primary dark:hover:text-white text-sm font-medium transition-colors" href="/courses/manage">Library</Link>
            <Link className="text-slate-900 dark:text-white text-sm font-medium border-b-2 border-primary pb-1" href="/settings">Settings</Link>
          </nav>
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary/20" data-alt="User profile avatar" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC2iKS5fjF5hhRMWhgKJtbYB2R1MJ6-Y9GMf0Z7dLszx5wVRfT36Yb2GvdpeeD16QD0jZsTytRnSzVJWl30QvmDJNf1tGjEI35QkzTq1EFUfr0BtMc0KvwCnaIxJMiUbdNmExf572nG5IIuqddD-EnwjwAXWysDBtOhZukaFJL9Hk6lVN6BFqPS-XmGhZA3P4K5LfDnLUZTSPT0i7o3GmL2aFjTuDxkr86q0f24t6_l68ENa-cnCS57lQaF5E5qd6HD-JiyyI5eeUQ")' }}></div>
        </div>
      </header>

      <div className="flex-1 flex max-w-[1200px] w-full mx-auto p-8 gap-12">
        {/* Sidebar */}
        <aside className="w-64 flex flex-col gap-2">
            <h3 className="text-xs font-bold text-slate-500 dark:text-[#9da6b9] uppercase tracking-wider mb-2">Account</h3>
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-bold text-sm">
                <span className="material-symbols-outlined text-[20px]">person</span>
                Profile
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-[#9da6b9] hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-sm transition-colors">
                <span className="material-symbols-outlined text-[20px]">credit_card</span>
                Subscription
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-[#9da6b9] hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-sm transition-colors">
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                Notifications
            </button>
            <div className="h-px bg-slate-200 dark:bg-slate-800 my-2"></div>
            <h3 className="text-xs font-bold text-slate-500 dark:text-[#9da6b9] uppercase tracking-wider mb-2">App</h3>
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-[#9da6b9] hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-sm transition-colors">
                <span className="material-symbols-outlined text-[20px]">palette</span>
                Appearance
            </button>
        </aside>

        {/* Content */}
        <div className="flex-1 max-w-2xl space-y-10">
            {/* Profile Section */}
            <section>
                <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
                <div className="flex items-center gap-6 mb-8">
                    <div className="size-20 rounded-full bg-cover border-2 border-slate-200 dark:border-slate-700" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC2iKS5fjF5hhRMWhgKJtbYB2R1MJ6-Y9GMf0Z7dLszx5wVRfT36Yb2GvdpeeD16QD0jZsTytRnSzVJWl30QvmDJNf1tGjEI35QkzTq1EFUfr0BtMc0KvwCnaIxJMiUbdNmExf572nG5IIuqddD-EnwjwAXWysDBtOhZukaFJL9Hk6lVN6BFqPS-XmGhZA3P4K5LfDnLUZTSPT0i7o3GmL2aFjTuDxkr86q0f24t6_l68ENa-cnCS57lQaF5E5qd6HD-JiyyI5eeUQ")' }}></div>
                    <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-colors">
                        Change Avatar
                    </button>
                </div>
                <div className="grid gap-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">First Name</label>
                            <input type="text" className="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white" defaultValue="Alex" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
                            <input type="text" className="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white" defaultValue="Morgan" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                        <input type="email" className="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white" defaultValue="alex.morgan@university.edu" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Major</label>
                         <div className="relative">
                            <select defaultValue="cs" className="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white appearance-none">
                                <option value="cs">Computer Science</option>
                                <option value="eng">Engineering</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">expand_more</span>
                        </div>
                    </div>
                </div>
                <div className="mt-8 flex justify-end">
                    <button className="px-6 py-3 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition-colors">
                        Save Changes
                    </button>
                </div>
            </section>

            <div className="h-px bg-slate-200 dark:bg-slate-800"></div>

            {/* Subscription Section */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Subscription</h2>
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Free Plan</span>
                </div>

                <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center">
                    <div className="size-12 bg-primary rounded-lg flex items-center justify-center text-white shrink-0">
                         <span className="material-symbols-outlined text-2xl">diamond</span>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">Upgrade to APEX Pro</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Unlock unlimited RAG, DeepSeek reasoning models, and streak freezes.</p>
                    </div>
                    <button className="px-6 py-3 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition-colors whitespace-nowrap">
                        Upgrade Now
                    </button>
                </div>
            </section>
        </div>
      </div>
    </div>
  )
}
