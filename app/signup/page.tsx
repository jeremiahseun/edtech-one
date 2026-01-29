import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center p-4 font-display">
      <div className="w-full max-w-md bg-white dark:bg-[#1c1f27] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-8">
            <Link href="/" className="size-10 bg-primary rounded-lg flex items-center justify-center text-white mb-4">
                <span className="material-symbols-outlined text-2xl">auto_awesome</span>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create an account</h1>
            <p className="text-slate-500 dark:text-[#9da6b9] text-sm mt-1">Start your AI learning journey today</p>
        </div>

        <button className="w-full h-12 flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors font-medium text-slate-700 dark:text-white mb-6">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
            <span>Sign up with Google</span>
        </button>

        <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-[#1c1f27] px-2 text-slate-500">Or with email</span></div>
        </div>

        <form className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input type="text" className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="John Doe" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email address</label>
                <input type="email" className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="name@example.com" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                <input type="password" className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Create a password" />
            </div>

            <Link href="/onboarding" className="flex items-center justify-center w-full h-12 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all">
                Create Account
            </Link>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
            Already have an account? <Link href="/login" className="font-bold text-primary hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  )
}
