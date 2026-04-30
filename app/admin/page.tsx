'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getEstadisticasAdmin, getPagosPendientes } from '@/lib/admin';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalCursos: 0,
    pagosPendientes: 0,
    ingresoTotal: 0,
  });
  const [pagosPendientes, setPagosPendientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔄 Cargando datos del admin...');
        const estadisticas = await getEstadisticasAdmin();
        setStats(estadisticas);

        const pagos = await getPagosPendientes();
        setPagosPendientes(pagos);
        setError(null);
      } catch (error: any) {
        console.error('❌ Error loading admin data:', error);
        const errorMessage = error?.message || 'Error al cargar datos';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    const loadData = async () => {
      try {
        console.log('🔄 Reintentando...');
        const estadisticas = await getEstadisticasAdmin();
        setStats(estadisticas);

        const pagos = await getPagosPendientes();
        setPagosPendientes(pagos);
        setError(null);
      } catch (error: any) {
        console.error('❌ Error:', error);
        setError(error?.message || 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-900 border border-red-700 rounded-lg p-4 sm:p-6">
          <p className="text-red-100 font-semibold">⚠️ Error cargando datos</p>
          <p className="text-red-200 text-sm mt-2 break-words">{error}</p>
          <p className="text-red-300 text-xs mt-3">
            💡 Posible causa: Políticas RLS no configuradas en Supabase. 
            Revisa: <code className="bg-red-800 px-2 py-1 rounded">docs/SUPABASE_RLS_COMPLETE.md</code>
          </p>
          <button
            onClick={handleRetry}
            className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded transition"
          >
            🔄 Reintentar
          </button>
        </div>
      )}

      {/* Título */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">📊 Panel Administrativo</h1>
        <p className="text-gray-400 text-sm sm:text-base">Gestiona cursos, pagos y estudiantes</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Usuarios */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 sm:p-6 hover:border-blue-500 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm font-medium">Total Usuarios</p>
              <p className="text-2xl sm:text-3xl font-bold text-white mt-2">{stats.totalUsuarios}</p>
            </div>
            <div className="text-3xl sm:text-4xl">👥</div>
          </div>
        </div>

        {/* Total Cursos */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 sm:p-6 hover:border-green-500 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm font-medium">Total Cursos</p>
              <p className="text-2xl sm:text-3xl font-bold text-white mt-2">{stats.totalCursos}</p>
            </div>
            <div className="text-3xl sm:text-4xl">📚</div>
          </div>
        </div>

        {/* Pagos Pendientes */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 sm:p-6 hover:border-yellow-500 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm font-medium">Pagos Pendientes</p>
              <p className="text-2xl sm:text-3xl font-bold text-white mt-2">{stats.pagosPendientes}</p>
            </div>
            <div className="text-3xl sm:text-4xl">💳</div>
          </div>
        </div>

        {/* Ingresos Totales */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 sm:p-6 hover:border-purple-500 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm font-medium">Ingresos Totales</p>
              <p className="text-xl sm:text-2xl font-bold text-white mt-2 break-words">
                S/{stats.ingresoTotal.toLocaleString('es-PE')}
              </p>
            </div>
            <div className="text-3xl sm:text-4xl">💰</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Link
          href="/admin/cursos/nuevo"
          className="bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white p-5 sm:p-6 rounded-lg transition transform hover:scale-105 active:scale-95"
        >
          <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">➕</div>
          <h3 className="font-bold text-base sm:text-lg">Crear Nuevo Curso</h3>
          <p className="text-xs sm:text-sm text-green-100 mt-1">Agrega un curso a la plataforma</p>
        </Link>

        <Link
          href="/admin/cursos"
          className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-5 sm:p-6 rounded-lg transition transform hover:scale-105 active:scale-95"
        >
          <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">📚</div>
          <h3 className="font-bold text-base sm:text-lg">Ver Cursos</h3>
          <p className="text-xs sm:text-sm text-blue-100 mt-1">Edita o elimina cursos existentes</p>
        </Link>

        <Link
          href="/admin/pagos"
          className="bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white p-5 sm:p-6 rounded-lg transition transform hover:scale-105 active:scale-95"
        >
          <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">💳</div>
          <h3 className="font-bold text-base sm:text-lg">Revisar Pagos</h3>
          <p className="text-xs sm:text-sm text-purple-100 mt-1">Aprueba o rechaza pagos pendientes</p>
        </Link>
      </div>

      {/* Evolución de Ingresos */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">📈 Evolución de Ingresos</h2>
        <div className="bg-slate-900 rounded-lg p-4 sm:p-6 h-72 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={[
                { date: 'Lun', ingresos: 1200 },
                { date: 'Mar', ingresos: 1900 },
                { date: 'Mié', ingresos: 1600 },
                { date: 'Jue', ingresos: 2100 },
                { date: 'Vie', ingresos: 1800 },
                { date: 'Sáb', ingresos: 2400 },
                { date: 'Dom', ingresos: 2000 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="ingresos" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', r: 5 }}
                name="Ingresos (S/)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Últimos Pagos Pendientes */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Pagos Recientes Pendientes</h2>
          <span className="bg-red-900 text-red-200 text-xs px-3 py-1 rounded-full font-semibold">
            {pagosPendientes.length}
          </span>
        </div>

        {pagosPendientes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-lg">✅ No hay pagos pendientes</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pagosPendientes.slice(0, 5).map((pago: any) => (
              <div
                key={pago.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-slate-900 rounded-lg hover:border-l-4 hover:border-yellow-500 transition gap-3 sm:gap-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-white truncate text-sm sm:text-base">
                    {pago.compra?.usuario?.nombre}
                  </p>
                  <p className="text-xs text-gray-400 line-clamp-1">
                    {pago.compra?.curso?.titulo}
                  </p>
                </div>
                <div className="flex items-center justify-between sm:flex-col sm:text-right">
                  <p className="font-bold text-white text-sm sm:text-base">S/{pago.monto}</p>
                  <Link
                    href="/admin/pagos"
                    className="text-xs text-blue-400 hover:text-blue-300 transition"
                  >
                    Revisar →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

