import { createClient } from '@/lib/supabase';
import { subirArchivoSeguro } from '@/lib/storage-utils';

// Obtener rol del usuario actual
export async function obtenerRolUsuario() {
  const client = createClient();
  
  try {
    // Obtener usuario autenticado
    const { data: { user }, error: errorAuth } = await client.auth.getUser();
    if (errorAuth || !user) throw new Error('No autenticado');

    // Obtener rol_id del usuario directamente
    const { data, error } = await client
      .from('usuarios')
      .select('rol_id')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    
    // Retornar el rol_id (1 = ADMIN, 2 = CLIENTE)
    return data?.rol_id || 2;
  } catch (err) {
    console.error('Error obteniendo rol:', err);
    return 2; // CLIENTE por defecto
  }
}

// Verificar si el usuario es admin
export async function esAdmin() {
  const rolId = await obtenerRolUsuario();
  return rolId === 1; // 1 es ADMIN
}

// Obtener todos los cursos
export async function getCursos() {
  const client = createClient();
  const { data, error } = await client
    .from('cursos')
    .select('*');

  if (error) throw error;
  
  // Normalizar datos: mapear 'nombre' a 'titulo' para coherencia
  return (data || []).map((curso: any) => ({
    ...curso,
    titulo: curso.nombre,
  }));
}

// Obtener un curso por ID
export async function getCursoById(id: string) {
  const client = createClient();
  const { data, error } = await client
    .from('cursos')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  
  // Normalizar datos: mapear 'nombre' a 'titulo'
  return {
    ...data,
    titulo: data?.nombre,
  };
}

