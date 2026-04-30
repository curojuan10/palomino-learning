'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPagosProcessados } from '@/lib/admin';

export default function AdminReportes() {
  const [pagos, setPagos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<'TODOS' | 'APROBADO' | 'RECHAZADO'>('TODOS');

  useEffect(() => {
    loadPagos();
  }, []);

  const loadPagos = async () => {
    try {
      console.log('🔄 Cargando pagos procesados...');
      const data = await getPagosProcessados();
      console.log('✅ Pagos cargados:', data);
      setPagos(data);
      setError(null);
    } catch (error: any) {
      console.error('❌ Error loading pagos:', error);
      const errorMessage = error?.message || 'Error al cargar pagos';
      setError(errorMessage);
      setPagos([]);
    } finally {
      setLoading(false);
    }
  };

  const pagosFiltrados = filtro === 'TODOS' ? pagos : pagos.filter(p => p.estado === filtro);

  const totalAprobados = pagos.filter(p => p.estado === 'APROBADO').length;
  const totalRechazados = pagos.filter(p => p.estado === 'RECHAZADO').length;
  const totalIngresos = pagos
    .filter(p => p.estado === 'APROBADO')
    .reduce((sum, p) => sum + (p.monto || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Cargando reportes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">📊 Reporte de Pagos</h1>
        <p className="text-gray-400 mt-1 text-sm sm:text-base">Historial de pagos aprobados y rechazados</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-900 border border-red-700 rounded-lg p-4 sm:p-6">
          <p className="text-red-100 font-semibold">⚠️ Error cargando datos</p>
          <p className="text-red-200 text-sm mt-2 break-words">{error}</p>
          <p className="text-red-300 text-xs mt-3">
            💡 Posible causa: Políticas RLS no configuradas en Supabase. 
            Revisa la documentación en <code className="bg-red-800 px-2 py-1 rounded">docs/SUPABASE_RLS_COMPLETE.md</code>
          </p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              loadPagos();
            }}
            className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded transition"
          >
            🔄 Reintentar
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <p className="text-gray-400 text-xs sm:text-sm">Total Aprobados</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-400 mt-2">{totalAprobados}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <p className="text-gray-400 text-xs sm:text-sm">Total Rechazados</p>
          <p className="text-2xl sm:text-3xl font-bold text-red-400 mt-2">{totalRechazados}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <p className="text-gray-400 text-xs sm:text-sm">Ingresos Totales</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-400 mt-2 break-words">S/{totalIngresos.toLocaleString('es-PE')}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button
          onClick={() => setFiltro('TODOS')}
          className={`px-4 py-2 rounded-lg transition text-sm font-semibold ${
            filtro === 'TODOS'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
          }`}
        >
          📋 Todos ({pagos.length})
        </button>
        <button
          onClick={() => setFiltro('APROBADO')}
          className={`px-4 py-2 rounded-lg transition text-sm font-semibold ${
            filtro === 'APROBADO'
              ? 'bg-green-600 text-white'
              : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
          }`}
        >
          ✅ Aprobados ({totalAprobados})
        </button>
        <button
          onClick={() => setFiltro('RECHAZADO')}
          className={`px-4 py-2 rounded-lg transition text-sm font-semibold ${
            filtro === 'RECHAZADO'
              ? 'bg-red-600 text-white'
              : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
          }`}
        >
          ❌ Rechazados ({totalRechazados})
        </button>
      </div>

      {/* Reporte */}
      {pagosFiltrados.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 sm:p-12 text-center">
          <p className="text-gray-400 text-lg">No hay pagos procesados en esta categoría</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pagosFiltrados.map((pago: any) => (
            <div
              key={pago.id}
              className="bg-slate-800 border border-slate-700 rounded-lg p-4 sm:p-6 hover:border-slate-600 transition"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Info Principal */}
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm mb-1">Curso</p>
                  <p className="text-white font-semibold text-sm line-clamp-2">
                    {pago.compra?.curso?.titulo}
                  </p>
                </div>

                {/* Estudiante */}
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm mb-1">Estudiante</p>
                  <p className="text-white font-semibold text-sm truncate">
                    {pago.compra?.usuario?.nombre}
                  </p>
                  <p className="text-gray-500 text-xs truncate">
                    {pago.compra?.usuario?.email}
                  </p>
                </div>

                {/* Monto y Estado */}
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm mb-1">Monto</p>
                  <p className="text-white font-bold text-lg">S/{pago.monto}</p>
                </div>

                {/* Estado */}
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm mb-1">Estado</p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                        pago.estado === 'APROBADO'
                          ? 'bg-green-900 text-green-200'
                          : 'bg-red-900 text-red-200'
                      }`}
                    >
                      {pago.estado === 'APROBADO' ? '✅ Aprobado' : '❌ Rechazado'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detalles adicionales */}
              <div className="mt-3 pt-3 border-t border-slate-700 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <p className="text-gray-500">Método</p>
                  <p className="text-gray-300 capitalize">{pago.metodo_pago}</p>
                </div>
                <div>
                  <p className="text-gray-500">Monto</p>
                  <p className="text-gray-300 font-semibold">S/{pago.monto}</p>
                </div>
                <div>
                  <p className="text-gray-500">ID Pago</p>
                  <p className="text-gray-300 font-mono text-xs break-all">
                    {String(pago.id).slice(0, 12)}...
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Botón volver */}
      <Link
        href="/admin/pagos"
        className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
      >
        ← Volver a Pagos Pendientes
      </Link>
    </div>
  );
}
