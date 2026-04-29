'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCursos, eliminarCurso, actualizarCurso } from '@/lib/admin';

export default function AdminCursos() {
  const [cursos, setCursos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadCursos();
  }, []);

  const loadCursos = async () => {
    try {
      const data = await getCursos();
      setCursos(data);
    } catch (error) {
      console.error('Error loading cursos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este curso? Esta acción no se puede deshacer.')) {
      setDeletingId(id);
      try {
        const result = await eliminarCurso(id);
        
        if (result.deleted) {
          // Curso eliminado completamente
          setCursos(cursos.filter(c => c.id !== id));
          alert('✅ ' + result.message);
        } else if (result.deactivated) {
          // Curso desactivado (tiene compras asociadas)
          setCursos(cursos.map(c => 
            c.id === id ? { ...c, estado: false } : c
          ));
          alert('⚠️ ' + result.message);
        }
      } catch (error: any) {
        console.error('Error deleting curso:', error);
        const errorMsg = error?.message || 'Error al eliminar el curso';
        alert(`❌ ${errorMsg}`);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const toggleActivo = async (id: string, estado: boolean) => {
    try {
      await actualizarCurso(id, { estado: !estado });
      setCursos(cursos.map(c => 
        c.id === id ? { ...c, estado: !estado } : c
      ));
    } catch (error: any) {
      console.error('Error updating curso:', error);
      const errorMsg = error?.message || 'Error al actualizar el curso';
      alert(`❌ ${errorMsg}`);
    }
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
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">📚 Cursos</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">Total: {cursos.length} curso{cursos.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/admin/cursos/nuevo"
          className="px-5 sm:px-6 py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          ➕ Crear Curso
        </Link>
      </div>

      {/* Cursos Grid */}
      {cursos.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 sm:p-12 text-center">
          <p className="text-gray-400 text-lg mb-4">No hay cursos creados aún</p>
          <Link
            href="/admin/cursos/nuevo"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm sm:text-base"
          >
            Crear el primer curso
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {cursos.map((curso: any) => (
            <div
              key={curso.id}
              className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden hover:border-blue-500 transition flex flex-col h-full"
            >
              {/* Image */}
              {curso.imagen_url && (
                <img
                  src={curso.imagen_url}
                  alt={curso.titulo}
                  className="w-full h-40 sm:h-48 object-cover"
                />
              )}

              {/* Content */}
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 flex flex-col flex-1">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base sm:text-lg font-bold text-white line-clamp-2">{curso.titulo}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-semibold whitespace-nowrap shrink-0 ${
                        curso.estado
                          ? 'bg-green-900 text-green-200'
                          : 'bg-red-900 text-red-200'
                      }`}
                    >
                      {curso.estado ? '✅' : '❌'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs sm:text-sm line-clamp-2">
                    {curso.descripcion}
                  </p>
                </div>

                {/* Details */}
                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm border-t border-slate-700 pt-3 sm:pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Precio:</span>
                    <span className="text-white font-semibold">S/{curso.precio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Categoría:</span>
                    <span className="text-white truncate">{curso.categoria}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duración:</span>
                    <span className="text-white">{curso.duracion}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 sm:pt-4 border-t border-slate-700 space-y-2 mt-auto">
                  <button
                    onClick={() => toggleActivo(curso.id, curso.estado)}
                    className={`w-full py-2 rounded-lg transition font-medium text-xs sm:text-sm ${
                      curso.estado
                        ? 'bg-red-900 hover:bg-red-800 text-red-200'
                        : 'bg-green-900 hover:bg-green-800 text-green-200'
                    }`}
                  >
                    {curso.estado ? '❌ Desactivar' : '✅ Activar'}
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/admin/cursos/${curso.id}/edit`}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-center font-medium text-xs sm:text-sm"
                    >
                      ✏️ Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(curso.id)}
                      disabled={deletingId === curso.id}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium text-xs sm:text-sm disabled:opacity-50"
                    >
                      {deletingId === curso.id ? '⏳' : '🗑️'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