// Crear nuevo curso
export async function crearCurso(courseData: {
  titulo: string;
  descripcion: string;
  precio: number;
  categoria: string;
  duracion: string;
  imagen_url?: string;
  estado: boolean;
}) {
  const client = createClient();
  
  // Verificar que el usuario sea admin
  const admin = await esAdmin();
  if (!admin) {
    throw new Error('No tienes permiso para crear cursos. Solo administradores pueden crear cursos.');
  }

  // Validar que todos los campos obligatorios estén presentes
  if (!courseData.titulo || !courseData.descripcion || courseData.precio === undefined || !courseData.categoria || !courseData.duracion) {
    throw new Error('Faltan campos obligatorios: titulo, descripcion, precio, categoria, duracion');
  }

  const { data, error } = await client
    .from('cursos')
    .insert([
      {
        nombre: courseData.titulo,
        descripcion: courseData.descripcion,
        precio: courseData.precio,
        categoria: courseData.categoria,
        duracion: courseData.duracion,
        imagen_url: courseData.imagen_url || null,
        estado: courseData.estado,
        fecha_creacion: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating course:', error);
    throw new Error(`Error al crear curso: ${error.message}`);
  }

  return data;
}

// Actualizar curso
export async function actualizarCurso(
  id: string,
  courseData: {
    nombre?: string;
    descripcion?: string;
    precio?: number;
    categoria?: string;
    duracion?: string;
    imagen_url?: string;
    estado?: boolean;
  }
) {
  const client = createClient();
  
  // Verificar que el usuario sea admin
  const admin = await esAdmin();
  if (!admin) {
    throw new Error('No tienes permiso para actualizar cursos. Solo administradores pueden actualizar cursos.');
  }

  const { data, error } = await client
    .from('cursos')
    .update(courseData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Supabase update error:', error);
    throw new Error(`Error al actualizar: ${error.message}`);
  }
  return data;
}

// Eliminar curso (o desactivar si tiene compras)
export async function eliminarCurso(id: string) {
  const client = createClient();
  
  // Verificar que el usuario sea admin
  const admin = await esAdmin();
  if (!admin) {
    throw new Error('No tienes permiso para eliminar cursos. Solo administradores pueden eliminar cursos.');
  }

  // Verificar si hay compras asociadas a este curso
  const { data: compras, error: errorCompras } = await client
    .from('compras')
    .select('id')
    .eq('curso_id', id);

  if (errorCompras) {
    console.error('Error verificando compras:', errorCompras);
    throw new Error('Error al verificar compras del curso');
  }

  // Si hay compras, desactivar el curso en lugar de eliminarlo
  if (compras && compras.length > 0) {
    const { error: updateError } = await client
      .from('cursos')
      .update({ estado: false })
      .eq('id', id);

    if (updateError) {
      console.error('Supabase update error:', updateError);
      throw new Error(`Curso desactivado (tiene ${compras.length} compra${compras.length !== 1 ? 's' : ''} asociada${compras.length !== 1 ? 's' : ''})`);
    }
    
    return { deleted: false, deactivated: true, message: `Curso desactivado. No se puede eliminar porque tiene ${compras.length} compra${compras.length !== 1 ? 's' : ''} asociada${compras.length !== 1 ? 's' : ''}.` };
  }

  // Si no hay compras, eliminar el curso
  const { error } = await client.from('cursos').delete().eq('id', id);

  if (error) {
    console.error('Supabase delete error:', error);
    throw new Error(`Error al eliminar: ${error.message}`);
  }
  
  return { deleted: true, deactivated: false, message: 'Curso eliminado correctamente' };
}

// Subir imagen a Storage con manejo mejorado de errores
export async function subirImagenCurso(file: File, nombreCurso: string) {
  const timestamp = Date.now();
  const nombreArchivo = `curso-${nombreCurso.replace(/\s+/g, '-')}-${timestamp}.jpg`;

  const { url, error } = await subirArchivoSeguro(
    file,
    'curso-images',
    `cursos/${nombreArchivo}`
  );

  if (error) {
    throw new Error(error);
  }

  return url;
}

// Obtener estadísticas admin
export async function getEstadisticasAdmin() {
  const client = createClient();

  try {
    console.log('📊 Obteniendo estadísticas del admin...');

    // Total usuarios
    console.log('👥 Contando usuarios...');
    const { count: totalUsuarios = 0, error: errorUsuarios } = await client
      .from('usuarios')
      .select('id', { count: 'exact', head: true });

    if (errorUsuarios) {
      console.warn('⚠️ Error al contar usuarios:', errorUsuarios);
    } else {
      console.log(`✅ Total usuarios: ${totalUsuarios}`);
    }

    // Total cursos
    console.log('📚 Contando cursos...');
    const { count: totalCursos = 0, error: errorCursos } = await client
      .from('cursos')
      .select('id', { count: 'exact', head: true });

    if (errorCursos) {
      console.warn('⚠️ Error al contar cursos:', errorCursos);
    } else {
      console.log(`✅ Total cursos: ${totalCursos}`);
    }

    // Pagos pendientes
    console.log('💳 Contando pagos pendientes...');
    const { count: pagosPendientes = 0, error: errorPagos } = await client
      .from('pagos')
      .select('id', { count: 'exact', head: true })
      .eq('estado', 'PENDIENTE');

    if (errorPagos) {
      console.warn('⚠️ Error al contar pagos:', errorPagos);
    } else {
      console.log(`✅ Pagos pendientes: ${pagosPendientes}`);
    }

    // Ingresos totales
    console.log('💰 Calculando ingresos...');
    const { data: pagosAprobados, error: errorIngresos } = await client
      .from('pagos')
      .select('monto')
      .eq('estado', 'APROBADO');

    if (errorIngresos) {
      console.warn('⚠️ Error al obtener ingresos:', errorIngresos);
    }

    const ingresoTotal = (pagosAprobados || []).reduce((sum, p) => sum + (p.monto || 0), 0);
    console.log(`✅ Ingresos totales: S/${ingresoTotal}`);

    const stats = {
      totalUsuarios: totalUsuarios || 0,
      totalCursos: totalCursos || 0,
      pagosPendientes: pagosPendientes || 0,
      ingresoTotal,
    };

    console.log('✅ Estadísticas completadas:', stats);
    return stats;
  } catch (err: any) {
    console.error('💥 Error en getEstadisticasAdmin:', err);
    throw err;
  }
}

// Obtener pagos pendientes
export async function getPagosPendientes() {
  const client = createClient();
  
  // Obtener pagos con su compra_id
  const { data: pagos, error } = await client
    .from('pagos')
    .select('id, estado, monto, comprobante_url, compra_id')
    .eq('estado', 'PENDIENTE');

  if (error) throw error;
  if (!pagos || pagos.length === 0) return [];

  // Obtener IDs de compras
  const compraIds = pagos.map((p: any) => p.compra_id).filter(Boolean);
  
  // Obtener datos de compras
  const { data: comprasData } = await client
    .from('compras')
    .select('id, usuario_id, curso_id')
    .in('id', compraIds);
  const compras = comprasData || [];

  // Obtener datos de usuarios
  const usuarioIds = compras.map((c: any) => c.usuario_id).filter(Boolean);
  const { data: usuariosData } = await client
    .from('usuarios')
    .select('id, nombre, email')
    .in('id', usuarioIds);
  const usuarios = usuariosData || [];

  // Obtener datos de cursos
  const cursoIds = compras.map((c: any) => c.curso_id).filter(Boolean);
  const { data: cursosData } = await client
    .from('cursos')
    .select('id, nombre')
    .in('id', cursoIds);
  const cursos = cursosData || [];

  // Combinar datos
  const resultado = pagos.map((pago: any) => {
    const compra = compras.find((c: any) => c.id === pago.compra_id);
    const usuario = usuarios.find((u: any) => u.id === compra?.usuario_id);
    const curso = cursos.find((c: any) => c.id === compra?.curso_id);

    return {
      ...pago,
      compra: {
        id: compra?.id,
        usuario: {
          nombre: usuario?.nombre || 'Desconocido',
          email: usuario?.email || 'N/A',
        },
        curso: {
          titulo: curso?.nombre || 'Curso eliminado',
        },
      },
    };
  });

  return resultado;
}

// Aprobar pago
export async function aprobarPago(pagoId: string) {
  const client = createClient();

  // Actualizar pago a aprobado
  const { data: pago, error: errorPago } = await client
    .from('pagos')
    .update({ estado: 'APROBADO' })
    .eq('id', pagoId)
    .select('compra_id')
    .single();

  if (errorPago) throw errorPago;

  // Actualizar compra a ACTIVO para habilitar acceso al curso
  if (pago?.compra_id) {
    const { error: errorCompra } = await client
      .from('compras')
      .update({ estado: 'ACTIVO' })
      .eq('id', pago.compra_id);

    if (errorCompra) throw errorCompra;
  }

  return true;
}

// Rechazar pago
export async function rechazarPago(pagoId: string) {
  const client = createClient();

  // Actualizar pago a rechazado
  const { data: pago, error: errorPago } = await client
    .from('pagos')
    .update({ estado: 'RECHAZADO' })
    .eq('id', pagoId)
    .select('compra_id')
    .single();

  if (errorPago) throw errorPago;

  // Actualizar compra a BLOQUEADO para impedir acceso
  if (pago?.compra_id) {
    const { error: errorCompra } = await client
      .from('compras')
      .update({ estado: 'BLOQUEADO' })
      .eq('id', pago.compra_id);

    if (errorCompra) throw errorCompra;
  }

  return true;
}

// Obtener todos los pagos procesados (aprobados y rechazados)
export async function getPagosProcessados() {
  const client = createClient();
  
  try {
    console.log('📦 Obteniendo pagos procesados...');
    
    // Obtener pagos procesados
    const { data: pagos, error } = await client
      .from('pagos')
      .select('id, estado, monto, metodo_pago, comprobante_url, compra_id')
      .neq('estado', 'PENDIENTE');

    if (error) {
      console.error('❌ Error en query de pagos:', error);
      throw new Error(`No se pudieron obtener pagos: ${error.message}`);
    }
    
    console.log(`✅ Pagos encontrados: ${pagos?.length || 0}`);
    
    if (!pagos || pagos.length === 0) {
      console.log('ℹ️ No hay pagos procesados');
      return [];
    }

    // Obtener IDs de compras
    const compraIds = pagos.map((p: any) => p.compra_id).filter(Boolean);
    console.log(`🔗 Buscando ${compraIds.length} compras...`);
    
    // Obtener datos de compras
    const { data: comprasData, error: errorCompras } = await client
      .from('compras')
      .select('id, usuario_id, curso_id')
      .in('id', compraIds);
    
    if (errorCompras) {
      console.error('❌ Error en query de compras:', errorCompras);
      throw new Error(`No se pudieron obtener compras: ${errorCompras.message}`);
    }
    
    const compras = comprasData || [];
    console.log(`✅ Compras encontradas: ${compras.length}`);

    // Obtener datos de usuarios
    const usuarioIds = compras.map((c: any) => c.usuario_id).filter(Boolean);
    console.log(`👥 Buscando ${usuarioIds.length} usuarios...`);
    
    const { data: usuariosData, error: errorUsuarios } = await client
      .from('usuarios')
      .select('id, nombre, email')
      .in('id', usuarioIds);
    
    if (errorUsuarios) {
      console.error('❌ Error en query de usuarios:', errorUsuarios);
      throw new Error(`No se pudieron obtener usuarios: ${errorUsuarios.message}`);
    }
    
    const usuarios = usuariosData || [];
    console.log(`✅ Usuarios encontrados: ${usuarios.length}`);

    // Obtener datos de cursos
    const cursoIds = compras.map((c: any) => c.curso_id).filter(Boolean);
    console.log(`📚 Buscando ${cursoIds.length} cursos...`);
    
    const { data: cursosData, error: errorCursos } = await client
      .from('cursos')
      .select('id, nombre')
      .in('id', cursoIds);
    
    if (errorCursos) {
      console.error('❌ Error en query de cursos:', errorCursos);
      throw new Error(`No se pudieron obtener cursos: ${errorCursos.message}`);
    }
    
    const cursos = cursosData || [];
    console.log(`✅ Cursos encontrados: ${cursos.length}`);

    // Combinar datos
    const resultado = pagos.map((pago: any) => {
      const compra = compras.find((c: any) => c.id === pago.compra_id);
      const usuario = usuarios.find((u: any) => u.id === compra?.usuario_id);
      const curso = cursos.find((c: any) => c.id === compra?.curso_id);

      return {
        ...pago,
        compra: {
          id: compra?.id,
          usuario: {
            nombre: usuario?.nombre || 'Desconocido',
            email: usuario?.email || 'N/A',
          },
          curso: {
            titulo: curso?.nombre || 'Curso eliminado',
          },
        },
      };
    });

    console.log(`✅ Reporte completado: ${resultado.length} pagos procesados`);
    return resultado;
  } catch (err: any) {
    console.error('💥 Error en getPagosProcessados:', err);
    throw err;
  }
}
