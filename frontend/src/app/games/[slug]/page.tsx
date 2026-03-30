'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { api } from 'src/lib/api';

export default function GamePage() {
  const params = useParams<{ slug: string }>();
  const [amount, setAmount] = useState(10);
  const [strategy, setStrategy] = useState<'hit' | 'stand'>('stand');
  const [result, setResult] = useState<string>('');

  const play = async () => {
    const isSlot = params.slug === 'slot-machine';
    const res = await api(isSlot ? '/games/slot/play' : '/games/blackjack/play', {
      method: 'POST',
      body: JSON.stringify(isSlot ? { amount } : { amount, strategy }),
    });
    setResult(JSON.stringify(res.result));
  };

  return (
    <section className="rounded-2xl bg-casino-card p-6">
      <h1 className="text-3xl font-bold capitalize">{params.slug?.replace('-', ' ')}</h1>
      <div className="mt-4 flex flex-wrap gap-3">
        <input type="number" className="rounded bg-slate-800 p-2" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        {params.slug === 'blackjack' && (
          <select className="rounded bg-slate-800 p-2" onChange={(e) => setStrategy(e.target.value as 'hit' | 'stand')}>
            <option value="stand">Stand</option>
            <option value="hit">Hit</option>
          </select>
        )}
        <button onClick={play} className="rounded bg-casino-accent px-4 py-2 font-semibold text-black">Apostar</button>
      </div>
      <pre className="mt-4 rounded bg-slate-900 p-4 text-xs">{result || 'Sin jugadas aún'}</pre>
    </section>
  );
}
