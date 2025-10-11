# 🔧 Solución de Problemas - Botón "Añadir" No Funciona

## ✅ Checklist de Verificación

### **1. Verifica las Variables de Entorno**

Tu archivo `.env.local` debe tener SOLO estas dos líneas:

```env
NEXT_PUBLIC_SUPABASE_URL=https://prlxicaxkpctkksmlnax.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBybHhpY2F4a3BjdGtrc21sbmF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MTg2MjAsImV4cCI6MjA3NDk5NDYyMH0.gT1P_5lfOkYtTCpqhnEGjKm8LJd_Tx1cUCMl9TjW0LQ
```

✅ **Ya tienes esto configurado correctamente**

---

### **2. Crear las Tablas en Supabase**

**IMPORTANTE:** Este es probablemente el problema. Las tablas NO se crean automáticamente.

#### **Pasos:**

1. **Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)**
2. **Selecciona tu proyecto**
3. **Ve a "SQL Editor"** (menú lateral izquierdo)
4. **Haz clic en "+ New query"**
5. **Copia y pega TODO el contenido del archivo `supabase-setup.sql`**
6. **Haz clic en "RUN"** (botón verde abajo a la derecha)
7. **Espera a que diga "Success"**
8. **Ve a "Table Editor"** y verifica que veas 10 tablas

---

### **3. Crear los Buckets de Storage**

**IMPORTANTE:** Los buckets tampoco se crean automáticamente.

#### **Pasos:**

1. **En Supabase Dashboard**, ve a **"Storage"** (menú lateral)
2. **Haz clic en "New bucket"**
3. **Crea estos 7 buckets (uno por uno):**

   | Nombre | Public |
   |--------|--------|
   | `courses` | ✅ Sí |
   | `services` | ✅ Sí |
   | `products` | ✅ Sí |
   | `perfumes` | ✅ Sí |
   | `gallery` | ✅ Sí |
   | `hero` | ✅ Sí |
   | `about` | ✅ Sí |

**IMPORTANTE:** Marca TODOS como **"Public bucket"** (checkbox)

---

### **4. Reiniciar el Servidor**

Después de crear tablas y buckets:

1. **Detén el servidor** (Ctrl + C en la terminal donde corre `npm run dev`)
2. **Inicia nuevamente:**
   ```bash
   npm run dev
   ```

---

### **5. Verificar en la Consola del Navegador**

1. **Abre tu aplicación:** `http://localhost:3000/admin`
2. **Presiona F12** para abrir las herramientas de desarrollador
3. **Ve a la pestaña "Console"**
4. **Intenta añadir un curso**
5. **Revisa si aparece algún error en rojo**

#### **Errores Comunes:**

**Error: "relation 'courses' does not exist"**
- ❌ Las tablas no se han creado
- ✅ Solución: Ejecuta el script SQL en Supabase

**Error: "The resource you requested could not be found"**
- ❌ Los buckets no se han creado
- ✅ Solución: Crea los buckets en Storage

**Error: "Invalid API key"**
- ❌ Las variables de entorno están mal
- ✅ Solución: Verifica `.env.local` y reinicia el servidor

---

## 🎯 Resumen de Acciones Necesarias

Para que funcione, debes:

1. ✅ **Variables de entorno configuradas** (ya lo tienes)
2. ❓ **Ejecutar el script SQL** en Supabase → **HAZLO AHORA**
3. ❓ **Crear los 7 buckets** en Storage → **HAZLO AHORA**
4. ❓ **Reiniciar el servidor** → **HAZLO DESPUÉS**

---

## 📸 Capturas de Pantalla de Referencia

### **Cómo ejecutar el SQL:**
1. SQL Editor → New query → Pegar script → Run

### **Cómo crear buckets:**
1. Storage → New bucket → Nombre: `courses` → Public: ✅ → Create

---

## 🆘 Si Sigue Sin Funcionar

Después de hacer los pasos anteriores, si sigue sin funcionar:

1. **Abre la consola del navegador** (F12)
2. **Toma una captura** del error que aparece
3. **Compártela conmigo** y te ayudaré a solucionarlo

---

## 💡 Tip Rápido

Para verificar que todo está bien configurado:

1. **Ve a Supabase Dashboard**
2. **Table Editor** → Deberías ver 10 tablas
3. **Storage** → Deberías ver 7 buckets
4. Si ves todo esto, el problema está en otro lado
