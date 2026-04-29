# Configuración de Políticas RLS en Supabase

## Problema
Para que los administradores puedan eliminar y actualizar cursos desde el panel admin, necesitas configurar las políticas de Row Level Security (RLS) en la tabla `cursos`.

## Solución

### 1. Ir a Supabase Dashboard
- Abre https://app.supabase.com
- Selecciona tu proyecto
- Ve a SQL Editor

### 2. Ejecuta estas políticas RLS

#### Política para SELECT (Lectura)
```sql
-- Permitir a todos ver cursos activos
CREATE POLICY "Permitir lectura de cursos activos"
  ON public.cursos
  FOR SELECT
  USING (true);
```

#### Política para UPDATE (Actualización)
```sql
-- Permitir a administradores actualizar cursos
CREATE POLICY "Admin puede actualizar cursos"
  ON public.cursos
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

#### Política para DELETE (Eliminación)
```sql
-- Permitir a administradores eliminar cursos
CREATE POLICY "Admin puede eliminar cursos"
  ON public.cursos
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM public.usuarios 
      WHERE rol_id = 1
    )
  );
```

#### Política para INSERT (Creación)
```sql
-- Permitir a administradores crear cursos
CREATE POLICY "Admin puede crear cursos"
  ON public.cursos
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.usuarios 
      WHERE rol_id = 1
    )
  );
```

### 3. Verificar que RLS esté habilitado
1. Ve a la tabla `cursos` en Supabase
2. Haz clic en "RLS" en la esquina superior derecha
3. Asegúrate de que esté activado (debe mostrar un ícono de candado)

### 4. Verificar datos del usuario
Asegúrate de que tu usuario admin en la tabla `usuarios` tenga:
- `rol_id = 1` (que identifica a un ADMIN)

## Testing
Después de configurar las políticas:
1. Abre el panel admin
2. Ve a "Cursos"
3. Intenta actualizar/desactivar un curso (✅ Desactivar/Activar)
4. Intenta eliminar un curso (🗑️ Eliminar)

Si aún hay errores, verifica:
- ✅ RLS está habilitado en la tabla `cursos`
- ✅ Las políticas están creadas correctamente
- ✅ Tu usuario tiene `rol_id = 1` en la tabla `usuarios`
- ✅ Estás autenticado como ese usuario
