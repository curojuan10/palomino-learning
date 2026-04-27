import Link from 'next/link';

export default function Home() {
  const stats = [
    { number: '500+', label: 'Estudiantes Activos', icon: '👥' },
    { number: '50+', label: 'Cursos Disponibles', icon: '📚' },
    { number: '4.9★', label: 'Calificación Promedio', icon: '⭐' },
    { number: '10K+', label: 'Horas de Contenido', icon: '⏱️' },
  ];

  const features = [
    {
      icon: '🎓',
      title: 'Instructores Expertos',
      description: 'Aprende de profesionales con años de experiencia en la industria',
    },
    {
      icon: '📱',
      title: 'Aprende a tu Ritmo',
      description: 'Accede 24/7 desde cualquier dispositivo, cuando quieras',
    },
    {
      icon: '🏆',
      title: 'Certificados Válidos',
      description: 'Obtén certificados reconocidos al completar cada curso',
    },
    {
      icon: '💻',
      title: 'Proyectos Reales',
      description: 'Trabaja en proyectos auténticos para tu portafolio',
    },
    {
      icon: '🤝',
      title: 'Comunidad Activa',
      description: 'Conecta con otros estudiantes y comparte tu progreso',
    },
    {
      icon: '🚀',
      title: 'Contenido Actualizado',
      description: 'Cursos al día con las últimas tecnologías y tendencias',
    },
  ];

  const testimonials = [
    {
      name: 'Juan Carlos',
      role: 'Desarrollador Frontend',
      image: '👨‍💼',
      text: 'Los cursos de Palomino me ayudaron a conseguir mi primer trabajo como desarrollador. Muy recomendado.',
    },
    {
      name: 'María González',
      role: 'Diseñadora UX/UI',
      image: '👩‍💼',
      text: 'Contenido de excelente calidad. Los proyectos prácticos fueron clave para mi carrera.',
    },
    {
      name: 'Luis Martínez',
      role: 'Data Scientist',
      image: '👨‍🔬',
      text: 'La mejor inversión que hice. Valió cada sol gastado en aprendizaje de calidad.',
    },
  ];

  const courses = [
    {
      id: 1,
      title: 'Python Avanzado',
      category: 'PROGRAMACIÓN',
      price: 99.99,
      duration: '40h',
      students: '1,234 estudiantes',
      image: '🐍',
      level: 'Intermedio',
    },
    {
      id: 2,
      title: 'JavaScript Moderno',
      category: 'DESARROLLO WEB',
      price: 89.99,
      duration: '35h',
      students: '2,456 estudiantes',
      image: '⚡',
      level: 'Principiante',
    },
    {
      id: 3,
      title: 'React & Next.js',
      category: 'FRONTEND',
      price: 109.99,
      duration: '50h',
      students: '3,789 estudiantes',
      image: '⚛️',
      level: 'Intermedio',
    },
    {
      id: 4,
      title: 'Diseño UX/UI',
      category: 'DISEÑO',
      price: 79.99,
      duration: '30h',
      students: '1,987 estudiantes',
      image: '🎨',
      level: 'Principiante',
    },
    {
      id: 5,
      title: 'TypeScript Pro',
      category: 'PROGRAMACIÓN',
      price: 89.99,
      duration: '25h',
      students: '892 estudiantes',
      image: '🔵',
      level: 'Avanzado',
    },
    {
      id: 6,
      title: 'Node.js & APIs REST',
      category: 'BACKEND',
      price: 99.99,
      duration: '45h',
      students: '2,123 estudiantes',
      image: '🟢',
      level: 'Intermedio',
    },
  ];

  return (
    <main className="bg-slate-950 text-white overflow-hidden">
      {/* Hero Section - Optimized Design */}
      <section className="relative min-h-[85vh] px-4 py-20 overflow-hidden flex items-center">
        {/* Background gradients */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            {/* Left content */}
            <div className="flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full mb-6 w-fit">
                <span className="text-blue-400 text-sm font-semibold">🚀 PLATAFORMA DE CURSOS ONLINE</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
                Prepárate para un <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Futuro Dominado por la Tecnología</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
                Aprende las habilidades más demandadas del mercado con cursos actualizados, instructores expertos y proyectos reales.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href="/auth/signup"
                  className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-bold text-lg transition transform hover:scale-105"
                >
                  Comienza Gratis
                </Link>
                <Link
                  href="/courses"
                  className="px-10 py-4 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold text-lg transition border border-slate-700"
                >
                  Ver Cursos
                </Link>
              </div>

              <p className="text-gray-400 text-sm">
                ✓ Sin tarjeta de crédito requerida • ✓ Acceso inmediato • ✓ Certificados gratis
              </p>
            </div>

            {/* Right stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition">
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-black mb-1">{stat.number}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">¿Por qué elegir Palomino Learning?</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Somos la plataforma número 1 en Latinoamérica para aprender tecnología
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-slate-800 border border-slate-700 rounded-lg p-8 hover:border-blue-500/50 transition group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cursos Destacados */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black mb-2">Cursos Populares</h2>
              <p className="text-gray-400">Los más elegidos por nuestros estudiantes</p>
            </div>
            <Link
              href="/courses"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition hidden md:block"
            >
              Ver Todos →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg overflow-hidden hover:border-blue-500/50 transition group"
              >
                {/* Course image */}
                <div className="bg-gradient-to-br from-slate-700 to-slate-800 h-48 flex items-center justify-center text-8xl group-hover:scale-110 transition">
                  {course.image}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-blue-400 bg-blue-400/20 px-3 py-1 rounded-full">
                      {course.category}
                    </span>
                    <span className="text-xs text-gray-400">{course.level}</span>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">{course.students}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                    <div>
                      <div className="text-2xl font-black text-green-400">S/{course.price}</div>
                      <div className="text-xs text-gray-500">{course.duration}</div>
                    </div>
                    <Link
                      href="/courses"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-sm transition"
                    >
                      Comprar
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 md:hidden">
            <Link
              href="/courses"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition inline-block"
            >
              Ver Todos los Cursos
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Lo que Dicen Nuestros Estudiantes</h2>
            <p className="text-gray-400 text-lg">Miles de vidas transformadas</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-slate-800 border border-slate-700 rounded-lg p-8 hover:border-blue-500/50 transition">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">{testimonial.image}</div>
                  <div>
                    <h3 className="font-bold text-lg">{testimonial.name}</h3>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.text}"</p>
                <div className="text-yellow-400 mt-4">★★★★★</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-12 text-center">
          <h2 className="text-4xl font-black mb-4">¿Listo para Transformar tu Carrera?</h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a miles de estudiantes aprendiendo hoy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="px-10 py-4 bg-white text-blue-600 hover:bg-gray-100 rounded-lg font-bold text-lg transition"
            >
              Crear Mi Cuenta Gratis
            </Link>
            <Link
              href="/courses"
              className="px-10 py-4 bg-blue-700 hover:bg-blue-800 rounded-lg font-bold text-lg transition border border-blue-500"
            >
              Explorar Cursos
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

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
    