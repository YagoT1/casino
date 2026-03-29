'use client';

import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="flex items-center justify-between rounded-xl bg-casino-card px-6 py-4">
      <Link href="/" className="text-xl font-bold text-casino-accent">
        Neon Casino
      </Link>
      <div className="flex gap-4 text-sm">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/games/slot-machine">Slots</Link>
        <Link href="/games/blackjack">Blackjack</Link>
        <Link href="/admin">Admin</Link>
      </div>
    </nav>
  );
}
