'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';

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
      <div className="group bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg overflow-hidden hover:border-blue-500/50 transition">
        {course.imageUrl ? (
          <img
            src={course.imageUrl}
            alt={course.title}
            className="w-full h-48 object-cover group-hover:scale-110 transition"
          />
        ) : (
          <div className="bg-linear-to-br from-slate-700 to-slate-800 h-48 flex items-center justify-center text-8xl group-hover:scale-110 transition">
            📚
          </div>
        )}

        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-blue-400 bg-blue-400/20 px-3 py-1 rounded-full">
              {course.category}
            </span>
            <span className="text-xs text-gray-400">{course.level}</span>
          </div>

          <h3 className="text-xl font-bold mb-2 text-white">{course.title}</h3>
          <p className="text-sm text-gray-400 mb-4 line-clamp-2">{course.description}</p>

          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <span>⏱️ {course.duration}</span>
            <span>🌐 Online</span>
          </div>

          <div className="border-t border-slate-700 pt-4">
            <div className="flex items-baseline justify-between mb-4">
              <span className="text-2xl font-black text-white">S/{course.price}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleVerInfo}
                className="w-full py-2 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-bold text-sm transition"
              >
                ℹ️ Más Información
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
