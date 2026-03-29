'use client';

import { useEffect, useState } from 'react';
import { api } from 'src/lib/api';

type Entry = { id: string; type: string; direction: string; amount: string; createdAt: string };

export default function DashboardPage() {
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState<Entry[]>([]);
  const [amount, setAmount] = useState(100);

  const refresh = async () => {
    const b = await api('/wallet/balance');
    const h = await api('/wallet/history');
    setBalance(b.balance);
    setHistory(h);
  };

  useEffect(() => {
    refresh();
  }, []);

  const payment = async (type: 'deposit' | 'withdrawal') => {
    await api('/payments', { method: 'POST', body: JSON.stringify({ type, amount }) });
    refresh();
  };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-casino-card p-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-xl">Balance: ${balance.toFixed(2)}</p>
        <div className="mt-4 flex gap-3">
          <input type="number" className="rounded bg-slate-800 p-2" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
          <button className="rounded bg-emerald-500 px-4 py-2 text-black" onClick={() => payment('deposit')}>Depositar</button>
          <button className="rounded bg-rose-500 px-4 py-2" onClick={() => payment('withdrawal')}>Retirar</button>
        </div>
      </div>

      <div className="rounded-2xl bg-casino-card p-6">
        <h2 className="text-2xl font-semibold">Ledger</h2>
        <div className="mt-4 space-y-2">
          {history.map((tx) => (
            <div key={tx.id} className="flex justify-between rounded bg-slate-900 p-3 text-sm">
              <span>{tx.type} / {tx.direction}</span>
              <span>${tx.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
