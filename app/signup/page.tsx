import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center p-4 font-display">
      <SignUp routing="path" path="/signup" forceRedirectUrl="/onboarding" />
    </div>
  );
}
