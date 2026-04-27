'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { crearCompra } from '@/lib/compras';
import { crearPago, subirComprobanteStorage } from '@/lib/pagos';
import { Upload, Check, AlertCircle } from 'lucide-react';

interface ModalCompraProps {
  isOpen: boolean;
  onClose: () => void;
  curso: {
    id: string;
    titulo: string;
    precio: number;
    imagen_url?: string;
  };
  userId?: string;
}

type FlowStep = 'confirmation' | 'payment' | 'receipt' | 'success';

export default function ModalCompra({ isOpen, onClose, curso, userId }: ModalCompraProps) {
  const router = useRouter();
  const [step, setStep] = useState<FlowStep>('confirmation');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [compraId, setCompraId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [monto, setMonto] = useState('');
  const [metodo, setMetodo] = useState('transferencia');

  // Validar que curso tenga datos
  if (!curso?.id || !curso?.titulo) {
    console.warn('⚠️ ModalCompra: curso incompleto', { curso });
  }

  // Actualizar monto cuando curso cambie
  useEffect(() => {
    if (curso?.precio) {
      setMonto(curso.precio.toString());
    }
  }, [curso?.precio]);

  if (!isOpen) return null;

  // Log de debugging
  console.log('🎯 ModalCompra props:', { 
    isOpen, 
    curso: { id: curso?.id, titulo: curso?.titulo, precio: curso?.precio },
    userId,
    userIdType: typeof userId,
  });

  // PASO A: Crear compra con estado 'pendiente'
  const handleCrearCompra = async () => {
    console.log('🔍 DEBUG handleCrearCompra:', { userId, cursoId: curso.id, cursoIdType: typeof curso.id });
    
    if (!userId) {
      alert('Debes iniciar sesión para comprar cursos');
      router.push('/auth/login');
      return;
    }

    if (!curso?.id) {
      setError('Error: ID del curso no disponible');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Asegurar que curso_id es string pero representa un número válido
      const cursoIdStr = String(curso.id).trim();
      console.log('📤 Enviando a crearCompra:', { userId, cursoId: cursoIdStr });
      
      const compra = await crearCompra(userId, cursoIdStr);
      console.log('✅ Compra creada:', compra);
      setCompraId(compra.id);
      setStep('payment'); // Avanza a Paso B
    } catch (err: any) {
      console.error('❌ Error detallado:', {
        message: err.message,
        fullError: err,
      });
      setError(`Error al registrar la compra: ${err.message || 'Intenta de nuevo.'}`);
    } finally {
      setLoading(false);
    }
  };

  // PASO B: El usuario selecciona el archivo (vista ya permite esto)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      if (!f.type.startsWith('image/')) {
        setError('Por favor selecciona una imagen');
        return;
      }

      if (f.size > 5 * 1024 * 1024) {
        setError('La imagen debe ser menor a 5MB');
        return;
      }

      setFile(f);
      const reader = new FileReader();
      reader.onload = (event) => {
        setFilePreview(event.target?.result as string);
      };
      reader.readAsDataURL(f);
      setError('');
    }
  };

  // PASO C + D: Subir archivo y crear pago
  const handleSubirComprobante = async () => {
    if (!compraId) {
      setError('ID de compra no disponible');
      return;
    }

    if (!file) {
      setError('Por favor selecciona un archivo');
      return;
    }

    if (!monto || parseFloat(monto) <= 0) {
      setError('El monto debe ser mayor a 0');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // PASO C: Subir archivo al Storage
      const comprobanteUrl = await subirComprobanteStorage(file, compraId);

      // PASO D: Crear registro en pagos
      await crearPago({
        compra_id: compraId,
        comprobante_url: comprobanteUrl,
        monto: parseFloat(monto),
        estado: 'PENDIENTE',
      });

      setStep('success');
    } catch (err: any) {
      console.error('Error al subir comprobante:', err);
      
      let errorMessage = 'Error al subir el comprobante.';
      
      if (err.message.includes('bucket')) {
        errorMessage = '❌ El bucket "comprobantes" no existe en Supabase Storage. Contáctanos.';
      } else if (err.message.includes('Permission denied')) {
        errorMessage = '❌ No tienes permiso para subir archivos. Contáctanos.';
      } else if (err.message.includes('already exists')) {
        errorMessage = '⚠️ Este archivo ya existe. Intenta con otro archivo.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 w-full max-w-md shadow-2xl">
        
        {/* PASO 1: CONFIRMACIÓN DE COMPRA */}
        {step === 'confirmation' && (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">📚 Confirmar Compra</h2>
              <p className="text-gray-400">Por favor revisa los detalles antes de continuar</p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-900 border border-red-700 text-red-200 rounded-lg text-sm flex gap-2">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {/* Curso Info */}
            <div className="bg-slate-700 rounded-lg p-4 mb-6 space-y-3">
              {curso.imagen_url && (
                <img
                  src={curso.imagen_url}
                  alt={curso.titulo}
                  className="w-full h-32 object-cover rounded-lg"
                />
              )}
              <div>
                <p className="text-gray-400 text-sm">Curso</p>
                <p className="text-white font-bold text-lg">{curso.titulo}</p>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-600">
                <span className="text-gray-400">Precio:</span>
                <span className="text-2xl font-bold text-green-400">S/{curso.precio}</span>
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-4 mb-6">
              <p className="text-blue-200 text-sm">
                ℹ️ Continuarás al formulario de pago donde podrás subir tu comprobante.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCrearCompra}
                disabled={loading}
                className="flex-1 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Procesando...
                  </>
                ) : (
                  <>
                    ✅ Continuar a Pago
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* PASO 2: FORMULARIO DE PAGO */}
        {step === 'payment' && (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">💳 Datos de Pago</h2>
              <p className="text-gray-400">Completa tu información de pago</p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-900 border border-red-700 text-red-200 rounded-lg text-sm flex gap-2">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {/* Resumen */}
            <div className="bg-slate-700 rounded-lg p-4 mb-6">
              <p className="text-gray-400 text-sm mb-2">Curso</p>
              <p className="text-white font-bold">{curso.titulo}</p>
              <p className="text-green-400 text-lg font-bold mt-2">S/{curso.precio}</p>
            </div>

            {/* Métodos de Pago */}
            <div className="mb-6 space-y-3">
              <label className="block text-white font-semibold mb-3">Método de Pago</label>
              
              <div className="space-y-2">
                <button
                  onClick={() => setMetodo('transferencia')}
                  className={`w-full p-3 rounded-lg text-left transition ${
                    metodo === 'transferencia'
                      ? 'bg-blue-600 border border-blue-500 text-white'
                      : 'bg-slate-700 border border-slate-600 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  🏦 <span className="font-semibold">Transferencia Bancaria</span>
                  <p className="text-sm text-gray-300 mt-1">BCP, BBVA, Scotiabank, Interbank</p>
                </button>

                <button
                  onClick={() => setMetodo('yape')}
                  className={`w-full p-3 rounded-lg text-left transition ${
                    metodo === 'yape'
                      ? 'bg-blue-600 border border-blue-500 text-white'
                      : 'bg-slate-700 border border-slate-600 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  📱 <span className="font-semibold">Yape</span>
                  <p className="text-sm text-gray-300 mt-1">Envía dinero al instante</p>
                </button>

                <button
                  onClick={() => setMetodo('plin')}
                  className={`w-full p-3 rounded-lg text-left transition ${
                    metodo === 'plin'
                      ? 'bg-blue-600 border border-blue-500 text-white'
                      : 'bg-slate-700 border border-slate-600 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  💰 <span className="font-semibold">Plin</span>
                  <p className="text-sm text-gray-300 mt-1">Sistema de pagos integrado</p>
                </button>
              </div>
            </div>

            {/* Monto */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">Monto a Pagar</label>
              <input
                type="number"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                min="0"
                step="0.01"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep('confirmation')}
                disabled={loading}
                className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition disabled:opacity-50"
              >
                Atrás
              </button>
              <button
                onClick={() => setStep('receipt')}
                disabled={loading}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition disabled:opacity-50"
              >
                Continuar
              </button>
            </div>
          </>
        )}

        {/* PASO 3: SUBIR COMPROBANTE */}
        {step === 'receipt' && (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">📄 Comprobante de Pago</h2>
              <p className="text-gray-400">Sube la evidencia de tu pago</p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-900 border border-red-700 text-red-200 rounded-lg text-sm flex gap-2">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {/* Preview */}
            {filePreview && (
              <div className="mb-6">
                <p className="text-white font-semibold mb-2">Vista Previa</p>
                <img
                  src={filePreview}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg border border-slate-600"
                />
              </div>
            )}

            {/* Upload Area */}
            <div className="mb-6">
              <label className="block border-2 border-dashed border-slate-600 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={loading}
                />
                <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                <p className="text-white font-semibold">Haz clic para subir</p>
                <p className="text-gray-400 text-sm mt-1">PNG, JPG o GIF (máx 5MB)</p>
              </label>
            </div>

            {/* Info */}
            <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-4 mb-6">
              <p className="text-blue-200 text-sm">
                ℹ️ Sube una captura clara de tu comprobante de pago (transferencia, Yape, etc.)
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep('payment')}
                disabled={loading}
                className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition disabled:opacity-50"
              >
                Atrás
              </button>
              <button
                onClick={handleSubirComprobante}
                disabled={loading || !file}
                className="flex-1 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    Confirmar Pago
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* PASO 4: ÉXITO */}
        {step === 'success' && (
          <>
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-6">
                <Check size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">¡Compra Completada!</h2>
              <div className="bg-slate-700 rounded-lg p-6 mb-6 text-left space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">Curso</p>
                  <p className="text-white font-bold">{curso.titulo}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Estado</p>
                  <p className="text-yellow-400 font-bold">⏳ Pendiente de Aprobación</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Próximo Paso</p>
                  <p className="text-blue-400 font-semibold">El administrador revisará tu comprobante</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                Te notificaremos cuando tu pago sea aprobado. Mientras tanto, puedes ver tus compras en tu dashboard.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    router.push('/dashboard');
                    onClose();
                  }}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
                >
                  Ir a Dashboard
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
