'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-300 mt-20">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Sobre Nosotros */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                🎓
              </div>
              <h3 className="text-white font-bold text-lg">Palomino Learning</h3>
            </div>
            <p className="text-sm leading-relaxed">
              Plataforma de educación en línea dedicada a proporcionar cursos de calidad en programación, diseño y más.
            </p>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h4 className="text-white font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/courses" className="hover:text-blue-400 transition">
                  Cursos
                </Link>
              </li>
              <li>
                <Link href="/home" className="hover:text-blue-400 transition">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-blue-400 transition">
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-blue-400 transition">
                  Registrarse
                </Link>
              </li>
            </ul>
          </div>

          {/* Información de Contacto */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-blue-400" />
                <a href="mailto:palominolearningcenter@gmail.com" className="hover:text-blue-400 transition">
                  palominolearningcenter@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-blue-400" />
                <a href="tel:+51910593571" className="hover:text-blue-400 transition">
                  +51 910 593571
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-blue-400 mt-0.5" />
                <span>Av. Maravillas Interior 3er Piso<br/>Ayacucho, Perú</span>
              </li>
            </ul>
          </div>

          {/* Redes Sociales */}
          <div>
            <h4 className="text-white font-semibold mb-4">Síguenos</h4>
            <div className="flex gap-4">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/p/Palomino-Learning-Center-61577172072426/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                title="Facebook"
                aria-label="Síguenos en Facebook"
              >
                <svg className="w-5 h-5 text-white fill-white" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/palominomachine"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                title="Instagram"
                aria-label="Síguenos en Instagram"
              >
                <svg className="w-5 h-5 text-white fill-white" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057-1.645.069-4.849.069-3.205 0-3.584-.012-4.849-.069-3.259-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12c0-3.403 2.759-6.162 6.162-6.162 3.403 0 6.162 2.759 6.162 6.162 0 3.403-2.759 6.162-6.162 6.162-3.403 0-6.162-2.759-6.162-6.162zm2.889 0c0 1.861 1.512 3.373 3.373 3.373 1.861 0 3.373-1.512 3.373-3.373 0-1.861-1.512-3.373-3.373-3.373-1.861 0-3.373 1.512-3.373 3.373zm11.294-5.686c0 .795.645 1.44 1.44 1.44.795 0 1.44-.645 1.44-1.44 0-.795-.645-1.44-1.44-1.44-1.44 0-1.44.645-1.44 1.44z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/51910593571"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                title="WhatsApp"
                aria-label="Contáctanos por WhatsApp"
              >
                <svg className="w-5 h-5 text-white fill-white" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.148.529 4.18 1.456 5.975L0 24l6.303-1.444c1.688.936 3.616 1.475 5.697 1.475 6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.85 0-3.607-.451-5.143-1.246l-.369-.215-3.841.885.905-3.766-.233-.371C1.503 15.898 1 14.043 1 12c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10zm5.892-7.597c-.322-.16-1.897-.937-2.192-1.043-.295-.105-.51-.16-.725.16-.215.32-.832 1.04-1.02 1.255-.188.215-.376.242-.698.08-.32-.16-1.355-.499-2.584-1.593-.955-.846-1.6-1.89-1.787-2.21-.188-.32-.02-.494.141-.653.144-.144.32-.376.481-.564.16-.188.213-.32.32-.534.106-.215.053-.402-.026-.564-.08-.16-.725-1.747-.994-2.39-.262-.615-.525-.532-.725-.542-.187-.01-.401-.011-.615-.011-.215 0-.564.08-.859.376-.295.295-1.127 1.101-1.127 2.688s1.153 3.118 1.313 3.333c.16.215 2.253 3.44 5.46 4.827.762.331 1.356.533 1.816.684.765.243 1.461.209 2.01.126.613-.092 1.897-.773 2.162-1.52.265-.746.265-1.386.186-1.52-.08-.135-.294-.215-.616-.375z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-8">
          {/* Newsletter */}
          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-lg p-6 mb-8">
            <h4 className="text-white font-semibold mb-2">Suscríbete a nuestro Newsletter</h4>
            <p className="text-sm text-slate-400 mb-4">Recibe las últimas noticias sobre cursos y promociones especiales.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition">
                Suscribir
              </button>
            </div>
          </div>

          {/* Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
            <p>&copy; {currentYear} Palomino Learning. Todos los derechos reservados.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-blue-400 transition">
                Política de Privacidad
              </Link>
              <Link href="#" className="hover:text-blue-400 transition">
                Términos de Servicio
              </Link>
              <Link href="#" className="hover:text-blue-400 transition">
                Contacto
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
