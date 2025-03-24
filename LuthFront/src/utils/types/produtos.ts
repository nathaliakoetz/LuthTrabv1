import { MarcaI } from "./marcas";

export interface ProdutoI {
  id: number;
  modelo: string;
  ano: number;
  preco: number;
  destaque: boolean;
  foto: string;
  acessorios: string;
  marca: MarcaI;
  marcaId: number;
  adminId: number;
}
