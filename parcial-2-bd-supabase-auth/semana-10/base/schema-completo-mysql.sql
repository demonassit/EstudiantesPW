-- schema-completo-mysql.sql
-- BD LOCAL completa del proyecto CECyT9 en MySQL (laboratorio), desde la semana 8 en adelante.
-- Equivale, tabla por tabla, a lo que en el servidor (Supabase/PostgreSQL) crean:
--   cecyt9-proyecto/backend/schema.sql                    -> talleres + asistencias (Parcial 1)
--   semana-09/.../schema-usuarios-supabase.sql            -> usuarios (Parcial 2)
--   cecyt9-proyecto/backend/schema-completo.sql           -> las 3 juntas + admin semilla
--
-- Ejecutar: mysql -u root -p < schema-completo-mysql.sql   (o abrirlo en MySQL Workbench)
-- Se puede correr varias veces: no duplica tablas ni datos.
--
-- [PUBLICACION-POSTGRES] Diferencias con el esquema del servidor (verificar al publicar):
--   - id de talleres/asistencias: aquí CHAR(36) DEFAULT (UUID()); allá uuid DEFAULT gen_random_uuid().
--     Mismo formato de texto, así que el front (/talleres/[id]) funciona igual con los dos.
--   - id de usuarios: aquí INT AUTO_INCREMENT; allá BIGSERIAL.
--   - Texto: aquí VARCHAR(n) (MySQL exige longitud para UNIQUE e índices); allá TEXT.
--   - Fechas: aquí DATETIME/TIMESTAMP sin zona horaria; allá timestamp with time zone.
--   - Mayúsculas: la collation de MySQL (utf8mb4_0900_ai_ci) NO distingue mayúsculas ni acentos;
--     PostgreSQL sí. Afecta el UNIQUE de correo, el login y el cruce por boleta del dashboard.
--   - Supabase activa Row Level Security; MySQL no tiene ese concepto (ver nota en schema.sql).

-- Acentos: en Windows el cliente `mysql` lee los archivos como cp850 y guardaría 'ó' como 'Ã³'/'├│'.
-- SET NAMES obliga a leer este archivo como UTF-8 (Workbench ya lo hace por defecto).
SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS cecyt9_local CHARACTER SET utf8mb4;
USE cecyt9_local;

-- ============================================================
-- 1. Talleres + asistencias (Parcial 1)
-- ============================================================

CREATE TABLE IF NOT EXISTS talleres (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  nombre VARCHAR(150) NOT NULL,
  instructor VARCHAR(150),
  fecha DATE NOT NULL,
  cupo INT DEFAULT 30,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS asistencias (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  taller_id CHAR(36),
  nombre_alumno VARCHAR(150) NOT NULL,
  boleta VARCHAR(20) NOT NULL,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (taller_id) REFERENCES talleres(id) ON DELETE CASCADE
);

-- Mismos 3 talleres de ejemplo que schema.sql (solo si la tabla está vacía).
INSERT INTO talleres (nombre, instructor, fecha, cupo)
SELECT * FROM (
  SELECT 'Introducción a Python', 'Ing. María López', DATE('2026-08-10'), 25
  UNION ALL SELECT 'Fundamentos de Redes', 'Ing. Carlos Ramírez', DATE('2026-08-12'), 30
  UNION ALL SELECT 'Diseño de Bases de Datos', 'Ing. Ana Torres', DATE('2026-08-14'), 20
) AS datos
WHERE NOT EXISTS (SELECT 1 FROM talleres);

-- ============================================================
-- 2. Usuarios (Parcial 2, semana 8) + administrador semilla
-- ============================================================

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(150) NOT NULL UNIQUE,
  contrasena_hash VARCHAR(100) NOT NULL,
  boleta VARCHAR(20) NOT NULL UNIQUE,
  rol VARCHAR(20) NOT NULL DEFAULT 'alumno'
);

-- Mismo admin semilla que schema-completo.sql (contraseña "CambiaEstaClave123", hash bcrypt costo 10).
-- Sin él no hay forma de crear el primer usuario cuando /api/usuarios ya pide sesión (sem. 10) o JWT (sem. 13).
INSERT INTO usuarios (nombre, correo, contrasena_hash, boleta, rol)
SELECT 'Admin Semilla', 'admin@cecyt9.ipn.mx',
       '$2a$10$uCuLGQ87xp5D4OO369.SsuOULnYNNSTQNs/LLdOmzZiv30gy4xVEy',
       '0000000000', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE correo = 'admin@cecyt9.ipn.mx');

-- ============================================================
-- 3. Asistencias de práctica (SOLO LOCAL)
-- ============================================================
-- Para que el dashboard (semana 14) muestre datos en el laboratorio. Una de las boletas no
-- pertenece a ningún usuario: sirve para mostrar que el cruce por boleta (JOIN) la deja fuera.
-- [PUBLICACION-POSTGRES] No copiar esta sección al servidor: allá las asistencias son reales.
INSERT INTO asistencias (taller_id, nombre_alumno, boleta)
SELECT t.id, datos.nombre_alumno, datos.boleta
FROM talleres t
JOIN (
  SELECT 'Introducción a Python' AS taller, 'Admin Semilla' AS nombre_alumno, '0000000000' AS boleta
  UNION ALL SELECT 'Fundamentos de Redes', 'Admin Semilla', '0000000000'
  UNION ALL SELECT 'Introducción a Python', 'Alumno sin cuenta', '2026999999'
) AS datos ON datos.taller = t.nombre
WHERE NOT EXISTS (SELECT 1 FROM asistencias);
