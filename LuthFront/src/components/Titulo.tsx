"use client";
import Cookies from "js-cookie";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiUsers } from "react-icons/fi";
import Image from "next/image"; // Importação do Image do Next.js

export function Titulo() {
  const [adminNome, setAdminNome] = useState<string>("");

  useEffect(() => {
    if (Cookies.get("admin_logado_nome")) {
      setAdminNome(Cookies.get("admin_logado_nome") as string);
    }
  }, []);

  return (
    <nav className="bg-blue-400/80 border-gray-200 dark:bg-black/50 flex flex-wrap justify-between fixed top-0 left-0 w-full z-50 h-20 shadow-md backdrop-blur-md">
      {/* Transparência ajustada com `bg-blue-400/80` e `backdrop-blur-md` */}
      <div className="flex flex-wrap justify-between max-w-screen-xl p-4">
        <Link
          href="/principal"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Image
            src="/logo.png"
            alt="palheta"
            className="h-16"
            width={64} // Definir as dimensões
            height={64} // Definir as dimensões
          />
          <span className="self-center text-3xl font-serif whitespace-nowrap dark:text-white">
            Music Store: Admin
          </span>
        </Link>
      </div>
      <div className="flex me-4 items-center font-bold text-white mr-16">
        <FiUsers className="mr-2 text-yellow-400" />
        {adminNome}
      </div>
    </nav>
  );
}
