
// src/app/register/page.tsx
export default function RegisterPage() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Registro</h1>
      <form>
        <label>
          Email:
          <input type="email" name="email" required />
        </label>
        <br />
        <label>
          Contraseña:
          <input type="password" name="password" required />
        </label>
        <br />
        <button type="submit">Crear cuenta</button>
      </form>
    </main>
  );
}
