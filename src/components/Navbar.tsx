"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, LogIn, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";
import { getUnreadCount } from "@/lib/db";
import Button from "@/components/ui/Button";
import AnonymousBadge from "@/components/ui/AnonymousBadge";

export default function Navbar() {
  const { user, anonymousId, loading, signInWithGoogle, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) { setUnreadCount(0); return; }
    const fetchCount = async () => {
      try { setUnreadCount(await getUnreadCount(user.id)); } catch {}
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <header className="sticky top-0 z-40 bg-neutral-white border-b-2 border-neutral-black">
      <div className="max-w-[680px] mx-auto px-4 sm:px-0">
        <div className="flex items-center justify-between h-14">
          {/* Logo — bold, ownable */}
          <Link href="/" className="flex items-center gap-1.5 no-underline group">
            <span className="inline-flex items-center justify-center w-8 h-8 bg-primary border-2 border-neutral-black rounded-[var(--radius-badge)] shadow-[2px_2px_0px_#000] text-neutral-black font-black text-sm group-hover:-translate-y-0.5 transition-transform">
              C
            </span>
            <span className="text-h2 font-black tracking-tight text-neutral-black">
              Cari-in
            </span>
          </Link>

          {/* Desktop actions */}
          <div className="hidden sm:flex items-center gap-2">
            {user ? (
              <>
                <Link
                  href="/notifications"
                  className="relative p-2 rounded-[var(--radius-badge)] hover:bg-neutral-gray transition-colors"
                  aria-label="Notifikasi"
                >
                  <Bell size={20} strokeWidth={2.5} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-danger text-neutral-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-neutral-white px-1">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>
                <div className="w-px h-5 bg-neutral-black/10" />
                <AnonymousBadge anonymousId={anonymousId ?? "???"} />
                <button
                  onClick={signOut}
                  className="p-2 rounded-[var(--radius-badge)] hover:bg-neutral-gray transition-colors cursor-pointer"
                  aria-label="Logout"
                >
                  <LogOut size={18} strokeWidth={2.5} />
                </button>
              </>
            ) : (
              <Button variant="primary" size="sm" onClick={signInWithGoogle} disabled={loading}>
                <LogIn size={16} strokeWidth={2.5} />
                Masuk
              </Button>
            )}
          </div>

          {/* Mobile menu */}
          <button
            className="sm:hidden p-2 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden border-t-2 border-neutral-black bg-neutral-white">
          <div className="max-w-[680px] mx-auto px-4 py-3 space-y-3">
            {user ? (
              <>
                <div className="flex items-center justify-between">
                  <AnonymousBadge anonymousId={anonymousId ?? "???"} />
                  <Link href="/notifications" className="relative p-2" aria-label="Notifikasi">
                    <Bell size={22} strokeWidth={2.5} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-danger text-neutral-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-neutral-white px-1">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Link>
                </div>
                <div className="border-t-2 border-neutral-black/10" />
                <button
                  onClick={() => { signOut(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-[var(--radius-badge)] hover:bg-neutral-gray transition-colors cursor-pointer text-left"
                >
                  <LogOut size={18} strokeWidth={2.5} />
                  <span className="font-bold text-sm">Keluar</span>
                </button>
              </>
            ) : (
              <Button variant="primary" size="sm" className="w-full" onClick={signInWithGoogle} disabled={loading}>
                <LogIn size={16} strokeWidth={2.5} />
                Masuk dengan Google
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
