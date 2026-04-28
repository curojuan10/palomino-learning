@AGENTS.md

# Sistema Web de Gestión y Venta de Cursos con Integración a Aula Virtual

## 1. Descripción general

Este sistema web permite la venta de cursos en línea mediante una landing page pública, registro de usuarios, compra manual con comprobante, validación por parte del administrador y habilitación de acceso al aula virtual existente.

La solución está pensada para una entidad que necesita controlar sus cursos, ventas, usuarios y pagos desde un panel administrativo, sin depender de procesos manuales fuera del sistema.

## 2. Objetivo del sistema

Desarrollar una aplicación web que permita:

- Captar clientes mediante una landing page
- Mostrar cursos disponibles
- Registrar e iniciar sesión de usuarios
- Gestionar compras de cursos
- Subir comprobantes de pago
- Validar pagos de forma manual por administrador
- Dar acceso al aula virtual solo a usuarios aprobados
- Administrar cursos, usuarios y reportes desde un panel privado

## 3. Tecnologías

**Frontend**
- Next.js 15 + React 19
- Tailwind CSS v4

**Backend y servicios**
- Supabase Auth — autenticación
- Supabase Database — base de datos PostgreSQL
- Supabase Storage — imágenes y comprobantes
- Supabase Row Level Security — permisos y seguridad

## 4. Roles del sistema

- `rol_id = 1` → ADMIN
- `rol_id = 2` → CLIENTE

## 5. Flujo principal

Usuario compra curso → sube comprobante → admin valida → se activa acceso

## 6. Estados

**Compra:** `PENDIENTE` → `ACTIVO` / `BLOQUEADO`
**Pago:** `PENDIENTE` → `APROBADO` / `RECHAZADO`

## 7. Base de datos (tablas principales)

- `roles` — id, nombre
- `usuarios` — id, nombre, email, rol_id, fecha_registro
- `cursos` — id, nombre, descripcion, precio, imagen_url, duracion, estado, categoria, fecha_creacion
- `compras` — id, usuario_id, curso_id, estado (PENDIENTE/ACTIVO/BLOQUEADO)
- `pagos` — id, compra_id, comprobante_url, monto, metodo_pago, estado (PENDIENTE/APROBADO/RECHAZADO), observaciones, fecha_pago

## 8. Estructura de rutas

- `/` — Landing page pública
- `/courses` — Catálogo de cursos (público)
- `/auth/login` — Login
- `/auth/register` — Registro
- `/dashboard` — Dashboard del cliente (protegido)
- `/dashboard/compra/[id]` — Subir comprobante de una compra
- `/admin` — Panel administrativo (solo rol_id=1)
- `/admin/cursos` — Gestión de cursos
- `/admin/cursos/nuevo` — Crear curso
- `/admin/cursos/[id]/edit` — Editar curso
- `/admin/pagos` — Validar pagos pendientes
- `/admin/estudiantes` — Ver usuarios registrados

## 9. Alcance actual

**Incluye:** Landing, auth, catálogo, compra+comprobante, validación manual, panel admin, reportes básicos

**Fuera de scope:** Aula virtual, pagos automáticos, pasarelas de pago, dashboard avanzado

## 10. Fases del desarrollo

- **Fase 1** (completa): Base del sistema — Next.js, Supabase, auth, BD, CRUD cursos
- **Fase 2** (completa): Proceso de ventas — compras, comprobantes, pagos
- **Fase 3** (completa): Panel admin — dashboard, validación pagos, gestión usuarios
- **Fase 4** (pendiente): Integración aula virtual, notificaciones
- **Fase 5** (futuro): Pagos automáticos, métricas avanzadas
