-- user demo: email demo@finwise.dev / password: Demo123!
INSERT INTO users (email, password_hash, name)
VALUES (
  'admin@frosttrack.dev',
  '$2y$10$ciXQX/8y7LDx1EX7H6BsSO/L9JgKtiGk//5uZcAGxg8gn9wDTN8MC', -- Nueva contraseña: "123456"
  'Demo User'
)
ON CONFLICT (email) DO UPDATE
SET password_hash = EXCLUDED.password_hash,
    name = EXCLUDED.name;

-- Opcional: categorías demo para el usuario demo (reemplaza USER_ID en tiempo de seed si quieres)
