'use client';

import { useAuth } from '@/lib/useAuth';
import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useState } from 'react';
import CourseCard from '@/components/CourseCard';
import ModalCompra from '@/components/ModalCompra';

export default function CursosDisponiblesPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [cursos, setCursos] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState<any>(null);

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated || !user) {
      setDataLoading(false);
      return;
    }

    const fetchCursos = async () => {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // Obtener todos los cursos activos
        const { data, error } = await supabase
          .from('cursos')
          .select('*')
          .eq('estado', true)
          .order('fecha_creacion', { ascending: false });

        if (error) throw error;

        const cursosFormateados = (data || []).map((curso: any) => ({
          id: curso.id,
          title: curso.nombre,
          category: curso.categoria || 'Sin categoría',
          price: curso.precio,
          duration: curso.duracion || 'Auto-paced',
          imageUrl: curso.imagen_url,
          level: 'Intermedio',
          description: curso.descripcion || 'Curso de capacitación',
        }));

        setCursos(cursosFormateados);
      } catch (err) {
        console.error('Error cargando cursos:', err);
      } finally {
        setDataLoading(false);
      }
    };

    fetchCursos();
  }, [isAuthenticated, user, loading]);

  if (loading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando cursos...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Debes iniciar sesión para ver los cursos disponibles</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">📚 Cursos Disponibles</h1>
        <p className="text-gray-400 text-sm sm:text-base">Descubre y compra los cursos disponibles</p>
      </div>

      {/* Grid de cursos */}
      {cursos.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 sm:p-12 text-center">
          <p className="text-gray-400 text-lg">No hay cursos disponibles en este momento</p>
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {cursos.map((curso) => (
            <div
              key={curso.id}
              className="group bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg overflow-hidden hover:border-blue-500/50 transition flex flex-col h-full"
            >
              {curso.imageUrl ? (
                <img
                  src={curso.imageUrl}
                  alt={curso.title}
                  className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition"
                />
              ) : (
                <div className="bg-linear-to-br from-slate-700 to-slate-800 h-40 sm:h-48 flex items-center justify-center text-6xl sm:text-8xl group-hover:scale-110 transition">
                  📚
                </div>
              )}

              <div className="p-4 sm:p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
                  <span className="text-xs font-bold text-blue-400 bg-blue-400/20 px-2 py-1 rounded-full line-clamp-1">
                    {curso.category}
                  </span>
                  <span className="text-xs text-gray-400 shrink-0">{curso.level}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold mb-2 text-white line-clamp-2">{curso.title}</h3>
                <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 line-clamp-2 flex-1">{curso.description}</p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>⏱️ {curso.duration}</span>
                  <span>🌐 Online</span>
                </div>

                <div className="border-t border-slate-700 pt-3 sm:pt-4 space-y-3 sm:space-y-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl sm:text-2xl font-black text-white">S/{curso.price}</span>
                  </div>

                  <button
                    onClick={() => {
                      const cursoConId = {
                        ...curso,
                        id: String(curso.id),
                        titulo: curso.title,
                        precio: curso.price,
                        imagen_url: curso.imageUrl,
                      };
                      setCursoSeleccionado(cursoConId);
                      setModalOpen(true);
                    }}
                    className="w-full py-2 bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-bold text-sm transition"
                  >
                    ✅ Comprar Ahora
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de compra */}
      <ModalCompra
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        curso={cursoSeleccionado}
        userId={user?.id}
      />
    </div>
  );
}
