import { SignIn } from "@clerk/react";
import Navbar from "@/components/Navbar";

export default function Login() {
  const base = import.meta.env.BASE_URL ?? "/";
  const origin = window.location.origin;

  return (
    <div className="min-h-screen bg-[#060612] text-white">
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-800 mb-5 shadow-2xl shadow-violet-900/50">
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
            <h1 className="text-3xl font-black tracking-tight">Welcome back</h1>
            <p className="text-gray-500 mt-2">Sign in to your account</p>
          </div>

          <SignIn
            routing="hash"
            signUpUrl={`${origin}${base}register`}
            fallbackRedirectUrl={`${origin}${base}dashboard`}
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-white/[0.04] border border-white/10 rounded-2xl shadow-2xl backdrop-blur w-full",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                header: "hidden",
                socialButtonsBlockButton: "bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/25 text-gray-300 hover:text-white rounded-xl transition-all font-medium",
                socialButtonsBlockButtonText: "text-gray-300 font-medium",
                dividerLine: "bg-white/10",
                dividerText: "text-gray-600 text-xs",
                formFieldLabel: "text-gray-500 text-xs font-semibold uppercase tracking-wider",
                formFieldInput: "bg-white/5 border-white/15 text-white rounded-xl focus:border-violet-500/60 outline-none",
                formButtonPrimary: "bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 rounded-xl font-semibold shadow-lg shadow-violet-900/40",
                footerActionLink: "text-violet-400 hover:text-violet-300 font-semibold",
                footerActionText: "text-gray-600",
                identityPreviewEditButton: "text-violet-400",
                formResendCodeLink: "text-violet-400",
                alertText: "text-red-400",
                alert: "bg-red-500/10 border-red-500/30 rounded-xl",
                otpCodeFieldInput: "bg-white/5 border-white/20 text-white rounded-xl",
                backLink: "text-violet-400",
                alternativeMethodsBlockButton: "bg-white/5 hover:bg-white/10 border border-white/15 text-gray-300 rounded-xl",
              },

            }}
          />
        </div>
      </div>
    </div>
  );
}
