"use client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { IoExitOutline } from "react-icons/io5";
import { BiSolidDashboard } from "react-icons/bi";
import { GiGuitarBassHead } from "react-icons/gi";
import { BsCashCoin } from "react-icons/bs";
import { CiUser } from "react-icons/ci";
import Link from "next/link";

export function MenuLateral() {
  const router = useRouter();

  function adminSair() {
    if (confirm("Confirma Saída?")) {
      Cookies.remove("admin_logado_id");
      Cookies.remove("admin_logado_nome");
      Cookies.remove("admin_logado_token");
      router.replace("/");
    }
  }

  return (
    <aside
      id="default-sidebar"
      className="fixed mt-24 left-0 z-40 w-64 h-screen transition-transform -translate-x-full 
     sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 py-4 overflow-y-auto bg-blue-300 dark:bg-transparent">
        <ul className="space-y-2 font-medium">
          <li>
            <Link href="/principal" className="flex items-center p-2">
              <span className="h-5 text-red-400 text-2xl">
                <BiSolidDashboard />
              </span>
              <span className="ms-2 mt-1 text-white">Visão Geral</span>
            </Link>
          </li>
          <li>
            <Link href="/principal/produtos" className="flex items-center p-2">
              <span className="h-5 text-red-500 text-2xl">
                <GiGuitarBassHead />
              </span>
              <span className="ms-2 mt-1 text-white">Cadastro de Produtos</span>
            </Link>
          </li>
          <li>
            <Link href="/principal/clientes" className="flex items-center p-2">
              <span className="h-5 text-blue-400 text-2xl">
                <CiUser />
              </span>
              <span className="ms-2 mt-1 text-white">Controle de Clientes</span>
            </Link>
          </li>
          <li>
            <Link
              href="/principal/propostas"
              className="flex items-center p-2 cursor-pointer"
            >
              <span className="h-5 text-green-400 text-2xl">
                <BsCashCoin />
              </span>
              <span className="ms-2 mt-1 text-white">
                Controle de Propostas
              </span>
            </Link>
          </li>

          <li>
            <span className="flex items-center p-2 cursor-pointer">
              <span className="h-5 text-red-600 text-2xl">
                <IoExitOutline />
              </span>
              <span className="ms-2 mt-1 text-white" onClick={adminSair}>
                Sair do Sistema
              </span>
            </span>
          </li>
        </ul>
      </div>
    </aside>
  );
}
