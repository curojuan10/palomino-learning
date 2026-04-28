'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { obtenerCompraId } from '@/lib/compras';
import { crearPago, subirComprobanteStorage } from '@/lib/pagos';

export default function SubirComprobanePage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const compraId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [compra, setCompra] = useState<any>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    monto: '',
    metodoPago: 'transferencia',
  });

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
      setFormData({
        ...formData,
        monto: data.curso?.precio?.toString() || '',
      });
    } catch (err) {
      console.error('Error loading compra:', err);
      setError('Error al cargar la compra');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      // Validar que sea imagen
      if (!f.type.startsWith('image/')) {
        setError('Por favor selecciona una imagen');
        return;
      }

      // Validar tamaño (máx 5MB)
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Validaciones
      if (!file) {
        setError('Por favor selecciona un comprobante de pago');
        setSubmitting(false);
        return;
      }

      if (!formData.monto || parseFloat(formData.monto) <= 0) {
        setError('El monto debe ser mayor a 0');
        setSubmitting(false);
        return;
      }

      // Subir imagen a Storage
      const comprobanteUrl = await subirComprobanteStorage(file, compraId);
      if (!comprobanteUrl) throw new Error('No se pudo subir el comprobante');

      // Crear registro en tabla pagos
      await crearPago({
        compra_id: compraId,
        comprobante_url: comprobanteUrl,
        monto: parseFloat(formData.monto),
        estado: 'PENDIENTE',
      });

      alert('¡Comprobante enviado exitosamente! El administrador lo revisará pronto.');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Error uploading comprobante:', err);
      
      // Mejorar mensaje de error
      let errorMessage = 'Error al subir el comprobante.';
      
      if (err.message.includes('bucket')) {
        errorMessage = err.message + '\n\nPor favor, contacta al administrador.';
      } else if (err.message.includes('permiso')) {
        errorMessage = 'No tienes permisos para subir archivos. Por favor contacta al administrador.';
      } else {
        errorMessage = err.message || 'Error desconocido. Por favor intenta de nuevo.';
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Cargando compra...</p>
        </div>
      </div>
    );
  }

  if (!compra) {
    return (
      <div className="text-center text-white py-12">
        <p className="text-lg text-red-400">{error || 'Compra no encontrada'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">💳 Subir Comprobante de Pago</h1>
        <p className="text-gray-400 mt-1">Carga la imagen de tu comprobante para procesar tu pago</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {/* Compra Info */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">📚 Información de tu Compra</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Curso:</span>
            <span className="text-white font-semibold">{compra.curso?.titulo}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Monto a Pagar:</span>
            <span className="text-green-400 font-bold text-lg">S/{compra.curso?.precio}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Estado:</span>
            <span className="text-yellow-400 font-semibold">
              ⏳ Pendiente de Pago
            </span>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-4">
        <p className="text-blue-200 text-sm">
          ℹ️ <strong>Métodos de pago aceptados:</strong> Transferencia bancaria, depósito en cuenta, Yape, Plin, Izipay.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-6">
        
        {/* Monto */}
        <div>
          <label className="block text-white font-semibold mb-2">Monto Pagado (S/) *</label>
          <input
            type="number"
            name="monto"
            value={formData.monto}
            onChange={handleInputChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            disabled={submitting}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 transition"
            required
          />
        </div>

        {/* Método de Pago */}
        <div>
          <label className="block text-white font-semibold mb-2">Método de Pago *</label>
          <select
            name="metodoPago"
            value={formData.metodoPago}
            onChange={handleInputChange}
            disabled={submitting}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 transition"
            required
          >
            <option value="transferencia">Transferencia Bancaria</option>
            <option value="deposito">Depósito en Cuenta</option>
            <option value="yape">Yape</option>
            <option value="plin">Plin</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        {/* Comprobante */}
        <div>
          <label className="block text-white font-semibold mb-3">📄 Comprobante de Pago *</label>
          <div className="flex gap-6">
            {/* Preview */}
            <div className="flex-shrink-0">
              {filePreview ? (
                <img
                  src={filePreview}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded-lg border border-slate-700"
                />
              ) : (
                <div className="w-40 h-40 bg-slate-700 rounded-lg border border-slate-600 flex items-center justify-center text-gray-400">
                  Sin comprobante
                </div>
              )}
            </div>

            {/* Upload */}
            <div className="flex-1">
              <label className="block text-center border-2 border-dashed border-slate-600 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={submitting}
                />
                <div className="text-gray-400">
                  <div className="text-2xl mb-2">📸</div>
                  <p className="font-medium">Haz clic para seleccionar imagen</p>
                  <p className="text-sm">PNG, JPG o GIF (max 5MB)</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-6 border-t border-slate-700">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-3 bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? '⏳ Subiendo...' : '✅ Subir Comprobante'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            disabled={submitting}
            className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition disabled:opacity-50"
          >
            ← Volver
          </button>
        </div>
      </form>
    </div>
  );
}
