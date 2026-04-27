'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { obtenerCompraId } from '@/lib/compras';
import Link from 'next/link';

export default function CursoPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const compraId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [compra, setCompra] = useState<any>(null);

  useEffect(() => {
    loadCompra();
  }, [compraId]);

  const loadCompra = async () => {
    try {
      const data = await obtenerCompraId(compraId);
      
      if (!data) {
        setError('Compra no encontrada');
        setLoading(false);
        return;
      }

      // Verificar que el usuario sea el propietario de la compra
      if (data.usuario_id !== user?.id) {
        router.push('/dashboard');
        return;
      }

      setCompra(data);
    } catch (err) {
      console.error('Error loading compra:', err);
      setError('Error cargando compra');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando curso...</p>
        </div>
      </div>
    );
  }

  if (error || !compra) {
    return (
      <div className="min-h-screen bg-slate-950 py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-4">❌ Error</h1>
            <p className="text-gray-300 mb-8">{error || 'No se encontró la compra'}</p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
              Volver al Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isApproved = compra.estado === 'activo';
  const paymentStatus = compra.pago?.estado;
  const hasPaidProof = !!compra.pago;

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Encabezado */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-blue-400 hover:text-blue-300 flex items-center gap-2 mb-6"
          >
            ← Volver al Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-white">
            {compra.curso?.titulo}
          </h1>
        </div>

        {/* Info de la Compra */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-500 text-sm uppercase tracking-wider mb-2">Precio</p>
              <p className="text-2xl font-bold text-white">S/{compra.curso?.precio}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm uppercase tracking-wider mb-2">Estado de Compra</p>
              <p
                className={`text-lg font-semibold ${
                  isApproved
                    ? 'text-green-400'
                    : 'text-yellow-400'
                }`}
              >
                {isApproved ? '✅ Activo' : '⏳ Pendiente'}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm uppercase tracking-wider mb-2">
                Estado del Pago
              </p>
              <p
                className={`text-lg font-semibold ${
                  paymentStatus === 'aprobado'
                    ? 'text-green-400'
                    : paymentStatus === 'rechazado'
                    ? 'text-red-400'
                    : 'text-yellow-400'
                }`}
              >
                {paymentStatus === 'aprobado'
                  ? '✅ Aprobado'
                  : paymentStatus === 'rechazado'
                  ? '❌ Rechazado'
                  : hasPaidProof
                  ? '⏳ Pendiente'
                  : '📄 Sin subir'}
              </p>
            </div>
          </div>
        </div>

        {/* Contenido Principal */}
        {isApproved ? (
          // Curso Aprobado - Aula Virtual
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-700/50 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-green-400 mb-3">
                🎓 ¡Bienvenido al Aula Virtual!
              </h2>
              <p className="text-gray-300 mb-6">
                Tu pago ha sido aprobado. Tienes acceso completo a todo el contenido del curso.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  disabled
                  className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-lg font-semibold cursor-not-allowed opacity-50"
                >
                  📺 Ir al Aula Virtual
                </button>
                <button
                  disabled
                  className="flex-1 px-6 py-4 bg-slate-700 text-gray-300 rounded-lg font-semibold cursor-not-allowed opacity-50"
                >
                  📥 Descargar Materiales
                </button>
              </div>

              <p className="text-xs text-gray-400 mt-4 italic">
                * El aula virtual se integrará próximamente. Por ahora, los materiales estarán disponibles en esta sección.
              </p>
            </div>

            {/* Detalles del Curso */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-8">
              <h3 className="text-xl font-bold text-white mb-4">Descripción del Curso</h3>
              <p className="text-gray-300 mb-6">
                {compra.curso?.descripcion ||
                  'No hay descripción disponible para este curso.'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-700">
                <div>
                  <p className="text-gray-500 text-sm uppercase tracking-wider mb-2">
                    Categoría
                  </p>
                  <p className="text-white">{compra.curso?.categoria}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm uppercase tracking-wider mb-2">
                    Duración
                  </p>
                  <p className="text-white">{compra.curso?.duracion}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Acceso Bloqueado
          <div className="space-y-6">
            <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-yellow-400 mb-3">
                ⏳ Acceso Pendiente
              </h2>
              <p className="text-gray-300 mb-6">
                Tu acceso al aula virtual estará disponible una vez que tu pago sea aprobado por nuestro equipo.
              </p>

              <div className="bg-slate-800 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-white mb-4">Estado actual:</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-lg ${
                        hasPaidProof ? '✅' : '❌'
                      }`}
                    ></span>
                    <span className="text-gray-300">
                      {hasPaidProof
                        ? 'Comprobante subido'
                        : 'Comprobante no subido'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">⏳</span>
                    <span className="text-gray-300">
                      En revisión por administrador
                    </span>
                  </div>
                </div>
              </div>

              {!hasPaidProof && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded">
                  <p className="text-red-300 text-sm">
                    <strong>Necesitas subir el comprobante de pago</strong> para que el administrador pueda validar tu compra.
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={`/dashboard/compra/${compra.id}`}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition text-center"
                >
                  {hasPaidProof
                    ? '📝 Ver Comprobante'
                    : '📄 Subir Comprobante'}
                </Link>
                <Link
                  href="/dashboard"
                  className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg font-semibold transition text-center"
                >
                  Volver al Dashboard
                </Link>
              </div>
            </div>

            {/* Detalles del Curso (Vista Previa) */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 opacity-60 pointer-events-none">
              <h3 className="text-xl font-bold text-gray-500 mb-4">
                Descripción del Curso (Vista Previa)
              </h3>
              <p className="text-gray-400 mb-6">
                {compra.curso?.descripcion ||
                  'No hay descripción disponible para este curso.'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-700">
                <div>
                  <p className="text-gray-600 text-sm uppercase tracking-wider mb-2">
                    Categoría
                  </p>
                  <p className="text-gray-500">{compra.curso?.categoria}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm uppercase tracking-wider mb-2">
                    Duración
                  </p>
                  <p className="text-gray-500">{compra.curso?.duracion}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
