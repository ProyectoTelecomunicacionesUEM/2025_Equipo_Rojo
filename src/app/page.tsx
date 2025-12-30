
import ContactForm from "@/components/ContactForm";
import Hero from "@/components/Hero";
import Description from "@/components/Description";

export default function Home() {
  return (
    <>
      <Hero />

      {/* ¿Quiénes somos? */}
      {/* Asegúrate de que dentro de Description el <section> tenga id="descripcion" */}
      <div className="scroll-mt-40 md:scroll-mt-32">
        <Description />
      </div>

      {/* Contacto */}
      <section
        id="contacto"
        className="scroll-mt-40 md:scroll-mt-32 w-full pt-24 md:pt-32 pb-16"
      >
        <div className="w-full max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-secondary">
            ¿Quieres conocernos?
          </h2>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
