import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { coletarPreco } from '../../libs/scraping';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const produtos = await prisma.produto.findMany();

    for (const produto of produtos) {
      try {
        const preco = await coletarPreco(produto.url);

        // Atualiza o preço atual do produto
        await prisma.produto.update({
          where: { id: produto.id },
          data: { preco },
        });

        // Cria um novo registro no histórico de preços
        await prisma.historicoPreco.create({
          data: {
            produtoId: produto.id,
            preco,
          },
        });
      } catch (error) {
        console.error(`Erro ao atualizar preço do produto ${produto.nome}:`, error);
      }
    }

    const produtosAtualizados = await prisma.produto.findMany();
    return res.status(200).json(produtosAtualizados);
  } catch (error) {
    console.error('Erro ao atualizar produtos:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}