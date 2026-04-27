# Componentes de Contacto y Footer

## 📱 Botón WhatsApp Flotante

**Ubicación:** `components/WhatsAppButton.tsx`

### Características:
✅ Botón flotante en la esquina inferior derecha  
✅ Icono de WhatsApp con animación de pulso  
✅ Tooltip "¿Necesitas ayuda?" al pasar el cursor  
✅ Efecto hover: escala y sombra  
✅ Abre WhatsApp en nueva pestaña  
✅ Mensaje pre-cargado personalizable  

### Cómo Personalizar:

**1. Cambiar número de WhatsApp:**
```typescript
const whatsappNumber = '51912345678'; // Cambiar este número
// Formato: código país + número sin +
// Ejemplo Perú: 51912345678
// Ejemplo México: 525512345678
// Ejemplo Colombia: 573212345678
```

**2. Cambiar mensaje predeterminado:**
```typescript
const whatsappMessage = 'Hola! Me gustaría información sobre tus cursos.';
```

**3. Cambiar tooltip:**
En la línea 17, cambiar el texto:
```html
<div className="...">¿Necesitas ayuda?</div>
```

---

## 🔗 Footer

**Ubicación:** `components/Footer.tsx`

### Secciones:

#### 1. Sobre Nosotros
- Logo de la marca
- Descripción breve
- 👈 Personalizable en la línea 17

#### 2. Enlaces Rápidos
- Cursos
- Inicio
- Iniciar Sesión
- Registrarse
- Editable en las líneas 26-33

#### 3. Información de Contacto
- Email
- Teléfono
- Ubicación
- 👈 CAMBIAR en las líneas 41-53

#### 4. Redes Sociales
- Facebook (azul)
- Instagram (gradiente rosa-naranja)
- WhatsApp (verde)
- 👈 CAMBIAR URLs en las líneas 56-87

#### 5. Newsletter
- Suscripción a email
- Diseño atractivo con gradiente

#### 6. Footer Inferior
- Copyright con año actual (automático)
- Enlaces: Privacidad, Términos, Contacto
- Editable en las líneas 128-133

### Cómo Personalizar:

**1. Email de contacto:**
```typescript
<a href="mailto:info@palomino.com"> {/* CAMBIAR AQUÍ */}
```

**2. Teléfono:**
```typescript
<a href="tel:+51912345678"> {/* CAMBIAR AQUÍ */}
```

**3. Ubicación:**
```typescript
<span>Lima, Perú {/* CAMBIAR AQUÍ */}</span>
```

**4. Facebook:**
```typescript
href="https://facebook.com/palominolearning" {/* CAMBIAR AQUÍ */}
```

**5. Instagram:**
```typescript
href="https://instagram.com/palominolearning" {/* CAMBIAR AQUÍ */}
```

**6. WhatsApp en Footer:**
```typescript
href="https://wa.me/51912345678" {/* CAMBIAR AQUÍ */}
```

---

## 🎨 Estilos y Personalización

### Colores utilizados:
- **WhatsApp Button:** Verde `#22c55e` (bg-green-500)
- **Facebook:** Azul `#2563eb` (bg-blue-600)
- **Instagram:** Gradiente rosa-naranja
- **Tema general:** Dark mode (slate-950)

### Animaciones:
- Hover scale: `hover:scale-110` (crece 10%)
- Pulse: `animate-pulse` (efecto de latido)
- Transiciones: `duration-300` (0.3 segundos)

### Responsive:
- Mobile: Una columna
- Tablet: 2 columnas (md:grid-cols-2)
- Desktop: 4 columnas (lg:grid-cols-4)

---

## ✨ Ventajas del Diseño

1. **Accesibilidad:**
   - Atributos `aria-label` para lectores de pantalla
   - Contraste de colores WCAG compliant
   - Texto descriptivo en botones

2. **SEO Friendly:**
   - Estructura HTML semántica
   - Links con rel="noopener noreferrer"
   - Meta descripciones en componentes

3. **Rendimiento:**
   - Componentes 'use client' optimizados
   - Iconos Lucide React (SVG ligero)
   - Sin dependencias externas innecesarias

4. **Experiencia de Usuario:**
   - Feedback visual en interacciones
   - Mensajes predeterminados en WhatsApp
   - Newsletter integrado
   - Múltiples formas de contacto

---

## 📋 Integración en el Layout

Los componentes ya están integrados en `app/layout.tsx`:

```typescript
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

// En el body:
<body className="flex flex-col">
  <Navbar />
  <main className="flex-1">
    {children}
  </main>
  <Footer />
  <WhatsAppButton />
</body>
```

El Footer aparece al final de cada página, y el botón de WhatsApp flota en la esquina.

---

## 🚀 Próximos Pasos

1. ✅ Crear componentes
2. ✅ Integrar en layout
3. ⏳ Cambiar datos reales (email, teléfono, redes)
4. ⏳ Hacer que el newsletter funcione (backend)
5. ⏳ Agregar más redes sociales si es necesario

---

**Última actualización:** 2026-04-22  
**Estado:** ✅ Completado y Funcional
