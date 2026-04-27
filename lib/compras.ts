import { createClient } from '@/lib/supabase';

// Crear una nueva compra
export async function crearCompra(usuarioId: string, cursoId: string) {
  const client = createClient();
  
  // Validar que usuario_id sea UUID válido
  if (!usuarioId || typeof usuarioId !== 'string' || usuarioId.trim() === '') {
    console.error('❌ usuario_id inválido:', { usuarioId, type: typeof usuarioId });
    throw new Error('usuario_id debe ser un UUID válido');
  }

  // Convertir cursoId a número (int8)
  const cursoIdNumero = parseInt(cursoId, 10);
  if (isNaN(cursoIdNumero)) {
    console.error('❌ curso_id no es un número válido:', { cursoId, cursoIdNumero });
    throw new Error(`curso_id debe ser un número válido. Recibido: ${cursoId}`);
  }

  console.log('📊 Datos para insert en compras:', {
    usuario_id: usuarioId,
    curso_id: cursoIdNumero,
    estado: 'PENDIENTE',
  });

  const { data, error } = await client
    .from('compras')
    .insert([
      {
        usuario_id: usuarioId,
        curso_id: cursoIdNumero,
        estado: 'PENDIENTE',
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('❌ Error de Supabase al crear compra:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw new Error(`Error en BD: ${error.message}`);
  }

  console.log('✅ Compra creada exitosamente:', data);
  return data;
}

// Obtener todas las compras del usuario
export async function obtenerComprasUsuario(usuarioId: string) {
  const client = createClient();
  
  const { data: compras, error: errorCompras } = await client
    .from('compras')
    .select('id, usuario_id, curso_id, estado')
    .eq('usuario_id', usuarioId);

  if (errorCompras) throw errorCompras;
  if (!compras || compras.length === 0) return [];

  // Obtener datos de cursos
  const cursoIds = compras.map((c: any) => c.curso_id).filter(Boolean);
  const { data: cursos = [] } = await client
    .from('cursos')
    .select('id, nombre, precio, imagen_url')
    .in('id', cursoIds);

  // Obtener datos de pagos
  const { data: pagos = [] } = await client
    .from('pagos')
    .select('id, compra_id, estado, monto')
    .in('compra_id', compras.map((c: any) => c.id));

  // Combinar datos
  const resultado = compras.map((compra: any) => {
    const curso = (cursos || []).find((c: any) => c.id === compra.curso_id);
    const pago = (pagos || []).find((p: any) => p.compra_id === compra.id);

    return {
      ...compra,
      curso: {
        titulo: curso?.nombre || 'Curso no disponible',
        precio: curso?.precio || 0,
        imagen_url: curso?.imagen_url,
      },
      pago: pago || null,
    };
  });

  return resultado;
}

// Obtener una compra por ID
export async function obtenerCompraId(compraId: string) {
  const client = createClient();
  
  const { data: compra, error: errorCompra } = await client
    .from('compras')
    .select('id, usuario_id, curso_id, estado')
    .eq('id', compraId)
    .single();

  if (errorCompra) throw errorCompra;
  if (!compra) return null;

  // Obtener datos del curso
  const { data: curso } = await client
    .from('cursos')
    .select('id, nombre, precio, descripcion, imagen_url')
    .eq('id', compra.curso_id)
    .single();

  // Obtener datos del pago
  const { data: pago } = await client
    .from('pagos')
    .select('id, estado, monto, comprobante_url')
    .eq('compra_id', compraId)
    .single();

  return {
    ...compra,
    curso: {
      ...curso,
      titulo: curso?.nombre, // Normalizar: mapear nombre a titulo
    },
    pago,
  };
}

// Verificar si el usuario ya compró un curso
export async function usuarioYaComproCurso(usuarioId: string, cursoId: string) {
  const client = createClient();
  
  const { data } = await client
    .from('compras')
    .select('id')
    .eq('usuario_id', usuarioId)
    .eq('curso_id', cursoId)
    .single();

  return !!data;
}

// Obtener compras de un usuario (con estado de pago)
export async function obtenerComprasUsuarioConPago(usuarioId: string) {
  const client = createClient();
  
  const { data: compras = [] } = await client
    .from('compras')
    .select('id, usuario_id, curso_id, estado')
    .eq('usuario_id', usuarioId);

  if ((compras || []).length === 0) return [];

  // Obtener pagos asociados
  const { data: pagos = [] } = await client
    .from('pagos')
    .select('id, compra_id, estado, monto')
    .in('compra_id', (compras || []).map((c: any) => c.id));

  // Combinar y retornar
  return (compras || []).map((compra: any) => ({
    ...compra,
    pago: (pagos || []).find((p: any) => p.compra_id === compra.id) || null,
  }));
}
