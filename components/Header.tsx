'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { logout } from '@/lib/auth';
import { useState } from 'react';

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    setLogoutLoading(true);
    await logout();
    router.push('/');
  };

  const getInitials = (email: string) => {
    if (!email) return 'JR';
    const parts = email.split('@')[0].split('.');
    return (parts[0][0] + (parts[1]?.[0] || parts[0][1] || '')).toUpperCase();
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-slate-900 border-b border-slate-800 z-40 h-20 flex items-center">
      <div className="w-full px-6 flex items-center justify-between ml-64">
        {/* Logo en Header */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white hover:text-blue-400 transition">
          <span className="text-2xl">🎓</span>
          <span>Palomino Learning Center</span>
        </Link>

        {/* Tabs de navegación */}
        <nav className="hidden md:flex gap-8 mx-auto">
          <Link href="/courses" className="text-gray-300 hover:text-white transition text-sm font-medium">
            Cursos
          </Link>
          <Link href="#" className="text-gray-300 hover:text-white transition text-sm font-medium">
            Asesoría
          </Link>
          <Link href="/dashboard" className="text-gray-300 hover:text-white transition text-sm font-medium">
            Mis compras
          </Link>
        </nav>

        {/* Right section: Search, Bell, Button, Profile */}
        <div className="flex items-center gap-6">
          {/* Search */}
          <div className="hidden lg:flex items-center bg-slate-800 rounded-lg px-4 py-2 max-w-xs">
            <input
              type="text"
              placeholder="Busca cursos o asesorías..."
              className="bg-transparent text-white text-sm placeholder-gray-500 outline-none w-full"
            />
            <span className="text-gray-500">🔍</span>
          </div>

          {/* Bell Notification */}
          <button className="relative text-gray-300 hover:text-white transition">
            <span className="text-xl">🔔</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Acceso Total Button */}
          {!user && (
            <Link
              href="/auth/register"
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold rounded-lg transition text-sm"
            >
              ⭐ Acceso Total
            </Link>
          )}

          {/* Profile Menu */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
              >
                {getInitials(user.email || '')}
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg border border-slate-700 shadow-lg">
                  <div className="p-4 border-b border-slate-700">
                    <p className="text-white font-semibold text-sm">{user.email}</p>
                  </div>
                  <nav className="py-2">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-gray-300 hover:bg-slate-700 text-sm transition"
                    >
                      👤 Mi perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={logoutLoading}
                      className="w-full text-left px-4 py-2 text-gray-300 hover:bg-red-600 hover:text-white text-sm transition disabled:opacity-50"
                    >
                      🚪 {logoutLoading ? 'Cerrando...' : 'Logout'}
                    </button>
                  </nav>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
