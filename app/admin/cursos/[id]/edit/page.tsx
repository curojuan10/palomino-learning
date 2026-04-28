'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCursoById, actualizarCurso, subirImagenCurso } from '@/lib/admin';

export default function EditarCurso() {
  const router = useRouter();
  const params = useParams();
  const cursoId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    precio: '',
    categoria: '',
    duracion: '',
    estado: true,
  });

  useEffect(() => {
    loadCurso();
  }, [cursoId]);

  const loadCurso = async () => {
    try {
      const curso = await getCursoById(cursoId);
      if (curso) {
        setFormData({
          titulo: curso.titulo,
          descripcion: curso.descripcion,
          precio: curso.precio.toString(),
          categoria: curso.categoria,
          duracion: curso.duracion,
          estado: curso.estado,
        });
        if (curso.imagen_url) {
          setImagePreview(curso.imagen_url);
        }
      }
    } catch (err) {
      console.error('Error loading curso:', err);
      setError('Error al cargar el curso');
    } finally {
      setLoading(false);
    }
  };

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
    setSubmitting(true);
    setError('');

    try {
      if (!formData.titulo || !formData.descripcion || !formData.precio || !formData.categoria || !formData.duracion) {
        setError('Por favor completa todos los campos requeridos');
        setSubmitting(false);
        return;
      }

      let updateData: any = {
        nombre: formData.titulo,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        categoria: formData.categoria,
        duracion: formData.duracion,
        estado: formData.estado,
      };

      // Subir imagen si hay una nueva
      if (imageFile) {
        const imagenUrl = await subirImagenCurso(imageFile, formData.titulo);
        updateData.imagen_url = imagenUrl;
      }

      await actualizarCurso(cursoId, updateData);
      alert('Curso actualizado exitosamente');
      router.push('/admin/cursos');
    } catch (err) {
      console.error('Error updating course:', err);
      setError('Error al actualizar el curso. Por favor intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Cargando curso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">✏️ Editar Curso</h1>
        <p className="text-gray-400 mt-1">Modifica los detalles de este curso</p>
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
                  <p className="font-medium">Haz clic para actualizar la imagen</p>
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
            disabled={submitting}
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
            disabled={submitting}
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
              disabled={submitting}
              min="0"
              step="0.01"
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
              disabled={submitting}
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
              disabled={submitting}
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
                disabled={submitting}
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
            disabled={submitting}
            className="flex-1 py-3 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? '⏳ Guardando...' : '✅ Guardar Cambios'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            disabled={submitting}
            className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition disabled:opacity-50"
          >
            ← Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
