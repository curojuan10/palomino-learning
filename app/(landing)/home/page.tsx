import Link from 'next/link';

export default function Home() {
  const courses = [
    {
      id: 1,
      title: 'Python Avanzado',
      category: 'PROGRAMACIÓN',
      price: 99.99,
      originalPrice: 129.99,
      duration: '40h',
      students: 'Online',
      image: '🐍',
      color: 'from-blue-600 to-blue-800',
      badge: 'NUEVO',
    },
    {
      id: 2,
      title: 'JavaScript Moderno',
      category: 'DESARROLLO WEB',
      price: 89.99,
      originalPrice: 119.99,
      duration: '35h',
      students: 'Online',
      image: '⚡',
      color: 'from-yellow-500 to-orange-600',
      badge: 'POPULAR',
    },
    {
      id: 3,
      title: 'React & Next.js',
      category: 'FRONTEND',
      price: 109.99,
      originalPrice: 149.99,
      duration: '50h',
      students: 'Online',
      image: '⚛️',
      color: 'from-cyan-500 to-blue-600',
      badge: 'NUEVO',
    },
    {
      id: 4,
      title: 'Diseño UX/UI',
      category: 'DISEÑO',
      price: 79.99,
      originalPrice: 99.99,
      duration: '30h',
      students: 'Online',
      image: '🎨',
      color: 'from-pink-500 to-purple-600',
      badge: 'TRENDING',
    },
  ];

  return (
    <main className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-32 px-4 pt-40 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full mb-6">
              <span className="text-blue-400 text-sm font-semibold">🚀 Bienvenido a Palomino Learning</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
              Aprende <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Nuevas Habilidades</span>{' '}
              Hoy
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Accede a cursos profesionales en programación, diseño y más. Aprende a tu propio ritmo con instructores expertos.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/auth/register"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg font-bold text-lg transition transform hover:scale-105"
              >
                Comenzar Ahora
              </Link>
              <Link
                href="/home/courses"
                className="px-8 py-4 border-2 border-gray-400 hover:border-white rounded-lg font-bold text-lg transition hover:bg-white/10"
              >
                Explorar Cursos
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition">
              <div className="text-4xl font-bold text-blue-400 mb-2">50+</div>
              <div className="text-gray-400">Cursos Disponibles</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition">
              <div className="text-4xl font-bold text-purple-400 mb-2">10K+</div>
              <div className="text-gray-400">Estudiantes Activos</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition">
              <div className="text-4xl font-bold text-pink-400 mb-2">95%</div>
              <div className="text-gray-400">Tasa de Satisfacción</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition">
              <div className="text-4xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-gray-400">Soporte Premium</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-2">Cursos Destacados</h2>
              <p className="text-gray-400">Los más populares esta semana</p>
            </div>
            <Link href="/home/courses" className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-2">
              Ver todos <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-blue-500/50 transition duration-300 hover:shadow-xl hover:shadow-blue-500/20"
              >
                {/* Image */}
                <div
                  className={`h-40 bg-gradient-to-br ${course.color} flex items-center justify-center text-7xl relative overflow-hidden`}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition"></div>
                  {course.image}
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {course.badge}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <p className="text-xs text-blue-400 font-bold mb-2 uppercase tracking-wider">{course.category}</p>
                  <h3 className="font-bold text-lg mb-3 group-hover:text-blue-400 transition">{course.title}</h3>

                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <span>⏱️ {course.duration}</span>
                    <span>🌐 {course.students}</span>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-white">${course.price}</span>
                        <span className="text-sm text-gray-500 line-through ml-2">${course.originalPrice}</span>
                      </div>
                    </div>
                    <Link
                      href="/auth/register"
                      className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold text-center transition transform hover:scale-105"
                    >
                      Inscribirse
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-white/5 border-y border-white/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">¿Por qué elegir Palomino?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border border-blue-500/20 rounded-xl p-8">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-2xl font-bold mb-3">Contenido Premium</h3>
              <p className="text-gray-400">Cursos diseñados por profesionales con años de experiencia en la industria.</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border border-purple-500/20 rounded-xl p-8">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-2xl font-bold mb-3">Precios Accesibles</h3>
              <p className="text-gray-400">Invierte en tu educación sin quebrar el banco. Paga solo una vez.</p>
            </div>

            <div className="bg-gradient-to-br from-pink-900/30 to-pink-800/30 border border-pink-500/20 rounded-xl p-8">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-3">Acceso Inmediato</h3>
              <p className="text-gray-400">Una vez aprobado tu pago, acceso instantáneo a todo el contenido del curso.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">Comienza tu Viaje de Aprendizaje</h2>
          <p className="text-xl text-gray-400 mb-8">
            Únete a miles de estudiantes que ya están aprendiendo y avanzando en sus carreras.
          </p>
          <Link
            href="/auth/register"
            className="inline-block px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-bold text-xl transition transform hover:scale-105"
          >
            Registrarse Ahora - ¡Es Gratis!
          </Link>
        </div>
      </section>
    </main>
  );
}
