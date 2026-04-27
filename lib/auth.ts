import { createClient } from './supabase'

/**
 * Registrar nuevo usuario
 * @param email - Email del usuario
 * @param password - Contraseña
 * @param nombre - Nombre completo
 */
export async function signup(email: string, password: string, nombre: string) {
  const supabase = createClient()

  try {
    // 1. Crear usuario en Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre, // Metadata que se pasará a la función trigger
        },
      },
    })

    if (authError) throw authError
    if (!authData.user) throw new Error('No user created')

    // 2. La sincronización hacia `usuarios` la hace el trigger on_auth_user_created.
    // Evitamos insertar aquí para no generar conflictos por clave duplicada.

    return {
      success: true,
      user: authData.user,
      message: 'Usuario registrado exitosamente.',
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Error al registrar',
    }
  }
}

/**
 * Iniciar sesión
 * @param email - Email del usuario
 * @param password - Contraseña
 */
export async function login(email: string, password: string) {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    if (!data.user) throw new Error('No user found')

    return {
      success: true,
      user: data.user,
      message: 'Sesión iniciada exitosamente',
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Error al iniciar sesión',
    }
  }
}

/**
 * Cerrar sesión
 */
export async function logout() {
  const supabase = createClient()

  try {
    const { error } = await supabase.auth.signOut()

    if (error) throw error

    // Limpiar cookies del rol
    await fetch('/api/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).catch(() => {
      // Ignorar error si falla, la sesión se cierra de todas formas
    })

    return {
      success: true,
      message: 'Sesión cerrada exitosamente',
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Error al cerrar sesión',
    }
  }
}

/**
 * Obtener usuario actual autenticado
 */
export async function getCurrentUser() {
  const supabase = createClient()

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) throw error

    return {
      success: true,
      user,
    }
  } catch (error: any) {
    return {
      success: false,
      user: null,
      error: error.message,
    }
  }
}

/**
 * Obtener sesión actual
 */
export async function getSession() {
  const supabase = createClient()

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) throw error

    return {
      success: true,
      session,
    }
  } catch (error: any) {
    return {
      success: false,
      session: null,
      error: error.message,
    }
  }
}

/**
 * Obtener usuario de la tabla usuarios (datos adicionales)
 * Nota: Esta función intenta leer de usuarios con RLS deshabilitado
 * @param userId - ID del usuario autenticado
 */
export async function getUserProfile(userId: string) {
  const supabase = createClient()

  try {
    // Intentar leer directamente (requiere RLS deshabilitado en usuarios)
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, email, nombre, rol_id')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('getUserProfile error:', error)
      throw error
    }

    return {
      success: true,
      profile: data,
    }
  } catch (error: any) {
    console.error('getUserProfile exception:', error.message)
    return {
      success: false,
      profile: null,
      error: error.message,
    }
  }
}

/**
 * Obtener rol del usuario (método alternativo para login)
 * @param userId - ID del usuario autenticado
 */
export async function getUserRole(userId: string) {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('rol_id')
      .eq('id', userId)
      .single()

    if (error) throw error

    return {
      success: true,
      rol_id: data?.rol_id || 2, // Default a cliente (2) si no existe
    }
  } catch (error: any) {
    console.error('getUserRole error:', error)
    // Si falla, devolver rol de cliente como default
    return {
      success: false,
      rol_id: 2, // Default cliente
      error: error.message,
    }
  }
}
