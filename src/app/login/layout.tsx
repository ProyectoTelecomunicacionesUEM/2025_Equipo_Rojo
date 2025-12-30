
import React from "react";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Imagen lado izquierdo (solo en desktop) */}
      <div
        className="hidden md:block w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/camionIcono.png')" }}
      ></div>

      {/* Columna derecha con formulario */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-50 dark:bg-gray-900 px-6">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-10 w-full max-w-lg transition-colors duration-300">
          {/* Toggle modo oscuro */}
          <div className="flex justify-end mb-4">
            <DarkModeToggle />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
