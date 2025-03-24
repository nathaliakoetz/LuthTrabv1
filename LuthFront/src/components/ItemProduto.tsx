"use client";

import { Dispatch, SetStateAction } from "react";
import { TiDeleteOutline } from "react-icons/ti";
import { FaRegStar } from "react-icons/fa";
import Cookies from "js-cookie";
import { ProdutoI } from "@/utils/types/produtos";

interface ListaProdutoProps {
  produto: ProdutoI;
  produtos: ProdutoI[];
  setProdutos: Dispatch<SetStateAction<ProdutoI[]>>;
}

const ItemProduto = ({ produto, produtos, setProdutos }: ListaProdutoProps) => {
  // Função para excluir o produto
  const excluirProduto = async () => {
    if (confirm(`Confirma a exclusão do produto?`)) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL_API}/produtos/${produto.id}`,
          {
            method: "DELETE",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${Cookies.get("admin_logado_token")}`,
            },
          },
        );

        if (response.ok) {
          const updatedProdutos = produtos.filter((x) => x.id !== produto.id);
          setProdutos(updatedProdutos);
          alert("Produto excluído com sucesso");
        } else {
          alert("Erro... Produto não foi excluído");
        }
      } catch {
        alert("Erro ao excluir produto");
      }
    }
  };

  // Função para alterar o destaque do produto
  const alterarDestaque = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/produtos/destacar/${produto.id}`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${Cookies.get("admin_logado_token")}`,
          },
        },
      );

      if (response.ok) {
        const updatedProdutos = produtos.map((x) =>
          x.id === produto.id ? { ...x, destaque: !x.destaque } : x,
        );
        setProdutos(updatedProdutos);
      }
    } catch {
      alert("Erro ao alterar destaque do produto");
    }
  };

  return (
    <tr key={produto.id} className="odd:bg-white even:bg-gray-50 border-b">
      <th scope="row" className="px-4 py-4 font-medium text-gray-900">
        <img src={produto.foto} alt="Produto" className="w-48" />
      </th>
      <td className={`px-6 py-4 ${produto.destaque ? "font-extrabold" : ""}`}>
        {produto.modelo}
      </td>
      <td className={`px-6 py-4 ${produto.destaque ? "font-extrabold" : ""}`}>
        {produto.marca.nome}
      </td>
      <td className={`px-6 py-4 ${produto.destaque ? "font-extrabold" : ""}`}>
        {produto.ano}
      </td>
      <td className={`px-6 py-4 ${produto.destaque ? "font-extrabold" : ""}`}>
        {Number(produto.preco).toLocaleString("pt-br", {
          minimumFractionDigits: 2,
        })}
      </td>
      <td className="px-6 py-4">
        <TiDeleteOutline
          className="text-3xl text-red-500 cursor-pointer"
          title="Excluir"
          onClick={excluirProduto}
        />
        <FaRegStar
          className="text-3xl text-yellow-400 cursor-pointer"
          title="Destacar"
          onClick={alterarDestaque}
        />
      </td>
    </tr>
  );
};

export default ItemProduto;
