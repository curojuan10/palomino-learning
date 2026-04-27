# 🔒 Configuración RLS para Tabla CURSOS

## Problema: TC017 - Crear curso falla

Cuando un admin intenta crear un curso, aparece el error:
```
"Error al crear el curso. Por favor intenta de nuevo."
```

**Causa:** Las políticas RLS (Row Level Security) de Supabase no permiten que los admins inserten en la tabla `cursos`.

---

## Solución: Configurar Políticas RLS

### **PASO 1: Ir a Supabase y abrir el SQL Editor**

1. Ve a [app.supabase.com](https://app.supabase.com)
2. Selecciona tu proyecto **palomino-learning**
3. En el menú lateral, ve a **SQL Editor**
4. Crea una **New Query**

---

### **PASO 2: Copiar y ejecutar este SQL**

```sql
-- ============================================
-- HABILITAR RLS en tabla CURSOS
-- ============================================

-- Habilitar RLS
ALTER TABLE cursos ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICA 1: Admins pueden crear/actualizar/eliminar cursos
-- ============================================
CREATE POLICY "admins_crud_cursos" ON cursos
  FOR ALL
  USING (
    -- El usuario debe estar autenticado
    auth.uid() IS NOT NULL
    AND
    -- El usuario debe tener rol ADMIN
    (
      SELECT rol_id 
      FROM usuarios 
      WHERE id = auth.uid()
    ) = 1  -- 1 = ADMIN
  )
  WITH CHECK (
    -- Validación al crear/actualizar
    auth.uid() IS NOT NULL
    AND
    (
      SELECT rol_id 
      FROM usuarios 
      WHERE id = auth.uid()
    ) = 1  -- 1 = ADMIN
  );

-- ============================================
-- POLÍTICA 2: Todos pueden leer cursos activos
-- ============================================
CREATE POLICY "todos_leen_cursos_activos" ON cursos
  FOR SELECT
  USING (activo = true);

-- ============================================
-- POLÍTICA 3: Admins pueden leer todos los cursos (activos e inactivos)
-- ============================================
CREATE POLICY "admins_leen_todos_cursos" ON cursos
  FOR SELECT
  USING (
    (
      SELECT rol_id 
      FROM usuarios 
      WHERE id = auth.uid()
    ) = 1  -- 1 = ADMIN
  );
```

---

### **PASO 3: Ejecutar la Query**

1. Copia el SQL anterior
2. Pégalo en el SQL Editor
3. Presiona **Run** (botón verde)
4. Espera a que diga ✅ "Success"

---

### **PASO 4: Verificar que funcionó**

En Supabase:
1. Ve a **Table Editor**
2. Selecciona tabla **cursos**
3. En la parte derecha, busca **RLS** 
4. Deberías ver:
   - ✅ **RLS enabled**
   - ✅ **3 policies** (admins_crud_cursos, todos_leen_cursos_activos, admins_leen_todos_cursos)

---

## Explicación de las Políticas

| Política | Quién aplica | Qué permite |
|----------|------------|-------------|
| **admins_crud_cursos** | Solo admins (rol_id=1) | Crear, leer, actualizar, eliminar cursos |
| **todos_leen_cursos_activos** | Todos (logueados o no) | Leer cursos que estén activos (activo=true) |
| **admins_leen_todos_cursos** | Solo admins | Leer cursos inactivos también |

---

## ¿Qué significa `rol_id = 1`?

En la tabla `roles`:
- `id = 1` → **ADMIN**
- `id = 2` → **CLIENTE**

---

## Prueba después de configurar RLS

1. Inicia sesión como admin
2. Ve a **/admin/cursos/nuevo**
3. Completa el formulario
4. Presiona **✅ Crear Curso**
5. Debería funcionar sin errores

---

## Si aún falla:

### Revisar logs de error en Supabase:
1. Ve a **Logs** (en el menú lateral)
2. Busca errores RLS
3. Verifica que el usuario tenga `rol_id = 1`

### Verificar que el usuario es admin:
```sql
SELECT id, email, rol_id, roles(nombre) 
FROM usuarios 
WHERE email = 'tu_email@gmail.com';
```

Debería mostrar `rol_id = 1` (ADMIN).

---

## Archivos afectados:

- ✅ `lib/admin.ts` - Funciones actualizadas con validación de rol
- ✅ `app/admin/cursos/nuevo/page.tsx` - Componente con verificación de permisos
- 📝 Este documento - Guía de RLS
