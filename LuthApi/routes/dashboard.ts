import { PrismaClient } from "@prisma/client"
import { Router } from "express"

const prisma = new PrismaClient()
const router = Router()

router.get("/gerais", async (req, res) => {
  try {
    const clientes = await prisma.cliente.count()
    const produtos = await prisma.produto.count()
    const propostas = await prisma.proposta.count()
    res.status(200).json({ clientes, produtos, propostas })
  } catch (error) {
    res.status(400).json(error)
  }
})

router.get("/produtosMarca", async (req, res) => {
  try {
    const produtos = await prisma.produto.groupBy({
      by: ['marcaId'],
      _count: {
        id: true, 
      }
    })

    // Para cada produto, inclui o nome da marca relacionada ao marcaId
    const produtosMarca = await Promise.all(
      produtos.map(async (produto) => {
        const marca = await prisma.marca.findUnique({
          where: { id: produto.marcaId }
        })
        return {
          marca: marca?.nome, 
          num: produto._count.id
        }
      })
    )
    res.status(200).json(produtosMarca)
  } catch (error) {
    res.status(400).json(error)
  }
})

export default router
