import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Produto } from '../types/index';

interface PriceChartProps {
  produtos: Produto[];
}

export default function PriceChart({ produtos }: PriceChartProps) {
  const ultimosProdutos = produtos.slice(-5);

  const chartData = ultimosProdutos.map((produto) => ({
    nome: produto.nome,
    preco: produto.preco,
  }));

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Últimos Preços Alterados</h3>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nome" />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
            <Legend />
            <Line
              type="monotone"
              dataKey="preco"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}