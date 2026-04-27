# ✅ Checklist Paso a Paso: Configurar Supabase

Una guía práctica para crear y configurar toda la base de datos en Supabase desde cero.

---

## **PASO 1: Preparar variables de entorno**

El proyecto necesita conectarse a Supabase. Necesitas credenciales.

### En tu proyecto Next.js, crea archivo `.env.local`

```env
# Supabase - Obtén esto de tu dashboard de Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tuproyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**¿Dónde obtener estas credenciales?**
1. Entra a [supabase.com](https://supabase.com)
2. Abre tu proyecto
3. Ve a **Settings** → **API**
4. Copia `Project URL`, `anon key` y `service_role key`

✅ **Status:** Credenciales configuradas

---

## **PASO 2: Crear tabla ROLES**

Los roles definen qué tipos de usuarios existen (ADMIN, CLIENTE).

### Entra a Supabase → SQL Editor → Nueva query

```sql
-- Crear tabla ROLES
CREATE TABLE IF NOT EXISTS roles (
  id SMALLINT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Insertar datos iniciales
INSERT INTO roles (id, nombre) VALUES 
  (1, 'ADMIN'),
  (2, 'CLIENTE')
ON CONFLICT (id) DO NOTHING;
```

**¿Qué hace?**
- Crea tabla con ID y nombre
- Inserta ADMIN (id=1) y CLIENTE (id=2)

**Ejecuta y verifica:**
- Ve a **Editor** → **roles**
- Deberías ver 2 filas

✅ **Status:** Tabla roles creada

---

## **PASO 3: Crear tabla USUARIOS**

Aquí guardamos los datos de los usuarios registrados.

### Query en SQL Editor:

```sql
-- Crear tabla USUARIOS
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  rol_id SMALLINT REFERENCES roles(id) DEFAULT 2,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índice para búsquedas rápidas por email
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
```

**¿Qué hace?**
- Tabla con ID (referencia a auth.users)
- Campos: nombre, email, rol_id, fecha_registro
- Por defecto, rol_id = 2 (CLIENTE)
- Si auth borra un usuario, esta tabla lo borra también

**Ejecuta y verifica:**
- Ve a **Editor** → **usuarios**
- Debería estar vacía por ahora

✅ **Status:** Tabla usuarios creada

---

## **PASO 4: Crear FUNCIÓN handle_new_user()**

Esta función copia automáticamente el usuario de Auth a la tabla usuarios.

### Query en SQL Editor:

```sql
-- Crear función que copia usuario de Auth a tabla usuarios
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.usuarios (id, nombre, email, rol_id)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'nombre', 'Usuario Nuevo'),
    new.email,
    2 -- ID del rol CLIENTE
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**¿Qué hace?**
- Se ejecuta cuando alguien se registra
- Copia: id (de Auth) → id (tabla usuarios)
- Copia: nombre (de metadata) → nombre (tabla usuarios)
- Copia: email → email
- Asigna rol_id = 2 (CLIENTE)

**¿Por qué SECURITY DEFINER?**
- Permite que la función ejecute con permisos de admin
- Necesario porque crea registros en tabla usuarios

✅ **Status:** Función creada

---

## **PASO 5: Crear TRIGGER on_auth_user_created**

El trigger ejecuta la función automáticamente cuando alguien se registra.

### Query en SQL Editor:

```sql
-- Crear trigger que se ejecuta al registrarse alguien
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();
```

**¿Qué hace?**
- Escucha: ¿Se registró alguien nuevo en Auth?
- Si SÍ → automáticamente ejecuta `handle_new_user()`
- Esto sincroniza Auth con tu tabla usuarios

**Verifica:**
- Ve a **Database** → **Triggers**
- Deberías ver `on_auth_user_created`

✅ **Status:** Trigger configurado

---

## **PASO 6: Crear tabla CURSOS**

Los cursos que vende la empresa.

### Query en SQL Editor:

```sql
-- Crear tabla CURSOS
CREATE TABLE IF NOT EXISTS cursos (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  imagen_url VARCHAR(500),
  duracion VARCHAR(50),
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_cursos_activo ON cursos(activo);
```

**¿Qué hace?**
- tabla con id, nombre, descripcion, precio, etc.
- `activo` = TRUE significa que el curso está activo y visible
- `activo` = FALSE significa que está desactivado

**Ejemplo de datos que irán aquí:**
```
id | titulo        | precio | activo
1  | Python 101    | 99.99  | true
2  | JavaScript    | 79.99  | true
3  | React Basics  | 89.99  | true
```

✅ **Status:** Tabla cursos creada

---

## **PASO 7: Crear tabla COMPRAS**

Relaciona un usuario con un curso que compró.

### Query en SQL Editor:

