import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X, Server, Zap } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const [location] = useLocation();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/plans", label: "Plans" },
    { href: "/announcements", label: "News" },
    { href: "/knowledgebase", label: "Support" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Server className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">
              NivenX <span className="text-purple-400">Hosting</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location === link.href
                    ? "text-purple-400 bg-purple-500/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  size="sm"
                  onClick={logout}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-black/90 px-4 py-4 space-y-2">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/5 text-sm"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-white/10 space-y-2">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full text-gray-300">Dashboard</Button>
                </Link>
                <Button size="sm" className="w-full bg-gradient-to-r from-purple-600 to-blue-600" onClick={() => { logout(); setOpen(false); }}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full text-gray-300">Login</Button>
                </Link>
                <Link href="/register" onClick={() => setOpen(false)}>
                  <Button size="sm" className="w-full bg-gradient-to-r from-purple-600 to-blue-600">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
