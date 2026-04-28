'use client';

import { useAuth } from '@/lib/useAuth';
import { getUserRole } from '@/lib/auth';
import { obtenerComprasUsuario } from '@/lib/compras';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface UserProfile {
  nombre: string;
  rol_id: number;
}

const estadoBadge: Record<string, { label: string; class: string }> = {
  ACTIVO:    { label: '✅ Activo',    class: 'bg-green-900 text-green-200' },
  PENDIENTE: { label: '⏳ Pendiente', class: 'bg-yellow-900 text-yellow-200' },
  BLOQUEADO: { label: '❌ Bloqueado', class: 'bg-red-900 text-red-200' },
};

const pagoBadge: Record<string, { label: string; class: string }> = {
  APROBADO:  { label: '✅ Aprobado',  class: 'bg-green-900 text-green-200' },
  PENDIENTE: { label: '⏳ En revisión', class: 'bg-yellow-900 text-yellow-200' },
  RECHAZADO: { label: '❌ Rechazado', class: 'bg-red-900 text-red-200' },
};

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [compras, setCompras] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated || !user) {
      setDataLoading(false);
      return;
    }

    const load = async () => {
      try {
        const [roleResult, comprasData] = await Promise.all([
          getUserRole(user.id),
          obtenerComprasUsuario(user.id),
        ]);
        setProfile({
          nombre: user.user_metadata?.nombre || user.email || 'Usuario',
          rol_id: roleResult.rol_id,
        });
        setCompras(comprasData || []);
      } catch {
        // silent
      } finally {
        setDataLoading(false);
      }
    };
    load();
  }, [isAuthenticated, user, loading]);

  if (loading || dataLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-96 text-center">
        <div>
          <p className="text-gray-400 mb-4">Debes iniciar sesión para ver tu dashboard</p>
          <Link href="/auth/login" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
            Ir a Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Bienvenida */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-black text-white mb-1">
            Hola, {profile?.nombre} 👋
          </h1>
          <p className="text-gray-400">Aquí puedes ver el estado de tus cursos y comprobantes.</p>
          <Link
            href="/courses"
            className="inline-block mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition"
          >
            Ver todos los cursos →
          </Link>
        </div>
        <span className={`text-sm font-bold px-3 py-1 rounded-full ${profile?.rol_id === 1 ? 'bg-purple-900 text-purple-200' : 'bg-blue-900 text-blue-200'}`}>
          {profile?.rol_id === 1 ? 'ADMIN' : 'CLIENTE'}
        </span>
      </div>

      {/* Mis Compras */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Mis Compras</h2>

        {compras.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <div className="text-5xl mb-4">🛒</div>
            <p className="text-gray-400 mb-6">Aún no has comprado ningún curso.</p>
            <Link
              href="/courses"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
              Explorar Cursos
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {compras.map((compra: any) => {
              const estadoInfo = estadoBadge[compra.estado] ?? { label: compra.estado, class: 'bg-slate-700 text-gray-300' };
              const pagoInfo = compra.pago
                ? (pagoBadge[compra.pago.estado] ?? { label: compra.pago.estado, class: 'bg-slate-700 text-gray-300' })
                : null;

              return (
                <div key={compra.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center gap-4">
                  {/* Imagen */}
                  {compra.curso?.imagen_url ? (
                    <img src={compra.curso.imagen_url} alt={compra.curso.titulo} className="w-24 h-16 object-cover rounded-lg shrink-0" />
                  ) : (
                    <div className="w-24 h-16 bg-slate-800 rounded-lg flex items-center justify-center text-3xl shrink-0">📚</div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-lg truncate">{compra.curso?.titulo ?? 'Curso'}</h3>
                    <p className="text-green-400 font-semibold text-sm">S/{compra.curso?.precio}</p>
                  </div>

                  {/* Estados */}
                  <div className="flex flex-wrap gap-2">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${estadoInfo.class}`}>
                      {estadoInfo.label}
                    </span>
                    {pagoInfo ? (
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${pagoInfo.class}`}>
                        {pagoInfo.label}
                      </span>
                    ) : (
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-700 text-gray-400">
                        Sin comprobante
                      </span>
                    )}
                  </div>

                  {/* Acción */}
                  <div className="shrink-0">
                    {compra.estado === 'ACTIVO' ? (
                      <Link
                        href={`/dashboard/curso/${compra.id}`}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition"
                      >
                        Ir al Curso →
                      </Link>
                    ) : !compra.pago ? (
                      <Link
                        href={`/dashboard/compra/${compra.id}`}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
                      >
                        Subir Comprobante
                      </Link>
                    ) : (
                      <Link
                        href={`/dashboard/curso/${compra.id}`}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-sm font-semibold transition"
                      >
                        Ver detalle
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
