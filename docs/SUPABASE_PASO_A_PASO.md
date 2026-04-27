# 📚 Guía Paso a Paso: Supabase en Palomino Learning

Aquí aprenderás **qué es Supabase**, **cómo funciona** en tu proyecto y **por qué lo estamos usando**.

---

## **¿Qué es Supabase?**

Supabase es una plataforma que proporciona:

| Servicio | Qué es | Para qué sirve en Palomino |
|----------|--------|---------------------------|
| **Auth** | Autenticación | Registro e inicio de sesión de usuarios |
| **Database** | PostgreSQL en la nube | Guardar cursos, usuarios, compras, pagos |
| **Storage** | Almacenamiento de archivos | Guardar comprobantes de pago e imágenes de cursos |
| **RLS** | Seguridad en base de datos | Proteger datos: admin solo ve admin, cliente solo ve sus datos |

**En resumen:** Supabase = Backend completo sin escribir código de servidor.

---

## **Cómo funciona el flujo en Palomino Learning**

### **Paso 1: Usuario se registra**

```
Usuario entra a la web
        ↓
Llena formulario (email, contraseña, nombre)
        ↓
Presiona "Registrarse"
        ↓
Next.js envía datos a Supabase Auth
        ↓
Supabase verifica y crea usuario en su tabla "auth.users"
        ↓
El TRIGGER "on_auth_user_created" se ejecuta
        ↓
La FUNCIÓN "handle_new_user()" copia el usuario a tu tabla "usuarios"
        ↓
El usuario aparece en tu BD con rol_id = 2 (CLIENTE)
```

**¿Por qué hacemos esto?**
- Supabase Auth mantiene las contraseñas seguras
- Tu tabla `usuarios` es para datos específicos de tu negocio
- Los dos sistemas están sincronizados

---

### **Paso 2: Usuario inicia sesión**

```
Usuario entra email y contraseña
        ↓
Supabase Auth verifica credenciales
        ↓
Si son correctos → devuelve un token (sesión)
        ↓
Next.js guarda el token en cookies/localStorage
        ↓
El usuario está autenticado en la aplicación
```

**¿Por qué es seguro?**
- Supabase Auth usa estándares de seguridad
- Nunca guardamos contraseñas sin encriptar
- El token expira después de cierto tiempo

---

### **Paso 3: Usuario compra un curso**

```
Usuario selecciona curso
        ↓
Presiona "Comprar"
        ↓
Next.js obtiene: usuario_id (del token) + curso_id (del curso)
        ↓
Se crea un registro en tabla "compras"
        ↓
Estado de compra = "PENDIENTE"
        ↓
Usuario ve: "Cargue su comprobante"
```

**Datos guardados:**
```
Tabla: compras
┌──────┬──────────┬──────────┬──────────┬────────────┐
│ id   │usuario_id│ curso_id │  fecha   │ estado     │
├──────┼──────────┼──────────┼──────────┼────────────┤
│ 1    │ abc-123  │ 1        │ 2026-... │ PENDIENTE  │
└──────┴──────────┴──────────┴──────────┴────────────┘
```

---

### **Paso 4: Usuario sube comprobante de pago**

```
Usuario sube archivo (imagen JPG/PNG del recibo)
        ↓
Next.js envía archivo a Supabase Storage
        ↓
Supabase guarda el archivo en la nube
        ↓
Devuelve URL pública del archivo
        ↓
Se crea registro en tabla "pagos"
        ↓
Estado de pago = "PENDIENTE"
```

**Datos guardados:**
```
Tabla: pagos
┌──────┬──────────┬──────────────────────────┬──────────┬─────────┐
│ id   │ compra_id│ comprobante_url          │ estado   │ monto   │
├──────┼──────────┼──────────────────────────┼──────────┼─────────┤
│ 1    │ 1        │ https://...jpg           │ PENDIENTE│ 100.00  │
└──────┴──────────┴──────────────────────────┴──────────┴─────────┘
```

---

### **Paso 5: Admin valida el pago**

```
Admin entra a panel administrativo
        ↓
Ve lista de pagos pendientes
        ↓
Revisa el comprobante (imagen)
        ↓
Presiona "Aprobar" o "Rechazar"
        ↓
Se actualiza tabla "pagos" → estado = "APROBADO"
        ↓
Si fue aprobado:
   - Se actualiza tabla "compras" → estado = "ACTIVO"
   - Usuario ahora SÍ puede acceder al curso
```

**Cambios en datos:**
```
Tabla: pagos
│ id   │ compra_id│ comprobante_url│ estado   │
├──────┼──────────┼────────────────┼──────────┤
│ 1    │ 1        │ https://...jpg │ APROBADO │  ← Cambió de PENDIENTE
└──────┴──────────┴────────────────┴──────────┘

Tabla: compras
│ id   │usuario_id│ curso_id │ estado   │
├──────┼──────────┼──────────┼──────────┤
│ 1    │ abc-123  │ 1        │ ACTIVO   │  ← Cambió de PENDIENTE
└──────┴──────────┴──────────┴──────────┘
```

---

### **Paso 6: Usuario accede al aula virtual**

```
Usuario entra a dashboard
        ↓
Sistema verifica: ¿tiene compras con estado ACTIVO?
        ↓
Si SÍ → muestra botón "Acceder al aula virtual"
        ↓
Usuario clickea
        ↓
Sistema verifica nuevamente que el pago está aprobado
        ↓
Si todo ok → redirige a aula virtual (con URL segura)
```

