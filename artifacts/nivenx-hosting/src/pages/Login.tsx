import { SignIn } from "@clerk/react";
import Navbar from "@/components/Navbar";

export default function Login() {
  const base = import.meta.env.BASE_URL ?? "/";
  const origin = window.location.origin;

  return (
    <div className="min-h-screen bg-[#030307] text-slate-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden antialiased relative">
      <Navbar />
      
      {/* Background Premium Glow Effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.05),transparent_60%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      </div>

      <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-12 relative z-10">
        <div className="w-full max-w-[440px]">
          {/* Brand Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-105">
              <img 
                src="https://www.image2url.com/r2/default/images/1782962523208-e3fe34b6-77ca-43f9-8588-6e54ed1441f8.png" 
                alt="NivenX Logo" 
                className="h-14 object-contain filter drop-shadow-[0_0_12px_rgba(99,102,241,0.3)]"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome to <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">NivenX</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1.5 font-light">Sign in with your enterprise credentials</p>
          </div>

          {/* Clerk Component Integration */}
          <SignIn
            routing="hash"
            signUpUrl={`${origin}${base}register`}
            fallbackRedirectUrl={`${origin}${base}dashboard`}
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-slate-950/40 border border-slate-900 rounded-2xl shadow-2xl shadow-slate-950/50 backdrop-blur-xl w-full p-1",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                header: "hidden",
                socialButtonsBlockButton: "bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl transition-all duration-200 font-medium h-11 shadow-sm",
                socialButtonsBlockButtonText: "text-slate-300 font-medium text-sm tracking-wide",
                socialButtonsProviderIcon: "w-5 h-5",
                dividerLine: "bg-slate-900",
                dividerText: "text-slate-600 text-[11px] font-bold tracking-wider uppercase",
                formFieldLabel: "text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1.5",
                formFieldInput: "bg-slate-950/60 border-slate-800/80 text-white rounded-xl h-11 focus:border-indigo-500/50 focus:bg-slate-950 transition-all outline-none text-sm px-4 shadow-inner",
                formButtonPrimary: "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl font-semibold text-sm tracking-wide h-11 shadow-lg shadow-indigo-950/50 hover:shadow-indigo-500/10 transition-all duration-300",
                footerActionLink: "text-indigo-400 hover:text-indigo-300 font-semibold transition-colors text-sm",
                footerActionText: "text-slate-500 text-sm font-light",
                identityPreviewEditButton: "text-indigo-400 hover:text-indigo-300",
                formResendCodeLink: "text-indigo-400 hover:text-indigo-300",
                alertText: "text-rose-400 text-sm",
                alert: "bg-rose-500/5 border border-rose-500/20 rounded-xl p-3",
                otpCodeFieldInput: "bg-slate-950/60 border-slate-800 text-white rounded-xl h-12 text-lg focus:border-indigo-500/50",
                backLink: "text-indigo-400 hover:text-indigo-300 text-sm font-medium",
                alternativeMethodsBlockButton: "bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-300 rounded-xl h-11 transition-all",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
                  }
