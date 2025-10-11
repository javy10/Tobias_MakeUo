-- Script para CORREGIR las políticas de Storage
-- Primero elimina las políticas existentes y luego las recrea correctamente

-- ============================================
-- ELIMINAR POLÍTICAS EXISTENTES
-- ============================================

DROP POLICY IF EXISTS "Allow public access to courses" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to services" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to products" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to perfumes" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to gallery" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to hero" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to about" ON storage.objects;

-- ============================================
-- CREAR POLÍTICAS CORRECTAS
-- ============================================

-- COURSES bucket - Permitir SELECT (lectura)
CREATE POLICY "Public Access - courses - select"
ON storage.objects FOR SELECT
USING (bucket_id = 'courses');

-- COURSES bucket - Permitir INSERT (subida)
CREATE POLICY "Public Access - courses - insert"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'courses');

-- COURSES bucket - Permitir UPDATE (actualización)
CREATE POLICY "Public Access - courses - update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'courses');

-- COURSES bucket - Permitir DELETE (eliminación)
CREATE POLICY "Public Access - courses - delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'courses');

-- SERVICES bucket
CREATE POLICY "Public Access - services - select"
ON storage.objects FOR SELECT
USING (bucket_id = 'services');

CREATE POLICY "Public Access - services - insert"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'services');

CREATE POLICY "Public Access - services - update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'services');

CREATE POLICY "Public Access - services - delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'services');

-- PRODUCTS bucket
CREATE POLICY "Public Access - products - select"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

CREATE POLICY "Public Access - products - insert"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'products');

CREATE POLICY "Public Access - products - update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'products');

CREATE POLICY "Public Access - products - delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'products');

-- PERFUMES bucket
CREATE POLICY "Public Access - perfumes - select"
ON storage.objects FOR SELECT
USING (bucket_id = 'perfumes');

CREATE POLICY "Public Access - perfumes - insert"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'perfumes');

CREATE POLICY "Public Access - perfumes - update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'perfumes');

CREATE POLICY "Public Access - perfumes - delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'perfumes');

-- GALLERY bucket
CREATE POLICY "Public Access - gallery - select"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

CREATE POLICY "Public Access - gallery - insert"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Public Access - gallery - update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'gallery');

CREATE POLICY "Public Access - gallery - delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'gallery');

-- HERO bucket
CREATE POLICY "Public Access - hero - select"
ON storage.objects FOR SELECT
USING (bucket_id = 'hero');

CREATE POLICY "Public Access - hero - insert"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'hero');

CREATE POLICY "Public Access - hero - update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'hero');

CREATE POLICY "Public Access - hero - delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'hero');

-- ABOUT bucket
CREATE POLICY "Public Access - about - select"
ON storage.objects FOR SELECT
USING (bucket_id = 'about');

CREATE POLICY "Public Access - about - insert"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'about');

CREATE POLICY "Public Access - about - update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'about');

CREATE POLICY "Public Access - about - delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'about');

-- ============================================
-- VERIFICACIÓN
-- ============================================

SELECT 'Políticas de Storage corregidas exitosamente!' as message;

-- Ver todas las políticas creadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE schemaname = 'storage'
ORDER BY tablename, policyname;
