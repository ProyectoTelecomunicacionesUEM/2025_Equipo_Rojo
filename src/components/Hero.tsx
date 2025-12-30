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

  return (
    <section className="w-full bg-white">
      {/* HERO */}
      <div className="relative w-full h-[260px] md:h-[520px] bg-black overflow-hidden">
        {/* IMAGEN */}
        <Image
          src="/images/camionPaisaje.png"
          alt="Camión frigorífico circulando por el paisaje"
          fill
          priority
          sizes="100vw"
          className="object-contain md:object-cover"
        />

        {/* OVERLAY SOLO DESKTOP */}
        <div className="hidden md:block absolute inset-0 bg-black/30 z-10" />

        {/* HEADER / NAV */}
        <header className="absolute top-0 left-0 right-0 z-50">
          <Container className="!px-0">
            <nav className="flex items-center bg-white/90 md:bg-transparent px-5 py-4 min-h-[72px]">
              {/* DESKTOP MENU */}
              <ul className="hidden md:flex items-center gap-8">
                {menuItems.map((item) => (
                  <li key={item.text}>
                    <Link href={item.url} className="text-white font-semibold">
                      {item.text}
                    </Link>
                  </li>
                ))}

                <li>
                  <Link
                    href="/login"
                    className="rounded-full px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold"
                  >
                    Inicia sesión
                  </Link>
                </li>

                <li>
                  <Link
                    href="/register"
                    className="rounded-full px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold"
                  >
                    Regístrate
                  </Link>
                </li>
              </ul>

              {/* BOTÓN MÓVIL */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden ml-auto bg-white rounded-full w-10 h-10 flex items-center justify-center"
              >
                {isOpen ? <HiOutlineXMark /> : <HiBars3 />}
              </button>
            </nav>
          </Container>

          {/* MENÚ MÓVIL */}
          <Transition show={isOpen}>
            <div className="md:hidden bg-white shadow-lg">
              <ul className="flex flex-col gap-4 p-6">
                {menuItems.map((item) => (
                  <li key={item.text}>
                    <Link href={item.url} onClick={() => setIsOpen(false)}>
                      {item.text}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    Inicia sesión
                  </Link>
                </li>
                <li>
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    Regístrate
                  </Link>
                </li>
              </ul>
            </div>
          </Transition>
        </header>

        {/* ===== TÍTULO DESKTOP (CENTRADO VERTICALMENTE) ===== */}
        <div className="hidden md:flex absolute inset-0 z-20 items-center">
          <Container className="text-center md:text-left">
            <h1
              className="
                font-extrabold
                bg-gradient-to-r from-blue-600 to-cyan-500
                bg-clip-text text-transparent
                drop-shadow-[0_2px_14px_rgba(0,0,0,0.45)]
              "
              style={{
                fontSize: 'clamp(56px, 7vw, 120px)',
                lineHeight: 1,
                whiteSpace: 'nowrap',
              }}
            >
              FrostTrack
            </h1>
          </Container>
        </div>
      </div>

      {/* ===== TÍTULO MÓVIL (DEBAJO DE LA IMAGEN) ===== */}
      <div className="md:hidden py-6 text-center">
        <h1
          className="
            font-extrabold
            bg-gradient-to-r from-blue-600 to-cyan-500
            bg-clip-text text-transparent
          "
          style={{
            fontSize: 'clamp(28px, 8vw, 42px)',
          }}
        >
          FrostTrack
        </h1>
      </div>
    </section>
  );
}
