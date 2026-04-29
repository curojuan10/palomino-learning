'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { logout } from '@/lib/auth';
import { useAuth } from '@/lib/useAuth';
import { getUserRole } from '@/lib/auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, loading } = useAuth();
  const [userName, setUserName] = useState('Usuario');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (!loading && user && isAuthenticated) {
      // 🔧 BUG 5: Obtener nombre del usuario desde metadata o email
      const nombre = user.user_metadata?.nombre || user.user_metadata?.full_name || user.email || 'Usuario';
      const primerNombre = nombre.split(' ')[0]; // Obtener solo el primer nombre
      setUserName(primerNombre);
      setUserEmail(user.email || '');
      console.log('📝 Nombre del usuario:', primerNombre);
    }
  }, [user, loading, isAuthenticated]);

  const handleLogout = async () => {
    await logout();
    // 🔧 BUG 8: Redirigir al landing page, NO al login
    router.push('/');
  };

  // 🔧 Determinar tab activo basado en pathname (exacto, no parcial)
  const getActiveTab = () => {
    if (pathname === '/dashboard') return 'inicio';
    if (pathname === '/dashboard/cursos') return 'mis-cursos';
    if (pathname === '/dashboard/cursos-disponibles') return 'cursos-disponibles';
    if (pathname === '/dashboard/perfil') return 'perfil';
    return 'inicio';
  };

  const activeTab = getActiveTab();

  const navItems = [
    { id: 'inicio', label: 'Inicio', href: '/dashboard', icon: '🏠' },
    { id: 'mis-cursos', label: 'Mis Cursos', href: '/dashboard/cursos', icon: '📚' },
    { id: 'cursos-disponibles', label: 'Cursos Disponibles', href: '/dashboard/cursos-disponibles', icon: '🎓' },
    { id: 'certificados', label: 'Certificados', href: '#', icon: '🏆', disabled: true },
  ];

  const handleNavClick = (href: string) => {
    router.push(href);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">👤 {userName}</h1>
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
            <h1 className="text-2xl font-bold">👤 {userName}</h1>
            <p className="text-gray-400 text-sm mt-1">{userEmail}</p>
          </div>

          {/* Navigation Tabs */}
          <nav className="space-y-2 mb-12">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => !item.disabled && handleNavClick(item.href)}
                disabled={item.disabled}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${
                  item.disabled
                    ? 'opacity-50 cursor-not-allowed text-gray-500' // 🔧 Deshabilitado: gris y opaco
                    : activeTab === item.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' // 🔧 Active: azul destacado
                    : 'text-gray-400 hover:bg-slate-800 hover:text-gray-300' // Inactive: gris
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Section: My Account */}
          <div className="border-t border-slate-800 pt-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Cuenta
            </h3>
            <button
              onClick={() => router.push('/dashboard/perfil')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium mb-3 ${
                activeTab === 'perfil'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-gray-400 bg-slate-800/50 hover:bg-slate-800 hover:text-gray-300'
              }`}
            >
              <span className="text-xl">👤</span>
              <span>Mi perfil</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg transition font-medium"
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
