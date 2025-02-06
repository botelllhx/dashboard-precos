import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { coletarPreco } from '../../../libs/scraping';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const produto = await prisma.produto.findUnique({ where: { id: id as string } });

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

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

    const produtoAtualizado = await prisma.produto.findUnique({
      where: { id: produto.id },
      include: { historico: true },
    });

    return res.status(200).json(produtoAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar preço:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}