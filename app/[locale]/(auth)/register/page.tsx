/**
 * Register Page
 */

import { RegisterForm } from '@/components/auth/RegisterForm';
import { PageShell } from '@/components/common/PageShell';

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-indigo-100 p-4 md:p-8">
      <div className="mx-auto w-full max-w-lg">
        <PageShell title="Create Your Account" subtitle="Join VenkatAI and get started with your creative studio" className="overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-2xl backdrop-blur-xl p-6 md:p-8 animate-slide-in-up">
          <RegisterForm />
        </PageShell>
      </div>
    </main>
  );
}
