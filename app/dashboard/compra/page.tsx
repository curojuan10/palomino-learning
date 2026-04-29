'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { crearCompra } from '@/lib/compras';

export default function CompraFlowPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const procesarCompra = async () => {
      try {
        // 🔧 BUG 1 & 2: Leer pending_purchase del sessionStorage
        const pendingPurchaseJson = sessionStorage.getItem('pending_purchase');
        
        if (!pendingPurchaseJson) {
          console.log('❌ No hay pending_purchase en sessionStorage');
          router.push('/dashboard');
          return;
        }

        const pendingPurchase = JSON.parse(pendingPurchaseJson);
        console.log('✅ Pending purchase encontrado:', pendingPurchase);

        if (!user?.id) {
          setError('Usuario no autenticado');
          setLoading(false);
          return;
        }

        // Crear la compra automáticamente
        console.log('📝 Creando compra para curso:', pendingPurchase.id);
        const compra = await crearCompra(user.id, String(pendingPurchase.id));
        
        console.log('✅ Compra creada:', compra);

        // Limpiar sessionStorage
        sessionStorage.removeItem('pending_purchase');

        // Redirigir al formulario de comprobante de la compra creada
        router.push(`/dashboard/compra/${compra.id}`);
      } catch (err: any) {
        console.error('❌ Error al procesar compra:', err);
        setError(err.message || 'Error al procesar la compra');
        setLoading(false);
      }
    };

    procesarCompra();
  }, [user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Procesando tu compra...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900 border border-red-700 rounded-lg p-8 text-center">
        <p className="text-red-200 text-lg mb-4">❌ Error: {error}</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
        >
          Volver al Dashboard
        </button>
      </div>
    );
  }

  return null;
}
