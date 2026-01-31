'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function CoursesManagePage() {
    const dashboardData = useQuery(api.dashboard.getDashboard);
    const createCourse = useMutation(api.courses.createCourse);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newCourseTitle, setNewCourseTitle] = useState('');
    const [newCourseDescription, setNewCourseDescription] = useState('');
    const [newCourseTheme, setNewCourseTheme] = useState('#4A90E2');

    const handleCreateCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCourseTitle) return;

        try {
            await createCourse({
                title: newCourseTitle,
                description: newCourseDescription,
                colorTheme: newCourseTheme,
            });
            setIsCreateModalOpen(false);
            setNewCourseTitle('');
            setNewCourseDescription('');
        } catch (error) {
            console.error("Failed to create course", error);
            alert("Failed to create course. Please try again.");
        }
    };

    if (!dashboardData) {
        return (
            <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    const { courses } = dashboardData;

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen font-display p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">My Courses</h1>
                            <p className="text-slate-500 dark:text-slate-400">Manage your subjects and study materials.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Create Course
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course: any) => (
                        <Link key={course._id} href={`/courses/${course._id}`} className="group bg-white dark:bg-[#1c1f27] border border-slate-100 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer flex flex-col h-full">
                            <div className={`h-32 rounded-lg mb-4 flex items-center justify-center transition-transform group-hover:scale-[1.02]`} style={{ backgroundColor: course.colorTheme || '#333' }}>
                                <span className="material-symbols-outlined text-white/50 text-5xl">folder_open</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                                {course.description || "No description provided."}
                            </p>
                            <div className="flex justify-between items-center mt-auto">
                                <span className="text-xs text-slate-400 font-bold">{course.completedModules || 0} modules</span>
                                <div className="text-primary font-bold text-sm flex items-center gap-1">
                                    Open
                                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {/* Empty State / Create Card */}
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-slate-50 dark:bg-[#1c1f27]/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:text-primary hover:border-primary/50 transition-colors h-[300px]"
                    >
                        <span className="material-symbols-outlined text-5xl mb-2">add_circle</span>
                        <span className="font-bold">Add New Course</span>
                    </button>
                </div>
            </div>

            {/* Create Course Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1c1f27] rounded-xl max-w-md w-full p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Create New Course</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleCreateCourse} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-2">Course Title</label>
                                <input
                                    type="text"
                                    value={newCourseTitle}
                                    onChange={(e) => setNewCourseTitle(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-black/20 focus:outline-none focus:border-primary"
                                    placeholder="e.g. Linear Algebra 101"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Description</label>
                                <textarea
                                    value={newCourseDescription}
                                    onChange={(e) => setNewCourseDescription(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-black/20 focus:outline-none focus:border-primary h-24 resize-none"
                                    placeholder="What is this course about?"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Theme Color</label>
                                <div className="flex gap-2">
                                    {['#4A90E2', '#D0021B', '#F5A623', '#7ED321', '#9013FE'].map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setNewCourseTheme(color)}
                                            className={`size-8 rounded-full border-2 ${newCourseTheme === color ? 'border-black dark:border-white' : 'border-transparent'}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90"
                                >
                                    Create Course
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
