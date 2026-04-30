'use client';

import { useEffect, useState } from 'react';
import { getCursos } from '@/lib/admin';
import { useAuth } from '@/lib/useAuth';
import ModalCompra from '@/components/ModalCompra';
import Link from 'next/link';
import { Clock, Globe, BookOpen, ShoppingCart, Flame } from 'lucide-react';

export default function CoursesPage() {
  const { user } = useAuth();
  const [cursos, setCursos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState<any>(null);

  useEffect(() => {
    loadCursos();
  }, []);

  const loadCursos = async () => {
    try {
      const data = await getCursos();
      console.log('✅ Cursos obtenidos:', data);
      console.log('🔍 Total cursos:', data?.length || 0);
      console.log('🔍 Cursos con estado true:', data?.filter((c: any) => c.estado === true).length || 0);
      
      // Filtrar solo cursos activos
      const cursosActivos = (data || []).filter((c: any) => c.estado === true);
      console.log('📦 Cursos a mostrar:', cursosActivos);
      setCursos(cursosActivos);
    } catch (error) {
      console.error('❌ Error loading cursos:', error);
      setCursos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleComprar = (curso: any) => {
    // Asegurar que el curso tiene un ID válido (convertir a string)
    const cursoConId = {
      ...curso,
      id: String(curso.id),
    };
    console.log('🛒 Curso seleccionado para compra:', cursoConId);
    setCursoSeleccionado(cursoConId);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Cargando cursos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Flame className="text-red-500" size={24} />
          <h1 className="text-4xl font-bold text-white">Cursos Disponibles</h1>
        </div>
        <p className="text-gray-400 mt-2">Selecciona los cursos que deseas tomar y comprarlos</p>
      </div>

      {/* Grid de Cursos */}
      {cursos.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center space-y-4">
          <BookOpen className="mx-auto text-gray-500" size={48} />
          <p className="text-gray-400 text-lg">No hay cursos disponibles en este momento</p>
          <p className="text-gray-500 text-sm">Los cursos aparecerán aquí cuando estén activos en el sistema.</p>
          {user?.user_metadata?.role === 'ADMIN' && (
            <Link
              href="/admin/cursos/nuevo"
              className="inline-block mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition"
            >
              ➕ Crear Primer Curso
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cursos.map((curso: any) => (
            <div
              key={curso.id}
              className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition duration-300 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col h-full"
            >
              {/* Header */}
              {curso.imagen_url ? (
                <img
                  src={curso.imagen_url}
                  alt={curso.titulo}
                  className="w-full h-48 object-cover group-hover:scale-110 transition"
                />
              ) : (
                <div className="w-full h-48 bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center group-hover:scale-110 transition">
                  <BookOpen size={56} className="text-blue-200" />
                </div>
              )}

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-2">
                  {curso.categoria}
                </p>
                <h3 className="font-bold text-lg text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition">
                  {curso.titulo}
                </h3>

                <p className="text-xs text-gray-400 mb-3 line-clamp-2 flex-1">
                  {curso.descripcion}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3 gap-2">
                  <span className="flex items-center gap-1"><Clock size={12} /> {curso.duracion}</span>
                  <span className="flex items-center gap-1"><Globe size={12} /> Online</span>
                </div>

                <div className="border-t border-slate-800 pt-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-white whitespace-nowrap">
                      S/{curso.precio}
                    </span>
                    <button
                      onClick={() => handleComprar(curso)}
                      className="flex-1 py-2 bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-semibold text-sm transition flex items-center justify-center gap-1"
                    >
                      <ShoppingCart size={16} />
                      Comprar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-linear-to-r from-blue-900/30 to-purple-900/30 border border-slate-800 rounded-xl p-12 text-center">
        <h2 className="text-3xl font-black text-white mb-4">¿Necesitas ayuda?</h2>
        <p className="text-gray-400 mb-8">
          Contáctanos si tienes dudas sobre nuestros cursos o necesitas más información
        </p>
      </div>

      {/* Modal */}
      <ModalCompra
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        curso={cursoSeleccionado || {}}
        userId={user?.id}
      />
    </div>
  );
}
