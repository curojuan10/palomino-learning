'use client';

import { useAuth } from '@/lib/useAuth';
import { getUserRole } from '@/lib/auth';
import { obtenerComprasUsuario } from '@/lib/compras';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, Clock, XCircle, ShoppingCart, BookOpen } from 'lucide-react';

interface UserProfile {
  nombre: string;
  rol_id: number;
}

const estadoBadge: Record<string, { label: string; class: string; icon: any }> = {
  ACTIVO:    { label: 'Activo',    class: 'bg-green-900 text-green-200', icon: CheckCircle },
  PENDIENTE: { label: 'Pendiente', class: 'bg-yellow-900 text-yellow-200', icon: Clock },
  BLOQUEADO: { label: 'Bloqueado', class: 'bg-red-900 text-red-200', icon: XCircle },
};

const pagoBadge: Record<string, { label: string; class: string; icon: any }> = {
  APROBADO:  { label: 'Aprobado',  class: 'bg-green-900 text-green-200', icon: CheckCircle },
  PENDIENTE: { label: 'En revisión', class: 'bg-yellow-900 text-yellow-200', icon: Clock },
  RECHAZADO: { label: 'Rechazado', class: 'bg-red-900 text-red-200', icon: XCircle },
};

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [compras, setCompras] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  useEffect(() => {
    // 🔧 Mostrar banner si viene de una compra exitosa
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && sessionStorage.getItem('purchase_completed')) {
        setShowSuccessBanner(true);
        sessionStorage.removeItem('purchase_completed');
        // Ocultar banner después de 5 segundos
        setTimeout(() => setShowSuccessBanner(false), 5000);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

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
      {/* 🔧 Banner de éxito de compra */}
      {showSuccessBanner && (
        <div className="bg-green-900/30 border border-green-600/50 rounded-xl p-4 flex items-center gap-4 animate-pulse">
          <CheckCircle size={32} className="text-green-400 shrink-0" />
          <div>
            <p className="text-green-400 font-bold">¡Compra registrada!</p>
            <p className="text-green-300 text-sm">Tu comprobante de pago está en revisión. Te notificaremos cuando sea aprobado.</p>
          </div>
        </div>
      )}

      {/* Bienvenida */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            Hola, {profile?.nombre} 👋
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mb-4">Aquí puedes ver el estado de tus cursos y comprobantes.</p>
          <Link
            href="/dashboard/cursos-disponibles"
            className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition"
          >
            Ver todos los cursos →
          </Link>
        </div>
        <span className={`self-start sm:self-auto text-xs sm:text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap ${profile?.rol_id === 1 ? 'bg-purple-900 text-purple-200' : 'bg-blue-900 text-blue-200'}`}>
          {profile?.rol_id === 1 ? '👨‍💼 ADMIN' : '👨‍🎓 CLIENTE'}
        </span>
      </div>

      {/* Mis Compras */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
          <ShoppingCart size={28} />
          Mis Compras
        </h2>

        {compras.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 sm:p-12 text-center">
            <ShoppingCart size={64} className="mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400 mb-6 text-base sm:text-lg">Aún no has comprado ningún curso.</p>
            <Link
              href="/dashboard/cursos-disponibles"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
              <BookOpen size={18} />
              Explorar Cursos
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {compras.map((compra: any) => {
              const estadoInfo = estadoBadge[compra.estado] ?? { label: compra.estado, class: 'bg-slate-700 text-gray-300', icon: Clock };
              const pagoInfo = compra.pago
                ? (pagoBadge[compra.pago.estado] ?? { label: compra.pago.estado, class: 'bg-slate-700 text-gray-300', icon: Clock })
                : null;
              
              const EstadoIcon = estadoInfo.icon;
              const PagoIcon = pagoInfo?.icon;

              return (
                <div key={compra.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-blue-500/50 transition">
                  {/* Imagen - Responsivo */}
                  <div className="shrink-0">
                    {compra.curso?.imagen_url ? (
                      <img 
                        src={compra.curso.imagen_url} 
                        alt={compra.curso.titulo} 
                        className="w-full sm:w-24 sm:h-16 h-32 object-cover rounded-lg" 
                      />
                    ) : (
                      <div className="w-full sm:w-24 sm:h-16 h-32 bg-slate-800 rounded-lg flex items-center justify-center">
                        <BookOpen size={40} className="text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* Información - Responsivo */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-base sm:text-lg line-clamp-2">{compra.curso?.titulo ?? 'Curso'}</h3>
                    <p className="text-green-400 font-semibold text-sm mt-1">S/{compra.curso?.precio}</p>
                  </div>

                  {/* Estados - Grid responsive */}
                  <div className="flex flex-wrap gap-2 justify-start sm:justify-center">
                    <div className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${estadoInfo.class}`}>
                      <EstadoIcon size={14} />
                      {estadoInfo.label}
                    </div>
                    {pagoInfo ? (
                      <div className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${pagoInfo.class}`}>
                        <PagoIcon size={14} />
                        {pagoInfo.label}
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-slate-700 text-gray-400">
                        <Clock size={14} />
                        Sin comprobante
                      </div>
                    )}
                  </div>

                  {/* Acción - Responsivo */}
                  <div className="w-full sm:w-auto shrink-0">
                    {compra.estado === 'ACTIVO' ? (
                      <Link
                        href={`/dashboard/curso/${compra.id}`}
                        className="w-full sm:w-auto flex justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition"
                      >
                        Ir al Curso →
                      </Link>
                    ) : !compra.pago ? (
                      <Link
                        href={`/dashboard/compra/${compra.id}`}
                        className="w-full sm:w-auto flex justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
                      >
                        Subir Comprobante
                      </Link>
                    ) : (
                      <Link
                        href={`/dashboard/curso/${compra.id}`}
                        className="w-full sm:w-auto flex justify-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-sm font-semibold transition"
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
