-- Script de verificación para confirmar que todas las políticas se crearon correctamente
-- Ejecuta este script DESPUÉS de ejecutar COMPLETAR_POLITICAS_STORAGE.sql

-- ============================================
-- VERIFICACIÓN COMPLETA DE POLÍTICAS
-- ============================================

-- 1. Ver todas las políticas de storage
SELECT 
    policyname,
    cmd,
    qual,
    CASE 
        WHEN qual LIKE '%hero%' THEN 'HERO'
        WHEN qual LIKE '%about%' THEN 'ABOUT'
        WHEN qual LIKE '%gallery%' THEN 'GALLERY'
        WHEN qual LIKE '%products%' THEN 'PRODUCTS'
        WHEN qual LIKE '%perfumes%' THEN 'PERFUMES'
        WHEN qual LIKE '%courses%' THEN 'COURSES'
        WHEN qual LIKE '%services%' THEN 'SERVICES'
        ELSE 'OTHER'
    END as bucket_type
FROM pg_policies 
WHERE schemaname = 'storage' 
    AND tablename = 'objects'
ORDER BY bucket_type, cmd;

-- 2. Contar políticas por bucket
SELECT 
    CASE 
        WHEN qual LIKE '%hero%' THEN 'hero'
        WHEN qual LIKE '%about%' THEN 'about'
        WHEN qual LIKE '%gallery%' THEN 'gallery'
        WHEN qual LIKE '%products%' THEN 'products'
        WHEN qual LIKE '%perfumes%' THEN 'perfumes'
        WHEN qual LIKE '%courses%' THEN 'courses'
        WHEN qual LIKE '%services%' THEN 'services'
        ELSE 'other'
    END as bucket_name,
    COUNT(*) as policy_count
FROM pg_policies 
WHERE schemaname = 'storage' 
    AND tablename = 'objects'
    AND qual IS NOT NULL
GROUP BY bucket_name
ORDER BY bucket_name;

-- 3. Verificar que cada bucket tenga las 4 operaciones (SELECT, INSERT, UPDATE, DELETE)
SELECT 
    bucket_name,
    COUNT(*) as operations_count,
    CASE 
        WHEN COUNT(*) = 4 THEN '✅ COMPLETO'
        WHEN COUNT(*) < 4 THEN '❌ INCOMPLETO'
        ELSE '⚠️ EXTRA'
    END as status
FROM (
    SELECT 
        CASE 
            WHEN qual LIKE '%hero%' THEN 'hero'
            WHEN qual LIKE '%about%' THEN 'about'
            WHEN qual LIKE '%gallery%' THEN 'gallery'
            WHEN qual LIKE '%products%' THEN 'products'
            WHEN qual LIKE '%perfumes%' THEN 'perfumes'
            WHEN qual LIKE '%courses%' THEN 'courses'
            WHEN qual LIKE '%services%' THEN 'services'
            ELSE 'other'
        END as bucket_name,
        cmd
    FROM pg_policies 
    WHERE schemaname = 'storage' 
        AND tablename = 'objects'
        AND qual IS NOT NULL
) as bucket_operations
GROUP BY bucket_name
ORDER BY bucket_name;

-- 4. Verificar políticas INSERT (deben tener WITH CHECK)
SELECT 
    policyname,
    cmd,
    qual,
    CASE 
        WHEN cmd = 'INSERT' AND qual IS NULL THEN '❌ INSERT SIN RESTRICCIÓN'
        WHEN cmd = 'INSERT' AND qual IS NOT NULL THEN '✅ INSERT CON RESTRICCIÓN'
        ELSE 'N/A'
    END as insert_status
FROM pg_policies 
WHERE schemaname = 'storage' 
    AND tablename = 'objects'
    AND cmd = 'INSERT'
ORDER BY policyname;

-- ============================================
-- RESULTADO ESPERADO
-- ============================================

-- Después de ejecutar COMPLETAR_POLITICAS_STORAGE.sql, deberías ver:
-- - 7 buckets: hero, about, gallery, products, perfumes, courses, services
-- - 4 operaciones por bucket: SELECT, INSERT, UPDATE, DELETE
-- - Total: 28 políticas (7 buckets × 4 operaciones)
-- - Todas las políticas INSERT deben tener restricciones de bucket




