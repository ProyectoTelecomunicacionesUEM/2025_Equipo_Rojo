'use client';

import React from 'react';
import Container from './Container';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      <Container className="!px-0">
        <nav
          className="
            relative flex items-center
            bg-transparent
            px-5 py-4 md:py-6
            min-h-[72px] md:min-h-[96px]
          "
        >
          {/* Aquí puedes poner un logo o dejar vacío */}
        </nav>
      </Container>
    </header>
  );
};

export default Header;
