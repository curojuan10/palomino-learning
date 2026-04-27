'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { login, getUserRole } from '@/lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!email || !password) {
      setError('Por favor completa todos los campos');
      setIsLoading(false);
      return;
    }

    try {
      // Usar supabase.auth.signInWithPassword
      const result = await login(email, password);

      if (!result.success) {
        // Mostrar mensaje de error en español
        setError('Credenciales inválidas');
        setIsLoading(false);
        return;
      }

      if (result.user) {
        console.log('Sesión iniciada para usuario:', result.user.id);
        
        // Consultar rol en la tabla Usuarios
        const roleResult = await getUserRole(result.user.id);
        const rolId = roleResult.rol_id;
        
        console.log('rol_id obtenido:', rolId);
        
        // Redirección inteligente según rol_id
        if (rolId === 1) {
          // Admin
          console.log('→ Redirigiendo a /admin (rol_id=1)');
          router.push('/admin');
        } else {
          // Cliente (rol_id === 2)
          console.log('→ Redirigiendo a /courses (rol_id=' + rolId + ')');
          router.push('/courses');
        }
      }
    } catch (err: any) {
      console.error('Error en login:', err);
      setError('Credenciales inválidas');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError('');

      const { data, error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (googleError) {
        console.error('Google login error:', googleError);
        setError('Error al iniciar sesión con Google');
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Google OAuth error:', err);
      setError('Error al iniciar sesión con Google');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="text-4xl">🎓</span>
          <span className="text-2xl font-bold text-white">Palomino</span>
        </Link>

        {/* Form Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">Iniciar Sesión</h1>
          <p className="text-gray-400 text-center mb-6">Bienvenido de vuelta</p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg text-sm">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 border-t border-slate-700"></div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-3 bg-white hover:bg-gray-100 text-gray-900 font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {isLoading ? 'Cargando...' : 'Iniciar con Google'}
          </button>

          {/* Divider */}
          <div className="my-6 border-t border-slate-700"></div>
          <p className="text-center text-gray-400">
            ¿No tienes cuenta?{' '}
            <Link href="/auth/register" className="text-blue-400 hover:text-blue-300 font-semibold transition">
              Registrarse aquí
            </Link>
          </p>

          {/* Back home */}
          <p className="text-center text-gray-600 text-sm mt-4">
            <Link href="/" className="hover:text-gray-400 transition">
              ← Volver al inicio
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
