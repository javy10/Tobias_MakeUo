# 🚀 Configuración de Supabase para Tobias Makeup Hub

Este documento te guiará paso a paso para configurar Supabase (base de datos PostgreSQL + Storage) en tu proyecto.

## 📋 ¿Por qué Supabase?

- ✅ **Más fácil de configurar** que otras alternativas
- ✅ **PostgreSQL** (base de datos relacional potente)
- ✅ **Sin problemas de permisos** complicados
- ✅ **Interfaz más intuitiva**
- ✅ **Gratis hasta 500MB de base de datos y 1GB de Storage**
- ✅ **API REST automática**

---

## 🚀 Paso 1: Crear Cuenta en Supabase

1. **Ve a [https://supabase.com/](https://supabase.com/)**
2. **Haz clic en "Start your project"**
3. **Inicia sesión con GitHub** (recomendado) o crea una cuenta con email

---

## 📦 Paso 2: Crear un Nuevo Proyecto

1. **Haz clic en "New Project"**
2. **Completa los datos:**
   - **Name:** `TobiasMakeupHub` (o el nombre que prefieras)
   - **Database Password:** Crea una contraseña segura (guárdala, la necesitarás)
   - **Region:** Selecciona la más cercana a tus usuarios (ej: `South America (São Paulo)` o `US East (N. Virginia)`)
   - **Pricing Plan:** Selecciona **"Free"** (gratis)

3. **Haz clic en "Create new project"**
4. **Espera 1-2 minutos** mientras Supabase crea tu proyecto

---

## 🔑 Paso 3: Obtener las Credenciales

1. **Una vez creado el proyecto**, ve a **Settings** (ícono de engranaje en el menú lateral)
2. **Haz clic en "API"** en el menú de Settings
3. **Copia estas dos credenciales:**

   - **Project URL:** `https://tu-proyecto.supabase.co`
   - **anon/public key:** Una clave larga que empieza con `eyJ...`

4. **Guarda estas credenciales**, las necesitarás en el siguiente paso

---

## 🔧 Paso 4: Configurar Variables de Entorno

1. **Abre tu archivo `.env.local`** en la raíz del proyecto
2. **Elimina cualquier configuración anterior** (ya no la necesitas)
3. **Agrega estas dos variables:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

4. **Reemplaza** los valores con tus credenciales reales
5. **Guarda el archivo**

---

## 🗄️ Paso 5: Crear las Tablas en la Base de Datos

1. **En Supabase**, ve a **"Table Editor"** (ícono de tabla en el menú lateral)
2. **Haz clic en "New Table"**
3. **Crea las siguientes tablas una por una:**

### **Tabla: courses**
```sql
CREATE TABLE courses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Tabla: services**
```sql
CREATE TABLE services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Tabla: products**
```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  category_id TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Tabla: perfumes**
```sql
CREATE TABLE perfumes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Tabla: gallery_items**
```sql
CREATE TABLE gallery_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  alt TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Tabla: hero_content**
```sql
CREATE TABLE hero_content (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Tabla: about_me_content**
```sql
CREATE TABLE about_me_content (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  happy_clients TEXT NOT NULL,
  years_of_experience TEXT NOT NULL,
  events TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Tabla: testimonials**
```sql
CREATE TABLE testimonials (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  author TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  seen BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Tabla: categories**
```sql
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Tabla: users**
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 💡 Método Rápido: Ejecutar Todo el SQL de una vez

En lugar de crear tabla por tabla, puedes:

1. **Ve a "SQL Editor"** en el menú lateral de Supabase
2. **Haz clic en "New Query"**
3. **Copia y pega todo este SQL:**

```sql
-- Crear todas las tablas de una vez
CREATE TABLE courses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  category_id TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE perfumes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE gallery_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  alt TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE hero_content (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE about_me_content (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  happy_clients TEXT NOT NULL,
  years_of_experience TEXT NOT NULL,
  events TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE testimonials (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  author TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  seen BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS) para todas las tablas
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_me_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Crear políticas para permitir lectura pública
CREATE POLICY "Allow public read access" ON courses FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON services FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON perfumes FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON gallery_items FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON hero_content FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON about_me_content FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON categories FOR SELECT USING (true);

-- Crear políticas para permitir escritura pública (TEMPORAL - para desarrollo)
CREATE POLICY "Allow public insert" ON courses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON courses FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON courses FOR DELETE USING (true);

CREATE POLICY "Allow public insert" ON services FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON services FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON services FOR DELETE USING (true);

CREATE POLICY "Allow public insert" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON products FOR DELETE USING (true);

CREATE POLICY "Allow public insert" ON perfumes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON perfumes FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON perfumes FOR DELETE USING (true);

CREATE POLICY "Allow public insert" ON gallery_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON gallery_items FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON gallery_items FOR DELETE USING (true);

CREATE POLICY "Allow public insert" ON hero_content FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON hero_content FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON hero_content FOR DELETE USING (true);

CREATE POLICY "Allow public insert" ON about_me_content FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON about_me_content FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON about_me_content FOR DELETE USING (true);

CREATE POLICY "Allow public insert" ON testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON testimonials FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON testimonials FOR DELETE USING (true);

CREATE POLICY "Allow public insert" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON categories FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON categories FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON users FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON users FOR DELETE USING (true);
```

4. **Haz clic en "Run"** (botón verde abajo a la derecha)
5. **Verifica** que todas las tablas se crearon correctamente en "Table Editor"

---

## 📦 Paso 6: Crear los Buckets de Storage

1. **Ve a "Storage"** en el menú lateral de Supabase
2. **Haz clic en "New bucket"**
3. **Crea los siguientes buckets uno por uno:**

   - **Nombre:** `courses` → **Public:** ✅ Sí
   - **Nombre:** `services` → **Public:** ✅ Sí
   - **Nombre:** `products` → **Public:** ✅ Sí
   - **Nombre:** `perfumes` → **Public:** ✅ Sí
   - **Nombre:** `gallery` → **Public:** ✅ Sí
   - **Nombre:** `hero` → **Public:** ✅ Sí
   - **Nombre:** `about` → **Public:** ✅ Sí

**IMPORTANTE:** Marca todos como **"Public bucket"** para que las imágenes sean accesibles públicamente.

---

## 🔄 Paso 7: Reiniciar el Servidor

1. **Detén el servidor** de desarrollo (Ctrl + C en la terminal)
2. **Inicia nuevamente:**
   ```bash
   npm run dev
   ```

---

## ✅ Paso 8: Probar el Sistema

1. **Abre tu aplicación:** `http://localhost:3000/admin`
2. **Ve a la sección de Cursos**
3. **Agrega un nuevo curso** con una imagen
4. **Verifica en Supabase:**
   - Ve a **"Table Editor"** → **"courses"** → Deberías ver tu curso
   - Ve a **"Storage"** → **"courses"** → Deberías ver tu imagen

---

## 🎉 ¡Listo!

Tu aplicación ahora está completamente migrada a Supabase. Todos los datos y archivos se guardan en la nube de manera permanente.

### **Ventajas de Supabase:**
- ✅ Sin problemas de permisos complicados
- ✅ Interfaz más fácil de usar
- ✅ PostgreSQL (base de datos más potente)
- ✅ API REST automática
- ✅ Configuración más rápida

---

## 🔒 Seguridad en Producción

Las políticas actuales permiten acceso público para desarrollo. En producción, deberás:

1. **Implementar autenticación** para el panel admin
2. **Actualizar las políticas RLS** para restringir escritura
3. **Usar Supabase Auth** para gestionar usuarios

---

## 🆘 Solución de Problemas

### **Error: "Invalid API key"**
- Verifica que las variables en `.env.local` sean correctas
- Asegúrate de que empiecen con `NEXT_PUBLIC_`
- Reinicia el servidor

### **Error: "relation does not exist"**
- Verifica que hayas creado todas las tablas en Supabase
- Revisa que los nombres de las tablas sean correctos (en snake_case)

### **Las imágenes no se suben**
- Verifica que los buckets estén marcados como "Public"
- Revisa la consola del navegador para errores

---

## 📚 Recursos

- [Documentación de Supabase](https://supabase.com/docs)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
