
'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import { HiOutlineXMark, HiBars3 } from 'react-icons/hi2';

import Container from './Container';
import { siteDetails } from '@/data/siteDetails';
import { menuItems } from '@/data/menuItems';
import Image from "next/image";

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="bg-transparent fixed top-0 left-0 right-0 md:absolute z-50 mx-auto w-full">
            <Container className="!px-0">
                <nav className="shadow-md md:shadow-none bg-white md:bg-transparent mx-auto flex justify-between items-center py-2 px-5 md:py-10">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2"> 
                    <Image
                        src={siteDetails.siteLogo || "/icon-512.png"} // fallback por si no hubiera logo
                        alt={siteDetails.siteName}
                        width={90}   // tamaño en desktop (ajustable)
                        height={90}
                        priority
                        className="w-12 h-12 md:w-16 md:h-16 object-contain" // móvil 32px, desktop 48px
                    />
                    <span className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    {siteDetails.siteName}
                    </span>
                    </Link>
                    {/* Desktop Menu */}
                    <ul className="hidden md:flex space-x-6 items-center">
                        {menuItems.map(item => (
                            <li key={item.text}>
                                <Link href={item.url} className="text-2xl  font-bold tracking-wider text-foreground hover:text-foreground-accent transition-colors">
                                    {item.text}
                                </Link>
                            </li>
                        ))}
                        {/* Botón Inicia sesión */}
                        <li>
                            <Link
                                href="/login"
                                className="border border-blue-600 text-blue-600 rounded-full px-6 py-2 hover:bg-blue-50 transition-colors"
                            >
                                Inicia sesión
                            </Link>
                        </li>
                        {/* Botón Regístrate */}
                        <li>
                            <Link
                                href="/register"
                                className="bg-blue-600 text-white rounded-full px-6 py-2 hover:bg-blue-700 transition-colors"
                            >
                                Regístrate
                            </Link>
                        </li>
                    </ul>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            type="button"
                            className="bg-primary text-black focus:outline-none rounded-full w-10 h-10 flex items-center justify-center"
                            aria-controls="mobile-menu"
                            aria-expanded={isOpen}
                        >
                            {isOpen ? (
                                <HiOutlineXMark className="h-6 w-6" aria-hidden="true" />
                            ) : (
                                <HiBars3 className="h-6 w-6" aria-hidden="true" />
                            )}
                            <span className="sr-only">Toggle navigation</span>
                        </button>
                    </div>
                </nav>
            </Container>

            {/* Mobile Menu with Transition */}
            <Transition
                show={isOpen}
                enter="transition ease-out duration-200 transform"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75 transform"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <div id="mobile-menu" className="md:hidden bg-white shadow-lg">
                    <ul className="flex flex-col space-y-4 pt-1 pb-6 px-6">
                        {menuItems.map(item => (
                            <li key={item.text}>
                                <Link href={item.url} className="text-foreground hover:text-primary block" onClick={toggleMenu}>
                                    {item.text}
                                </Link>
                            </li>
                        ))}
                        {/* Botón Inicia sesión móvil */}
                        <li>
                            <Link
                                href="/login"
                                className="border border-blue-600 text-blue-600 rounded-full px-5 py-2 block w-fit hover:bg-blue-50"
                                onClick={toggleMenu}
                            >
                                Inicia sesión
                            </Link>
                        </li>
                        {/* Botón Regístrate móvil */}
                        <li>
                            <Link
                                href="/register"
                                className="bg-blue-600 text-white rounded-full px-5 py-2 block w-fit hover:bg-blue-700"
                                onClick={toggleMenu}
                            >
                                Regístrate
                            </Link>
                        </li>
                    </ul>
                </div>
            </Transition>
        </header>
    );
};

export default Header;
