'use client';

import { FormEvent, useState } from 'react';
import { api } from 'src/lib/api';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('player@casino.dev');
  const [password, setPassword] = useState('Player1234!');
  const router = useRouter();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('token', res.accessToken);
    router.push('/dashboard');
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-md space-y-4 rounded-2xl bg-casino-card p-6">
      <h1 className="text-2xl font-semibold">Iniciar sesión</h1>
      <input className="w-full rounded bg-slate-800 p-3" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input
        className="w-full rounded bg-slate-800 p-3"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="w-full rounded bg-casino-accent p-3 font-semibold text-black">Entrar</button>
    </form>
  );
}
