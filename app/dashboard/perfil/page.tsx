'use client';

import { useAuth } from '@/lib/useAuth';
import { getUserRole } from '@/lib/auth';
import { useEffect, useState } from 'react';

interface UserProfile {
  nombre: string;
  email: string;
  rol_id: number;
  fecha_registro: string;
}

export default function PerfilPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated || !user) {
      setDataLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        const roleResult = await getUserRole(user.id);
        const nombre = user.user_metadata?.nombre || user.user_metadata?.full_name || user.email || 'Usuario';
        
        setProfile({
          nombre: nombre,
          email: user.email || '',
          rol_id: roleResult.rol_id,
          fecha_registro: new Date(user.created_at || '').toLocaleDateString('es-ES'),
        });
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setDataLoading(false);
      }
    };

    loadProfile();
  }, [user, isAuthenticated, loading]);

  if (loading || dataLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Debes iniciar sesión para ver tu perfil</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
        <h1 className="text-3xl font-black text-white mb-2">👤 Mi Perfil</h1>
        <p className="text-gray-400">Información de tu cuenta</p>
      </div>

      {/* Profile Card */}
      <div className="max-w-2xl">
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          {/* Header del card */}
          <div className="bg-linear-to-r from-blue-600 to-blue-700 h-32"></div>

          {/* Contenido */}
          <div className="px-8 pb-8 relative">
            {/* Avatar */}
            <div className="flex items-center gap-6 -mt-16 mb-8 relative z-10">
              <div className="w-24 h-24 bg-blue-600 rounded-full border-4 border-slate-900 flex items-center justify-center text-4xl shadow-lg">
                👤
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{profile.nombre}</h2>
                <p className="text-gray-400 text-sm">{profile.email}</p>
              </div>
            </div>

            {/* Profile Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Email */}
                <div className="bg-slate-800 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">📧 Correo Electrónico</p>
                  <p className="text-white font-semibold break-words">{profile.email}</p>
                </div>

                {/* Rol */}
                <div className="bg-slate-800 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">🎭 Tipo de Cuenta</p>
                  <p className="text-white font-semibold">
                    {profile.rol_id === 1 ? '👨‍💼 Administrador' : '👨‍🎓 Cliente'}
                  </p>
                </div>

                {/* Fecha de Registro */}
                <div className="bg-slate-800 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">📅 Fecha de Registro</p>
                  <p className="text-white font-semibold">{profile.fecha_registro}</p>
                </div>

                {/* Estado */}
                <div className="bg-slate-800 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">✅ Estado</p>
                  <p className="text-green-400 font-semibold">Activo</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-6">
          <h3 className="text-lg font-bold text-white mb-4">ℹ️ Información de tu Cuenta</h3>
          <div className="space-y-3 text-gray-400 text-sm">
            <p>✅ Tu cuenta está completamente activa y verificada</p>
            <p>🔐 Acceso seguro con autenticación de Supabase</p>
            <p>📚 Tienes acceso a todos nuestros cursos disponibles</p>
            <p>💳 Puedes realizar compras de cursos en cualquier momento</p>
          </div>
        </div>
      </div>
    </div>
  );
}
