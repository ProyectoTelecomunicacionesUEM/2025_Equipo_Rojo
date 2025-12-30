
import ContactForm from "@/components/ContactForm";
import Hero from "@/components/Hero";
import Description from "@/components/Description";

export default function Home() {
  return (
    <>
      {/* Hero debajo del Header */}
      <Hero />

      {/* Sección de contacto */}
      <section id="contacto" className="w-full pt-24 md:pt-32 pb-16">
        {/* Limita ancho en desktop */}
        <div className="w-full max-w-3xl mx-auto px-6">
          {/* Añadimos margen inferior al bloque de descripción */}
          <div className="mb-12">
            <Description />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-secondary">
            ¿Quieres conocernos?
          </h2>

          {/* El formulario ya lleva su padding interno */}
          <ContactForm />
        </div>
      </section>
    </>
  );
}
