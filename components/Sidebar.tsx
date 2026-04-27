'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';

const menuItems = [
  { id: 'inicio', label: 'Inicio', href: '/', icon: '🏠' },
  { id: 'cursos', label: 'Cursos', href: '/courses', icon: '🎓', badge: '8' },
  { id: 'asesoria-menu', label: 'Asesoría de tesis', href: '#', icon: '📚' },
];

const mySpaceItems = [
  { id: 'mis-compras', label: 'Mis compras', href: '/dashboard', icon: '🛒' },
  { id: 'aula-virtual', label: 'Aula virtual', href: '#', icon: '🎯' },
  { id: 'mi-progreso', label: 'Mi progreso', href: '#', icon: '📊' },
  { id: 'certificados', label: 'Certificados', href: '#', icon: '🏆' },
];

const accountItems = [
  { id: 'mi-perfil', label: 'Mi perfil', href: '/dashboard', icon: '👤' },
  { id: 'soporte', label: 'Soporte', href: '#', icon: '💬' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 h-screen overflow-y-auto fixed left-0 top-0 pt-20">
      <div className="p-6">
        {/* Main Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-lg transition ${
                isActive(item.href)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </span>
              {item.badge && (
                <span className="text-xs bg-cyan-500 text-white px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Divider */}
        <div className="my-6 border-t border-slate-700"></div>

        {/* My Space */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider px-4 mb-3">
            Mi Espacio
          </p>
          <nav className="space-y-2">
            {mySpaceItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive(item.href)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-slate-800'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-slate-700"></div>

        {/* Account */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider px-4 mb-3">
            Cuenta
          </p>
          <nav className="space-y-2">
            {accountItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive(item.href)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-slate-800'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* CTA Button */}
        <div className="mt-8">
          <button className="w-full px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold rounded-lg transition flex items-center justify-center gap-2">
            ⭐ Acceso Total
          </button>
        </div>

        {/* Collapse hint */}
        <div className="mt-6 pt-4 border-t border-slate-700 text-center">
          <button className="text-xs text-gray-500 hover:text-gray-400 transition">
            ← Colapsar menú
          </button>
        </div>
      </div>
    </aside>
  );
}
