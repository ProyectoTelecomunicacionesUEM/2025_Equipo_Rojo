"use client";

export default function ConfirmGuardarAsignacion({ truckId }: { truckId: string }) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!window.confirm(`¿Asignar conductor al camión ${truckId}?`)) {
          e.preventDefault();
        }
      }}
      className="w-full sm:w-auto px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-sm transition-all active:scale-95 shadow-md shadow-sky-600/10"
    >
      Guardar
    </button>
  );
}
