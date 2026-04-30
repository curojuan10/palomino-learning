'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { Clock, Globe, BookOpen, Info } from 'lucide-react';

interface CourseCardProps {
  course: {
    id: string | number;
    title: string;
    category: string;
    price: number;
    duration: string;
    imageUrl?: string;
    level: string;
    description: string;
  };
}

export default function CourseCard({ course }: CourseCardProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  // 🔧 Captura de intención: "Más información"
  const handleVerInfo = () => {
    if (!user && !loading) {
      // Guardar intención de ver más info
      const pending = {
        type: 'view_course',
        id: String(course.id),
        title: course.title,
      };
      sessionStorage.setItem('pending_action', JSON.stringify(pending));
      console.log('📌 Intención guardada (Ver Info):', pending);
      router.push('/auth/login');
    } else {
      // Si tiene sesión, ir directo a detalles (para futuro)
      // router.push(`/cursos/${course.id}`);
    }
  };

  return (
    <>
      <div className="group bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg overflow-hidden hover:border-blue-500/50 transition flex flex-col h-full">
        {/* Imagen con altura fija */}
        {course.imageUrl ? (
          <img
            src={course.imageUrl}
            alt={course.title}
            className="w-full h-48 object-cover group-hover:scale-110 transition"
          />
        ) : (
          <div className="bg-linear-to-br from-slate-700 to-slate-800 h-48 flex items-center justify-center group-hover:scale-110 transition">
            <BookOpen size={56} className="text-slate-600" />
          </div>
        )}

        {/* Contenido */}
        <div className="p-5 flex flex-col flex-1">
          {/* Header con categoría y nivel */}
          <div className="flex items-center justify-between mb-2 gap-2">
            <span className="text-xs font-bold text-blue-400 bg-blue-400/20 px-2 py-1 rounded-full line-clamp-1">
              {course.category}
            </span>
            <span className="text-xs text-gray-400 whitespace-nowrap">{course.level}</span>
          </div>

          {/* Título más compacto */}
          <h3 className="text-lg font-bold mb-2 text-white line-clamp-2">{course.title}</h3>
          
          {/* Descripción */}
          <p className="text-xs text-gray-400 mb-3 line-clamp-2 flex-1">{course.description}</p>

          {/* Duración y modalidad */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3 gap-2">
            <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
            <span className="flex items-center gap-1"><Globe size={12} /> Online</span>
          </div>

          {/* Divisor */}
          <div className="border-t border-slate-700 pt-3">
            {/* Precio y botón alineados compactamente */}
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-white whitespace-nowrap">S/{course.price}</span>
              <button
                onClick={handleVerInfo}
                className="flex-1 py-2 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold text-sm transition flex items-center justify-center gap-1"
              >
                <Info size={16} />
                Más Info
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
