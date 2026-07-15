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
      try {
        const count = await getUnreadCount(user.id);
        setUnreadCount(count);
      } catch {}
    };

    fetchCount();
    // Poll setiap 30 detik
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <header className="sticky top-0 z-40 bg-neutral-white border-b-[var(--border-brutal)]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-h2 font-bold text-primary no-underline">
          Cari-in
        </Link>

        {/* Desktop */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <>
              <Link href="/notifications" className="relative p-2 cursor-pointer" aria-label="Notifications">
                <Bell size={24} strokeWidth={2.5} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-danger text-neutral-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-neutral-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
              <AnonymousBadge anonymousId={anonymousId ?? "???"} />
              <Button variant="secondary" className="!px-3 !py-2 text-sm" onClick={signOut}>
                <LogOut size={18} strokeWidth={2.5} />
              </Button>
            </>
          ) : (
            <Button variant="primary" className="!px-4 !py-2 text-sm" onClick={signInWithGoogle} disabled={loading}>
              <LogIn size={18} strokeWidth={2.5} className="mr-1" />
              Login
            </Button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="sm:hidden p-2 cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden border-t-[var(--border-brutal)] bg-neutral-white px-4 py-3 space-y-3">
          {user ? (
            <>
              <div className="flex items-center justify-between">
                <AnonymousBadge anonymousId={anonymousId ?? "???"} />
                <Link href="/notifications" className="relative p-2" aria-label="Notifications">
                  <Bell size={24} strokeWidth={2.5} />
                </Link>
              </div>
              <Button variant="secondary" className="w-full !py-2 text-sm" onClick={() => { signOut(); setMenuOpen(false); }}>
                <LogOut size={18} strokeWidth={2.5} className="mr-1" />
                Logout
              </Button>
            </>
          ) : (
            <Button variant="primary" className="w-full !py-2 text-sm" onClick={signInWithGoogle} disabled={loading}>
              <LogIn size={18} strokeWidth={2.5} className="mr-1" />
              Login dengan Google
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
