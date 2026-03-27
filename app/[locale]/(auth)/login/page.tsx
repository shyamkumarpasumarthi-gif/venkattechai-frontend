/**
 * Login Page
 */

import { LoginForm } from '@/components/auth/LoginForm';
import { PageShell } from '@/components/common/PageShell';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-indigo-100 p-4 md:p-8">
      <div className="mx-auto w-full max-w-lg">
        <PageShell title="Welcome back" subtitle="Sign in to continue to your dashboard" className="overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-2xl backdrop-blur-xl p-6 md:p-8 animate-slide-in-up">
          <LoginForm />
        </PageShell>
      </div>
    </main>
  );
}
