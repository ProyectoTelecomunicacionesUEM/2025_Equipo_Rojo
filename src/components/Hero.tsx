'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import { HiOutlineXMark, HiBars3 } from 'react-icons/hi2';

import Container from './Container';
import { menuItems } from '@/data/menuItems';

export default function Hero() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <section className="relative w-full h-[400px] md:h-[520px] overflow-hidden">
      {/* IMAGEN DE FONDO RESPONSIVE */}
      <Image
        src="/images/camionPaisaje.png"
        alt="Camión frigorífico circulando por el paisaje"
        fill
        priority
        style={{
          objectFit: 'cover',       // llena el contenedor
          objectPosition: 'center', // centra la imagen
        }}
      />

      {/* OVERLAY OSCURO */}
      <div className="absolute inset-0 bg-black/30 z-0" />

      {/* HEADER */}
      <header className="absolute top-0 left-0 right-0 z-50 w-full">
        <Container className="!px-0">
          <nav className="relative flex items-center bg-white/90 md:bg-transparent shadow-md md:shadow-none px-5 py-4 md:py-6 min-h-[72px] md:min-h-[96px]">
            {/* MENÚ DESKTOP */}
            <ul className="hidden md:flex items-center gap-8">
              {menuItems.map((item) => (
                <li key={item.text}>
                  <Link
                    href={item.url}
                    className="text-white font-semibold"
                    style={{
                      fontSize: 'clamp(18px, 1.8vw, 24px)',
                      textShadow: '0 1px 14px rgba(0,0,0,0.40)',
                    }}
                  >
                    {item.text}
                  </Link>
                </li>
              ))}

              <li>
                <Link
                  href="/login"
                  className="inline-flex items-center rounded-full px-5 py-3
                    bg-gradient-to-r from-blue-600 to-cyan-500
                    text-white font-extrabold shadow-lg
                    transition hover:brightness-110"
                  style={{ fontSize: 'clamp(16px, 1.6vw, 20px)' }}
                >
                  Inicia sesión
                </Link>
              </li>

              <li>
                <Link
                  href="/register"
                  className="inline-flex items-center rounded-full px-5 py-3
                    bg-gradient-to-r from-blue-600 to-cyan-500
                    text-white font-extrabold shadow-lg
                    transition hover:brightness-110"
                  style={{ fontSize: 'clamp(16px, 1.6vw, 20px)' }}
                >
                  Regístrate
                </Link>
              </li>
            </ul>

            {/* BOTÓN MENÚ MÓVIL */}
            <button
              onClick={toggleMenu}
              type="button"
              className="md:hidden ml-auto rounded-full w-10 h-10 flex items-center justify-center bg-white/80"
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <HiOutlineXMark className="h-6 w-6" />
              ) : (
                <HiBars3 className="h-6 w-6" />
              )}
              <span className="sr-only">Toggle navigation</span>
            </button>
          </nav>
        </Container>

        {/* TÍTULO GRANDE */}
        <div className="hidden md:block absolute left-0 right-0 top-full mt-4 pointer-events-none">
          <Container className="!px-5">
            <h1
              className="
                font-extrabold leading-none whitespace-nowrap
                bg-gradient-to-r from-blue-600 to-cyan-500
                bg-clip-text text-transparent
                drop-shadow-[0_2px_14px_rgba(0,0,0,0.45)]
              "
              style={{
                fontSize: 'clamp(56px, 7vw, 120px)',
                letterSpacing: '0.5px',
              }}
            >
              FrostTrack
            </h1>
          </Container>
        </div>

        {/* MENÚ MÓVIL */}
        <Transition
          show={isOpen}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="md:hidden bg-white shadow-lg">
            <ul className="flex flex-col space-y-5 py-6 px-6">
              {menuItems.map((item) => (
                <li key={item.text}>
                  <Link
                    href={item.url}
                    className="text-gray-800 text-lg"
                    onClick={toggleMenu}
                  >
                    {item.text}
                  </Link>
                </li>
              ))}

              <li>
                <Link href="/login" onClick={toggleMenu}>
                  Inicia sesión
                </Link>
              </li>

              <li>
                <Link href="/register" onClick={toggleMenu}>
                  Regístrate
                </Link>
              </li>
            </ul>
          </div>
        </Transition>
      </header>
    </section>
  );
}
