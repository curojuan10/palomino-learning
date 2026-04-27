import { createClient } from '@/lib/supabase';
import { subirArchivoSeguro } from '@/lib/storage-utils';

// Subir comprobante a Storage con manejo mejorado de errores
export async function subirComprobanteStorage(file: File, compraId: string) {
  const timestamp = Date.now();
  const nombreArchivo = `comprobante-${compraId}-${timestamp}.jpg`;

  const { url, error } = await subirArchivoSeguro(
    file,
    'comprobantes',
    `pagos/${nombreArchivo}`
  );

  if (error) {
    throw new Error(error);
  }

  return url;
}

// Crear registro de pago
export async function crearPago(pagoData: {
  compra_id: string;
  comprobante_url: string;
  monto: number;
  estado: string;
}) {
  const client = createClient();
  
  const { data, error } = await client
    .from('pagos')
    .insert([
      {
        compra_id: pagoData.compra_id,
        comprobante_url: pagoData.comprobante_url,
        monto: pagoData.monto,
        estado: pagoData.estado,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Obtener pago de una compra
export async function obtenerPagoCompra(compraId: string) {
  const client = createClient();
  
  const { data, error } = await client
    .from('pagos')
    .select('id, estado, monto, comprobante_url')
    .eq('compra_id', compraId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = row not found
  return data || null;
}

// Actualizar estado de pago
export async function actualizarEstadoPago(pagoId: string, estado: string) {
  const client = createClient();
  
  const { data, error } = await client
    .from('pagos')
    .update({ estado })
    .eq('id', pagoId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
