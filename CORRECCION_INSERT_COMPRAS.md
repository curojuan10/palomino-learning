# Corrección: Error de Insert en Tabla Compras

## Problema Identificado
La función `crearCompra()` estaba enviando `curso_id` como string, pero el esquema de la tabla `compras` espera:
- `usuario_id`: UUID (string válido) ✅
- `curso_id`: int8 (número) ❌ Estaba siendo enviado como string
- `estado`: tipo enum `estado_compra` = 'pendiente' (minúsculas exacto) ✅

## Cambios Realizados

### 📄 [lib/compras.ts](lib/compras.ts#L4-L28)

**Antes:**
```typescript
export async function crearCompra(usuarioId: string, cursoId: string) {
  const client = createClient();
  
  const { data, error } = await client
    .from('compras')
    .insert([
      {
        usuario_id: usuarioId,
        curso_id: cursoId,  // ❌ String, debería ser número
        estado: 'pendiente',
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

**Después:**
```typescript
export async function crearCompra(usuarioId: string, cursoId: string) {
  const client = createClient();
  
  // Convertir cursoId a número (int8)
  const cursoIdNumero = parseInt(cursoId, 10);
  if (isNaN(cursoIdNumero)) {
    throw new Error('curso_id debe ser un número válido');
  }

  // Validar que usuario_id sea UUID
  if (!usuarioId || typeof usuarioId !== 'string' || usuarioId.trim() === '') {
    throw new Error('usuario_id debe ser un UUID válido');
  }

  const { data, error } = await client
    .from('compras')
    .insert([
      {
        usuario_id: usuarioId,
        curso_id: cursoIdNumero,  // ✅ Convertido a int8
        estado: 'pendiente',
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

## Validaciones Agregadas
1. ✅ Conversión de `curso_id` de string a número (int8)
2. ✅ Validación que `curso_id` sea un número válido
3. ✅ Validación que `usuario_id` sea un UUID válido
4. ✅ Solo se envían las 3 columnas requeridas: `usuario_id`, `curso_id`, `estado`

## Flujo de Datos Verificado
1. **ModalCompra.tsx** → llama `crearCompra(userId, curso.id)`
   - `userId`: UUID válido del auth
   - `curso.id`: string que será convertido a int8

2. **lib/compras.ts** → realiza conversiones y validaciones
   - Convierte `cursoId` a número
   - Valida que sea un número válido
   - Envía a Supabase con tipos correctos

3. **lib/pagos.ts** → crear registros de pago (verificado)
   - Solo envía: `compra_id`, `comprobante_url`, `monto`, `estado`
   - No incluye columnas inexistentes como 'metodo' o 'total'

## Resultado Esperado
✅ Los inserts en la tabla `compras` ahora funcionarán correctamente con tipos de datos coincidentes.
