"use client";

export default function ConfirmAddTruckButton() {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!window.confirm("¿Seguro que quieres añadir este camión a la flota?")) {
          e.preventDefault();
        }
      }}
      className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-sky-600/20 active:scale-95"
    >
      Añadir
    </button>
  );
}
