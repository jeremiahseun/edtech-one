'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useOnboardingStore } from '@/app/store/useOnboardingStore';

export default function Onboarding() {
  const router = useRouter();
  const { step, major, studyStruggle, setStep, setMajor, setStudyStruggle } = useOnboardingStore();
  const updateOnboarding = useMutation(api.users.updateOnboarding);
  const user = useQuery(api.users.getUser);

  // Local loading state for sync
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    if (user && !isSynced) {
      if (user.major) setMajor(user.major);
      if (user.studyStruggle) setStudyStruggle(user.studyStruggle);
      if (user.onboardingCompleted) {
         // Optionally redirect here if already completed, but AuthCheck usually handles it.
         // But for better UX, if they land here manually:
         router.replace('/dashboard');
      }
      setIsSynced(true);
    }
  }, [user, isSynced, setMajor, setStudyStruggle, router]);

  const handleNext = () => {
    if (step === 1 && major) {
      setStep(2);
    } else if (step === 2 && studyStruggle) {
       handleContinue();
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
        router.push('/');
    }
  };

  const handleSaveExit = async () => {
    await updateOnboarding({
        major,
        studyStruggle,
        onboardingCompleted: false
    });
    router.push('/dashboard');
  };

  const handleContinue = async () => {
     await updateOnboarding({
        major,
        studyStruggle,
        onboardingCompleted: true
     });
     router.push('/dashboard');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        {/* Top Navigation */}
        <header className="flex items-center justify-between border-b border-solid border-slate-200 dark:border-[#282e39] px-6 py-3 lg:px-40">
          <div className="flex items-center gap-3">
            <div className="text-primary size-8">
              <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.1288 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z" fill="currentColor"></path>
                <path clipRule="evenodd" d="M10.4485 13.8519C10.4749 13.9271 10.6203 14.246 11.379 14.7361C12.298 15.3298 13.7492 15.9145 15.6717 16.3735C18.0007 16.9296 20.8712 17.2655 24 17.2655C27.1288 17.2655 29.9993 16.9296 32.3283 16.3735C34.2508 15.9145 35.702 15.3298 36.621 14.7361C37.3796 14.246 37.5251 13.9271 37.5515 13.8519C37.5287 13.7876 37.4333 13.5973 37.0635 13.2931C36.5266 12.8516 35.6288 12.3647 34.343 11.9175C31.79 11.0295 28.1333 10.4437 24 10.4437C19.8667 10.4437 16.2099 11.0295 13.657 11.9175C12.3712 12.3647 11.4734 12.8516 10.9365 13.2931C10.5667 13.5973 10.4713 13.7876 10.4485 13.8519ZM37.5563 18.7877C36.3176 19.3925 34.8502 19.8839 33.2571 20.2642C30.5836 20.9025 27.3973 21.2655 24 21.2655C20.6027 21.2655 17.4164 20.9025 14.7429 20.2642C13.1498 19.8839 11.6824 19.3925 10.4436 18.7877V34.1275C10.4515 34.1545 10.5427 34.4867 11.379 35.027C12.298 35.6207 13.7492 36.2054 15.6717 36.6644C18.0007 37.2205 20.8712 37.5564 24 37.5564C27.1288 37.5564 29.9993 37.2205 32.3283 36.6644C34.2508 36.2054 35.702 35.6207 36.621 35.027C37.4573 34.4867 37.5485 34.1546 37.5563 34.1275V18.7877ZM41.5563 13.8546V34.1455C41.5563 36.1078 40.158 37.5042 38.7915 38.3869C37.3498 39.3182 35.4192 40.0389 33.2571 40.5551C30.5836 41.1934 27.3973 41.5564 24 41.5564C20.6027 41.5564 17.4164 41.1934 14.7429 40.5551C12.5808 40.0389 10.6502 39.3182 9.20848 38.3869C7.84205 37.5042 6.44365 36.1078 6.44365 34.1455L6.44365 13.8546C6.44365 12.2684 7.37223 11.0454 8.39581 10.2036C9.43325 9.3505 10.8137 8.67141 12.343 8.13948C15.4203 7.06909 19.5418 6.44366 24 6.44366C28.4582 6.44366 32.5797 7.06909 35.657 8.13948C37.1863 8.67141 38.5667 9.3505 39.6042 10.2036C40.6278 11.0454 41.5563 12.2684 41.5563 13.8546Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">APEX</h2>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleSaveExit} className="text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white text-sm font-medium transition-colors cursor-pointer">
              Save & Exit
            </button>
            <button className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold transition-all hover:bg-blue-600">
              Help
            </button>
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center justify-start py-8 px-6">
          <div className="w-full max-w-[640px] flex flex-col">
            {/* Progress Bar Component */}
            <div className="flex flex-col gap-3 mb-10 w-full">
              <div className="flex gap-6 justify-between items-center">
                <p className="text-slate-900 dark:text-white text-base font-semibold">Step {step} of 2</p>
                <p className="text-slate-900 dark:text-white text-sm font-medium">{step === 1 ? '50%' : '100%'}</p>
              </div>
              <div className="rounded-full bg-slate-200 dark:bg-[#3b4354] overflow-hidden">
                <div className="h-2 rounded-full bg-primary transition-all duration-300" style={{ width: step === 1 ? '50%' : '100%' }}></div>
              </div>
              <p className="text-slate-500 dark:text-[#9da6b9] text-sm font-normal">Personalizing your experience</p>
            </div>

            {/* Step 1: Major Selection */}
            {step === 1 && (
              <>
                <div className="mb-10 text-center">
                  <h1 className="text-slate-900 dark:text-white tracking-tight text-3xl lg:text-4xl font-bold leading-tight mb-2">Tell us a bit about yourself</h1>
                  <p className="text-slate-500 dark:text-slate-400">Help APEX understand your academic background to better tailor your study materials.</p>
                </div>
                <div className="flex flex-col gap-4 mb-12">
                  <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">What&apos;s your major?</h2>
                  <div className="w-full">
                    <label className="flex flex-col w-full">
                      <select
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        className="custom-select-icon flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-[#3b4354] bg-white dark:bg-[#1c1f27] h-14 placeholder:text-slate-400 dark:placeholder:text-[#9da6b9] px-4 text-base font-normal transition-all"
                      >
                        <option disabled value="">e.g., Computer Science, Nursing...</option>
                        <option value="cs">Computer Science</option>
                        <option value="biology">Biology & Life Sciences</option>
                        <option value="business">Business Administration</option>
                        <option value="engineering">Engineering</option>
                        <option value="nursing">Nursing & Healthcare</option>
                        <option value="psychology">Psychology</option>
                        <option value="other">Other</option>
                      </select>
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Struggle Selection */}
            {step === 2 && (
              <>
                <div className="mb-10 text-center">
                   <h1 className="text-slate-900 dark:text-white tracking-tight text-3xl lg:text-4xl font-bold leading-tight mb-2">How do you study best?</h1>
                   <p className="text-slate-500 dark:text-slate-400">We will adapt the AI persona to help you overcome these challenges.</p>
                </div>
                <div className="flex flex-col gap-6 mb-12">
                  <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">What&apos;s your biggest study struggle?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Option 1 */}
                    <div
                      onClick={() => setStudyStruggle('procrastination')}
                      className={`flex flex-col p-6 rounded-xl border-2 cursor-pointer transition-all group active:scale-95 ${studyStruggle === 'procrastination' ? 'border-primary bg-primary/5 dark:bg-primary/10 relative overflow-hidden' : 'border-slate-200 dark:border-[#3b4354] bg-white dark:bg-[#1c1f27] hover:border-primary/50'}`}
                    >
                      {studyStruggle === 'procrastination' && (
                        <div className="absolute top-3 right-3 text-primary">
                          <span className="material-symbols-outlined fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        </div>
                      )}
                      <div className={`size-12 rounded-lg flex items-center justify-center mb-4 transition-colors ${studyStruggle === 'procrastination' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-primary group-hover:bg-primary group-hover:text-white'}`}>
                        <span className="material-symbols-outlined text-3xl">timer</span>
                      </div>
                      <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-1">Procrastination</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Hard to get started on tasks.</p>
                    </div>
                    {/* Option 2 */}
                    <div
                      onClick={() => setStudyStruggle('hard_concepts')}
                      className={`flex flex-col p-6 rounded-xl border-2 cursor-pointer transition-all group active:scale-95 ${studyStruggle === 'hard_concepts' ? 'border-primary bg-primary/5 dark:bg-primary/10 relative overflow-hidden' : 'border-slate-200 dark:border-[#3b4354] bg-white dark:bg-[#1c1f27] hover:border-primary/50'}`}
                    >
                      {studyStruggle === 'hard_concepts' && (
                        <div className="absolute top-3 right-3 text-primary">
                          <span className="material-symbols-outlined fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        </div>
                      )}
                      <div className={`size-12 rounded-lg flex items-center justify-center mb-4 transition-colors ${studyStruggle === 'hard_concepts' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-primary group-hover:bg-primary group-hover:text-white'}`}>
                        <span className="material-symbols-outlined text-3xl">psychology</span>
                      </div>
                      <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-1">Hard Concepts</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Complex topics take too long to grasp.</p>
                    </div>
                    {/* Option 3 */}
                    <div
                      onClick={() => setStudyStruggle('boring_reading')}
                      className={`flex flex-col p-6 rounded-xl border-2 cursor-pointer transition-all group active:scale-95 ${studyStruggle === 'boring_reading' ? 'border-primary bg-primary/5 dark:bg-primary/10 relative overflow-hidden' : 'border-slate-200 dark:border-[#3b4354] bg-white dark:bg-[#1c1f27] hover:border-primary/50'}`}
                    >
                       {studyStruggle === 'boring_reading' && (
                        <div className="absolute top-3 right-3 text-primary">
                          <span className="material-symbols-outlined fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        </div>
                      )}
                      <div className={`size-12 rounded-lg flex items-center justify-center mb-4 transition-colors ${studyStruggle === 'boring_reading' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-primary group-hover:bg-primary group-hover:text-white'}`}>
                        <span className="material-symbols-outlined text-3xl">auto_stories</span>
                      </div>
                      <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-1">Boring Reading</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Dense textbooks are draining.</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-300 dark:border-[#3b4354] text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={step === 1 ? !major : !studyStruggle}
                className="flex items-center gap-2 px-10 py-3 rounded-lg bg-primary text-white font-bold hover:bg-blue-600 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {step === 2 ? 'Finish' : 'Continue'}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </main>
        {/* Minimal Footer */}
        <footer className="py-10 px-6 text-center text-slate-400 dark:text-slate-600 text-xs">
          <p>© 2024 APEX Learning AI. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link className="hover:underline" href="#">Privacy Policy</Link>
            <Link className="hover:underline" href="#">Terms of Service</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
