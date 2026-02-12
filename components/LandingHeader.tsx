"use client";

import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";

export default function LandingHeader() {
    const { isSignedIn, isLoaded } = useAuth();
    const { user } = useUser();

    return (
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
                    {!isLoaded ? (
                        // Loading state - show skeleton buttons
                        <>
                            <div className="hidden sm:block w-16 h-9 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg"></div>
                            <div className="w-24 h-9 bg-primary/50 animate-pulse rounded-lg"></div>
                        </>
                    ) : isSignedIn ? (
                        // Authenticated state
                        <>
                            <span className="hidden sm:block text-sm text-slate-500 dark:text-slate-400">
                                Welcome{user?.firstName ? `, ${user.firstName}` : ""}!
                            </span>
                            <Link
                                href="/dashboard"
                                className="bg-primary hover:bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">dashboard</span>
                                Dashboard
                            </Link>
                        </>
                    ) : (
                        // Unauthenticated state
                        <>
                            <Link href="/login" className="hidden sm:block px-4 py-2 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Log In</Link>
                            <Link href="/signup" className="bg-primary hover:bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-primary/20">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
