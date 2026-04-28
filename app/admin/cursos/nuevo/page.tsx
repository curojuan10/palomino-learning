'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { crearCurso, subirImagenCurso, esAdmin } from '@/lib/admin';

export default function CrearCurso() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  // Verificar que el usuario sea admin
  useEffect(() => {
    const verificarPermiso = async () => {
      try {
        const admin = await esAdmin();
        if (!admin) {
          setError('No tienes permiso para crear cursos. Solo administradores pueden crear cursos.');
          setTimeout(() => router.push('/admin'), 2000);
        } else {
          setIsAuthorized(true);
        }
      } catch (err) {
        setError('Error al verificar permisos. Por favor recarga la página.');
      } finally {
        setChecking(false);
      }
    };
    verificarPermiso();
  }, [router]);

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    precio: '',
    categoria: '',
    duracion: '',
    estado: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validaciones
      if (!formData.titulo || !formData.descripcion || !formData.precio || !formData.categoria || !formData.duracion) {
        setError('Por favor completa todos los campos requeridos');
        setLoading(false);
        return;
      }

      let imagenUrl = null;

      // Subir imagen si existe
      if (imageFile) {
        imagenUrl = await subirImagenCurso(imageFile, formData.titulo);
      }

      // Crear curso
      await crearCurso({
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        categoria: formData.categoria,
        duracion: formData.duracion,
        imagen_url: imagenUrl || undefined,
        estado: formData.estado,
      });

      alert('Curso creado exitosamente');
      router.push('/admin/cursos');
    } catch (err) {
      console.error('Error creating course:', err);
      setError('Error al crear el curso. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Si está verificando permisos, mostrar loading
  if (checking) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
          <p className="text-gray-400">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Si no está autorizado, mostrar error
  if (!isAuthorized) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
          ⚠️ {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">➕ Crear Nuevo Curso</h1>
        <p className="text-gray-400 mt-1">Completa el formulario para agregar un nuevo curso a la plataforma</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-6">
        
        {/* Imagen */}
        <div>
          <label className="block text-white font-semibold mb-3">📷 Imagen del Curso</label>
          <div className="flex gap-6">
            {/* Preview */}
            <div className="flex-shrink-0">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded-lg border border-slate-700"
                />
              ) : (
                <div className="w-40 h-40 bg-slate-700 rounded-lg border border-slate-600 flex items-center justify-center text-gray-400">
                  Sin imagen
                </div>
              )}
            </div>

            {/* Upload */}
            <div className="flex-1">
              <label className="block text-center border-2 border-dashed border-slate-600 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div className="text-gray-400">
                  <div className="text-2xl mb-2">📁</div>
                  <p className="font-medium">Haz clic para subir una imagen</p>
                  <p className="text-sm">PNG, JPG o GIF (max 5MB)</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Título */}
        <div>
          <label className="block text-white font-semibold mb-2">Título del Curso *</label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleInputChange}
            placeholder="Ej: Excel Avanzado"
            disabled={loading}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 transition"
            required
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-white font-semibold mb-2">Descripción *</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            placeholder="Describe el contenido del curso..."
            disabled={loading}
            rows={4}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 transition resize-none"
            required
          />
        </div>

        {/* Detalles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Precio */}
          <div>
            <label className="block text-white font-semibold mb-2">Precio (S/) *</label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleInputChange}
              placeholder="99.99"
              min="0"
              step="0.01"
              disabled={loading}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 transition"
              required
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-white font-semibold mb-2">Categoría *</label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 transition"
              required
            >
              <option value="">Selecciona una categoría</option>
              <option value="OFIMÁTICA">📊 Ofimática</option>
              <option value="INVESTIGACIÓN">🔬 Investigación Científica</option>
              <option value="PROGRAMACIÓN">💻 Programación</option>
              <option value="DISEÑO">🎨 Diseño</option>
              <option value="NEGOCIOS">📈 Negocios</option>
              <option value="IDIOMAS">🌍 Idiomas</option>
              <option value="OTROS">📚 Otros</option>
            </select>
          </div>

          {/* Duración */}
          <div>
            <label className="block text-white font-semibold mb-2">Duración *</label>
            <input
              type="text"
              name="duracion"
              value={formData.duracion}
              onChange={handleInputChange}
              placeholder="Ej: 4 semanas"
              disabled={loading}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 transition"
              required
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-white font-semibold mb-2">Estado</label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="estado"
                checked={formData.estado}
                onChange={handleInputChange}
                disabled={loading}
                className="w-4 h-4"
              />
              <span className="text-gray-300">Curso Activo</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-6 border-t border-slate-700">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Creando curso...' : '✅ Crear Curso'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            disabled={loading}
            className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition disabled:opacity-50"
          >
            ← Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
