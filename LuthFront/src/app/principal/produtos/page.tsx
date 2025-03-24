"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ItemProduto from "@/components/ItemProduto";
import { ProdutoI } from "@/utils/types/produtos";

function CadProdutos() {
  const [produtos, setProdutos] = useState<ProdutoI[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getProdutos() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL_API}/produtos`,
        );
        if (!response.ok) {
          throw new Error("Erro ao carregar produtos");
        }
        const dados = await response.json();
        setProdutos(dados);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Erro desconhecido");
      } finally {
        setIsLoading(false);
      }
    }
    getProdutos();
  }, []);

  const listaProdutos = produtos.map((produto) => (
    <ItemProduto
      key={produto.id}
      produto={produto}
      produtos={produtos}
      setProdutos={setProdutos}
    />
  ));

  return (
    <div className="m-4 mt-20">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white ">
          Cadastro de Produto
        </h1>
        <Link
          href="produtos/novo"
          className="text-white  bg-yellow-700 hover:bg-yellow-500 focus:ring-4 focus:ring-blue-300 
          font-bold rounded-lg text-md px-6 py-2.5 dark:bg-yellow-600 dark:hover:bg-yellow-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Novo Produto
        </Link>
      </div>

      {isLoading && (
        <div className="text-center py-4 text-lg text-gray-900 dark:text-gray-900">
          Carregando produtos....
        </div>
      )}

      {error && (
        <div className="text-center py-4 text-lg text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {!isLoading && !error && produtos.length === 0 && (
        <div className="text-center py-4 text-lg text-gray-900 dark:text-gray-900">
          Nenhum produto encontrado.
        </div>
      )}

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
        <table className="w-full text-sm text-left rtl:text-right text-gray-100 dark:text-gray-900 ">
          <thead className=" bg-transparent text-xs text-gray-900 uppercase bg-gray-50 dark:bg-transparent dark:text-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3">
                Foto
              </th>
              <th scope="col" className="px-6 py-3">
                Modelo do Produto
              </th>
              <th scope="col" className="px-6 py-3">
                Marca
              </th>
              <th scope="col" className="px-6 py-3">
                Ano
              </th>
              <th scope="col" className="px-6 py-3">
                Preço R$
              </th>
              <th scope="col" className="px-6 py-3">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>{listaProdutos}</tbody>
        </table>
      </div>
    </div>
  );
}

export default CadProdutos;
