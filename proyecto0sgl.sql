USE proyecto0;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE trabajadores;
TRUNCATE TABLE roles;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO roles (nombre_rol) VALUES
('Administrador'),
('Mayordomo'),
('Capataz'),
('Cortero'),
('Garruchero'),
('Embolsador'),
('Desmanador'),
('Empacador'),
('Fumigador'),
('Guadañador');

SELECT * FROM roles;
