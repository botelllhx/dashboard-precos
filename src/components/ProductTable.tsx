import React from 'react';
import { useRouter } from 'next/router';
import { Produto } from '../types/index';

interface ProductTableProps {
  produtos: Produto[];
  termoPesquisa: string;
}

export default function ProductTable({ produtos, termoPesquisa }: ProductTableProps) {
  const router = useRouter();

  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-3">Lista de Produtos</h3>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="p-2">Nome</th>
            <th className="p-2">Preço Atual</th>
            <th className="p-2">Preço Alvo</th>
            <th className="p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtosFiltrados.map((produto) => (
            <tr key={produto.id} className="border-b border-gray-700">
              <td className="p-2">{produto.nome}</td>
              <td className="p-2">R$ {produto.preco.toFixed(2)}</td>
              <td className="p-2">R$ {produto.precoAlvo.toFixed(2)}</td>
              <td className="p-2">
                <button
                  onClick={() => router.push(`/historico/${produto.id}`)}
                  className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-500"
                >
                  🔍 Ver Histórico
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}