```sql
-- Crear tabla COMPRAS
CREATE TABLE IF NOT EXISTS compras (
  id SERIAL PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  curso_id INTEGER NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado VARCHAR(50) DEFAULT 'pendiente'
  CHECK (estado IN ('pendiente', 'activo', 'bloqueado'))
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_compras_usuario ON compras(usuario_id);
CREATE INDEX IF NOT EXISTS idx_compras_curso ON compras(curso_id);
```

**¿Qué hace?**
- usuario_id → Apunta a tabla usuarios
- curso_id → Apunta a tabla cursos
- estado puede ser: pendiente, activo, bloqueado
- CHECK valida que estado tenga uno de esos 3 valores

**Estados:**
- **pendiente**: Usuario compró pero aún no pagó
- **activo**: Pago fue aprobado, usuario accede al curso
- **bloqueado**: Pago fue rechazado

✅ **Status:** Tabla compras creada

---

## **PASO 8: Crear tabla PAGOS**

Registra el comprobante de pago y su validación.

### Query en SQL Editor:

```sql
-- Crear tabla PAGOS
CREATE TABLE IF NOT EXISTS pagos (
  id SERIAL PRIMARY KEY,
  compra_id INTEGER NOT NULL REFERENCES compras(id) ON DELETE CASCADE,
  comprobante_url VARCHAR(500) NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  metodo_pago VARCHAR(50),
  estado VARCHAR(50) DEFAULT 'pendiente'
  CHECK (estado IN ('pendiente', 'aprobado', 'rechazado')),
  observaciones TEXT,
  fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_pagos_compra ON pagos(compra_id);
CREATE INDEX IF NOT EXISTS idx_pagos_estado ON pagos(estado);
```

**¿Qué hace?**
- compra_id → Apunta a tabla compras
- comprobante_url → URL de la imagen del recibo (guardada en Storage)
- monto → Dinero pagado
- metodo_pago → "Transferencia", "Tarjeta", etc.
- estado: pendiente, aprobado, rechazado
- observaciones: Por qué se rechazó (ej. "Monto no coincide")

**Estados:**
- **pendiente**: Admin aún no revisa
- **aprobado**: Admin validó, compra pasa a activo
- **rechazado**: Admin revisa y ve que no es válido

✅ **Status:** Tabla pagos creada

---

## **PASO 9: Configurar Row Level Security (RLS)**

RLS protege los datos: cada usuario solo ve lo que le corresponde.

### Query 1: Habilitar RLS en tabla USUARIOS

```sql
-- Activar RLS en tabla usuarios
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Política: Admin ve todos los usuarios
CREATE POLICY "Admin ve todos usuarios"
  ON usuarios
  FOR SELECT
  USING (
    (SELECT rol_id FROM usuarios WHERE id = auth.uid()) = 1
  );

-- Política: Cliente ve solo su propio perfil
CREATE POLICY "Cliente ve su propio perfil"
  ON usuarios
  FOR SELECT
  USING (
    id = auth.uid() OR
    (SELECT rol_id FROM usuarios WHERE id = auth.uid()) = 1
  );
```

**¿Qué hace?**
- Admin (rol_id=1) ve todos los usuarios
- Cliente (rol_id=2) solo ve su propio perfil
- `auth.uid()` = el ID del usuario actual autenticado

---

### Query 2: Habilitar RLS en tabla COMPRAS

```sql
-- Activar RLS en tabla compras
ALTER TABLE compras ENABLE ROW LEVEL SECURITY;

-- Política: Admin ve todas las compras
CREATE POLICY "Admin ve todas compras"
  ON compras
  FOR SELECT
  USING (
    (SELECT rol_id FROM usuarios WHERE id = auth.uid()) = 1
  );

-- Política: Cliente ve solo sus compras
CREATE POLICY "Cliente ve sus compras"
  ON compras
  FOR SELECT
  USING (
    usuario_id = auth.uid()
  );

-- Política: Cliente puede insertar compra
CREATE POLICY "Cliente puede comprar"
  ON compras
  FOR INSERT
  WITH CHECK (
    usuario_id = auth.uid()
  );
```

---

### Query 3: Habilitar RLS en tabla PAGOS

```sql
-- Activar RLS en tabla pagos
ALTER TABLE pagos ENABLE ROW LEVEL SECURITY;

-- Política: Admin ve todos los pagos
CREATE POLICY "Admin ve todos pagos"
  ON pagos
  FOR SELECT
  USING (
    (SELECT rol_id FROM usuarios WHERE id = auth.uid()) = 1
  );

-- Política: Cliente ve solo sus pagos
CREATE POLICY "Cliente ve sus pagos"
  ON pagos
  FOR SELECT
  USING (
    compra_id IN (
      SELECT id FROM compras WHERE usuario_id = auth.uid()
    )
  );

-- Política: Cliente puede subir comprobante
CREATE POLICY "Cliente puede subir pagos"
  ON pagos
  FOR INSERT
  WITH CHECK (
    compra_id IN (
      SELECT id FROM compras WHERE usuario_id = auth.uid()
    )
  );

-- Política: Admin valida pagos
CREATE POLICY "Admin valida pagos"
  ON pagos
  FOR UPDATE
  USING (
    (SELECT rol_id FROM usuarios WHERE id = auth.uid()) = 1
  )
  WITH CHECK (
    (SELECT rol_id FROM usuarios WHERE id = auth.uid()) = 1
  );
```

