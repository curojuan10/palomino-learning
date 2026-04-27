'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { logout } from '@/lib/auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  const navItems = [
    { label: 'Inicio', href: '/dashboard', icon: '🏠' },
    { label: 'Cursos', href: '/courses', icon: '📚' },
    { label: 'Mis compras', href: '/dashboard', icon: '🛒' },
    { label: 'Certificados', href: '#', icon: '🏆', disabled: true },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Palomino</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-slate-800 rounded"
        >
          ☰
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`w-64 bg-slate-900 border-r border-slate-800 p-6 fixed h-screen overflow-y-auto md:relative transition-transform ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          {/* Logo */}
          <div className="mb-8 hidden md:block">
            <h1 className="text-2xl font-bold">Palomino</h1>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 mb-12">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.disabled ? '#' : item.href}
                onClick={(e) => {
                  if (item.disabled) e.preventDefault();
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  item.disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : isActive(item.href)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-slate-800'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Section: My Account */}
          <div className="border-t border-slate-800 pt-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Cuenta
            </h3>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition mb-3"
            >
              <span className="text-xl">👤</span>
              <span>Mi perfil</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg transition"
            >
              <span className="text-xl">🚪</span>
              <span>Cerrar sesión</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full">
          <div className="min-h-screen bg-slate-950 p-6 md:p-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
