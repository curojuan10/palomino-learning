'use client';

import { useAuth } from '@/lib/useAuth';
import { getUserRole } from '@/lib/auth';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface UserProfile {
  nombre: string;
  rol_id: number;
}

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      const loadData = async () => {
        try {
          const roleResult = await getUserRole(user.id);
          setProfile({
            nombre: user.user_metadata?.nombre || user.email || 'Usuario',
            rol_id: roleResult.rol_id,
          });
        } catch (error) {
          console.error('Error loading profile:', error);
        } finally {
          setProfileLoading(false);
        }
      };
      loadData();
    }
  }, [isAuthenticated, user]);

  if (loading || profileLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-2xl font-bold text-gray-300">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-6">Acceso Denegado</h1>
          <p className="text-gray-400 mb-8">Debes iniciar sesión para ver tu dashboard</p>
          <Link href="/auth/login" className="inline-block px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800">
            Ir a Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Bienvenida Section */}
      <div className="mb-12 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-slate-800 rounded-xl p-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-5xl font-black text-white mb-2">
              Bienvenido, {profile?.nombre} 👋
            </h1>
            <p className="text-gray-400">
              Continúa aprendiendo o explora nuestros nuevos cursos disponibles para ti.
            </p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-black ${profile?.rol_id === 1 ? 'text-red-400' : 'text-green-400'}`}>
              {profile?.rol_id === 1 ? 'ADMIN' : 'CLIENTE'}
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Link
            href="/courses"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            Ver todos los cursos
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="text-sm text-gray-500 uppercase tracking-wider mb-2">Rol</div>
          <div className={`text-2xl font-black ${profile?.rol_id === 1 ? 'text-red-400' : 'text-green-400'}`}>
            {profile?.rol_id === 1 ? 'ADMINISTRADOR' : 'CLIENTE'}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="text-sm text-gray-500 uppercase tracking-wider mb-2">Estado</div>
          <div className="text-2xl font-black text-green-400">Activo</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="text-sm text-gray-500 uppercase tracking-wider mb-2">Acceso</div>
          <div className="text-2xl font-black text-blue-400">Completo</div>
        </div>
      </div>

      {/* Empty State */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
        <div className="text-6xl mb-4">📚</div>
        <h2 className="text-2xl font-bold text-white mb-2">Bienvenido a tu Dashboard</h2>
        <p className="text-gray-400 mb-6">
          Explora nuestro catálogo de cursos y comienza tu aprendizaje hoy.
        </p>
        <Link
          href="/courses"
          className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
        >
          Ir al Catálogo de Cursos
        </Link>
      </div>
    </div>
  );
}
