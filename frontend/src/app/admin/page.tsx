'use client';

import { useEffect, useState } from 'react';
import { api } from 'src/lib/api';

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [balances, setBalances] = useState<any[]>([]);

  useEffect(() => {
    api('/admin/users').then(setUsers);
    api('/admin/balances').then(setBalances);
  }, []);

  return (
    <section className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl bg-casino-card p-6">
        <h2 className="text-2xl font-semibold">Usuarios</h2>
        {users.map((u) => (
          <p key={u.id} className="mt-2 text-sm">{u.email} - {u.role}</p>
        ))}
      </div>
      <div className="rounded-2xl bg-casino-card p-6">
        <h2 className="text-2xl font-semibold">Balances</h2>
        {balances.map((b) => (
          <p key={b.userId} className="mt-2 text-sm">{b.email}: ${b.balance.toFixed(2)}</p>
        ))}
      </div>
    </section>
  );
}
