'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { obtenerComprasUsuario } from '@/lib/compras';
import Link from 'next/link';

interface CursoComprado {
  id: string;
  titulo: string;
  precio: number;
  categoria: string;
  descripcion: string;
  duracion: string;
  imagen_url?: string;
  estado_acceso: string; // ACTIVO, PENDIENTE, BLOQUEADO
  estado_pago: string; // APROBADO, PENDIENTE, RECHAZADO
}

const estadoAccesoBadge: Record<string, { label: string; class: string }> = {
  ACTIVO: { label: '✅ Acceso Activado', class: 'bg-green-900 text-green-200' },
  PENDIENTE: { label: '⏳ Pendiente de Aprobación', class: 'bg-yellow-900 text-yellow-200' },
  BLOQUEADO: { label: '❌ Acceso Bloqueado', class: 'bg-red-900 text-red-200' },
};

export default function CursosCompradosPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [cursos, setCursos] = useState<CursoComprado[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated || !user) {
      setDataLoading(false);
      return;
    }

    const loadCursos = async () => {
      try {
        const comprasData = await obtenerComprasUsuario(user.id);
        
        // 🔧 BUG 7: Mapear compras a cursos comprados
        const cursosComprados = (comprasData || []).map((compra: any) => ({
          id: compra.curso?.id || compra.id,
          titulo: compra.curso?.nombre || compra.curso?.titulo || 'Curso',
          precio: compra.curso?.precio || 0,
          categoria: compra.curso?.categoria || 'General',
          descripcion: compra.curso?.descripcion || 'Sin descripción',
          duracion: compra.curso?.duracion || 'No especificada',
          imagen_url: compra.curso?.imagen_url,
          estado_acceso: compra.estado || 'PENDIENTE',
          estado_pago: compra.pago?.estado || 'PENDIENTE',
        }));

        console.log('📚 Cursos comprados:', cursosComprados);
        setCursos(cursosComprados);
      } catch (error) {
        console.error('Error loading purchased courses:', error);
        setCursos([]);
      } finally {
        setDataLoading(false);
      }
    };

    loadCursos();
  }, [user, isAuthenticated, loading]);

  if (loading || dataLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Cargando tus cursos...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-96 text-center">
        <div>
          <p className="text-gray-400 mb-4">Debes iniciar sesión para ver tus cursos</p>
          <Link href="/auth/login" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
            Ir a Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white">📚 Mis Cursos</h1>
        <p className="text-gray-400 mt-2">Accede a los cursos que has comprado</p>
      </div>

      {/* Grid de Cursos */}
      {cursos.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center space-y-4">
          <p className="text-gray-400 text-lg">📚 No has comprado ningún curso aún</p>
          <p className="text-gray-500 text-sm">Explora el catálogo de cursos disponibles</p>
          <Link
            href="/dashboard/cursos-disponibles"
            className="inline-block mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition"
          >
            Ver Cursos Disponibles →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cursos.map((curso) => {
            const estadoInfo = estadoAccesoBadge[curso.estado_acceso] || {
              label: curso.estado_acceso,
              class: 'bg-slate-700 text-gray-300',
            };

            return (
              <div
                key={curso.id}
                className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition duration-300 hover:shadow-xl hover:shadow-blue-500/10"
              >
                {/* Imagen */}
                {curso.imagen_url ? (
                  <img
                    src={curso.imagen_url}
                    alt={curso.titulo}
                    className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-40 bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center text-4xl">
                    📚
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-2">
                    {curso.categoria}
                  </p>
                  <h3 className="font-bold text-base text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition">
                    {curso.titulo}
                  </h3>

                  <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                    {curso.descripcion}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>⏱️ {curso.duracion}</span>
                    <span>S/{curso.precio}</span>
                  </div>

                  {/* Estados */}
                  <div className="border-t border-slate-800 pt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${estadoInfo.class}`}>
                        {estadoInfo.label}
                      </span>
                    </div>

                    {curso.estado_acceso === 'ACTIVO' ? (
                      <button className="w-full py-2 bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-bold text-center text-sm transition transform hover:scale-105">
                        🎯 Ir al Aula Virtual
                      </button>
                    ) : (
                      <button disabled className="w-full py-2 bg-slate-700 text-gray-400 rounded-lg font-bold text-center text-sm opacity-50 cursor-not-allowed">
                        Acceso No Disponible
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
