'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function AdminEstudiantes() {
  const [estudiantes, setEstudiantes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEstudiantes();
  }, []);

  const loadEstudiantes = async () => {
    try {
      const client = createClient();
      
      // Obtener usuarios
      const { data: usuarios, error: errorUsuarios } = await client
        .from('usuarios')
        .select('id, nombre, email, rol_id, created_at')
        .order('created_at', { ascending: false });

      if (errorUsuarios) throw errorUsuarios;

      // Obtener compras
      const { data: compras = [] } = await client
        .from('compras')
        .select('usuario_id, id');

      // Contar compras por usuario
      const comprasPorUsuario = (compras || []).reduce((acc: Record<string, number>, c: any) => {
        acc[c.usuario_id] = (acc[c.usuario_id] || 0) + 1;
        return acc;
      }, {});

      // Combinar datos
      const usuariosConCompras = (usuarios || []).map((u: any) => ({
        ...u,
        compras: Array(comprasPorUsuario[u.id] || 0).fill(null),
      }));

      setEstudiantes(usuariosConCompras);
    } catch (error) {
      console.error('Error loading estudiantes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Cargando estudiantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">👥 Estudiantes</h1>
        <p className="text-gray-400 mt-1 text-sm sm:text-base">Total: {estudiantes.length} usuario{estudiantes.length !== 1 ? 's' : ''} registrado{estudiantes.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Students List */}
      {estudiantes.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 sm:p-12 text-center">
          <p className="text-gray-400 text-lg">No hay estudiantes registrados aún</p>
        </div>
      ) : (
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-900 border-b border-slate-700">
                <tr className="text-gray-400 text-left">
                  <th className="py-3 sm:py-4 px-4 sm:px-6 font-semibold text-xs sm:text-sm">Nombre</th>
                  <th className="py-3 sm:py-4 px-4 sm:px-6 font-semibold text-xs sm:text-sm">Email</th>
                  <th className="py-3 sm:py-4 px-4 sm:px-6 font-semibold text-xs sm:text-sm">Rol</th>
                  <th className="py-3 sm:py-4 px-4 sm:px-6 font-semibold text-xs sm:text-sm">Cursos</th>
                  <th className="py-3 sm:py-4 px-4 sm:px-6 font-semibold text-xs sm:text-sm">Registro</th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.map((est: any, idx) => (
                  <tr
                    key={est.id}
                    className={`${
                      idx % 2 === 0 ? 'bg-slate-800' : 'bg-slate-750'
                    } border-b border-slate-700 hover:bg-slate-700 transition text-xs sm:text-sm`}
                  >
                    <td className="py-3 sm:py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm shrink-0">
                          {est.nombre.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white font-semibold truncate">{est.nombre}</span>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6 text-gray-300 truncate">{est.email}</td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6">
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          est.rol_id === 1
                            ? 'bg-purple-900 text-purple-200'
                            : 'bg-blue-900 text-blue-200'
                        }`}
                      >
                        {est.rol_id === 1 ? '⚙️ Admin' : '👤 Cliente'}
                      </span>
                    </td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6 text-white font-semibold">
                      {est.compras?.length || 0}
                    </td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6 text-gray-400 text-xs">
                      {new Date(est.created_at).toLocaleDateString('es-PE')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3 sm:space-y-4 p-3 sm:p-4">
            {estudiantes.map((est: any) => (
              <div
                key={est.id}
                className="bg-slate-700 border border-slate-600 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {est.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{est.nombre}</p>
                    <p className="text-gray-400 text-xs truncate">{est.email}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 ${
                      est.rol_id === 1
                        ? 'bg-purple-900 text-purple-200'
                        : 'bg-blue-900 text-blue-200'
                    }`}
                  >
                    {est.rol_id === 1 ? 'Admin' : 'Cliente'}
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm gap-4">
                  <div>
                    <p className="text-gray-400">Cursos Comprados</p>
                    <p className="text-white font-bold">{est.compras?.length || 0}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400">Registro</p>
                    <p className="text-white text-xs">
                      {new Date(est.created_at).toLocaleDateString('es-PE')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <p className="text-gray-400 text-xs sm:text-sm">Total Estudiantes</p>
          <p className="text-xl sm:text-2xl font-bold text-white mt-2">{estudiantes.length}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <p className="text-gray-400 text-xs sm:text-sm">Admins</p>
          <p className="text-xl sm:text-2xl font-bold text-purple-400 mt-2">
            {estudiantes.filter((e: any) => e.rol_id === 1).length}
          </p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <p className="text-gray-400 text-xs sm:text-sm">Clientes</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-400 mt-2">
            {estudiantes.filter((e: any) => e.rol_id !== 1).length}
          </p>
        </div>
      </div>
    </div>
  );
}
