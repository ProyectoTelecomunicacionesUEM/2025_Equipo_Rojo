
import React from "react";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Imagen lado izquierdo */}
      <div className="w-full md:w-1/2 h-48 md:h-full">
        /images/camiones-frigorificos.png
      </div>

      {/* Columna derecha con formulario */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 w-full max-w-md transition-colors duration-300">
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
