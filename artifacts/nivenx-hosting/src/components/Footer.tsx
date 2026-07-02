import { Link } from "wouter";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/8 bg-[#06060f] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center shadow-lg shadow-violet-900/40">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
              <span className="font-black text-white text-lg tracking-tight">
                Niven<span className="text-violet-400">X</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-6">{t("footer.tagline")}</p>
            {/* Social */}
            <div className="flex gap-2">
              {[
                { icon: "𝕏", href: "#", title: "Twitter" },
                { icon: "💬", href: "#", title: "Discord" },
                { icon: "▶", href: "#", title: "YouTube" },
              ].map(s => (
                <a key={s.title} href={s.href} title={s.title}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 flex items-center justify-center text-gray-500 hover:text-white transition-all text-sm">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wide">{t("footer.services")}</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li><Link href="/plans"><span className="hover:text-violet-400 transition-colors cursor-pointer">{t("footer.minecraft")}</span></Link></li>
              <li><Link href="/plans"><span className="hover:text-violet-400 transition-colors cursor-pointer">{t("footer.vps")}</span></Link></li>
              <li><Link href="/plans"><span className="hover:text-violet-400 transition-colors cursor-pointer">{t("footer.game")}</span></Link></li>
              <li><Link href="/plans"><span className="hover:text-violet-400 transition-colors cursor-pointer">{t("footer.web")}</span></Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wide">{t("footer.company")}</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li><Link href="/announcements"><span className="hover:text-violet-400 transition-colors cursor-pointer">{t("footer.announcements")}</span></Link></li>
              <li><Link href="/knowledgebase"><span className="hover:text-violet-400 transition-colors cursor-pointer">{t("footer.kb")}</span></Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wide">{t("footer.account")}</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li><Link href="/login"><span className="hover:text-violet-400 transition-colors cursor-pointer">{t("nav.login")}</span></Link></li>
              <li><Link href="/register"><span className="hover:text-violet-400 transition-colors cursor-pointer">{t("nav.register")}</span></Link></li>
              <li><Link href="/dashboard"><span className="hover:text-violet-400 transition-colors cursor-pointer">{t("nav.dashboard")}</span></Link></li>
              <li><Link href="/dashboard/tickets"><span className="hover:text-violet-400 transition-colors cursor-pointer">{t("footer.support")}</span></Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            © {year} NivenX Hosting. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 font-medium">{t("footer.operational")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