---

## **Las Tablas que necesitamos**

### **1. Tabla: roles**

Define qué tipos de usuarios existen.

```sql
CREATE TABLE roles (
  id SMALLINT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Datos iniciales:
INSERT INTO roles VALUES 
  (1, 'ADMIN'),
  (2, 'CLIENTE');
```

**¿Para qué?** Determinar si un usuario es admin o cliente.

---

### **2. Tabla: usuarios**

Guardamos información del usuario registrado.

```sql
CREATE TABLE usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  rol_id SMALLINT REFERENCES roles(id),
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**¿Para qué?** Guardar nombre, email, rol de cada usuario.

---

### **3. Tabla: cursos**

Guardamos los cursos que vende la empresa.

```sql
CREATE TABLE cursos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  imagen_url VARCHAR(500),
  duracion VARCHAR(50),
  estado BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**¿Para qué?** Que el admin cree cursos y la landing page los muestre.

---

### **4. Tabla: compras**

Relaciona un usuario con un curso que compró.

```sql
CREATE TABLE compras (
  id SERIAL PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  curso_id INTEGER REFERENCES cursos(id) ON DELETE CASCADE,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado VARCHAR(50) DEFAULT 'PENDIENTE' -- PENDIENTE, ACTIVO, BLOQUEADO
);
```

**¿Para qué?** Saber qué cursos compró cada usuario.

---

### **5. Tabla: pagos**

Guardamos el comprobante de pago y su validación.

```sql
CREATE TABLE pagos (
  id SERIAL PRIMARY KEY,
  compra_id INTEGER REFERENCES compras(id) ON DELETE CASCADE,
  comprobante_url VARCHAR(500) NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  metodo_pago VARCHAR(50),
  estado VARCHAR(50) DEFAULT 'PENDIENTE', -- PENDIENTE, APROBADO, RECHAZADO
  observaciones TEXT,
  fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**¿Para qué?** Guardar el comprobante y decidir si aprobamos o rechazamos.

---

## **Las Funciones que usamos**

### **Función: handle_new_user()**

```sql
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
- Se ejecuta automáticamente cuando alguien se registra
- Copia el id, nombre y email de Auth a tu tabla usuarios
- Asigna rol_id = 2 (CLIENTE)

**¿Por qué?**
- Sincroniza Auth con tu BD
- Garantiza que todo usuario registrado existe en tu tabla

---

### **Trigger: on_auth_user_created**

```sql
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();
```

**¿Qué hace?**
- Escucha cuando alguien se registra en Auth
- Automáticamente ejecuta la función `handle_new_user()`

**¿Por qué?**
- No tenemos que hacerlo manualmente
- Es automático y confiable

---

## **Row Level Security (RLS) - Próximo paso**

RLS es una capa de seguridad que dice:

- **Admin** puede ver y editar cursos, pagos, usuarios
- **Cliente** solo ve sus propias compras y pagos
- **Nadie** puede hack la BD desde la URL

**Ejemplo:**
```sql
-- Un cliente NO puede ver pagos de otros
ALTER TABLE pagos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clientes ven solo sus pagos"
  ON pagos FOR SELECT
  USING (
    compra_id IN (
      SELECT id FROM compras 
      WHERE usuario_id = auth.uid()
    )
  );
```

---

## **Resumen - Lo que pasa en tu sistema**

```
┌─────────────────────────────────────────────────────┐
│  1. Usuario se registra                             │
│     Auth guarda contraseña → Función copia a BD    │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│  2. Usuario compra curso                            │
│     Se crea registro en tabla "compras"            │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│  3. Usuario sube comprobante                        │
│     Se guarda en Storage → URL en tabla "pagos"    │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│  4. Admin revisa y aprueba                          │
│     Cambia estado en tabla "pagos" a APROBADO      │
│     Automáticamente "compras" pasa a ACTIVO        │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│  5. Usuario accede al curso                         │
│     Sistema verifica que compra estña ACTIVO       │
└─────────────────────────────────────────────────────┘
```

---

## **Preguntas frecuentes**

### **¿Dónde se guardan las contraseñas?**
En `auth.users` de Supabase, encriptadas. Tú NUNCA las ves.

### **¿Cómo Next.js se conecta a Supabase?**
Mediante la librería `@supabase/auth-helpers-nextjs` y variables de entorno.

### **¿Qué es `auth.uid()`?**
Es el ID del usuario actual autenticado. Se usa en RLS para proteger datos.

### **¿Por qué usamos triggers?**
Para automatizar tareas. Sin triggers, tendrías que crear usuarios manualmente.

### **¿Qué pasa si admin rechaza un pago?**
El estado en `pagos` cambia a RECHAZADO, pero `compras` sigue PENDIENTE. El usuario puede intentar de nuevo.

---

## **Próximos pasos**

- [ ] Revisar y crear todas las tablas en Supabase
- [ ] Configurar RLS (Row Level Security)
- [ ] Conectar Next.js a Supabase
- [ ] Crear interfaz de registro
- [ ] Crear interfaz de compra
- [ ] Crear panel de admin

---

**¿Dudas hasta aquí? Pregunta cualquier cosa antes de continuar.** 👀
