-- Base de datos de la demo de sesiones, LISTA PARA IMPORTAR (estructura + usuarios de ejemplo).
--
-- MySQL Workbench: File > Open SQL Script... > elige este archivo > botón del rayo (Execute).
-- Terminal:        npm run bd   (carga este mismo archivo)
--
-- OJO: borra la base "demo_sesiones" si ya existía.
-- Si en tu .env usas otro DB_NAME, cambia "demo_sesiones" en las 3 líneas de abajo.

SET NAMES utf8mb4;
DROP DATABASE IF EXISTS demo_sesiones;
CREATE DATABASE demo_sesiones CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE demo_sesiones;

-- Usuarios: la contraseña NUNCA se guarda tal cual, solo su hash (bcrypt).
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(30) NOT NULL UNIQUE,
  nombre VARCHAR(80) NOT NULL,
  rol VARCHAR(10) NOT NULL, -- 'alumno' o 'admin'
  contrasena_hash CHAR(60) NOT NULL
);

-- Sesiones: aquí guarda express-mysql-session lo que el servidor recuerda de cada sesión.
-- session_id = el id que viaja (firmado) en la cookie connect.sid
-- expires    = cuándo vence (segundos desde 1970)
-- data       = los datos de la sesión en JSON (usuario, rol, visitas...)
CREATE TABLE sessions (
  session_id VARCHAR(128) COLLATE utf8mb4_bin NOT NULL,
  expires INT UNSIGNED NOT NULL,
  data MEDIUMTEXT COLLATE utf8mb4_bin,
  PRIMARY KEY (session_id)
);

-- Contraseñas: ana12345, luis12345 y admin12345
INSERT INTO usuarios (usuario, nombre, rol, contrasena_hash) VALUES
  ('ana', 'Ana López', 'alumno', '$2a$10$zngOdAyKeY6JTTKdax4nwu9nq7YOkXlSCCfouJLolZF6JR0QIabSy'),
  ('luis', 'Luis Pérez', 'alumno', '$2a$10$ReAlY7F0jEMlErF7VHM2fe0LATf1FNFzyQ88R8GahAMC8vk1OF67i'),
  ('admin', 'Administración CECyT 9', 'admin', '$2a$10$PGRPlqtOY2XBKvdebx1H8eHgifILHaD8joCQIm5t9lbjoIHArBbvK');
