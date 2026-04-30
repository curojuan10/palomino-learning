# 🔧 Diagnóstico: Reportes Mostrando 0

## Problema
El panel de admin muestra todo en 0 (sin datos) en:
- `/admin` - Estadísticas
- `/admin/reportes` - Reporte de Pagos

## ✅ Mejoras Implementadas

### 1. Mejor Manejo de Errores
- Ahora verás alertas en la UI si hay errores
- Cada error te apunta a la solución
- Botón "🔄 Reintentar" disponible

### 2. Logs en Consola del Navegador
Abre **DevTools** (F12) y ve a la pestaña **Console**. Verás logs como:

```
📊 Obteniendo estadísticas del admin...
👥 Contando usuarios...
✅ Total usuarios: 5
📚 Contando cursos...
✅ Total cursos: 3
💳 Contando pagos pendientes...
✅ Pagos pendientes: 2
💰 Calculando ingresos...
✅ Ingresos totales: S/1500
```

Si ves errores como:
```
❌ Error en query de pagos: Policy error or insufficient permissions
```

**Significa que RLS está bloqueando el acceso.**

## 🚀 Solución Rápida (2 opciones)

### Opción 1: RECOMENDADO - Configurar RLS Correctamente
1. Ve a https://app.supabase.com
2. Selecciona tu proyecto
3. Ve a **SQL Editor**
4. Copia y ejecuta los SQL del archivo: `docs/SUPABASE_RLS_COMPLETE.md`
5. Verifica que cada tabla tenga RLS habilitado (candado 🔒)
6. Haz refresh en el navegador

### Opción 2: Deshabilitar RLS Temporalmente (NO RECOMENDADO)
**Solo para testing rápido, nunca en producción:**

1. Ve a Supabase Dashboard
2. Haz click en cada tabla: `usuarios`, `compras`, `pagos`, `cursos`
3. En la esquina superior derecha, desactiva RLS (quita el candado 🔒)
4. Haz refresh en el navegador

⚠️ **RECUERDA**: Reactiva RLS después de testing y configura las políticas correctamente.

## 📋 Checklist de Diagnóstico

- [ ] Abre DevTools (F12)
- [ ] Ve a Console
- [ ] Actualiza la página
- [ ] Busca errores que digan "Policy" o "permission"
- [ ] Si hay errores → Sigue "Opción 1" arriba
- [ ] Si NO hay errores pero datos siguen siendo 0 → Revisa si hay datos reales en Supabase:
  - [ ] Ve a Supabase Dashboard
  - [ ] Tabla `pagos` → ¿Hay filas con estado "APROBADO" o "RECHAZADO"?
  - [ ] Tabla `usuarios` → ¿Hay múltiples usuarios?
  - [ ] Tabla `cursos` → ¿Hay cursos creados?

## 🆘 Si Aún Falla

Comparte en consola:
1. Los logs que ves (copiar del Console)
2. El mensaje de error exacto
3. Captura de Supabase mostrando las tablas y datos

Ejemplo de logs para compartir:
```
📊 Obteniendo estadísticas del admin...
👥 Contando usuarios...
❌ Error al contar usuarios: {message}
```
