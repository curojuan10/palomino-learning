'use client';

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="min-h-screen bg-slate-950 p-6 md:p-12">
        {children}
      </main>
    </div>
  );
}
