import { createClient } from '@/lib/supabase';

/**
 * Obtener configuración de métodos de pago
 */
export async function obtenerConfiguracionPagos() {
  const client = createClient();

  try {
    const { data, error } = await client
      .from('configuracion_pagos')
      .select('*')
      .eq('activo', true);

    if (error) {
      console.warn('Tabla configuracion_pagos no existe o está vacía:', error);
      // Retornar datos por defecto si la tabla no existe
      return obtenerDatosPagoPorDefecto();
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching payment config:', error);
    return obtenerDatosPagoPorDefecto();
  }
}

/**
 * Obtener datos de pago por defecto (fallback)
 */
function obtenerDatosPagoPorDefecto() {
  return [
    {
      metodo: 'yape',
      numero: '+51 987654321',
      titular: 'Palomino Learning SAC',
      activo: true,
    },
    {
      metodo: 'transferencia',
      numero: '12345678901234567890',
      banco: 'BCP',
      cci: '0021234567890123456789',
      titular: 'Palomino Learning SAC',
      activo: true,
    },
    {
      metodo: 'plin',
      numero: '+51 987654321',
      titular: 'Palomino Learning SAC',
      activo: true,
    },
  ];
}

/**
 * Obtener datos de pago por método
 */
export async function obtenerDatoPagoPorMetodo(metodo: string) {
  const configs = await obtenerConfiguracionPagos();
  return configs.find((c: any) => c.metodo === metodo);
}
