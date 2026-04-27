# Implementación: Navbar Mejorado + Flujo de Compra Completo

**Fecha**: Abril 23, 2026  
**Estado**: ✅ Completado

---

## 1. Navbar Mejorado con Verificación de Sesión

### Cambios Realizados

#### ✅ Importaciones Nuevas
- `useAuth` de `@/lib/useAuth` para verificar sesión del usuario
- `createClient` de `@/lib/supabase` para logout
- `useRouter` de `next/navigation` para redirecciones
- Icono `LogOut` de `lucide-react`

#### ✅ Lógica de Autenticación
```typescript
const { user, loading } = useAuth();
const router = useRouter();

const handleLogout = async () => {
  const client = createClient();
  await client.auth.signOut();
  router.push('/');
  window.location.reload();
};
```

**Flujo**:
1. Verifica estado de carga
2. Si usuario está logueado: muestra email + botón logout
3. Si usuario NO está logueado: muestra botones login/register

#### ✅ Desktop (md+)
**Cuando está logueado**:
```
┌─────────────────────────────┐
│ usuario | email@domain.com  │
│         [ 🚪 Salir ]        │
└─────────────────────────────┘
```

**Cuando NO está logueado**:
```
┌──────────────────────────────────┐
│ [ Inicia sesión ]  [ Comienza ]  │
└──────────────────────────────────┘
```

#### ✅ Mobile (< md)
**Menú desplegable mejorado**:
- Si está logueado: email, link a dashboard, botón logout
- Si NO está logueado: botones login y register

---

## 2. Flujo de Compra Completo (4 Pasos)

### Arquitectura

#### Estados del Modal
```
'confirmation' 
    ↓
'payment'
    ↓
'receipt'
    ↓
'success'
```

### Paso A: Crear Compra (Estado = 'pendiente')

**Archivo**: `components/ModalCompra.tsx`

**Función**:
```typescript
const handleCrearCompra = async () => {
  const compra = await crearCompra(userId, curso.id);
  setCompraId(compra.id);
  setStep('payment'); // Avanza a Paso B
};
```

**BD**:
- Tabla: `compras`
- Inserción: `usuario_id`, `curso_id`, `estado: 'pendiente'`

**Vista**: Modal de confirmación con detalles del curso

---

### Paso B: Datos de Pago + Selección de Método

**Vista**: "💳 Datos de Pago"

**Elementos**:
1. **Resumen del curso** (solo lectura)
2. **Selección de método de pago**:
   - 🏦 Transferencia Bancaria (BCP, BBVA, Scotiabank, Interbank)
   - 📱 Yape
   - 💰 Plin
3. **Campo de monto** (pre-llenado con precio del curso)

**Código**:
```typescript
const [metodo, setMetodo] = useState('transferencia');
const [monto, setMonto] = useState(curso.precio.toString());

<input
  type="number"
  value={monto}
  onChange={(e) => setMonto(e.target.value)}
  min="0"
  step="0.01"
/>
```

**Acción**: Botón "Continuar" → Paso C

---

### Paso C: Subir Archivo (Comprobante)

**Archivo**: `components/ModalCompra.tsx`  
**Función**: `handleFileChange()`

**Validaciones**:
```typescript
// ✅ Debe ser imagen
if (!f.type.startsWith('image/')) {
  setError('Por favor selecciona una imagen');
}

// ✅ Máximo 5MB
if (f.size > 5 * 1024 * 1024) {
  setError('La imagen debe ser menor a 5MB');
}
```

**Vista**:
- Área de carga (drag & drop visual)
- Preview de la imagen cargada
- Información sobre formatos aceptados

**Código de Upload**:
```typescript
const handleSubirComprobante = async () => {
  // PASO C: Subir archivo
  const comprobanteUrl = await subirComprobanteStorage(file, compraId);
  
  // Continúa a PASO D
};
```

---

### Paso D: Crear Registro en Pagos

**Archivo**: `lib/pagos.ts`  
**Función**: `crearPago()`

**Inserción**:
```typescript
await crearPago({
  compra_id: compraId,
  comprobante_url: comprobanteUrl,
  monto: parseFloat(monto),
  estado: 'pendiente',
});
```

**BD**:
- Tabla: `pagos`
- Campos:
  - `compra_id` (UUID, referencia a compras)
  - `comprobante_url` (string, URL en Storage)
  - `monto` (numeric, cantidad pagada)
  - `estado` (varchar, inicialmente 'pendiente')

**Vista Final**: ✅ Compra Completada
- Muestra resumen
- Estado: ⏳ Pendiente de Aprobación
- Botones: "Cerrar" o "Ir a Dashboard"

---

## 3. Manejo de Errores Mejorado