---

### Query 4: Habilitar RLS en tabla CURSOS

```sql
-- Activar RLS en tabla cursos
ALTER TABLE cursos ENABLE ROW LEVEL SECURITY;

-- Política: TODOS ven cursos activos (público)
CREATE POLICY "Cursos públicos"
  ON cursos
  FOR SELECT
  USING (
    activo = TRUE
  );

-- Política: Solo admin crea, edita, elimina cursos
CREATE POLICY "Admin gestiona cursos"
  ON cursos
  FOR ALL
  USING (
    (SELECT rol_id FROM usuarios WHERE id = auth.uid()) = 1
  );
```

**¿Qué hace RLS?**
- Sin RLS: Alguien puede hacer una query y hackear datos
- Con RLS: La BD misma filtra qué puede ver cada usuario
- Es seguridad en la base de datos, no solo en la aplicación

✅ **Status:** RLS configurado

---

## **PASO 10: Crear Storage para comprobantes**

Supabase Storage te deja guardar archivos (imágenes de comprobantes).

### En Supabase dashboard:

1. Ve a **Storage** (en el menú lateral)
2. Clickea **Create new bucket**
3. Nombre: `comprobantes`
4. Marca: **Private** (no público)
5. Clickea **Create bucket**

**¿Por qué Private?**
- Los comprobantes son privados, solo usuario y admin pueden verlos
- Supabase genera URLs temporales que expiran

✅ **Status:** Storage creado

---

## **PASO 11: Configurar seguridad en Storage**

### Query en SQL Editor:

```sql
-- Política: Admin ve todos los comprobantes
CREATE POLICY "Admin ve comprobantes"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'comprobantes' AND
    (SELECT rol_id FROM usuarios WHERE id = auth.uid()) = 1
  );

-- Política: Usuario ve solo sus comprobantes
CREATE POLICY "Usuario ve sus comprobantes"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'comprobantes' AND
    owner = auth.uid()
  );

-- Política: Usuario puede subir comprobantes
CREATE POLICY "Usuario sube comprobantes"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'comprobantes' AND
    owner = auth.uid()
  );
```

✅ **Status:** Seguridad en Storage configurada

---

## **PASO 12: Insertar datos de prueba (OPCIONAL)**

Para testing.

### Query en SQL Editor:

```sql
-- Insertar un curso de prueba
INSERT INTO cursos (titulo, descripcion, precio, categoria, duracion, activo)
VALUES (
  'Python 101',
  'Aprende Python desde cero',
  99.99,
  'Programación',
  '4 semanas',
  TRUE
);

INSERT INTO cursos (titulo, descripcion, precio, categoria, duracion, activo)
VALUES (
  'JavaScript Avanzado',
  'Domina JavaScript moderno',
  79.99,
  'Programación',
  '6 semanas',
  TRUE
);
```

✅ **Status:** Datos de prueba insertados

---

## **Resumen: ¿Qué acabas de hacer?**

| Paso | Qué creaste | Para qué |
|------|-------------|----------|
| 1 | Variables de entorno | Conectar Next.js a Supabase |
| 2 | Tabla ROLES | ADMIN y CLIENTE |
| 3 | Tabla USUARIOS | Guardar usuarios registrados |
| 4 | Función handle_new_user() | Copiar usuario de Auth a BD |
| 5 | Trigger on_auth_user_created | Ejecutar función automáticamente |
| 6 | Tabla CURSOS | Guardar cursos a vender |
| 7 | Tabla COMPRAS | Registrar qué usuario compró qué curso |
| 8 | Tabla PAGOS | Guardar comprobantes y validarlos |
| 9 | RLS en todas las tablas | Seguridad: cada user ve solo sus datos |
| 10 | Storage bucket "comprobantes" | Guardar imágenes de recibos |
| 11 | RLS en Storage | Seguridad: comprobantes privados |
| 12 | Datos de prueba | Testear funcionalidad |

---

## **Próximos pasos en Next.js**

Una vez que Supabase cumple todos estos pasos:

1. ✅ Conectar Next.js a Supabase client
2. ✅ Crear página de registro
3. ✅ Crear página de login
4. ✅ Crear página de catálogo (mostrar cursos)
5. ✅ Crear flujo de compra
6. ✅ Crear formulario para subir comprobante
7. ✅ Panel admin para validar pagos
8. ✅ Proteger rutas (solo admin accede a admin panel)

---

## **¿Listo?**

¿Quieres que revisemos si todo está correcto en tu Supabase?

**Pregunta:** ¿Cuál de estos pasos ya completaste y cuál no?
