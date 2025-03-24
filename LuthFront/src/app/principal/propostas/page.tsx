"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Proposta {
  id: string;
  descricao: string;
  produto: { nome: string; imagemUrl: string };
  cliente: { nome: string; email: string };
  resposta?: string;
}

const Propostas = () => {
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar as propostas da API
  useEffect(() => {
    const fetchPropostas = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL_API}/propostas`,
        );

        if (!response.ok) {
          throw new Error("Falha ao carregar propostas");
        }

        const data: Proposta[] = await response.json();
        setPropostas(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError("Erro ao buscar as propostas: " + err.message);
        } else {
          setError("Erro desconhecido ao buscar as propostas");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPropostas();
  }, []);

  // Função para excluir a proposta tanto da lista local quanto da API
  const excluirProposta = async (id: string) => {
    try {
      // Enviar a requisição DELETE para o backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/propostas/${id}`,
        {
          method: "DELETE",
        },
      );

      // Verificar se a resposta foi bem-sucedida
      if (!response.ok) {
        throw new Error("Erro ao excluir proposta no backend");
      }

      // Remove a proposta da lista local após exclusão bem-sucedida
      setPropostas((prevPropostas) =>
        prevPropostas.filter((proposta) => proposta.id !== id),
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("Erro ao excluir proposta: " + err.message);
      } else {
        setError("Erro desconhecido ao excluir proposta");
      }
    }
  };

  return (
    <div style={{ backgroundColor: "black", color: "white", padding: "20px" }}>
      <h1>Propostas</h1>
      {loading && <p>Carregando propostas...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && propostas.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Foto</th>
              <th>Descrição</th>
              <th>Cliente</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {propostas.map((proposta) => (
              <tr key={proposta.id}>
                <td>{proposta.produto.nome}</td>
                <td>
                  <img
                    src={
                      proposta.produto.imagemUrl ||
                      "https://via.placeholder.com/180"
                    }
                    alt={`Imagem do produto ${proposta.produto.nome}`}
                    width={180}
                    height={180}
                    style={{ borderRadius: "8px" }}
                  />
                </td>
                <td>{proposta.descricao}</td>
                <td>{proposta.cliente.nome}</td>
                <td>
                  <button
                    onClick={() => excluirProposta(proposta.id)}
                    style={{
                      backgroundColor: "#f44336",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && !error && propostas.length === 0 && (
        <p>Nenhuma proposta encontrada.</p>
      )}
    </div>
  );
};

export default Propostas;
