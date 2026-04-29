'use client';

import { useEffect, useState } from 'react';
import { getPagosPendientes, aprobarPago, rechazarPago } from '@/lib/admin';

export default function AdminPagos() {
  const [pagos, setPagos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadPagos();
  }, []);

  const loadPagos = async () => {
    try {
      const data = await getPagosPendientes();
      setPagos(data);
    } catch (error) {
      console.error('Error loading pagos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAprobar = async (pagoId: string) => {
    if (confirm('¿Deseas aprobar este pago?')) {
      setProcessingId(pagoId);
      try {
        await aprobarPago(pagoId);
        setPagos((prevPagos) => prevPagos.filter((p: any) => p.id !== pagoId));
        alert('Pago aprobado exitosamente');
      } catch (error) {
        console.error('Error approving pago:', error);
        alert('Error al aprobar el pago');
      } finally {
        setProcessingId(null);
      }
    }
  };

  const handleRechazar = async (pagoId: string) => {
    if (confirm('¿Deseas rechazar este pago?')) {
      setProcessingId(pagoId);
      try {
        await rechazarPago(pagoId);
        setPagos((prevPagos) => prevPagos.filter((p: any) => p.id !== pagoId));
        alert('Pago rechazado');
      } catch (error) {
        console.error('Error rejecting pago:', error);
        alert('Error al rechazar el pago');
      } finally {
        setProcessingId(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Cargando pagos pendientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">💳 Pagos Pendientes</h1>
        <p className="text-gray-400 mt-1 text-sm sm:text-base">
          {pagos.length > 0
            ? `${pagos.length} pago${pagos.length !== 1 ? 's' : ''} pendiente${pagos.length !== 1 ? 's' : ''} de revisar`
            : 'No hay pagos pendientes'}
        </p>
      </div>

      {/* Pagos List */}
      {pagos.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 sm:p-12 text-center">
          <p className="text-gray-400 text-lg">✅ No hay pagos pendientes de revisar</p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {pagos.map((pago: any) => (
            <div
              key={pago.id}
              id={`pago-${pago.id}`}
              className="bg-slate-800 border border-slate-700 rounded-lg p-4 sm:p-6 hover:border-yellow-500 transition"
            >
              {/* Header */}
              <div className="mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-white line-clamp-2">
                    {pago.compra?.curso?.titulo}
                  </h3>
                  <span className="bg-yellow-900 text-yellow-200 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                    ⏳ Pendiente
                  </span>
                </div>
                <div className="space-y-1.5 text-xs sm:text-sm">
                  <p className="text-gray-400">
                    Estudiante: <span className="text-white font-semibold">{pago.compra?.usuario?.nombre}</span>
                  </p>
                  <p className="text-gray-400">
                    Email: <span className="text-blue-400 break-all">{pago.compra?.usuario?.email}</span>
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-slate-700">
                <span className="text-3xl sm:text-4xl font-black text-green-400">
                  S/{pago.monto}
                </span>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6 py-4 border-y border-slate-700">
                <div>
                  <p className="text-gray-400 text-xs">ID Pago</p>
                  <p className="text-white font-mono text-xs mt-1 break-all">{String(pago.id).slice(0, 8)}...</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Método</p>
                  <p className="text-white text-xs mt-1 capitalize">{pago.metodo_pago}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Solicitud</p>
                  <p className="text-white text-xs mt-1">
                    {new Date(pago.created_at).toLocaleDateString('es-PE')}
                  </p>
                </div>
              </div>

              {/* Comprobante */}
              {pago.comprobante_url && (
                <div className="mb-4 sm:mb-6">
                  <p className="text-gray-400 text-sm font-semibold mb-3">📄 Comprobante de Pago</p>
                  <a
                    href={pago.comprobante_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full sm:w-auto max-w-md"
                  >
                    <img
                      src={pago.comprobante_url}
                      alt="Comprobante"
                      className="w-full max-h-48 rounded-lg border border-slate-700 hover:border-blue-500 transition cursor-pointer"
                    />
                  </a>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-slate-700">
                <button
                  onClick={() => handleAprobar(pago.id)}
                  disabled={processingId === pago.id}
                  className="flex-1 py-2 bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  {processingId === pago.id ? (
                    <>
                      <span className="animate-spin text-sm">⏳</span>
                      <span className="hidden sm:inline">Procesando...</span>
                    </>
                  ) : (
                    <>
                      ✅ <span className="hidden sm:inline">Aprobar</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleRechazar(pago.id)}
                  disabled={processingId === pago.id}
                  className="flex-1 py-2 bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  {processingId === pago.id ? (
                    <>
                      <span className="animate-spin text-sm">⏳</span>
                      <span className="hidden sm:inline">Procesando...</span>
                    </>
                  ) : (
                    <>
                      ❌ <span className="hidden sm:inline">Rechazar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
