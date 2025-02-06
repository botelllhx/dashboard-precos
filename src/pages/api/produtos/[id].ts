import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Verifica se o produto existe
    const produto = await prisma.produto.findUnique({ where: { id: id as string } });

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    // Exclui o produto
    await prisma.produto.delete({ where: { id: id as string } });

    return res.status(200).json({ message: 'Produto excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}