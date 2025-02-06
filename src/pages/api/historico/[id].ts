import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    // Busca o produto e seu histórico
    const produto = await prisma.produto.findUnique({
      where: { id: id as string },
      include: {
        historico: {
          orderBy: { data: "asc" },
        },
      },
    });

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    // Retorna o produto e o histórico formatado
    res.status(200).json({

      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      precoAlvo: produto.precoAlvo,
      url: produto.url,
      historico: produto.historico.map((h) => ({
        data: h.data.toISOString(),
        preco: h.preco,
        
      })),
    });


  } catch (error) {
    console.error("Erro ao buscar produto e histórico:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}