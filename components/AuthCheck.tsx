"use client";

import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";

export default function AuthCheck({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
    const user = useQuery(api.users.getUser);
    const syncUser = useMutation(api.users.syncUser);
    const router = useRouter();
    const pathname = usePathname();
    const [isSyncing, setIsSyncing] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    // Sync user when authenticated but user doesn't exist in Convex DB
    useEffect(() => {
        const ensureUser = async () => {
            // Only sync if: auth is loaded, user is authenticated, user query returned null (not undefined),
            // and we're not already syncing.
            if (!isAuthLoading && isAuthenticated && user === null && !isSyncing) {
                setIsSyncing(true);
                setAuthError(null);
                try {
                    await syncUser();
                } catch (error: any) {
                    console.error("Failed to sync user:", error);
                    setAuthError(error.message || "Failed to sync user account.");
                    setIsSyncing(false);
                }
            }
        };
        ensureUser();
    }, [isAuthLoading, isAuthenticated, user, isSyncing, syncUser]);

    // Handle onboarding redirect (middleware handles unauthenticated redirects)
    useEffect(() => {
        if (isAuthLoading || !isAuthenticated || !user) return;

        if (user.onboardingCompleted) {
            // If completed and trying to access onboarding, redirect to dashboard
            if (pathname === '/onboarding') {
                router.replace('/dashboard');
            }
        } else {
            // If NOT completed and on a protected route (not onboarding), redirect to onboarding
            if (pathname !== '/onboarding' && pathname !== '/') {
                router.replace('/onboarding');
            }
        }
    }, [isAuthLoading, isAuthenticated, user, pathname, router]);

    // Show error state
    if (authError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-slate-900 dark:text-white p-8">
                <div className="max-w-md w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                    <span className="material-symbols-outlined text-4xl text-red-500 mb-4">error</span>
                    <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Authentication Error</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-6">{authError}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (isAuthLoading) {
                setShowTimeoutMessage(true);
            }
        }, 5000);
        return () => clearTimeout(timer);
    }, [isAuthLoading]);

    // Show loading spinner while Convex auth is loading
    if (isAuthLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    {showTimeoutMessage && (
                        <div className="max-w-xs text-center animate-in fade-in duration-700">
                            <p className="text-slate-500 text-sm mb-2">Connecting to authentication service...</p>
                            <p className="text-xs text-slate-400">If this takes too long, please ensure your Clerk JWT template named &quot;convex&quot; is created.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Show loading while user is being synced (authenticated but no user record yet)
    if (isAuthenticated && (user === undefined || user === null)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    <p className="text-slate-500 text-sm">Setting up your account...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
