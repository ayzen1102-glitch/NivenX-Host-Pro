import { Link } from "wouter";
import { Server } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/40 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <Server className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">NivenX Hosting</span>
            </div>
            <p className="text-gray-500 text-sm">Premium hosting powered by NVMe SSDs and Ryzen CPUs. Fast, reliable, secure.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Services</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/plans" className="hover:text-purple-400 transition-colors">Game Servers</Link></li>
              <li><Link href="/plans" className="hover:text-purple-400 transition-colors">VPS Hosting</Link></li>
              <li><Link href="/plans" className="hover:text-purple-400 transition-colors">Minecraft Hosting</Link></li>
              <li><Link href="/plans" className="hover:text-purple-400 transition-colors">Web Hosting</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/announcements" className="hover:text-purple-400 transition-colors">Announcements</Link></li>
              <li><Link href="/knowledgebase" className="hover:text-purple-400 transition-colors">Knowledgebase</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Account</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/login" className="hover:text-purple-400 transition-colors">Login</Link></li>
              <li><Link href="/register" className="hover:text-purple-400 transition-colors">Register</Link></li>
              <li><Link href="/dashboard" className="hover:text-purple-400 transition-colors">Dashboard</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">© 2024 NivenX Hosting. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-gray-500 text-sm">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
