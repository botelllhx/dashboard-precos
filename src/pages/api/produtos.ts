import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { coletarPreco } from '../../libs/scraping';
import { ProdutoAPIResponse } from "../../types/index"; // Importe o tipo

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      const { nome, url, precoAlvo } = req.body

      if (!nome || !url || precoAlvo === undefined) {
        return res.status(400).json({ error: "Os campos 'nome', 'url' e 'precoAlvo' são obrigatórios" });
      }

      // Coleta o preço atual
      const preco = await coletarPreco(url);

      if (isNaN(preco) || preco <= 0) {
        return res.status(400).json({ error: "Não foi possível coletar o preço do produto" });
      }

      // Cria o produto e o histórico de preço
      const novoProduto = await prisma.produto.create({
        data: { nome, url, preco, precoAlvo },
      });

      await prisma.historicoPreco.create({
        data: {
          produtoId: novoProduto.id,
          preco,
        },
      });

      return res.status(201).json(novoProduto);
    }

    if (req.method === "GET") {
      const produtos = await prisma.produto.findMany({
        include: {
          historico: {
            orderBy: { data: "desc" },
            take: 1, // Pega o último preço registrado
          },
        },
      });

      const response: ProdutoAPIResponse[] = produtos.map((p) => ({
        id: p.id,
        nome: p.nome,
        preco: p.historico[0]?.preco || 0,
        precoAlvo: p.precoAlvo,
      }));

      return res.status(200).json(response);
    }

    return res.status(405).json({ error: "Método não permitido" });
  } catch (error) {
    console.error("Erro na API de produtos:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}