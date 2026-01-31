'use client';

import Link from 'next/link';
import { useQuery, useMutation, useConvexAuth } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useEffect } from 'react';

export default function Dashboard() {
    const dashboardData = useQuery(api.dashboard.getDashboard);
    const checkDailyGoals = useMutation(api.dashboard.checkDailyGoals);
    const toggleGoal = useMutation(api.dashboard.toggleGoal);

    const { isAuthenticated } = useConvexAuth();

    useEffect(() => {
        // Attempt to initialize daily goals if they don't exist
        // Only fire if we are authenticated to avoid "Unauthorized" errors
        if (isAuthenticated) {
            checkDailyGoals().catch(() => { });
        }
    }, [checkDailyGoals, isAuthenticated]);

    if (!dashboardData) {
        return (
            <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    const { user, courses, dailyGoals, activeCourse } = dashboardData;

    // Calculate ranks
    const currentLevel = Math.floor((user.totalXp || 0) / 1000) + 1;
    const nextLevelXp = currentLevel * 1000;
    const xpProgress = ((user.totalXp || 0) % 1000) / 1000 * 100;

    // Daily Goals Stats
    const completedGoals = dailyGoals.filter((g: any) => g.isCompleted).length;
    const totalGoals = dailyGoals.length || 1; // avoid divide by zero
    const dailyProgress = Math.round((completedGoals / totalGoals) * 100);

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen font-display">
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
                            <Link className="text-slate-600 dark:text-[#9da6b9] text-sm font-medium hover:text-primary transition-colors" href="/settings">Settings</Link>
                        </nav>
                    </div>
                    <div className="flex flex-1 justify-end items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500 rounded-lg font-bold text-sm">
                            <span className="material-symbols-outlined text-lg fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>flare</span>
                            <span>{user.currentStreak || 0}</span>
                        </div>
                        <div className="bg-slate-200 dark:bg-slate-700 rounded-full size-10 border-2 border-primary flex items-center justify-center text-primary font-bold overflow-hidden">
                            {/* Fallback avatar if no image */}
                            {user.fullName?.charAt(0) || 'U'}
                        </div>
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
                                        <p className="text-slate-900 dark:text-white text-lg font-bold leading-normal">Level {currentLevel} Scholar</p>
                                    </div>
                                    <p className="text-slate-600 dark:text-white text-sm font-medium leading-normal">{user.totalXp || 0} <span className="text-slate-400 dark:text-[#9da6b9]">/ {nextLevelXp} XP</span></p>
                                </div>
                                <div className="rounded-full bg-slate-100 dark:bg-[#3b4354] h-2.5 w-full overflow-hidden">
                                    <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${xpProgress}%` }}></div>
                                </div>
                                <p className="text-slate-400 dark:text-[#9da6b9] text-xs font-normal">{nextLevelXp - (user.totalXp || 0)} XP remaining to unlock Level {currentLevel + 1}</p>
                            </div>
                        </div>

                        {/* Featured Section: Continue Studying */}
                        {activeCourse ? (
                            <section>
                                <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight mb-4">Continue Studying</h2>
                                <div className="group relative overflow-hidden rounded-xl bg-white dark:bg-[#1c1f27] border border-slate-100 dark:border-slate-800 shadow-md hover:shadow-lg transition-all duration-300">
                                    <div className="flex flex-col md:flex-row">
                                        <div className={`md:w-2/5 h-48 md:h-auto bg-center bg-no-repeat bg-cover ${!activeCourse.colorTheme ? 'bg-blue-900' : ''}`} style={{ backgroundColor: activeCourse.colorTheme }}>
                                            <div className="w-full h-full bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                                                <span className="material-symbols-outlined text-white text-5xl opacity-80 group-hover:opacity-100 transition-opacity">play_circle</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">Course</span>
                                                <span className="text-slate-400 dark:text-slate-500 material-symbols-outlined">auto_awesome</span>
                                            </div>
                                            <h3 className="text-slate-900 dark:text-white text-2xl font-bold mb-2">{activeCourse.title}</h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="text-primary font-bold text-lg">{activeCourse.progress}%</div>
                                                    <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full">
                                                        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${activeCourse.progress}%` }}></div>
                                                    </div>
                                                </div>
                                                <p className="text-slate-500 dark:text-[#9da6b9] text-sm">
                                                    {activeCourse.completedModules} of {activeCourse.totalModules} modules completed
                                                </p>
                                                <Link href={`/courses/${activeCourse._id}`} className="w-full md:w-auto px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold text-sm transition-all transform active:scale-95 flex items-center justify-center gap-2">
                                                    Resume Course
                                                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        ) : (
                            <section>
                                <div className="bg-white dark:bg-[#1c1f27] rounded-xl p-8 border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center text-center">
                                    <div className="size-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-400">
                                        <span className="material-symbols-outlined text-3xl">add</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Start your first course</h3>
                                    <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">Upload your lecture slides or notes to generate an interactive AI study plan.</p>
                                    <Link href="/courses/manage" className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-blue-600 transition-colors">
                                        Create Course
                                    </Link>
                                </div>
                            </section>
                        )}

                        {/* Course Grid: My Courses */}
                        <section>
                            <div className="flex items-center justify-between mb-4 px-1">
                                <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight">My Courses</h2>
                                <Link className="text-primary text-sm font-semibold hover:underline" href="/courses/manage">View All</Link>
                            </div>
                            {courses.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {courses.map((course: any) => (
                                        <Link key={course._id} href={`/courses/${course._id}`} className="bg-white dark:bg-[#1c1f27] border border-slate-100 dark:border-slate-800 rounded-xl p-4 hover:border-primary/50 transition-colors cursor-pointer group flex flex-col h-full">
                                            <div className={`relative w-full aspect-video rounded-lg mb-4 overflow-hidden ${!course.colorTheme ? 'bg-slate-800' : ''}`} style={{ backgroundColor: course.colorTheme }}>
                                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors"></div>
                                                <div className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-[#1c1f27]/90 rounded-full flex">
                                                    {/* Simple circular progress using SVG */}
                                                    <svg className="w-8 h-8" viewBox="0 0 36 36">
                                                        <path className="stroke-slate-200 dark:stroke-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3"></path>
                                                        <path
                                                            className="stroke-primary"
                                                            strokeDasharray={`${course.progress}, 100`}
                                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                            fill="none"
                                                            strokeLinecap="round"
                                                            strokeWidth="3"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                            <h4 className="text-slate-900 dark:text-white font-bold text-base mb-1 line-clamp-1">{course.title}</h4>
                                            <div className="flex items-center justify-between mt-auto pt-2">
                                                <span className="text-slate-500 dark:text-[#9da6b9] text-xs">{course.progress}% Complete</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-500 dark:text-slate-400 italic">No courses yet.</p>
                            )}
                        </section>
                    </div>

                    {/* Right Column: Sidebar Widgets */}
                    <aside className="w-full lg:w-[320px] flex flex-col gap-6">
                        {/* Daily Goals Widget */}
                        <div className="bg-white dark:bg-[#1c1f27] rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-slate-900 dark:text-white font-bold text-lg">Daily Goals</h3>
                                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-[#9da6b9] px-2 py-1 rounded">{completedGoals}/{totalGoals} Done</span>
                            </div>
                            <div className="space-y-4">
                                {dailyGoals.map((goal: any) => (
                                    <label key={goal.id} className="flex items-center gap-3 group cursor-pointer">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                checked={goal.isCompleted}
                                                onChange={() => toggleGoal({ goalId: goal.id })}
                                                className="peer appearance-none size-5 rounded border-2 border-slate-300 dark:border-slate-600 checked:bg-primary checked:border-primary transition-all cursor-pointer"
                                                type="checkbox"
                                            />
                                            <span className="material-symbols-outlined absolute text-white text-sm opacity-0 peer-checked:opacity-100 pointer-events-none">check</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`text-sm font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors ${goal.isCompleted ? 'line-through decoration-slate-400 dark:decoration-slate-500 opacity-60' : ''}`}>
                                                {goal.title}
                                            </span>
                                            <span className="text-[10px] text-slate-400 dark:text-[#9da6b9]">+{goal.xpReward} XP</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center justify-between text-xs mb-2">
                                    <span className="text-slate-500 dark:text-[#9da6b9]">Daily Progress</span>
                                    <span className="text-slate-900 dark:text-white font-bold">{dailyProgress}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary transition-all duration-500" style={{ width: `${dailyProgress}%` }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Streak Motivation */}
                        <div className="bg-gradient-to-br from-primary to-blue-700 rounded-xl p-6 text-white shadow-lg overflow-hidden relative">
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="material-symbols-outlined fill-1 text-orange-400" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                                    <span className="text-xs font-bold uppercase tracking-widest text-blue-100">Hot Streak</span>
                                </div>
                                <h3 className="text-xl font-bold mb-1">{user.currentStreak || 0} Days Strong!</h3>
                                <p className="text-sm text-blue-100 mb-4">Keep learning every day to build your habit.</p>
                            </div>
                            <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-9xl opacity-10 rotate-12 pointer-events-none">flare</span>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
