import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');

  // Si hay error de OAuth
  if (error) {
    console.error('OAuth error:', error);
    return NextResponse.redirect(new URL('/auth/login?error=auth-callback-error', request.url));
  }

  // Si no hay código, redirigir a login
  if (!code) {
    console.error('No code provided');
    return NextResponse.redirect(new URL('/auth/login?error=auth-callback-error', request.url));
  }

  try {
    // Crear cliente Supabase seguro para el servidor
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch (error) {
              console.error('Error setting cookies:', error);
            }
          },
        },
      }
    );

    // Intercambiar código por sesión
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError || !data.user) {
      console.error('Error exchanging code for session:', exchangeError);
      return NextResponse.redirect(new URL('/auth/login?error=auth-callback-error', request.url));
    }

    const userId = data.user.id;
    console.log('Usuario autenticado con OAuth:', userId);

    // Obtener rol del usuario de la tabla usuarios
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('rol_id')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      console.error('Error obteniendo rol del usuario:', userError);
      return NextResponse.redirect(new URL('/auth/login?error=auth-callback-error', request.url));
    }

    const rolId = userData.rol_id;
    console.log('rol_id obtenido:', rolId);

    // Redirección inteligente según rol
    if (rolId === 1) {
      // Admin
      console.log('→ Redirigiendo a /admin (rol_id=1)');
      return NextResponse.redirect(new URL('/admin', request.url));
    } else {
      // Cliente (rol_id === 2)
      console.log('→ Redirigiendo a /dashboard (rol_id=' + rolId + ')');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(new URL('/auth/login?error=auth-callback-error', request.url));
  }
}
