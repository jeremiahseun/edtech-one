import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center p-4 font-display">
      <SignIn routing="path" path="/login" forceRedirectUrl="/dashboard" />
    </div>
  );
}
