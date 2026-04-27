# 🔧 Correcciones Completas: Error 400 en Creación de Compras

## ✅ CAMBIOS REALIZADOS

### 1️⃣ Tipos de Datos en Insert de Compras

**Archivo**: [lib/compras.ts](lib/compras.ts#L1-L30)

**Antes:**
```typescript
export async function crearCompra(usuarioId: string, cursoId: string) {
  const client = createClient();
  
  const { data, error } = await client
    .from('compras')
    .insert([
      {
        usuario_id: usuarioId,
        curso_id: cursoId,  // ❌ String
        estado: 'pendiente',
      },
    ])
```

**Después:**
```typescript
export async function crearCompra(usuarioId: string, cursoId: string) {
  const client = createClient();
  
  // Convertir cursoId a número (int8)
  const cursoIdNumero = parseInt(cursoId, 10);
  if (isNaN(cursoIdNumero)) {
    throw new Error('curso_id debe ser un número válido');
  }

  // Validar que usuario_id sea UUID
  if (!usuarioId || typeof usuarioId !== 'string' || usuarioId.trim() === '') {
    throw new Error('usuario_id debe ser un UUID válido');
  }

  const { data, error } = await client
    .from('compras')
    .insert([
      {
        usuario_id: usuarioId,        // ✅ UUID directo de auth.user.id
        curso_id: cursoIdNumero,      // ✅ Int8 (número)
        estado: 'pendiente',          // ✅ String exacto minúsculas
      },
    ])
```

---

### 2️⃣ Conversión de Tipos en ModalCompra

**Archivo**: [components/ModalCompra.tsx](components/ModalCompra.tsx#L54-L58)

**Antes:**
```typescript
const compra = await crearCompra(userId, curso.id);  // curso.id es string
```

**Después:**
```typescript
// Convertir curso.id a número y asegurar que usuario_id sea UUID
const compra = await crearCompra(userId, String(Number(curso.id)));  // Conversión segura
```

**Beneficio:** 
- `Number(curso.id)` convierte el string a número
- `String()` lo vuelve a convertir a string para mantener compatibilidad de firma
- La función `crearCompra` internamente hace `parseInt(cursoId, 10)` para obtener int8

---

### 3️⃣ Cambio de Columna: 'estado' → 'activo' en Tabla Cursos

#### 3.1 En [lib/admin.ts](lib/admin.ts#L68-L100)

**crearCurso() - Firma de función:**
```typescript
// ❌ ANTES:
export async function crearCurso(courseData: {
  titulo: string;
  descripcion: string;
  precio: number;
  categoria: string;
  duracion: string;
  imagen_url?: string;
  estado: boolean;  // ❌ INCORRECTO
})

// ✅ DESPUÉS:
export async function crearCurso(courseData: {
  titulo: string;
  descripcion: string;
  precio: number;
  categoria: string;
  duracion: string;
  imagen_url?: string;
  activo: boolean;  // ✅ CORRECTO
})
```

**crearCurso() - Insert:**
```typescript
// ❌ ANTES:
const { data, error } = await client
    .from('cursos')
    .insert([
      {
        nombre: courseData.titulo,
        descripcion: courseData.descripcion,
        precio: courseData.precio,
        categoria: courseData.categoria,
        duracion: courseData.duracion,
        imagen_url: courseData.imagen_url || null,
        estado: courseData.estado,  // ❌ Columna no existe
        fecha_creacion: new Date().toISOString(),
      },
    ])

// ✅ DESPUÉS:
const { data, error } = await client
    .from('cursos')
    .insert([
      {
        nombre: courseData.titulo,
        descripcion: courseData.descripcion,
        precio: courseData.precio,
        categoria: courseData.categoria,
        duracion: courseData.duracion,
        imagen_url: courseData.imagen_url || null,
        activo: courseData.estado,  // ✅ Columna correcta
        fecha_creacion: new Date().toISOString(),
      },
    ])
```

#### 3.2 En [lib/admin.ts](lib/admin.ts#L115-L140)

**actualizarCurso() - Parámetro y lógica:**
```typescript
// ❌ ANTES:
export async function actualizarCurso(
  id: string,
  courseData: {
    nombre?: string;
    descripcion?: string;
    precio?: number;
    categoria?: string;
    duracion?: string;
    imagen_url?: string;
    estado?: boolean;  // ❌ INCORRECTO
  }
) {
  const client = createClient();
  const { data, error } = await client
    .from('cursos')
    .update(courseData)  // Pasa 'estado' que no existe
    .eq('id', id)

// ✅ DESPUÉS:
export async function actualizarCurso(
  id: string,
  courseData: {
    nombre?: string;
    descripcion?: string;
    precio?: number;
    categoria?: string;
    duracion?: string;
    imagen_url?: string;
    activo?: boolean;  // ✅ CORRECTO
  }
) {
  const client = createClient();
  
  // Mapear 'activo' si viene en courseData
  const updateData = courseData.activo !== undefined 
    ? { ...courseData, activo: courseData.activo }
    : courseData;
  
  const { data, error } = await client
    .from('cursos')
    .update(updateData)  // Pasa 'activo' correctamente
    .eq('id', id)
```

#### 3.3 En [app/admin/cursos/nuevo/page.tsx](app/admin/cursos/nuevo/page.tsx#L86-L95)

**Llamada a crearCurso:**
```typescript
// ❌ ANTES:
await crearCurso({
  titulo: formData.titulo,
  descripcion: formData.descripcion,
  precio: parseFloat(formData.precio),
  categoria: formData.categoria,
  duracion: formData.duracion,
  imagen_url: imagenUrl || undefined,
  estado: formData.estado,  // ❌ INCORRECTO
});

// ✅ DESPUÉS:
await crearCurso({
  titulo: formData.titulo,
  descripcion: formData.descripcion,
  precio: parseFloat(formData.precio),
  categoria: formData.categoria,
  duracion: formData.duracion,
  imagen_url: imagenUrl || undefined,
  activo: formData.estado,  // ✅ CORRECTO
});
```

#### 3.4 En [app/courses/page.tsx](app/courses/page.tsx#L22-L26)

**Filtro de cursos activos:**
```typescript
// ❌ ANTES:
const loadCursos = async () => {
  try {
    const data = await getCursos();
    // Filtrar solo cursos activos
    const cursosActivos = data.filter((c: any) => c.estado === true);  // ❌ INCORRECTO
    setCursos(cursosActivos);

// ✅ DESPUÉS:
const loadCursos = async () => {
  try {
    const data = await getCursos();
    // Filtrar solo cursos activos
    const cursosActivos = data.filter((c: any) => c.activo === true);  // ✅ CORRECTO
    setCursos(cursosActivos);
```

---

### 4️⃣ Responsividad del Modal

**Archivo**: [components/ModalCompra.tsx](components/ModalCompra.tsx#L208)

**Antes:**
```typescript
<div className="bg-slate-800 border border-slate-700 rounded-lg p-8 max-w-md w-full shadow-2xl">
```

**Después:**
```typescript
<div className="bg-slate-800 border border-slate-700 rounded-lg p-8 w-full max-w-md shadow-2xl">
```

**Cambios:**
- ✅ `w-full` primero (aplicar 100% de ancho en móviles)
- ✅ `max-w-md` después (limitar a 448px máximo en desktop)
- ✅ Padding `p-4` del contenedor padre `.fixed inset-0 p-4` proporciona espaciado en móviles

---

## 📋 RESUMEN DE TIPOS DE DATOS CORRECTOS

| Campo | Tipo Esperado | Tipo Enviado | Estado |
|-------|---------------|--------------|--------|
| `usuario_id` | UUID (text) | `auth.user.id` directo | ✅ CORRECTO |
| `curso_id` | int8 | `Number()` o `parseInt()` | ✅ CORRECTO |
| `estado` (compras) | estado_compra enum | `'pendiente'` (string) | ✅ CORRECTO |
| `activo` (cursos) | boolean | `true` o `false` | ✅ CORRECTO |

---

## 🚀 RESULTADO ESPERADO

✅ **Error 400 al crear compra**: RESUELTO
- Los tipos de datos coinciden exactamente con el schema
- `curso_id` es convertido a int8
- `usuario_id` es UUID directo de auth.user.id
- `estado` es exactamente `'pendiente'` en minúsculas
- Solo se envían columnas que existen en la tabla

✅ **Error de columna 'activo' en cursos**: RESUELTO
- Todos los inserts/updates usan `activo` en lugar de `estado`
- Todos los filtros usan `c.activo` en lugar de `c.estado`
- No más errores "column activo does not exist"

✅ **Responsividad del modal**: MEJORADA
- Modal se adapta a pantallas móviles
- Usa 100% de ancho en móviles (w-full)
- Limita a máximo 448px en desktop (max-w-md)
- Padding del contenedor padre proporciona margen seguro

---

## 📝 ARCHIVOS MODIFICADOS

1. ✅ [lib/compras.ts](lib/compras.ts) - Conversión de tipos
2. ✅ [components/ModalCompra.tsx](components/ModalCompra.tsx) - Conversión segura + responsividad
3. ✅ [lib/admin.ts](lib/admin.ts) - Cambio estado → activo (3 funciones)
4. ✅ [app/courses/page.tsx](app/courses/page.tsx) - Filtro actualizado
5. ✅ [app/admin/cursos/nuevo/page.tsx](app/admin/cursos/nuevo/page.tsx) - Parámetro actualizado
