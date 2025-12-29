
import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <>
      {/* Sección de contacto (sin main adicional) */}
<section id="contacto" className="w-full pt-24 md:pt-32 pb-16">        {/* Limita ancho en desktop, sin padding lateral */}
        <div className="w-full max-w-3xl mx-auto px-0">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            ¿Quieres conocernos?
          </h2>

          {/* El formulario ya lleva su padding interno */}
          <ContactForm />
        </div>
      </section>
    </>
  );
}
