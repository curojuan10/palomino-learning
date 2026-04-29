'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { getUserProfile, logout } from '@/lib/auth';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      const result = await logout();
      if (result.success) {
        router.push('/');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  useEffect(() => {
    const checkAdmin = async () => {
      if (!loading) {
        if (!user) {
          router.push('/auth/login');
          return;
        }

        try {
          const result = await getUserProfile(user.id);
          if (result.success && result.profile?.rol_id === 1) {
            setIsAdmin(true);
          } else {
            router.push('/dashboard');
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          router.push('/dashboard');
        } finally {
          setChecking(false);
        }
      }
    };

    checkAdmin();
  }, [user, loading, router]);

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center text-white">
          <p className="text-2xl mb-4">❌ No tienes permisos para acceder aquí</p>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
          >
            Volver al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar Admin */}
      <aside className="w-56 sm:w-64 bg-slate-900 border-r border-slate-800 overflow-y-auto flex flex-col h-screen">
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-base sm:text-xl text-white mb-6 sm:mb-8 hover:text-blue-400 transition">
            <span className="text-xl sm:text-2xl">⚙️</span>
            <span>Admin</span>
          </Link>

          <nav className="space-y-2">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-gray-300 hover:bg-slate-800 transition text-sm sm:text-base"
            >
              <span>📊</span>
              <span>Dashboard</span>
            </Link>
            <Link
              href="/admin/cursos"
              className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-gray-300 hover:bg-slate-800 transition text-sm sm:text-base"
            >
              <span>📚</span>
              <span>Cursos</span>
            </Link>
            <Link
              href="/admin/pagos"
              className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-gray-300 hover:bg-slate-800 transition text-sm sm:text-base"
            >
              <span>💳</span>
              <span>Pagos</span>
            </Link>
            <Link
              href="/admin/estudiantes"
              className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-gray-300 hover:bg-slate-800 transition text-sm sm:text-base"
            >
              <span>👥</span>
              <span>Estudiantes</span>
            </Link>
          </nav>
        </div>

        <div className="p-4 sm:p-6 border-t border-slate-700 space-y-2">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-white font-semibold bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:opacity-50 transition text-xs sm:text-sm"
          >
            {loggingOut ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-red-300 border-t-white rounded-full animate-spin"></span>
                <span className="hidden sm:inline">Cerrando...</span>
              </>
            ) : (
              <>
                🚪 <span className="hidden sm:inline">Cerrar</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