### Errores de Storage
```typescript
if (err.message.includes('bucket')) {
  errorMessage = '❌ El bucket "comprobantes" no existe en Supabase Storage. Contáctanos.';
} else if (err.message.includes('Permission denied')) {
  errorMessage = '❌ No tienes permiso para subir archivos. Contáctanos.';
} else if (err.message.includes('already exists')) {
  errorMessage = '⚠️ Este archivo ya existe. Intenta con otro archivo.';
}
```

---

## 4. Flujo Visual Completo

```
┌─────────────────────────────────────────────────┐
│ PASO 1: Confirmación                            │
├─────────────────────────────────────────────────┤
│ Título del curso                                │
│ Precio: S/XXX                                   │
│ [ Cancelar ]    [ Continuar a Pago ]            │
│                          ↓ Crea compra          │
├─────────────────────────────────────────────────┤
│ PASO 2: Datos de Pago                           │
├─────────────────────────────────────────────────┤
│ ⭕ Transferencia Bancaria                        │
│ ⭕ Yape                                          │
│ ⭕ Plin                                          │
│ Monto: [XXX.XX]                                 │
│ [ Atrás ]    [ Continuar ]                      │
│                          ↓                      │
├─────────────────────────────────────────────────┤
│ PASO 3: Comprobante de Pago                     │
├─────────────────────────────────────────────────┤
│ [Área de carga de archivo]                      │
│ [Vista previa de imagen]                        │
│ [ Atrás ]    [ Confirmar Pago ]                 │
│                          ↓ Sube archivo + crea  │
│                            registro en pagos    │
├─────────────────────────────────────────────────┤
│ PASO 4: ¡Éxito!                                 │
├─────────────────────────────────────────────────┤
│ ✅ Compra Completada                            │
│ Estado: ⏳ Pendiente de Aprobación              │
│ [ Cerrar ]    [ Ir a Dashboard ]                │
└─────────────────────────────────────────────────┘
```

---

## 5. Estado de Compra en BD

### Tabla: compras
| usuario_id | curso_id | estado | Descripción |
|-----------|----------|--------|------------|
| UUID | 1 | 'pendiente' | Creada en Paso A |

### Tabla: pagos
| compra_id | comprobante_url | monto | estado | Descripción |
|-----------|-----------------|-------|--------|------------|
| UUID | https://... | 99.99 | 'pendiente' | Creada en Paso D |

---

## 6. Componentes Afectados

### `components/Navbar.tsx`
- ✅ Agregado: useAuth hook
- ✅ Agregado: handleLogout función
- ✅ Actualizado: Sección de autenticación (desktop)
- ✅ Actualizado: Menú móvil

### `components/ModalCompra.tsx`
- ✅ Refactorizado: Flujo de 4 pasos
- ✅ Agregado: Estados (confirmation, payment, receipt, success)
- ✅ Agregado: Lógica de archivo y upload
- ✅ Mejorado: Manejo de errores
- ✅ Mejorado: UX visual con métodos de pago

---

## 7. Funciones Utilizadas

### De `lib/compras.ts`
- `crearCompra(usuarioId, cursoId)` → Crea compra con estado 'pendiente'

### De `lib/pagos.ts`
- `crearPago(pagoData)` → Crea registro en tabla pagos
- `subirComprobanteStorage(file, compraId)` → Sube archivo a Storage

### De `lib/supabase.ts`
- `createClient()` → Cliente de Supabase

### De `lib/useAuth.ts`
- `useAuth()` → Hook para obtener usuario y estado de carga

---

## 8. Validaciones Implementadas

✅ **Usuario autenticado**: Redirige a login si no está logueado  
✅ **Monto válido**: Debe ser > 0  
✅ **Archivo válido**: Solo imágenes, máximo 5MB  
✅ **Campos requeridos**: Todos deben estar completos  
✅ **Estados de carga**: Botones deshabilitados durante operaciones  

---

## 9. Próximos Pasos Sugeridos

1. **Testing**: Verificar flujo completo end-to-end
2. **Dashboard de pagos**: Panel admin para revisar y aprobar pagos
3. **Notificaciones**: Email cuando pago es aprobado
4. **Acceso automático**: Cambiar estado a 'activo' cuando pago es aprobado

---

## 10. Checklist de Implementación

- ✅ Navbar verifica sesión Supabase
- ✅ Muestra email si está logueado
- ✅ Botón logout funcional
- ✅ Paso A: Crear compra con estado='pendiente'
- ✅ Paso B: Mostrar datos de pago + métodos
- ✅ Paso C: Upload de archivo al bucket
- ✅ Paso D: Crear registro en pagos
- ✅ Vista de éxito después de completar
- ✅ Manejo de errores mejorado
- ✅ 0 errores TypeScript
- ✅ Compilación exitosa

---

**Implementación completada con éxito** ✅
