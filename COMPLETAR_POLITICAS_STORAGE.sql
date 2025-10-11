-- Script SQL para completar las políticas de Storage faltantes en Supabase
-- Ejecuta este script en el SQL Editor de Supabase

-- ============================================
-- POLÍTICAS FALTANTES PARA BUCKETS
-- ============================================

-- HERO bucket - Permitir todo acceso público
CREATE POLICY "Public Access - hero - select"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'hero');

CREATE POLICY "Public Access - hero - insert"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'hero');

CREATE POLICY "Public Access - hero - update"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'hero');

CREATE POLICY "Public Access - hero - delete"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'hero');

-- ABOUT bucket - Permitir todo acceso público
CREATE POLICY "Public Access - about - select"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'about');

CREATE POLICY "Public Access - about - insert"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'about');

CREATE POLICY "Public Access - about - update"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'about');

CREATE POLICY "Public Access - about - delete"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'about');

-- GALLERY bucket - Permitir todo acceso público
CREATE POLICY "Public Access - gallery - select"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'gallery');

CREATE POLICY "Public Access - gallery - insert"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Public Access - gallery - update"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'gallery');

CREATE POLICY "Public Access - gallery - delete"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'gallery');

-- PRODUCTS bucket - Permitir todo acceso público
CREATE POLICY "Public Access - products - select"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'products');

CREATE POLICY "Public Access - products - insert"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'products');

CREATE POLICY "Public Access - products - update"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'products');

CREATE POLICY "Public Access - products - delete"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'products');

-- PERFUMES bucket - Permitir todo acceso público
CREATE POLICY "Public Access - perfumes - select"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'perfumes');

CREATE POLICY "Public Access - perfumes - insert"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'perfumes');

CREATE POLICY "Public Access - perfumes - update"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'perfumes');

CREATE POLICY "Public Access - perfumes - delete"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'perfumes');

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Verificar que todas las políticas se crearon correctamente
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'storage' 
    AND tablename = 'objects'
ORDER BY policyname;

-- Contar el total de políticas
SELECT COUNT(*) as total_policies
FROM pg_policies 
WHERE schemaname = 'storage' 
    AND tablename = 'objects';

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================

-- 1. Este script agrega políticas para los buckets faltantes
-- 2. Las políticas existentes para 'courses' y 'services' se mantienen
-- 3. Todas las políticas permiten acceso público (SELECT, INSERT, UPDATE, DELETE)
-- 4. Cada política está restringida a su bucket específico
-- 5. Después de ejecutar este script, las imágenes deberían cargar correctamente




