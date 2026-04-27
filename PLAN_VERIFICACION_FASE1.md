# 🔍 PLAN COMPLETO: Verificación Fase 1 vs Planificación
## Sistema: Palomino Learning - Gestión y Venta de Cursos

---

## 📋 COMPARATIVA: Lo Planificado vs Lo Actual

### FASE 1: Base del Sistema

#### 1️⃣ Configuración de Next.js
**Planificado:** El proyecto arranca correctamente y es accesible sin errores  
**Estado:** ✅ **CUMPLE**
- El proyecto está en Next.js v15
- Arranca correctamente con `npm run dev`
- Landing page funcional

---

#### 2️⃣ Configuración de Supabase
**Planificado:** Variables de entorno configuradas, conexión activa, lectura/escritura funcional  
**Estado:** ⚠️ **PARCIALMENTE CUMPLE** - Ver detalles abajo

**Verificar:**
- [x] `.env.local` existe con credenciales
- [x] `NEXT_PUBLIC_SUPABASE_URL` configurada
- [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configurada
- ❌ **FALTA:** Buckets en Storage no están creados

**Buckets requeridos:**
```
❌ "curso-images"      → Para imágenes de cursos
❌ "comprobantes"      → Para comprobantes de pago
```

**Acción requerida:**
1. Ve a Supabase Dashboard → Storage
2. Crea bucket "curso-images" (público para lectura)
3. Crea bucket "comprobantes" (privado, solo admin lectura)
4. Configura CORS en ambos buckets

**CORS Settings requerido:**
```json
[
  {
    "origin": "http://localhost:3000",
    "methods": ["GET", "POST", "HEAD"],
    "headers": ["Content-Type", "Authorization"],
    "credentials": true,
    "maxAge": 3600
  }
]
```

---

#### 3️⃣ Autenticación
**Planificado:**
- ✅ Registro de usuarios
- ✅ Login y sesión
- ✅ Logout
- ✅ Diferencia roles (ADMIN vs CLIENTE)
- ✅ Protección de rutas privadas según rol

**Estado:** ✅ **CUMPLE COMPLETAMENTE**

**Verificar:**
```bash
# Acceso público (SIN login):
✅ http://localhost:3000                 # Landing
✅ http://localhost:3000/courses         # Catálogo
✅ http://localhost:3000/auth/register   # Registro
✅ http://localhost:3000/auth/login      # Login

# Acceso protegido (REQUIERE login):
✅ http://localhost:3000/dashboard       # Dashboard usuario
❌ http://localhost:3000/admin           # Admin panel (solo si rol_id=1)

# Después de logout:
✅ Debe redirigir a login
✅ Las rutas protegidas no deben ser accesibles
```

**Test manual:**
1. Registra usuario de prueba
2. Verifica que se crea en tabla `usuarios` con `rol_id=2`
3. Inicia sesión con el usuario
4. Intenta acceder a `/admin` (debe rechazar o redirigir a `/courses`)
5. Cierra sesión (logout)
6. Verifica que cookies se limpien

---

#### 4️⃣ Base de Datos
**Planificado:** Tablas (roles, usuarios, cursos, compras, pagos) con campos según especificación

**Estado:** ✅ **TABLAS EXISTEN** - Pero revisar RLS

**Tablas que deben existir:**

| Tabla | Campos | Status |
|-------|--------|--------|
| **roles** | id, nombre | ✅ Debe existir |
| **usuarios** | id (UUID FK auth.users), nombre, email, rol_id FK, fecha_registro | ✅ Debe existir |
| **cursos** | id, titulo, descripcion, precio, categoria, duracion, imagen_url, activo, created_at | ✅ Debe existir |
| **compras** | id, usuario_id FK, curso_id FK, estado, fecha | ✅ Debe existir |
| **pagos** | id, compra_id FK, comprobante_url, monto, metodo_pago, estado, observaciones | ✅ Debe existir |

**Verificar en Supabase → SQL Editor:**
```sql
-- Listar todas las tablas
SELECT table_name FROM information_schema.tables 
WHERE table_schema='public';

-- Verificar estructura de tabla cursos
\d cursos;

-- Verificar datos iniciales en roles
SELECT * FROM roles;
```

**Datos iniciales requeridos en tabla roles:**
```
id  | nombre
----|--------
1   | ADMIN
2   | CLIENTE
```

**Verificar:**
```sql
SELECT * FROM roles;
-- Debe mostrar 2 filas: ADMIN (1) y CLIENTE (2)
```

---

#### 5️⃣ CRUD de Cursos
**Planificado:**
- ✅ Admin puede crear cursos
- ✅ Admin puede editar cursos
- ✅ Admin puede eliminar cursos
- ✅ Admin puede listar cursos
- ✅ Los cambios se reflejan automáticamente en landing/catálogo

**Estado:** ⚠️ **CÓDIGO EXISTE - PERO FALLA AL EJECUTAR**

**Problema encontrado:**
```
Error: 400 Bad Request
Ubicación: Al subir imagen en subirImagenCurso()
Causa probable: Bucket "curso-images" no existe en Storage
```

**Verificar:**
1. **Intenta crear curso:**
   - Ve a http://localhost:3000/admin/cursos/nuevo (CON usuario admin logueado)
   - Llena campos:
     ```
     Título: "Test Curso"
     Descripción: "Descripción de prueba"
     Precio: "50"
     Categoría: "Ofimática"
     Duración: "3"
     Imagen: (sube una imagen)
     Estado: Activo (✓)
     ```
   - Click "Crear Curso"
   - **Si falla con error 400:** Es el problema de Storage que necesita solucionar

2. **Verifica que buckets existen:**
   - Ve a Supabase Dashboard → Storage
   - ¿Existen los buckets "curso-images" y "comprobantes"?
   - Si no existen, créalos

3. **Verifica RLS en buckets:**
   - Click en bucket "curso-images"
   - ¿Tiene políticas RLS configuradas?
   - Debe permitir uploads de usuarios autenticados con rol_id=1 (ADMIN)

4. **Prueba después de crear buckets:**
   - Reinicia servidor (`npm run dev`)
   - Intenta crear curso nuevamente
   - ¿Funciona ahora?

---

## 🔧 SOLUCIÓN PASO A PASO

### PASO 1: Crear Buckets en Supabase Storage

**Acceso:**
1. Entra a https://supabase.com → Tu Proyecto
2. Menú lateral → **Storage**
3. Click **"New bucket"**

**Crear Bucket 1: curso-images**
```
Nombre: curso-images
Privado: ❌ NO (debe ser público para que se vean las imágenes)
```

**Crear Bucket 2: comprobantes**
```
Nombre: comprobantes
Privado: ✅ SÍ (solo admin y usuario propietario pueden ver)
```

---

### PASO 2: Configurar Políticas RLS en Buckets

**Para bucket "curso-images":**
1. Click en el bucket
2. Click en el ícono ⚙️ (Settings)
3. Ir a "Policies"
4. Click **"New policy"** → **"For full customization"**

**Política para CREAR (upload):**
```sql
-- Permite que solo ADMINs suban archivos
CREATE POLICY "Admin can upload curso images"
ON storage.objects
FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM usuarios WHERE rol_id = 1
  )
);
```

**Política para LEER (públicamente):**
```sql
-- Permite que todos vean las imágenes
CREATE POLICY "Anyone can read curso images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'curso-images');
```

**Para bucket "comprobantes":**
Similar a arriba, pero más restrictivo:

**Política para CREAR:**
```sql
-- Permite que usuarios autenticados suban comprobantes
CREATE POLICY "Users can upload their own payment receipts"
ON storage.objects
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  bucket_id = 'comprobantes'
);
```

**Política para LEER:**
```sql
-- Solo admin puede ver todos los comprobantes
CREATE POLICY "Admin can read all receipts"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'comprobantes' AND
  auth.uid() IN (
    SELECT id FROM usuarios WHERE rol_id = 1
  )
);
```

---

### PASO 3: Configurar CORS en Supabase

**Acceso:**
1. Supabase Dashboard → Settings → API
2. Scroll down a "Storage"
3. Configura CORS allowed origins

**Agregar:**
```
http://localhost:3000
https://tudominio.com
```

---

### PASO 4: Verificar que todo funciona

**Prueba 1: Crear curso (admin)**
1. Log in como admin (rol_id = 1)
2. Ve a http://localhost:3000/admin/cursos/nuevo
3. Llena formulario y sube imagen
4. Click "Crear Curso"
5. ¿Aparece en la lista? ✅ ÉXITO
6. ¿Error 400? ❌ Revisar políticas RLS

**Prueba 2: Ver curso en catálogo**
1. Log out
2. Ve a http://localhost:3000/courses
3. ¿Aparece el curso creado? ✅ ÉXITO

**Prueba 3: Intentar crear como cliente**
1. Log in como usuario CLIENTE (rol_id = 2)
2. Intenta acceder a http://localhost:3000/admin/cursos/nuevo
3. ¿Te redirige? ✅ ÉXITO (debe redirigir a /courses)

---

## ✅ CHECKLIST FASE 1 FINAL

- [ ] `npm run dev` arranca sin errores
- [ ] Puedo acceder a landing page http://localhost:3000
- [ ] `.env.local` tiene credenciales de Supabase
- [ ] Registro de usuarios funciona (se crean en tabla usuarios)
- [ ] Login funciona (mantiene sesión)
- [ ] Logout funciona (limpia sesión)
- [ ] Rutas protegidas redirigen correctamente según rol
- [ ] Tabla `roles` tiene 2 registros: ADMIN (1), CLIENTE (2)
- [ ] Tabla `usuarios` se llena al registrarse
- [ ] **BUCKETS CREADOS:**
  - [ ] "curso-images" existe y es público
  - [ ] "comprobantes" existe y es privado
- [ ] **POLÍTICAS RLS CONFIGURADAS:**
  - [ ] Admins pueden subir a curso-images
  - [ ] Todos pueden ver curso-images
  - [ ] Usuarios pueden subir a comprobantes
  - [ ] Solo admins ven comprobantes
- [ ] CRUD de cursos funciona:
  - [ ] Admin puede crear curso (con imagen)
  - [ ] Curso aparece en tabla cursos
  - [ ] Curso aparece en catálogo público
  - [ ] Imagen del curso se ve correctamente
  - [ ] Admin puede editar curso
  - [ ] Admin puede eliminar curso

---

## 📝 Notas Importantes

1. **Si el error persiste después de crear buckets:**
   - Reinicia el servidor: Ctrl+C en terminal, luego `npm run dev`
   - Limpia caché del navegador: Ctrl+Shift+Delete
   - Prueba desde una ventana privada/incógnito

2. **Si error persiste en RLS:**
   - Revisa permisos: ¿El usuario está correctamente marcado como ADMIN en tabla usuarios?
   - Verifica que el trigger `on_auth_user_created` existe
   - Ejecuta: `SELECT * FROM usuarios WHERE id = 'tu_id';` para ver el rol_id

3. **Para debug de uploads:**
   - Abre Console (F12) en el navegador
   - Ve a pestaña "Network"
   - Busca la petición POST a Supabase Storage
   - ¿Qué código de estado retorna? (si es 400, hay problema de permisos)

---

## 🎯 Siguiente Paso

Cuando hayas verificado ✅ TODOS los puntos del checklist, avísame y pasamos a:
**FASE 2: Proceso de Ventas** (Compra de cursos, subida de comprobantes, pagos)

---

**Creado:** 2026-04-22  
**Última actualización:** Verificación automática inicial
