import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();
const router = Router();

// Validação simples de dados
const validarProposta = (descricao: string, clienteId: number, produtoId: number) => {
  if (!descricao || !clienteId || !produtoId) {
    return 'Descrição, clienteId e produtoId são obrigatórios.';
  }
  return null;
};

// Rota para criar uma nova proposta para um cliente
router.post('/', async (req: Request, res: Response) => {
  const { clienteId, produtoId, descricao } = req.body;

  // Validação dos dados de entrada
  const erroValidacao = validarProposta(descricao, clienteId, produtoId);
  if (erroValidacao) {
    return res.status(400).json({ message: erroValidacao });
  }

  try {
    const novaProposta = await prisma.proposta.create({
      data: {
        descricao,
        clienteId,
        produtoId,
      },
    });
    res.status(201).json(novaProposta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar proposta." });
  }
});

// Rota para listar todas as propostas de um cliente específico
router.get('/:clienteId', async (req: Request, res: Response) => {
  const { clienteId } = req.params;

  if (!clienteId) {
    return res.status(400).json({ message: "clienteId é obrigatório." });
  }

  // Verificar se clienteId é um número válido, mas manter como string para Prisma
  if (isNaN(Number(clienteId))) {
    return res.status(400).json({ message: "clienteId deve ser um número válido." });
  }

  try {
    const propostasDoCliente = await prisma.proposta.findMany({
      where: {
        clienteId: String(clienteId), // Convertendo clienteId para string
      },
      include: { produto: true }, // Inclui os dados do produto associado à proposta
    });

    if (propostasDoCliente.length === 0) {
      return res.status(404).json({ message: "Nenhuma proposta encontrada para este cliente." });
    }

    res.json(propostasDoCliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao listar propostas." });
  }
});

// Rota para atualizar uma proposta
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { descricao } = req.body;

  if (!descricao) {
    return res.status(400).json({ message: "A descrição é obrigatória para atualizar a proposta." });
  }

  try {
    const propostaAtualizada = await prisma.proposta.update({
      where: { id: Number(id) },
      data: { descricao },
    });

    res.json(propostaAtualizada);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Proposta não encontrada." });
  }
});

// Rota para deletar uma proposta
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.proposta.delete({
      where: { id: Number(id) },
    });
    res.status(204).send(); // Retorna 204 No Content
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Proposta não encontrada." });
  }
});

export default router;
