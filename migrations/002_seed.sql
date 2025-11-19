-- user demo: email demo@finwise.dev / password: Demo123!
INSERT INTO users (email, password_hash, name)
VALUES (
  'demo@finwise.dev',
  '$2y$10$KuLzZ3DJ4oO50z2bToFU6u5rGskxJUOl6wGvyIr5L7EnMYLTZp0sG', -- bcrypt de "Demo123!"
  'Demo User'
)
ON CONFLICT (email) DO UPDATE
SET password_hash = EXCLUDED.password_hash,
    name = EXCLUDED.name;

-- Opcional: categorías demo para el usuario demo (reemplaza USER_ID en tiempo de seed si quieres)
