
import DarkModeToggle from "@/components/DarkModeToggle";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-6">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 w-full max-w-md transition-colors duration-300">
        {/* Toggle modo oscuro */}
        <div className="flex justify-end mb-4">
          <DarkModeToggle />
        </div>

        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          Iniciar sesión
        </h1>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
              Usuario
            </label>
            <input
              type="text"
              title="Introduce tu nombre de usuario"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
              Contraseña
            </label>
            <input
              type="password"
              title="Introduce tu contraseña"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <button
            type="submit"
            title="Haz clic para iniciar sesión"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
}
