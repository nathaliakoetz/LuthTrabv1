"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import Cookies from "js-cookie";

type Inputs = {
  email: string;
  senha: string;
};

export default function Home() {
  const { register, handleSubmit, setFocus } = useForm<Inputs>();
  const router = useRouter();

  useEffect(() => {
    setFocus("email");
  }, []);

  async function verificaLogin(data: Inputs) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}/admins/login`,
      {
        method: "POST",
        headers: { "Content-type": "Application/json" },
        body: JSON.stringify({ email: data.email, senha: data.senha }),
      },
    );

    // console.log(response)
    if (response.status == 200) {
      const admin = await response.json();

      Cookies.set("admin_logado_id", admin.id);
      Cookies.set("admin_logado_nome", admin.nome);
      Cookies.set("admin_logado_token", admin.token);

      router.push("/principal");
    } else if (response.status == 400) {
      toast.error("Erro... Login ou senha incorretos");
    }
  }

  return (
    <main className="max-w-screen-xl flex flex-col items-center mx-auto p-32">
      <img
        src="./logo.png"
        alt="E-commerce"
        style={{ width: 240 }}
        className="d-block"
      />
      <div className="max-w-sm">
        <h1 className="text-3xl font-sans my-8 text-red-500">
          Admin: Music Store
        </h1>
        <form
          className="max-w-sm mx-auto"
          onSubmit={handleSubmit(verificaLogin)}
        >
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-bold text-gray-900 dark:text-red-400"
            >
              E-mail:
            </label>
            <input
              type="email"
              id="email"
              className="  text-gray-900 text-sm rounded-lg focus:ring-blue-500
             focus:border-blue-500 block w-full p-2.5 dark:bg-gray-500 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white
             dark:focus:ring-blue-500 dark:focus:border-blue-500"
              {...register("email")}
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-bold text-gray-900 dark:text-red-400"
            >
              Senha:
            </label>
            <input
              type="password"
              id="password"
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg
             focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
             dark:focus:ring-blue-500 dark:focus:border-blue-500"
              {...register("senha")}
              required
            />
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-red-500 focus:ring-4 focus:outline-none
           focus:ring-blue-300 font-bold rounded-lg text-sm w-full sm:w-auto ms-16 mt-3 px-10 py-1.5 text-center
           dark:bg-red-700"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}
