-- Script para verificar y configurar Realtime en Supabase
-- Ejecutar este script en el SQL Editor de Supabase

-- 1. Verificar si Realtime está habilitado
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename IN (
  'services', 'products', 'perfumes', 'courses', 
  'gallery_items', 'testimonials', 'users', 'categories',
  'hero_content', 'about_me_content'
) 
AND schemaname = 'public'
ORDER BY tablename;

-- 2. Verificar la configuración actual de Realtime
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';

-- 3. Habilitar Realtime para todas las tablas (si no están habilitadas)
ALTER PUBLICATION supabase_realtime ADD TABLE services;
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE perfumes;
ALTER PUBLICATION supabase_realtime ADD TABLE courses;
ALTER PUBLICATION supabase_realtime ADD TABLE gallery_items;
ALTER PUBLICATION supabase_realtime ADD TABLE testimonials;
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE categories;
ALTER PUBLICATION supabase_realtime ADD TABLE hero_content;
ALTER PUBLICATION supabase_realtime ADD TABLE about_me_content;

-- 4. Verificar que las tablas están habilitadas para Realtime
SELECT 
  schemaname,
  tablename,
  pubname
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
ORDER BY tablename;

-- 5. Verificar políticas RLS (Row Level Security)
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN (
  'services', 'products', 'perfumes', 'courses', 
  'gallery_items', 'testimonials', 'users', 'categories',
  'hero_content', 'about_me_content'
)
ORDER BY tablename, policyname;

-- 6. Crear políticas RLS básicas si no existen (para permitir operaciones)
-- Servicios
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'services' AND policyname = 'Enable all operations for services') THEN
    CREATE POLICY "Enable all operations for services" ON services FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Productos
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Enable all operations for products') THEN
    CREATE POLICY "Enable all operations for products" ON products FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Perfumes
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'perfumes' AND policyname = 'Enable all operations for perfumes') THEN
    CREATE POLICY "Enable all operations for perfumes" ON perfumes FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Cursos
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'courses' AND policyname = 'Enable all operations for courses') THEN
    CREATE POLICY "Enable all operations for courses" ON courses FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Galería
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'gallery_items' AND policyname = 'Enable all operations for gallery_items') THEN
    CREATE POLICY "Enable all operations for gallery_items" ON gallery_items FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Testimonios
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'testimonials' AND policyname = 'Enable all operations for testimonials') THEN
    CREATE POLICY "Enable all operations for testimonials" ON testimonials FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Usuarios
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Enable all operations for users') THEN
    CREATE POLICY "Enable all operations for users" ON users FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Categorías
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'categories' AND policyname = 'Enable all operations for categories') THEN
    CREATE POLICY "Enable all operations for categories" ON categories FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Hero Content
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'hero_content' AND policyname = 'Enable all operations for hero_content') THEN
    CREATE POLICY "Enable all operations for hero_content" ON hero_content FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- About Me Content
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'about_me_content' AND policyname = 'Enable all operations for about_me_content') THEN
    CREATE POLICY "Enable all operations for about_me_content" ON about_me_content FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 7. Verificar el estado final
SELECT 
  'Realtime Configuration Complete' as status,
  COUNT(*) as tables_enabled
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';



