"use client";

import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const user = useQuery(api.users.getUser);
  const syncUser = useMutation(api.users.syncUser);
  const router = useRouter();
  const pathname = usePathname();
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    const ensureUser = async () => {
      if (!isLoading && isAuthenticated && !synced) {
        try {
          await syncUser();
          setSynced(true);
        } catch (error) {
          console.error("Failed to sync user:", error);
        }
      }
    };
    ensureUser();
  }, [isLoading, isAuthenticated, synced, syncUser]);

  useEffect(() => {
    // Redirect logic
    if (!isLoading && isAuthenticated && user) {
       if (user.onboardingCompleted) {
           // If completed and trying to access onboarding, redirect to dashboard
           if (pathname === '/onboarding') {
               router.replace('/dashboard');
           }
       } else {
           // If NOT completed and trying to access something else (like dashboard), redirect to onboarding
           // We allow access to "/" (landing page) or specific public routes if needed,
           // but the requirement is "users register newly, follow the onboarding flow... and when done pushed to homepage".
           // Assuming dashboard is protected.
           // We shouldn't block public pages, but let's assume protected pages are everything except maybe root?
           // Actually, `onboarding` page is protected by Clerk middleware usually.

           if (pathname !== '/onboarding') {
               router.replace('/onboarding');
           }
       }
    }
  }, [isLoading, isAuthenticated, user, pathname, router]);

  if (isLoading) {
      // You might want a loading spinner here
      return <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">Loading...</div>;
  }

  return <>{children}</>;
}
