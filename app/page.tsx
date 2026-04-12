export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-24">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-4">
          Palomino Learning Center
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Potenciando tu futuro con los mejores cursos en línea.
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <p className="font-semibold text-green-600">
            ✓ Entorno de desarrollo listo
          </p>
        </div>
      </div>
    </main>
  )
}