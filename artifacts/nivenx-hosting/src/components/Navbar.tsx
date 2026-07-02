import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { LANGUAGES } from "@/lib/i18n";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const [location] = useLocation();
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/plans", label: t("nav.plans") },
    { href: "/announcements", label: t("nav.news") },
    { href: "/knowledgebase", label: t("nav.support") },
  ];

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) ?? LANGUAGES[0];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#060612]/95 border-b border-white/10 backdrop-blur-xl shadow-xl shadow-black/20" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2.5 cursor-pointer group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center shadow-lg shadow-violet-900/50 group-hover:shadow-violet-700/50 transition-shadow">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
              <span className="font-black text-white text-lg tracking-tight">
                Niven<span className="text-violet-400">X</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href}>
                <span className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${location === l.href ? "text-white bg-white/10" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                  {l.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Selector */}
            <div ref={langRef} className="relative">
              <button onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all">
                <span>{currentLang.flag}</span>
                <span className="font-medium">{currentLang.code.toUpperCase()}</span>
                <svg className={`w-3.5 h-3.5 transition-transform ${langOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-[#0d0d1e] border border-white/15 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50 py-1">
                  {LANGUAGES.map(lang => (
                    <button key={lang.code}
                      onClick={() => { i18n.changeLanguage(lang.code); setLangOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/8 transition-colors ${i18n.language === lang.code ? "text-violet-400 bg-violet-500/10" : "text-gray-400 hover:text-white"}`}>
                      <span>{lang.flag}</span>
                      <span className="font-medium">{lang.label}</span>
                      {i18n.language === lang.code && (
                        <svg className="w-3.5 h-3.5 ml-auto text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/dashboard">
                  <span className="px-4 py-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors cursor-pointer">
                    {t("nav.dashboard")}
                  </span>
                </Link>
                {isAdmin && (
                  <Link href="/admin">
                    <span className="px-3 py-2 text-sm font-semibold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 rounded-lg transition-colors cursor-pointer">
                      Admin
                    </span>
                  </Link>
                )}
                <button onClick={logout} className="px-3 py-2 text-sm text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                  {t("nav.logout")}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <span className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors cursor-pointer">{t("nav.login")}</span>
                </Link>
                <Link href="/register">
                  <span className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 rounded-lg transition-all shadow-lg shadow-violet-900/30 cursor-pointer">
                    {t("nav.register")}
                  </span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile lang */}
            <button onClick={() => setLangOpen(!langOpen)}
              className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm">
              {currentLang.flag}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#060612]/98 border-t border-white/10 backdrop-blur-xl px-4 py-4 space-y-1">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href}>
              <span onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${location === l.href ? "text-white bg-white/10" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                {l.label}
              </span>
            </Link>
          ))}
          <div className="pt-3 border-t border-white/10 space-y-2">
            {/* Mobile language picker */}
            <div className="px-2">
              <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">Language</p>
              <div className="grid grid-cols-3 gap-1">
                {LANGUAGES.map(lang => (
                  <button key={lang.code}
                    onClick={() => { i18n.changeLanguage(lang.code); setMenuOpen(false); }}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs transition-colors ${i18n.language === lang.code ? "bg-violet-600/20 text-violet-300 border border-violet-500/30" : "bg-white/5 text-gray-400 hover:text-white"}`}>
                    <span>{lang.flag}</span>
                    <span className="truncate">{lang.code.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>
            {user ? (
              <>
                <Link href="/dashboard"><span onClick={() => setMenuOpen(false)} className="block w-full text-center px-4 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-colors cursor-pointer">{t("nav.dashboard")}</span></Link>
                <button onClick={() => { logout(); setMenuOpen(false); }} className="block w-full text-center px-4 py-2.5 text-gray-400 hover:text-white text-sm transition-colors">{t("nav.logout")}</button>
              </>
            ) : (
              <>
                <Link href="/login"><span onClick={() => setMenuOpen(false)} className="block w-full text-center px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-colors cursor-pointer">{t("nav.login")}</span></Link>
                <Link href="/register"><span onClick={() => setMenuOpen(false)} className="block w-full text-center px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-700 text-white font-semibold rounded-xl cursor-pointer">{t("nav.register")}</span></Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
