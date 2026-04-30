# Configuración Completa de RLS en Supabase - Panel Admin

## Problema
El panel admin muestra todo en 0 porque faltan políticas RLS en las tablas `pagos`, `usuarios`, y `compras`. Los datos no son accesibles al admin.

## Solución: Ejecuta estas políticas RLS

### 1. TABLA: USUARIOS - Lectura para Admins

```sql
-- Permitir a administradores ver todos los usuarios
CREATE POLICY "Admin puede ver usuarios"
  ON public.usuarios
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.usuarios 
      WHERE rol_id = 1
    )
  );

-- Permitir que los clientes vean su propio perfil
CREATE POLICY "Clientes ven su propio perfil"
  ON public.usuarios
  FOR SELECT
  USING (auth.uid() = id);
```

### 2. TABLA: COMPRAS - Lectura para Admins

```sql
-- Permitir a administradores ver todas las compras
CREATE POLICY "Admin puede ver compras"
  ON public.compras
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.usuarios 
      WHERE rol_id = 1
    )
  );

-- Permitir que los clientes vean sus propias compras
CREATE POLICY "Clientes ven sus compras"
  ON public.compras
  FOR SELECT
  USING (usuario_id = auth.uid());
```

### 3. TABLA: PAGOS - Lectura para Admins

```sql
-- Permitir a administradores ver todos los pagos
CREATE POLICY "Admin puede ver pagos"
  ON public.pagos
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.usuarios 
      WHERE rol_id = 1
    )
  );

-- Permitir que los clientes vean sus propios pagos (a través de compra_id)
CREATE POLICY "Clientes ven sus pagos"
  ON public.pagos
  FOR SELECT
  USING (
    compra_id IN (
      SELECT id FROM public.compras 
      WHERE usuario_id = auth.uid()
    )
  );
```

### 4. TABLA: CURSOS - Lectura Pública

```sql
-- Permitir a todos ver cursos activos
CREATE POLICY "Permitir lectura de cursos activos"
  ON public.cursos
  FOR SELECT
  USING (true);
```

### 5. TABLA: PAGOS - Actualización para Admins

```sql
-- Permitir a administradores actualizar pagos
CREATE POLICY "Admin puede actualizar pagos"
  ON public.pagos
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM public.usuarios 
      WHERE rol_id = 1
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.usuarios 
      WHERE rol_id = 1
    )
  );
```

## Pasos para Aplicar

1. **Abre Supabase Dashboard**: https://app.supabase.com
2. **Selecciona tu proyecto**
3. **Ve a: SQL Editor**
4. **Copia y ejecuta cada bloque SQL arriba**
5. **Verifica que cada tabla tenga RLS habilitado:**
   - Ve a cada tabla (usuarios, compras, pagos, cursos)
   - En la esquina superior derecha debe mostrar un candado 🔒 (RLS Enabled)

## Verificación

- ✅ Login como ADMIN
- ✅ Ve a `/admin` (dashboard principal)
- ✅ Verifica que las estadísticas NO muestren 0
- ✅ Ve a `/admin/reportes`
- ✅ Verifica que aparezcan pagos procesados

## Notas

- El botón de WhatsApp ya fue removido del panel admin
- Solo aparece en páginas públicas (landing, courses, etc)
- Los clientes solo ven sus propios datos
- Los admins ven todos los datos
