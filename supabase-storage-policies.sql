-- Script SQL para crear políticas de Storage en Supabase
-- Copia y pega este script en el SQL Editor de Supabase

-- ============================================
-- POLÍTICAS DE STORAGE (Acceso Público)
-- ============================================

-- COURSES bucket - Permitir todo acceso público
CREATE POLICY "Allow public access to courses"
ON storage.objects FOR ALL
USING (bucket_id = 'courses');

-- SERVICES bucket - Permitir todo acceso público
CREATE POLICY "Allow public access to services"
ON storage.objects FOR ALL
USING (bucket_id = 'services');

-- PRODUCTS bucket - Permitir todo acceso público
CREATE POLICY "Allow public access to products"
ON storage.objects FOR ALL
USING (bucket_id = 'products');

-- PERFUMES bucket - Permitir todo acceso público
CREATE POLICY "Allow public access to perfumes"
ON storage.objects FOR ALL
USING (bucket_id = 'perfumes');

-- GALLERY bucket - Permitir todo acceso público
CREATE POLICY "Allow public access to gallery"
ON storage.objects FOR ALL
USING (bucket_id = 'gallery');

-- HERO bucket - Permitir todo acceso público
CREATE POLICY "Allow public access to hero"
ON storage.objects FOR ALL
USING (bucket_id = 'hero');

-- ABOUT bucket - Permitir todo acceso público
CREATE POLICY "Allow public access to about"
ON storage.objects FOR ALL
USING (bucket_id = 'about');

-- ============================================
-- VERIFICACIÓN
-- ============================================

SELECT 'Políticas de Storage creadas exitosamente!' as message;

-- Para verificar que se crearon correctamente:
SELECT * FROM pg_policies WHERE schemaname = 'storage';
