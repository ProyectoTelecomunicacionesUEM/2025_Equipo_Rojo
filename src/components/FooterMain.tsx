
// components/FooterMain.tsx
import React from "react";
import { siteDetails } from "@/data/siteDetails";
import { footerDetails } from "@/data/footer";
import { FaInstagram, FaFacebook, FaXTwitter, FaLinkedinIn } from "react-icons/fa6";

const FooterMain: React.FC = () => {
  const year = new Date().getFullYear();

  const email = footerDetails?.email || (siteDetails as any)?.contactEmail;
  const phone = footerDetails?.telephone || (siteDetails as any)?.contactPhone;

  const socials = {
    instagram: footerDetails?.socials?.instagram,
    facebook: footerDetails?.socials?.facebook,
    x: footerDetails?.socials?.x || footerDetails?.socials?.twitter,
    linkedin: footerDetails?.socials?.linkedin,
  };

  // Badges redondos blancos
  const badgeClasses =
    "w-9 h-9 md:w-10 md:h-10 rounded-full bg-white text-secondary " +
    "flex items-center justify-center shadow-sm " +
    "hover:bg-primary hover:text-foreground transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/50";

  return (
    <footer className="bg-secondary text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-5 md:py-6">
        {/* En móvil: permite wrap; en desktop: alinea verticalmente */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-8 text-center">

          {/* Contacto */}
          <div className="flex items-center gap-4">
            {email && (
              <a
                href={`mailto:${email}`}
                className="text-base md:text-lg font-bold hover:underline"
              >
                {email}
              </a>
            )}
            {email && phone && <span className="text-white/50">|</span>}
            {phone && (
              <a
                href={`tel:${String(phone).replace(/\s+/g, "")}`}
                className="text-base md:text-lg font-bold hover:underline"
              >
                {phone}
              </a>
            )}
          </div>

          {/* Redes: badges redondos */}
          <div className="flex items-center gap-3 md:gap-4">
            {socials.instagram && (
              <a
                href={socials.instagram}
                aria-label="Instagram"
                target="_blank"
                rel="noreferrer noopener"
                className={badgeClasses}
                title="Instagram"
              >
                <FaInstagram className="size-4 md:size-5" />
              </a>
            )}
            {socials.facebook && (
              <a
                href={socials.facebook}
                aria-label="Facebook"
                target="_blank"
                rel="noreferrer noopener"
                className={badgeClasses}
                title="Facebook"
              >
                <FaFacebook className="size-4 md:size-5" />
              </a>
            )}
            {socials.x && (
              <a
                href={socials.x}
                aria-label="X (Twitter)"
                target="_blank"
                rel="noreferrer noopener"
                className={badgeClasses}
                title="X (Twitter)"
              >
                <FaXTwitter className="size-4 md:size-5" />
              </a>
            )}
            {socials.linkedin && (
              <a
                href={socials.linkedin}
                aria-label="LinkedIn"
                target="_blank"
                rel="noreferrer noopener"
                className={badgeClasses}
                title="LinkedIn"
              >
                <FaLinkedinIn className="size-4 md:size-5" />
              </a>
            )}
          </div>

          {/* Copyright */}
          <p className="text-sm md:text-base font-semibold text-white/90">
            © {year} {siteDetails.siteName}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterMain;
