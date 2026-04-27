import { createClient } from '@/lib/supabase';

/**
 * Valida que los buckets requeridos existan en Supabase Storage
 * Si no existen, retorna información para crear manualmente
 */
export async function validarBucketsRequeridos() {
  const client = createClient();
  const bucketsRequeridos = ['curso-images', 'comprobantes'];
  const bucketsExistentes: string[] = [];
  const bucketsFaltantes: string[] = [];

  try {
    // Obtener lista de buckets
    const { data: buckets, error } = await client.storage.listBuckets();

    if (error) {
      console.error('Error al listar buckets:', error);
      return {
        validos: false,
        error: 'No se pueden verificar los buckets. Asegúrate de tener permisos en Supabase.',
        bucketsFaltantes,
      };
    }

    const nombresExistentes = buckets?.map((b) => b.name) || [];

    // Verificar cuáles existen
    for (const bucket of bucketsRequeridos) {
      if (nombresExistentes.includes(bucket)) {
        bucketsExistentes.push(bucket);
      } else {
        bucketsFaltantes.push(bucket);
      }
    }

    return {
      validos: bucketsFaltantes.length === 0,
      bucketsExistentes,
      bucketsFaltantes,
      error: bucketsFaltantes.length > 0 ? `Faltan buckets: ${bucketsFaltantes.join(', ')}` : null,
    };
  } catch (err) {
    console.error('Error validando buckets:', err);
    return {
      validos: false,
      error: 'Error al validar buckets. Revisa la consola para más detalles.',
      bucketsFaltantes,
    };
  }
}

/**
 * Sube un archivo a Storage con manejo mejorado de errores
 */
export async function subirArchivoSeguro(
  file: File,
  bucketName: string,
  ruta: string
): Promise<{ url: string | null; error: string | null }> {
  const client = createClient();

  try {
    // Validar que el archivo no esté vacío
    if (!file || file.size === 0) {
      return {
        url: null,
        error: 'El archivo está vacío. Por favor selecciona un archivo válido.',
      };
    }

    // Intentar subir
    const { data, error } = await client.storage
      .from(bucketName)
      .upload(ruta, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      // Analizar tipo de error
      const errorMsg = error.message.toLowerCase();

      if (errorMsg.includes('not found') || errorMsg.includes('does not exist')) {
        return {
          url: null,
          error: `El bucket '${bucketName}' no existe en Supabase Storage. Debes crearlo manualmente en el dashboard.`,
        };
      } else if (errorMsg.includes('permission') || errorMsg.includes('unauthorized')) {
        return {
          url: null,
          error: 'No tienes permisos para subir archivos. Verifica las políticas RLS en Supabase.',
        };
      } else if (errorMsg.includes('already exists')) {
        return {
          url: null,
          error: 'El archivo ya existe. Intenta con un nombre diferente.',
        };
      } else {
        return {
          url: null,
          error: `Error al subir archivo: ${error.message}`,
        };
      }
    }

    // Obtener URL pública
    const { data: publicData } = client.storage.from(bucketName).getPublicUrl(ruta);

    return {
      url: publicData.publicUrl,
      error: null,
    };
  } catch (err: any) {
    console.error('Error subiendo archivo:', err);
    return {
      url: null,
      error: `Error inesperado: ${err?.message || 'Revisa la consola'}`,
    };
  }
}

/**
 * Instrucciones para crear un bucket manualmente
 */
export function obtenerInstruccionesCrearBucket(nombreBucket: string): string {
  return `
Para crear el bucket '${nombreBucket}' manualmente:

1. Ve a tu Dashboard de Supabase
2. Haz clic en "Storage" en el menú lateral
3. Haz clic en "+ New bucket"
4. Nombre del bucket: ${nombreBucket}
5. ${nombreBucket === 'curso-images' ? 'Marca como PÚBLICO ✓' : 'Marca como PRIVADO ✓'}
6. Haz clic en "Create bucket"

Después de crear el bucket, reinicia tu aplicación.
`;
}
