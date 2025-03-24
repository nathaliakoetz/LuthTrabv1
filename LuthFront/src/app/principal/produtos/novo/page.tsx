"use client";

import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { MarcaI } from "@/utils/types/marcas";

type Inputs = {
  modelo: string;
  marcaId: number;
  ano: number;
  preco: number;
  foto: string;
  acessorios: string;
};

type ErrorData = {
  message?: string;
};

function NovoProduto() {
  const [marcas, setMarcas] = useState<MarcaI[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<Inputs>();

  useEffect(() => {
    async function getMarcas() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL_API}/marcas`,
        );
        if (!response.ok) {
          throw new Error("Erro ao carregar as marcas");
        }
        const dados = await response.json();
        setMarcas(dados);
      } catch (err) {
        console.error("Erro ao buscar marcas:", err);
        toast.error("Erro ao carregar as marcas.");
      }
    }
    getMarcas();

    // Garantir que o foco esteja no campo 'modelo' após o carregamento
    setFocus("modelo");
  }, [setFocus]);

  const optionsMarca = marcas.map((marca) => (
    <option key={marca.id} value={marca.id}>
      {marca.nome}
    </option>
  ));

  // Função para validar URL da foto
  const isValidUrl = (url: string) => {
    try {
      new URL(url); // Tenta criar um objeto URL, se falhar, não é uma URL válida.
      return true;
    } catch {
      return false;
    }
  };

  // Função para cadastrar o produto
  async function incluirProduto(data: Inputs) {
    if (!data.foto || !isValidUrl(data.foto)) {
      toast.error("A URL da foto não é válida.");
      return;
    }

    const novoProduto: Inputs = {
      modelo: data.modelo,
      marcaId: data.marcaId,
      ano: data.ano,
      acessorios: data.acessorios,
      foto: data.foto,
      preco: data.preco,
    };

    // Adicionando o console.log antes da requisição
    console.log("Dados a serem enviados para a API:", novoProduto);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/produtos`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${Cookies.get("admin_logado_token")}`,
          },
          body: JSON.stringify(novoProduto),
        },
      );

      if (response.ok) {
        toast.success("Produto cadastrado com sucesso");
        reset(); // Limpa os campos após o sucesso
      } else {
        console.error("Erro ao cadastrar o produto. Status:", response.status);

        let errorData: ErrorData = {};
        try {
          errorData = await response.json();
        } catch (err) {
          console.error("Erro ao tentar ler o corpo da resposta:", err);
        }

        console.error("Erro detalhado:", errorData);
        toast.error(
          errorData.message ||
            `Erro ao cadastrar o produto. Status: ${response.status}`,
        );
      }
    } catch (error) {
      console.error("Erro de rede ou de requisição:", error);
      toast.error("Erro de rede ou de requisição. Tente novamente.");
    }
  }

  return (
    <>
      <h1 className="mb-10 mt-16 font-bold tracking-tight text-gray-900 lg:text-3xl dark:text-white text-center">
        Inclusão de Produtos
      </h1>

      <form
        className="max-w-lg mx-auto"
        onSubmit={handleSubmit(incluirProduto)}
      >
        {/* Campo Modelo do Produto */}
        <div className="mb-4">
          <label
            htmlFor="modelo"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Modelo do Produto
          </label>
          <input
            type="text"
            id="modelo"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            {...register("modelo")}
          />
          {errors.modelo && (
            <p className="text-red-500 text-xs">Modelo é obrigatório</p>
          )}
        </div>

        {/* Seção Marca e Ano */}
        <div className="grid gap-6 mb-3 md:grid-cols-2">
          <div className="mb-3">
            <label
              htmlFor="marcaId"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Marca
            </label>
            <select
              id="marcaId"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
              {...register("marcaId", { valueAsNumber: true })}
            >
              {optionsMarca}
            </select>
          </div>

          <div className="mb-3">
            <label
              htmlFor="ano"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Ano
            </label>
            <input
              type="number"
              id="ano"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
              {...register("ano")}
            />
          </div>
        </div>

        {/* Seção Preço */}
        <div className="mb-3">
          <label
            htmlFor="preco"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Preço R$
          </label>
          <input
            type="number"
            id="preco"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            {...register("preco")}
          />
        </div>

        {/* Seção URL da Foto */}
        <div className="mb-3">
          <label
            htmlFor="foto"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            URL da Foto
          </label>
          <input
            type="text"
            id="foto"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            {...register("foto")}
          />
          {errors.foto && (
            <p className="text-red-500 text-xs">A URL da foto é inválida</p>
          )}
        </div>

        {/* Seção Acessórios */}
        <div className="mb-3">
          <label
            htmlFor="acessorios"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Acessórios
          </label>
          <textarea
            id="acessorios"
            rows={4}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            {...register("acessorios")}
          ></textarea>
        </div>

        <div className="mb-3">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white rounded-lg p-2.5 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Cadastrar Produto
          </button>
        </div>
      </form>
    </>
  );
}

export default NovoProduto;
