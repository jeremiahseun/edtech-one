import { create } from 'zustand';

interface OnboardingState {
  step: number;
  major: string;
  studyStruggle: string;
  setStep: (step: number) => void;
  setMajor: (major: string) => void;
  setStudyStruggle: (struggle: string) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  step: 1,
  major: '',
  studyStruggle: '',
  setStep: (step) => set({ step }),
  setMajor: (major) => set({ major }),
  setStudyStruggle: (studyStruggle) => set({ studyStruggle }),
}));
