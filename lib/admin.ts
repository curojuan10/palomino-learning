import { createClient } from '@/lib/supabase';
import { subirArchivoSeguro } from '@/lib/storage-utils';

// Obtener rol del usuario actual
export async function obtenerRolUsuario() {
  const client = createClient();
  
  try {
    // Obtener usuario autenticado
    const { data: { user }, error: errorAuth } = await client.auth.getUser();
    if (errorAuth || !user) throw new Error('No autenticado');

    // Obtener rol del usuario
    const { data, error } = await client
      .from('usuarios')
      .select('rol_id, roles(nombre)')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    const roles = data?.roles as { nombre: string } | { nombre: string }[] | null;
    const nombre = Array.isArray(roles) ? roles[0]?.nombre : roles?.nombre;
    return nombre || 'CLIENTE';
  } catch (err) {
    return 'CLIENTE';
  }
}

// Verificar si el usuario es admin
export async function esAdmin() {
  const rol = await obtenerRolUsuario();
  return rol === 'ADMIN';
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
  const { data, error } = await client
    .from('cursos')
    .update(courseData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Eliminar curso
export async function eliminarCurso(id: string) {
  const client = createClient();
  const { error } = await client.from('cursos').delete().eq('id', id);

  if (error) throw error;
  return true;
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

  // Total usuarios
  const { count: totalUsuarios = 0 } = await client
    .from('usuarios')
    .select('id', { count: 'exact', head: true });

  // Total cursos
  const { count: totalCursos = 0 } = await client
    .from('cursos')
    .select('id', { count: 'exact', head: true });

  // Pagos pendientes
  const { count: pagosPendientes = 0 } = await client
    .from('pagos')
    .select('id', { count: 'exact', head: true })
    .eq('estado', 'PENDIENTE');

  // Ingresos totales
  const { data: pagosAprobados } = await client
    .from('pagos')
    .select('monto')
    .eq('estado', 'APROBADO');

  const ingresoTotal = (pagosAprobados || []).reduce((sum, p) => sum + (p.monto || 0), 0);

  return {
    totalUsuarios: totalUsuarios || 0,
    totalCursos: totalCursos || 0,
    pagosPendientes: pagosPendientes || 0,
    ingresoTotal,
  };
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
