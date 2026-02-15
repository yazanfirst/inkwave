'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: form.get('username'), password: form.get('password') })
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.reason || 'Failed');
      return;
    }
    router.push('/admin');
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-white/20 bg-black/60 p-6">
      <h1 className="mb-4 text-2xl font-bold">Admin Login</h1>
      <form onSubmit={submit} className="space-y-3">
        <input name="username" placeholder="Username" className="w-full rounded bg-white/10 p-2" required />
        <input name="password" type="password" placeholder="Password" className="w-full rounded bg-white/10 p-2" required />
        {error && <p className="text-sm text-red-300">{error}</p>}
        <button className="w-full rounded bg-inkwave-gradient p-2 font-semibold text-black">Login</button>
      </form>
    </div>
  );
}
