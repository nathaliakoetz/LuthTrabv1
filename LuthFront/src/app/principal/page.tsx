"use client";
import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

interface ProdutosMarcaI {
  marca: string;
  num: number;
}

interface GeralDadosI {
  clientes: number;
  produtos: number;
  propostas: number;
}

export default function Principal() {
  const [produtosMarca, setProdutosMarca] = useState<ProdutosMarcaI[]>([]);
  const [dados, setDados] = useState<GeralDadosI>({
    clientes: 0,
    produtos: 0,
    propostas: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Função para buscar dados gerais
    async function getDadosGerais() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL_API}/dashboard/gerais`,
        );
        if (!response.ok) throw new Error("Erro ao buscar dados gerais.");
        const dados = await response.json();
        setDados(dados);
      } catch (error) {
        console.error("Erro ao carregar dados gerais:", error);
      }
    }

    // Função para buscar dados do gráfico
    async function getDadosGrafico() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL_API}/dashboard/produtosMarca`,
        );
        if (!response.ok)
          throw new Error("Erro ao buscar dados de produtos por marca.");
        const dados = await response.json();
        setProdutosMarca(dados);
      } catch (error) {
        console.error("Erro ao carregar dados do gráfico:", error);
      }
    }

    // Chama as funções ao carregar a página
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([getDadosGerais(), getDadosGrafico()]);
      setLoading(false); // Atualiza o estado de loading para falso quando ambos os dados forem carregados
    };

    fetchData();
  }, []); // Certifique-se de que a dependência esteja vazia, para executar uma vez

  // Preenchendo os dados com as marcas e a quantidade de produtos
  const data: Array<["Marca", "NºProdutos"] | [string, number]> = [
    ["Marca", "NºProdutos"], // Cabeçalho do gráfico
    ...produtosMarca.map(
      (produto) => [produto.marca, produto.num] as [string, number],
    ), // Mapeando os dados para o gráfico
  ];

  const cores = [
    "red",
    "blue",
    "violet",
    "green",
    "gold",
    "cyan",
    "chocolate",
    "purple",
    "brown",
    "orangered",
  ];

  const options = {
    colors: cores,
    chartArea: {
      width: "70%",
      height: "70%",
    },
    hAxis: {
      title: "Marca",
    },
    vAxis: {
      title: "Número de Produtos",
    },
    isStacked: false,
  };

  // Exibe mensagem de loading enquanto os dados não são carregados
  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mt-24 text-white">
      <h2 className="text-3xl mb-4 font-bold">Visão Geral do Sistema</h2>

      <div className="w-2/3 flex justify-between mx-auto mb-5">
        <div className="border-blue-600 border rounded p-6 w-1/3 me-3">
          <span className="bg-blue-100 text-blue-800 text-xl text-center font-bold mx-auto block px-2.5 py-5 rounded dark:bg-blue-900 dark:text-blue-300">
            {dados.clientes}
          </span>
          <p className="font-bold mt-2 text-center">Nº Clientes</p>
        </div>
        <div className="border-red-600 border rounded p-6 w-1/3 me-3">
          <span className="bg-red-100 text-red-800 text-xl text-center font-bold mx-auto block px-2.5 py-5 rounded dark:bg-red-900 dark:text-red-300">
            {dados.produtos}
          </span>
          <p className="font-bold mt-2 text-center">Nº Produtos</p>
        </div>
        <div className="border-green-600 border rounded p-6 w-1/3">
          <span className="bg-green-100 text-green-800 text-xl text-center font-bold mx-auto block px-2.5 py-5 rounded dark:bg-green-900 dark:text-green-300">
            {dados.propostas}
          </span>
          <p className="font-bold mt-2 text-center">Nº Propostas</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-4">
        Gráfico: Nº de Produtos por Marca
      </h2>
      <Chart
        bg-transparent
        chartType="ColumnChart"
        width="95%"
        height="380px"
        data={data}
        options={options}
      />
    </div>
  );
}
