
"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function HeaderWrapper() {
  const pathname = usePathname();
console.log("Ruta actual:", pathname);
  // Ocultar el header si la ruta contiene "login" o "register"
  const hideHeader = pathname.includes("login") || pathname.includes("register");

  return hideHeader ? null : <Header />;
}
