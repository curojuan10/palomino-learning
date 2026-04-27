'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search, ChevronDown, Rocket, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    const client = createClient();
    await client.auth.signOut();
    router.push('/');
    window.location.reload();
  };

  return (
    <nav className="bg-[#0b1120] text-slate-300 border-b border-slate-800 sticky top-0 z-[100] w-full font-sans">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* SECCIÓN IZQUIERDA: Logo y Navegación Principal */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-900/20 group-hover:scale-105 transition">
              <Rocket size={20} fill="currentColor" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Palomino</span>
          </Link>

          {/* Enlaces estilo EDteam */}
          <div className="hidden lg:flex items-center gap-7 text-[14.5px] font-medium">
            <Link href="/courses" className="hover:text-white transition">Cursos</Link>
      
            <button className="flex items-center gap-1 hover:text-white transition">
              Escuelas <ChevronDown size={14} className="mt-0.5 text-slate-500" />
            </button>
            
          </div>
        </div>

        {/* SECCIÓN DERECHA: Buscador y Acciones */}
        <div className="flex items-center gap-6">
          
          {/* Barra de búsqueda minimalista */}
          <div className="hidden xl:flex relative group">
            <input 
              type="text" 
              placeholder="Busca en Palomino" 
              className="bg-slate-900/50 border border-slate-800 rounded-md py-1.5 pl-4 pr-10 text-sm w-64 focus:outline-none focus:border-blue-500/50 focus:bg-slate-900 transition"
            />
            <Search className="absolute right-3 top-2 text-slate-500 group-focus-within:text-blue-500 transition" size={16} />
          </div>

          <div className="hidden md:flex items-center gap-6 text-[14.5px] font-medium">
            {loading ? (
              <div className="px-4 py-1.5 text-slate-400">Cargando...</div>
            ) : user ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <p className="text-white font-semibold text-sm">{user.email?.split('@')[0]}</p>
                  <p className="text-slate-500 text-xs">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md transition active:scale-95"
                >
                  <LogOut size={16} />
                  Salir
                </button>
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="hover:text-white transition">Inicia sesión</Link>
                <Link 
                  href="/auth/register" 
                  className="border-2 border-blue-600 text-blue-500 px-5 py-1.5 rounded-md hover:bg-blue-600 hover:text-white transition duration-300 active:scale-95"
                >
                  Comienza gratis
                </Link>
              </>
            )}
          </div>

          {/* Menú móvil */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-slate-400 hover:text-white">
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Menú Móvil Desplegable */}
      {isOpen && (
        <div className="lg:hidden bg-[#0b1120] border-t border-slate-800 p-6 flex flex-col gap-5 animate-in slide-in-from-top duration-300">
          <Link href="/courses" className="text-lg">Cursos</Link>
          <Link href="/rutas" className="text-lg">Rutas</Link>
          <Link href="/premium" className="text-lg text-yellow-500 font-bold">Premium ★</Link>
          <div className="h-px bg-slate-800 my-2" />
          {loading ? (
            <div className="text-center py-3 text-slate-400">Cargando...</div>
          ) : user ? (
            <>
              <div className="px-4 py-3 bg-slate-700 rounded-lg">
                <p className="text-white font-semibold text-sm">{user.email?.split('@')[0]}</p>
                <p className="text-slate-400 text-xs">{user.email}</p>
              </div>
              <Link href="/dashboard" className="text-center py-3 border border-blue-600 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition">
                Mi Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition"
              >
                <LogOut size={18} />
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-center py-3 border border-slate-700 rounded-lg">Inicia sesión</Link>
              <Link href="/auth/register" className="bg-blue-600 text-white text-center py-3 rounded-lg font-bold">Comienza gratis</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}