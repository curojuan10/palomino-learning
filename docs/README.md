# 📖 Documentación Palomino Learning

Bienvenido a la documentación del sistema de gestión y venta de cursos.

---

## **📚 Guías disponibles**

### **1. SUPABASE_PASO_A_PASO.md**
**Para:** Entender qué es Supabase y cómo funciona en el proyecto

Aprenderás:
- Qué servicios ofrece Supabase
- Cómo fluyen los datos en tu sistema
- Qué es cada tabla y para qué sirve
- Qué es RLS (seguridad)
- Qué son las funciones y triggers

**Cuándo leerla:** Al principio, para entender el contexto

---

### **2. SUPABASE_CHECKLIST.md**
**Para:** Configurar Supabase desde cero, paso a paso

Contiene:
- Instrucciones SQL completas para crear tablas
- Configuración de funciones y triggers
- Activación de RLS (seguridad)
- Datos de prueba

**Cuándo usarla:** Ahora, para configurar la BD

**Formato:** Copy-paste directo en SQL Editor de Supabase

---

### **3. API_SWAGGER.yaml**
**Para:** Entender todas las operaciones de la BD de forma visual

Documenta:
- Qué datos se envían (request)
- Qué datos se reciben (response)
- Qué errores pueden ocurrir
- Quién puede hacer cada operación (Auth y permisos)
- Ejemplos de datos

**Cuándo usarla:** Cuando desarrollamos endpoints en Next.js

**Formato:** OpenAPI/Swagger - puedes ver bonito en [swagger.io/tools/swagger-ui](https://swagger.io/tools/swagger-ui/)

---

## **📊 Relación entre documentos**

```
┌─────────────────────────────────────────┐
│  SUPABASE_PASO_A_PASO.md               │
│  (Entiende el concepto)                │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  SUPABASE_CHECKLIST.md                  │
│  (Crea las tablas paso a paso)          │
│  Copy-paste SQL en Supabase             │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  API_SWAGGER.yaml                       │
│  (Documenta todas las operaciones)      │
│  Referencia al desarrollar Next.js      │
└─────────────────────────────────────────┘
```

---

## **🚀 Empezar ahora**

### **Si eres nuevo en Supabase:**

1. Lee **SUPABASE_PASO_A_PASO.md** (10-15 min)
2. Abre **SUPABASE_CHECKLIST.md** en otra ventana
3. Copia cada query SQL y pégala en Supabase SQL Editor
4. Ejecuta y verifica

### **Si ya entienes Supabase:**

1. Abre directamente **SUPABASE_CHECKLIST.md**
2. Ejecuta las queries
3. Listo

### **Cuando desarrolles Next.js:**

1. Consulta **API_SWAGGER.yaml** para ver qué datos enviar/recibir
2. Asegúrate de que el frontend respete la estructura

---

## **📝 Estructura de carpetas**

```
palomino-learning/
├── docs/
│   ├── README.md (este archivo)
│   ├── SUPABASE_PASO_A_PASO.md
│   ├── SUPABASE_CHECKLIST.md
│   └── API_SWAGGER.yaml
├── app/
├── lib/
├── public/
└── ...
```

---

## **🔗 Enlaces útiles**

- [Supabase Dashboard](https://supabase.com) - Tu BD en la nube
- [Next.js Docs](https://nextjs.org/docs) - Framework frontend
- [Swagger UI](https://swagger.io/tools/swagger-ui/) - Ver API_SWAGGER.yaml bonito

---

## **❓ Preguntas frecuentes**

**¿Por dónde empiezo?**
→ Lee SUPABASE_PASO_A_PASO.md

**¿Cómo creo las tablas?**
→ Sigue SUPABASE_CHECKLIST.md

**¿Qué datos envío cuando creo una compra?**
→ Consulta API_SWAGGER.yaml, sección "Compras"

**¿Qué es RLS?**
→ Lee la sección "Row Level Security (RLS)" en SUPABASE_CHECKLIST.md

---

## **📞 Soporte**

Si tienes preguntas:
1. Revisa la documentación arriba
2. Busca en el doc de Supabase (Ctrl+F)
3. Pregunta cualquier cosa 👀

---

**Última actualización:** Abril 11, 2026
