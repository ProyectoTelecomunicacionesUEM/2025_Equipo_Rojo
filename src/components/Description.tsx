import Image from "next/image";

export default function Description() {
  return (
    <section
      id="descripcion"
      className="bg-blue-50 py-16"
      aria-labelledby="desc-title"
    >
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Texto */}
        <div> {/* Sin max-w: ocupa toda la columna */}
          <h2
            id="desc-title"
            className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6"
          >
            ¿Qué hace FrostTrack?
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Centralizamos la monitorización de tu cadena de frío: integra
            sensores IoT, visualiza la temperatura en tiempo real y automatiza
            alertas para evitar incidentes.
          </p>

          <ul className="space-y-4 text-gray-900">
            <li className="flex items-center gap-3">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Z" />
                <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z" />
              </svg>
              <span className="text-lg">
                Alertas instantáneas ante desvíos de temperatura
              </span>
            </li>

            <li className="flex items-center gap-3">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M4 20V10" />
                <path d="M10 20V4" />
                <path d="M16 20v-6" />
                <path d="M2 20h20" />
              </svg>
              <span className="text-lg">
                Paneles de control y reportes auditables
              </span>
            </li>

            <li className="flex items-center gap-3">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 3l7 4v5c0 5-3 8-7 9-3.5-1-7-4-7-9V7l7-4Z" />
                <path d="M9 12h6" />
              </svg>
              <span className="text-lg">
                Cumplimiento de normativas (HACCP, ISO)
              </span>
            </li>

            <li className="flex items-center gap-3">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18" />
                <path d="M12 3a15 15 0 0 1 0 18" />
                <path d="M12 3a15 15 0 0 0 0 18" />
              </svg>
              <span className="text-lg">
                Acceso desde cualquier dispositivo
              </span>
            </li>
          </ul>
        </div>

        {/* Imagen */}
        <div className="flex justify-center">
          <Image
            src="/images/tablet.png"
            alt="Tablet mostrando el panel de FrostTrack"
            width={500}
            height={500}
            style={{ width: '100%', height: 'auto' }}
            priority
          />
        </div>
      </div>
    </section>
  );
}
