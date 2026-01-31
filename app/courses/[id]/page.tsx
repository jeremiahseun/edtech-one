'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import { Id } from '@/convex/_generated/dataModel';

export default function CoursePage() {
    const params = useParams();
    const courseId = params.id as Id<"courses">;
    const course = useQuery(api.courses.getCourse, { courseId });
    const learningPath = useQuery(api.curriculum.getLearningPath, { courseId });

    if (!course || learningPath === undefined) {
        return (
            <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen font-display pb-20">
            {/* Header */}
            <div className={`w-full py-12 px-8 mb-8 ${!course.colorTheme ? 'bg-primary/10' : ''}`} style={{ backgroundColor: course.colorTheme ? `${course.colorTheme}20` : undefined }}>
                <div className="max-w-4xl mx-auto">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary dark:text-blue-400 font-bold mb-6 hover:underline">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
                            <p className="text-slate-500 dark:text-[#9da6b9]">{course.description || "Course materials and study plan"}</p>
                        </div>
                        <Link href={`/courses/${courseId}/manage`} className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary transition-colors">
                            <span className="material-symbols-outlined text-slate-500">settings</span>
                        </Link>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-8">
                {learningPath ? (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">auto_stories</span>
                                Learning Path
                            </h2>
                            <span className="text-sm font-bold text-slate-500">{learningPath.modules.length} Modules</span>
                        </div>

                        <div className="space-y-4">
                            {learningPath.modules.map((module: any, idx: number) => (
                                <Link
                                    key={module.id}
                                    href={`/lesson/${courseId}?moduleId=${module.id}`}
                                    className="block group bg-white dark:bg-[#1c1f27] border border-slate-100 dark:border-slate-800 rounded-2xl p-6 hover:border-primary transition-all hover:shadow-lg"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="size-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{module.title}</h3>
                                                {module.isCompleted && (
                                                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                                                )}
                                            </div>
                                            <p className="text-slate-500 dark:text-[#9da6b9] text-sm mb-4 line-clamp-2">{module.description}</p>
                                            <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">schedule</span>
                                                    {module.estimatedDuration} min
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">attachment</span>
                                                    {module.sourceUploadIds.length} Materials
                                                </span>
                                            </div>
                                        </div>
                                        <div className="place-self-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="material-symbols-outlined text-primary text-3xl">play_circle</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white dark:bg-[#1c1f27] rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="size-24 bg-primary/5 dark:bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                            <span className="material-symbols-outlined text-primary text-5xl">auto_awesome_motion</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Your Learning Journey Starts Here</h3>
                        <p className="text-slate-500 dark:text-[#9da6b9] mb-10 max-w-md mx-auto leading-relaxed">
                            This course is currently empty. To get started, upload your lecture slides, notes, or textbooks, and Gemini will build a structured learning path for you.
                        </p>
                        <Link
                            href={`/courses/${courseId}/manage`}
                            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <span className="material-symbols-outlined">upload_file</span>
                            Upload & Setup Path
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}
