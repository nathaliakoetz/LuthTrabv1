import { PrismaClient } from "@prisma/client"
import { Router } from "express"

const prisma = new PrismaClient()
const router = Router()

router.get("/", async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      include: {
        marca: true
      }
    })
    res.status(200).json(produtos)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.post("/", async (req, res) => {
  const { modelo, ano, preco, foto, acessorios, marcaId } = req.body

  if (!modelo || !ano || !preco || !foto || !acessorios || !marcaId) {
    res.status(400).json({ "erro": "Informe modelo, ano, preco, foto, acessorios e marcaId" })
    return
  }

  try {
    const produto = await prisma.produto.create({
      data: { modelo, ano, preco,  foto, acessorios, marcaId }
    })
    res.status(201).json(produto)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.delete("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const produto = await prisma.produto.delete({
      where: { id: Number(id) }
    })
    res.status(200).json(produto)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.put("/:id", async (req, res) => {
  const { id } = req.params
  const { modelo, ano, preco, combustivel, km, foto, acessorios, marcaId } = req.body

  if (!modelo || !ano || !preco|| !foto || !acessorios || !marcaId) {
    res.status(400).json({ "erro": "Informe modelo, ano, preco, foto, acessorios e marcaId" })
    return
  }

  try {
    const produto = await prisma.produto.update({
      where: { id: Number(id) },
      data: { modelo, ano, preco, foto, acessorios, marcaId }
    })
    res.status(200).json(produto)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.get("/pesquisa/:termo", async (req, res) => {
  const { termo } = req.params

  // tenta converter o termo em número
  const termoNumero = Number(termo)

  // se a conversão gerou um NaN (Not a Number)
  if (isNaN(termoNumero)) {
    try {
      const produtos = await prisma.produto.findMany({
        include: {
          marca: true
        },
        where: {
          OR: [
            { modelo: { contains: termo }},
            { marca: { nome: termo }}
          ]
        }
      })
      res.status(200).json(produtos)
    } catch (error) {
      res.status(400).json(error)
    }
  } else {
    try {
      const produtos = await prisma.produto.findMany({
        include: {
          marca: true
        },
        where: {
          OR: [
            { preco: { lte: termoNumero }},
            { ano: termoNumero }
          ]
        }
      })
      res.status(200).json(produtos)
    } catch (error) {
      res.status(400).json(error)
    }
  }
})

router.get("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const produto = await prisma.produto.findUnique({
      where: { id: Number(id)},
      include: {
        marca: true
      }
    })
    res.status(200).json(produto)
  } catch (error) {
    res.status(400).json(error)
  }
})

export default router