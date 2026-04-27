import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas públicas que no necesitan protección
  const publicRoutes = ['/', '/courses', '/auth/login', '/auth/register'];
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  try {
    // Crear cliente Supabase seguro para el middleware
    let supabaseResponse = NextResponse.next({
      request,
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              supabaseResponse.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    // Obtener usuario actual usando supabase.auth.getUser()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    // Si no hay sesión/usuario
    if (!user || userError) {
      // Si intenta acceder a rutas protegidas, redirige a login
      if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
        console.log('ACCESO DENEGADO: Sin sesión activa en ruta', pathname);
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
      return supabaseResponse;
    }

    // Obtener rol del usuario desde la tabla Usuarios
    const { data: userData, error: dataError } = await supabase
      .from('usuarios')
      .select('rol_id')
      .eq('id', user.id)
      .single();

    if (dataError || !userData) {
      console.log('Error obteniendo rol del usuario:', dataError?.message);
      // Sin acceso a la tabla, redirigir a login
      if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
      return supabaseResponse;
    }

    const rolId = userData.rol_id;

    // Proteger /admin: solo si rol_id es 1
    if (pathname.startsWith('/admin') && rolId !== 1) {
      console.log('ACCESO DENEGADO: Usuario con rol_id=' + rolId + ' intentó acceder a /admin');
      return NextResponse.redirect(new URL('/courses', request.url));
    }

    // Proteger /dashboard: requiere estar logueado (ya validado arriba)
    if (pathname.startsWith('/dashboard') && !user) {
      console.log('ACCESO DENEGADO: Sin sesión en /dashboard');
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    return supabaseResponse;
  } catch (error) {
    console.error('Middleware error:', error);
    // En caso de error, permitir pasar (es más seguro que bloquear)
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Proteger todas las rutas excepto:
     * - api (API routes)
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico (favicon)
     * - public (archivos públicos)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};

