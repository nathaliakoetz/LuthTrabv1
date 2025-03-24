import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from 'express'

interface TokenI {
  userLogadoId: number
  userLogadoNome: string
}

// Estendendo a interface Request para incluir os novos campos
interface CustomRequest extends Request {
  userLogadoId?: number
  userLogadoNome?: string
}

export function verificaToken(req: CustomRequest, res: Response, next: NextFunction) {
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(401).json({ error: "Token não informado" })
  }

  const token = authorization.split(" ")[1]

  try {
    // Aqui, estamos garantindo que o processo de verificação vai decodificar o token corretamente
    const decoded = jwt.verify(token, process.env.JWT_KEY as string) as TokenI
    const { userLogadoId, userLogadoNome } = decoded

    req.userLogadoId = userLogadoId
    req.userLogadoNome = userLogadoNome

    next()
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" })
  }
}
