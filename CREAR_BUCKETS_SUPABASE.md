# 🚀 GUÍA: Crear Buckets en Supabase Storage - PASO A PASO

**Tiempo estimado:** 5 minutos  
**Dificultad:** Muy fácil

---

## ❓ ¿Qué es un Bucket?

Un bucket es una carpeta en la nube de Supabase donde se guardan archivos (imágenes, PDFs, etc).

Tu proyecto necesita **2 buckets**:
- `curso-images` → Para guardar imágenes de cursos
- `comprobantes` → Para guardar comprobantes de pago

---

## 📋 PASO 1: Entra a Supabase Dashboard

1. Ve a https://supabase.com
2. Inicia sesión con tu cuenta
3. Haz clic en tu proyecto **"palomino-learning"** (o como se llame)
4. Deberías ver el dashboard del proyecto

---

## 📋 PASO 2: Accede a Storage

En el menú izquierdo, busca **"Storage"** y haz clic:

```
Dashboard Left Menu:
├── Home
├── SQL Editor
├── Auth
├── Database
├── Realtime
├── Storage  ← HAZ CLIC AQUÍ
├── Vectors
└── ...
```

Deberías ver una pantalla que dice:

```
🗂️ Buckets
"You don't have any buckets yet"
```

O si ya tienes buckets, verás una lista.

---

## 📋 PASO 3: Crear Bucket "curso-images"

### Botón "+ New bucket"
1. Busca el botón **"+ New bucket"** (generalmente arriba a la derecha)
2. Haz clic

### Llenar Formulario
Aparecerá un formulario. Completa así:

```
Bucket name:  curso-images
Public bucket: ✅ ACTIVA ESTA OPCIÓN (debe estar checked)
```

**¿Por qué pública?**  
Porque necesitamos que las imágenes de los cursos se vean en la web pública. Los usuarios deben poder verlas.

### Haz clic: "Create bucket"

Debería mostrarte: ✅ **"bucket created"**

---

## 📋 PASO 4: Crear Bucket "comprobantes"

Repite el paso anterior, pero ahora:

```
Bucket name:  comprobantes
Public bucket: ❌ NO actives (debe estar UNchecked)
```

**¿Por qué privado?**  
Porque los comprobantes de pago son sensibles. Solo el admin debe poder verlos.

### Haz clic: "Create bucket"

Debería mostrarte: ✅ **"bucket created"**

---

## 📋 PASO 5: Verificar que existen

Después de crear ambos, deberías ver en Storage:

```
🗂️ Buckets

📁 curso-images     (Público) 🌐
📁 comprobantes     (Privado) 🔒
```

Si ves ambos, ¡PERFECTO! ✅

---

## 📋 PASO 6: Configurar CORS (IMPORTANTE)

**¿Qué es CORS?**  
CORS permite que tu aplicación Next.js suba archivos a los buckets.

### Para cada bucket (primero "curso-images"):

1. Haz clic en el bucket **"curso-images"**
2. Deberías ver dentro una carpeta vacía (o varios archivos si ya hay)
3. Busca el ícono de **"⚙️ Settings"** (arriba a la derecha del bucket)
4. Haz clic en "Settings"

### Busca la sección "CORS"

Deberías ver algo como:

```
🔧 CORS allowed origins

[Add a new origin] o similar
```

### Agrega tu origen local:

1. Haz clic en "Add" (o el botón para agregar)
2. Escribe:
   ```
   http://localhost:3000
   ```
3. Haz clic en "Save" o "Confirm"

### Si tienes un dominio en producción, agrega también:
```
https://tudominio.com
```

Repite esto para ambos buckets ("curso-images" y "comprobantes")

---

## 📋 PASO 7: OPCIONAL - Configurar Políticas RLS

**Nota:** El sistema ya está configurado para RLS en el código. Si no ves políticas, no te preocupes, el código las maneja.

Si quieres verificar que todo está bien, busca:

1. En el bucket "curso-images" → Ir a "Policies"
2. Deberías ver políticas para lectura y escritura

Si no ves nada, no es crítico ahora. El sistema funcionará.

---

## ✅ VERIFICACIÓN FINAL

Después de seguir todos los pasos:

- [ ] Bucket "curso-images" existe y es PÚBLICO
- [ ] Bucket "comprobantes" existe y es PRIVADO
- [ ] Ambos buckets tienen CORS configurado para http://localhost:3000
- [ ] Puedes ver ambos buckets en la lista de Storage

---

## 🧪 PRUEBA EL SISTEMA

Una vez hecho esto:

1. Regresa a tu aplicación (http://localhost:3000)
2. **IMPORTANTE:** Reinicia el servidor:
   - Presiona **Ctrl+C** en la terminal
   - Ejecuta `npm run dev` de nuevo
3. Inicia sesión como **ADMIN**
4. Ve a: http://localhost:3000/admin/cursos/nuevo
5. Llena los campos y **especialmente sube una imagen**
6. Haz clic "Crear Curso"

### Posibles resultados:

✅ **ÉXITO:** El curso se crea y aparece en la lista
- Significa: ¡Los buckets funcionan correctamente!
- Puedes continuar con el resto de verificaciones de Fase 1

❌ **ERROR 400 o similar:** El bucket sigue sin funcionar
- Posible causa: 
  - [ ] ¿Reiniciaste el servidor (`npm run dev`)?
  - [ ] ¿Los nombres de los buckets son exactamente `curso-images` y `comprobantes`?
  - [ ] ¿Revisaste que estén PÚBLICO/PRIVADO según corresponde?
  - [ ] ¿Configuraste CORS?

---

## 🆘 Si algo no funciona

1. **Verifica los nombres exactamente:**
   - `curso-images` (con guión, minúsculas)
   - `comprobantes` (minúsculas)

2. **Reinicia el servidor:**
   ```bash
   Ctrl+C
   npm run dev
   ```

3. **Limpia caché del navegador:**
   - Presiona Ctrl+Shift+Delete
   - Borra cookies y cache

4. **Prueba en una ventana incógnita:**
   - Ctrl+Shift+N (o Cmd+Shift+N en Mac)
   - Accede a http://localhost:3000

5. **Revisa la consola del navegador (F12):**
   - Abre Developer Tools (F12)
   - Ve a la pestaña "Console"
   - Intenta crear un curso
   - ¿Qué error aparece?

---

## ✨ Lo que pasará después

Una vez que los buckets estén listos:

1. Los cursos se crearán **sin errores**
2. Las imágenes se guardarán automáticamente
3. Los comprobantes de pago se subirán **sin problemas**
4. El sistema estará **100% funcional para Fase 1**

---

## 📞 Checklist Final

Antes de decir "listo":

- [ ] ¿Leíste todos los pasos?
- [ ] ¿Creaste "curso-images" como PÚBLICO?
- [ ] ¿Creaste "comprobantes" como PRIVADO?
- [ ] ¿Configuraste CORS para ambos?
- [ ] ¿Reiniciaste el servidor Next.js?
- [ ] ¿Intentaste crear un curso?
- [ ] ¿El curso se creó SIN errores?

Si todo está ✅, avísame y pasamos a **VERIFICACIÓN FASE 1 COMPLETA**

---

**Tiempo total:** ~10 minutos (5 min crear buckets + 5 min testing)  
**Dificultad:** ⭐ Muy fácil

¿Necesitas ayuda? Revisa los pasos de nuevo o contacta para clarificaciones.
