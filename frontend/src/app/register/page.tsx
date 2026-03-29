'use client';

import { FormEvent, useState } from 'react';
import { api } from 'src/lib/api';

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '', fullName: '', birthDate: '1990-01-01' });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await api('/auth/register', { method: 'POST', body: JSON.stringify(form) });
    localStorage.setItem('token', res.accessToken);
    window.location.href = '/dashboard';
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-md space-y-4 rounded-2xl bg-casino-card p-6">
      <h1 className="text-2xl font-semibold">Crear cuenta</h1>
      <input className="w-full rounded bg-slate-800 p-3" placeholder="Nombre" onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
      <input className="w-full rounded bg-slate-800 p-3" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input className="w-full rounded bg-slate-800 p-3" type="password" placeholder="Contraseña" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <input className="w-full rounded bg-slate-800 p-3" type="date" onChange={(e) => setForm({ ...form, birthDate: e.target.value })} />
      <button className="w-full rounded bg-casino-accent p-3 font-semibold text-black">Registrarme</button>
    </form>
  );
}
