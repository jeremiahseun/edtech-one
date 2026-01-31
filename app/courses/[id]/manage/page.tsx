'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

export default function CourseDetailManagePage() {
    const params = useParams();
    const courseId = params.id as Id<"courses">;

    const course = useQuery(api.courses.getCourse, { courseId });
    const uploads = useQuery(api.courses.getUploads, { courseId });
    const generateUploadUrl = useMutation(api.courses.generateUploadUrl);
    const saveUpload = useMutation(api.courses.saveUpload);
    const processPdf = useAction(api.ingest.processPdf);

    const generateStudyPlan = useAction(api.curriculum.generateStudyPlan);
    const learningPath = useQuery(api.curriculum.getLearningPath, { courseId });

    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
    const [processingUploadIds, setProcessingUploadIds] = useState<Set<string>>(new Set());
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleProcessPdf = async (uploadId: Id<"uploads">, storageId: Id<"_storage">) => {
        setProcessingUploadIds(prev => new Set(prev).add(uploadId));
        try {
            await processPdf({ uploadId, storageId });
        } catch (error) {
            console.error("Processing failed:", error);
        } finally {
            setProcessingUploadIds(prev => {
                const next = new Set(prev);
                next.delete(uploadId);
                return next;
            });
        }
    };

    const handleGenerateStudyPlan = async () => {
        setIsGeneratingPlan(true);
        try {
            await generateStudyPlan({ courseId });
            alert("Study plan generated successfully! You can now start studying from your dashboard.");
        } catch (error: any) {
            console.error("Failed to generate study plan:", error);
            alert(error.message || "Failed to generate study plan. Please try again.");
        } finally {
            setIsGeneratingPlan(false);
        }
    };

    const uploadFile = async (file: File) => {
        if (!file) return;

        setIsUploading(true);
        try {
            // 1. Get Upload URL
            const postUrl = await generateUploadUrl();

            // 2. Upload to Convex Storage
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });
            const { storageId } = await result.json();

            // 3. Save Metadata
            const uploadId = await saveUpload({
                courseId,
                fileName: file.name,
                fileType: file.type,
                storageId,
            });

            // 4. Auto-trigger processing
            if (uploadId) {
                handleProcessPdf(uploadId, storageId);
            }

        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed. Please try again.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) uploadFile(file);
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file && (file.type === 'application/pdf' || file.type === 'text/plain' || file.name.endsWith('.md'))) {
            uploadFile(file);
        } else {
            alert("Please drop a PDF, TXT, or MD file.");
        }
    }, [courseId, generateUploadUrl, saveUpload, processPdf]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    if (!course) {
        return (
            <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
            </div>
        );
    }

    const allProcessed = (uploads || []).length > 0 && uploads?.every(u => u.processingStatus === 'completed');
    const hasLearningPath = !!learningPath;

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen font-display p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/courses/manage" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">{course.title}</h1>
                        <p className="text-slate-500 dark:text-slate-400">Manage Content & Study Plan</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Upload Section with Drag and Drop */}
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            className={`bg-white dark:bg-[#1c1f27] border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
                                ${isDragging
                                    ? 'border-primary bg-primary/5 dark:bg-primary/10 scale-[1.02]'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                }`}
                        >
                            <div className="max-w-md mx-auto">
                                <div className={`size-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors
                                    ${isDragging
                                        ? 'bg-primary/20 text-primary'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                    }`}>
                                    <span className="material-symbols-outlined text-4xl">
                                        {isDragging ? 'file_download' : 'cloud_upload'}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold mb-2">
                                    {isDragging ? 'Drop your file here!' : 'Upload Course Materials'}
                                </h3>
                                <p className="text-slate-500 dark:text-[#9da6b9] text-sm mb-6">
                                    {isDragging
                                        ? 'Release to upload your file'
                                        : 'Drag & drop your files here, or click to browse. Supports PDF, TXT, and MD files.'
                                    }
                                </p>

                                <input
                                    type="file"
                                    accept=".pdf,.txt,.md"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />

                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-bold w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isUploading ? (
                                        <>
                                            <span className="animate-spin size-4 border-2 border-white/30 border-t-white rounded-full"></span>
                                            Uploading & Processing...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-lg">folder_open</span>
                                            Browse Files
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Uploads List */}
                        <div>
                            <h3 className="text-xl font-bold mb-4">Uploaded Files</h3>
                            <div className="bg-white dark:bg-[#1c1f27] border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
                                {(uploads || []).length > 0 ? (
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                                            <tr>
                                                <th className="p-4 text-xs font-bold uppercase text-slate-500 dark:text-[#9da6b9]">File Name</th>
                                                <th className="p-4 text-xs font-bold uppercase text-slate-500 dark:text-[#9da6b9]">Status</th>
                                                <th className="p-4 text-xs font-bold uppercase text-slate-500 dark:text-[#9da6b9] text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {uploads?.map((upload: any) => (
                                                <tr key={upload._id}>
                                                    <td className="p-4 font-medium flex items-center gap-3 text-slate-900 dark:text-white">
                                                        <span className="material-symbols-outlined text-slate-400">description</span>
                                                        <div className="flex flex-col">
                                                            <span className="truncate max-w-[200px]">{upload.fileName}</span>
                                                            <span className="text-[10px] text-slate-400 capitalize">{upload.fileType.split('/')[1] || 'File'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold
                                                            ${upload.processingStatus === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                                upload.processingStatus === 'processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                                    upload.processingStatus === 'failed' ? 'bg-red-100 text-red-700' :
                                                                        'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                                                            {upload.processingStatus === 'processing' && <span className="animate-spin size-2 bg-current rounded-full"></span>}
                                                            {upload.processingStatus}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <div className="flex justify-end">
                                                            {processingUploadIds.has(upload._id) ? (
                                                                <span className="text-blue-500 text-xs font-bold flex items-center gap-1.5">
                                                                    <span className="animate-spin size-3 border-2 border-blue-300 border-t-blue-600 rounded-full"></span>
                                                                    Processing...
                                                                </span>
                                                            ) : (
                                                                <>
                                                                    {upload.processingStatus === 'pending' && (
                                                                        <button
                                                                            onClick={() => handleProcessPdf(upload._id, upload.storageId)}
                                                                            className="text-primary text-xs font-bold hover:underline"
                                                                        >
                                                                            Process
                                                                        </button>
                                                                    )}
                                                                    {upload.processingStatus === 'failed' && (
                                                                        <button
                                                                            onClick={() => handleProcessPdf(upload._id, upload.storageId)}
                                                                            className="text-red-500 text-xs font-bold hover:underline flex items-center gap-1"
                                                                        >
                                                                            <span className="material-symbols-outlined text-sm">refresh</span>
                                                                            Retry
                                                                        </button>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="p-12 text-center text-slate-400 dark:text-[#9da6b9]">
                                        No files uploaded yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Study Plan Status Card */}
                        <div className="bg-white dark:bg-[#1c1f27] border border-slate-100 dark:border-slate-800 rounded-xl p-6 h-fit sticky top-8">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">auto_awesome</span>
                                AI Study Plan
                            </h3>

                            {!hasLearningPath ? (
                                <div className="space-y-4">
                                    <p className="text-sm text-slate-500 dark:text-[#9da6b9]">
                                        {allProcessed
                                            ? "Great! All your files are processed. Now let Gemini create a customized study plan for you."
                                            : "Upload and process your materials first. Then Gemini will build your structured learning path."}
                                    </p>
                                    <button
                                        onClick={handleGenerateStudyPlan}
                                        disabled={!allProcessed || isGeneratingPlan}
                                        className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale transition-all"
                                    >
                                        {isGeneratingPlan ? (
                                            <>
                                                <span className="animate-spin size-4 border-2 border-white/30 border-t-white rounded-full"></span>
                                                Building Curriculum...
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined">rocket_launch</span>
                                                Generate Study Plan
                                            </>
                                        )}
                                    </button>
                                    {!allProcessed && (uploads || []).length > 0 && (
                                        <p className="text-[10px] text-center text-amber-500 font-medium">
                                            Wait for all files to finish processing
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg">
                                        <span className="material-symbols-outlined text-green-500">check_circle</span>
                                        <div>
                                            <p className="text-sm font-bold text-green-700 dark:text-green-400">Path Generated</p>
                                            <p className="text-xs text-green-600/70 dark:text-green-400/70">{learningPath.modules.length} Modules ready</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-[#9da6b9]">
                                        Your curriculum is ready! You can now start your interactive lessons and quizzes.
                                    </p>
                                    <div className="space-y-2">
                                        <Link
                                            href="/dashboard"
                                            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                                        >
                                            Go to Dashboard
                                        </Link>
                                        <button
                                            onClick={handleGenerateStudyPlan}
                                            className="w-full text-slate-400 text-xs font-bold hover:text-primary transition-colors py-2"
                                        >
                                            Regenerate Plan
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Tips */}
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
                            <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">lightbulb</span>
                                Study Tip
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                Use high-quality PDF slides or structured notes for the best AI-generated lessons.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
