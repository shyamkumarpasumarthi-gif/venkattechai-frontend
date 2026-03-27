/**
 * Dashboard Layout
 */

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-fuchsia-50 p-4 md:p-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className="overflow-hidden rounded-3xl border border-white/50 bg-white/80 shadow-2xl backdrop-blur-xl p-6 md:p-8">
          {children}
        </div>
      </div>
    </main>
  );
}
