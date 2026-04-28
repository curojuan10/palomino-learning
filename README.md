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
- Next.js
- React
- Tailwind CSS

**Backend y servicios**
- Supabase Auth — autenticación
- Supabase Database — base de datos PostgreSQL
- Supabase Storage — imágenes y comprobantes
- Supabase Row Level Security — permisos y seguridad

## 4. Alcance

**Incluye**
- Landing page pública
- Registro e inicio de sesión
- Catálogo de cursos
- Compra de cursos
- Subida de comprobantes
- Validación manual de pagos
- Panel administrador
- Reportes básicos
- Acceso controlado al aula virtual

**No incluye por ahora**
- Desarrollo del aula virtual
- Pagos automáticos
- Integraciones con pasarelas de pago
- Dashboard avanzado de analítica

## 5. Roles del sistema

### Cliente
- Ver cursos
- Registrarse e iniciar sesión
- Comprar cursos
- Subir comprobante
- Ver estado de su compra
- Acceder al aula virtual cuando su pago sea aprobado

### Administrador
- Crear, editar y eliminar cursos
- Activar o desactivar cursos
- Revisar comprobantes
- Aprobar o rechazar pagos
- Ver usuarios registrados
- Ver compras realizadas
- Consultar reportes de ventas e ingresos

## 6. Flujo general

1. El usuario entra desde publicidad o buscadores
2. Ve la landing page
3. Selecciona un curso
4. Se registra o inicia sesión
5. Realiza la compra
6. Sube el comprobante de pago
7. El admin revisa el pago
8. Si el pago es aprobado, se activa el acceso al curso
9. El usuario puede ingresar al aula virtual

## 7. Funcionamiento del administrador

El administrador gestiona los datos desde un panel privado y la web pública se actualiza automáticamente.

**Ejemplo:** El admin crea un curso → se guarda en la base de datos → la landing y el catálogo lo muestran automáticamente.

El admin podrá:
- Crear, editar y eliminar cursos
- Cambiar estado de cursos
- Validar pagos
- Ver compras
- Consultar reportes

## 8. Módulos del sistema

### 8.1 Landing Page
- Información general
- Beneficios
- Cursos destacados
- Precios
- Botón de inscripción

### 8.2 Autenticación
- Registro
- Login
- Recuperación de sesión
- Control de acceso según rol

### 8.3 Gestión de cursos
- Crear, editar y eliminar curso
- Listar cursos
- Activar o desactivar curso

### 8.4 Compras
- Selección de curso
- Registro de compra
- Estado de compra

### 8.5 Pagos
- Subida de comprobante
- Estado del pago: Pendiente / Aprobado / Rechazado

### 8.6 Panel admin
- Dashboard
- Validación de pagos
- Gestión de cursos
- Gestión de usuarios
- Reportes

## 9. Base de datos

### 9.1 Roles
| Campo | Tipo |
|-------|------|
| id | uuid |
| nombre | text |

Valores: `ADMIN`, `CLIENTE`

### 9.2 Usuarios
| Campo | Tipo |
|-------|------|
| id | uuid |
| nombre | text |
| email | text |
| password | text |
| rol_id | uuid |
| fecha_registro | timestamp |

### 9.3 Cursos
| Campo | Tipo |
|-------|------|
| id | uuid |
| nombre | text |
| descripcion | text |
| precio | numeric |
| imagen_url | text |
| duracion | text |
| estado | boolean |
| fecha_creacion | timestamp |

### 9.4 Compras
| Campo | Tipo |
|-------|------|
| id | uuid |
| usuario_id | uuid |
| curso_id | uuid |
| fecha | timestamp |
| estado_acceso | text |

Estados: `PENDIENTE`, `ACTIVO`, `BLOQUEADO`

### 9.5 Pagos
| Campo | Tipo |
|-------|------|
| id | uuid |
| compra_id | uuid |
| comprobante_url | text |
| monto | numeric |
| metodo_pago | text |
| estado | text |
| observaciones | text |
| fecha_pago | timestamp |

Estados: `PENDIENTE`, `APROBADO`, `RECHAZADO`

## 10. Lógica del negocio

**Flujo principal:** Usuario compra curso → sube comprobante → admin valida → se activa acceso

**Reglas:**
- Un usuario debe registrarse para comprar
- Cada compra está asociada a un curso
- Cada compra tiene un pago relacionado
- El acceso al curso solo se activa si el pago fue aprobado
- El administrador decide si el comprobante es válido
- Un usuario puede comprar varios cursos

## 11. Flujo de estados

**Compra:** `PENDIENTE` → `ACTIVO` / `BLOQUEADO`

**Pago:** `PENDIENTE` → `APROBADO` / `RECHAZADO`

**Relación:**
- Pago `APROBADO` → Compra pasa a `ACTIVO`
- Pago `RECHAZADO` → Compra pasa a `BLOQUEADO`

## 12. Seguridad

- Contraseñas seguras mediante Supabase Auth
- Autenticación por sesión
- Roles diferenciados
- Protección de rutas privadas
- Políticas RLS en base de datos
- Acceso al panel admin solo para usuarios autorizados

## 13. Reportes

- Total de ventas
- Cursos más vendidos
- Cantidad de usuarios registrados
- Pagos pendientes / aprobados / rechazados
- Ingresos por curso
- Ingresos por mes

## 14. Pantallas principales

**Cliente**
- Landing page
- Catálogo de cursos
- Registro / Login
- Mis compras
- Subir comprobante
- Estado de acceso

**Admin**
- Dashboard
- Gestión de cursos
- Validación de pagos
- Gestión de usuarios
- Reportes

## 15. Fases del desarrollo

### Fase 1 — Base del sistema
- Configurar Next.js y Supabase
- Crear autenticación
- Crear base de datos
- Crear CRUD de cursos

### Fase 2 — Proceso de ventas
- Compra de cursos
- Subida de comprobantes
- Registro de pagos

### Fase 3 — Panel administrativo
- Dashboard
- Validación de pagos
- Gestión de cursos y usuarios

### Fase 4 — Integración
- Acceso al aula virtual
- Notificaciones básicas

### Fase 5 — Mejoras futuras
- Pagos automáticos
- Dashboard avanzado
- Métricas detalladas
- Automatización de notificaciones

## 16. Beneficios del sistema

- Automatiza la venta de cursos
- Centraliza la gestión
- Reduce trabajo manual
- Mejora el control de pagos
- Permite escalar el sistema
- Facilita la administración sin depender del programador
