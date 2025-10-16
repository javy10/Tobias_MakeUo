-- Script para habilitar Realtime en Supabase
-- Ejecutar este script en el SQL Editor de Supabase

-- Habilitar realtime para todas las tablas del proyecto
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

-- Verificar que las tablas están habilitadas para realtime
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN (
  'services', 'products', 'perfumes', 'courses', 
  'gallery_items', 'testimonials', 'users', 'categories',
  'hero_content', 'about_me_content'
) 
AND schemaname = 'public';

-- Verificar la configuración de realtime
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';








