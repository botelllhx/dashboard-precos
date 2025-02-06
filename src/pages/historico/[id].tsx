import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface HistoricoPreco {
  data: string;
  preco: number;
}

interface Produto {
  id: string;
  nome: string;
  preco: number;
  precoAlvo: number;
  url: string;
  historico: HistoricoPreco[];
}

export default function Historico() {
  const router = useRouter();
  const { id } = router.query;
  const [produto, setProduto] = useState<Produto | null>(null);
  const [loading, setLoading] = useState(true);

  const atualizarPreco = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/atualizar-individual/${id}`, { method: "POST" });
      const data = await res.json();
      setProduto(data);
    } catch (error) {
      console.error("Erro ao atualizar preço:", error);
    } finally {
      setLoading(false);
    }
  };

  const excluirProduto = async () => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      setLoading(true);
      try {
        const res = await fetch(`/api/produtos/${id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          // Redireciona para o dashboard após exclusão
          router.push('/');
        } else {
          const errorData = await res.json();
          console.error('Erro ao excluir produto:', errorData);
        }
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (id) {
      // Busca as informações do produto e seu histórico
      fetch(`/api/historico/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setProduto(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Erro ao buscar produto:", error);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-white p-8">Carregando...</div>;
  }

  if (!produto) {
    return <div className="min-h-screen bg-gray-900 text-white p-8">Produto não encontrado.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Histórico - {produto.nome}</h1>

      {/* Botão "Atualizar Preço" */}
      <button
        onClick={atualizarPreco}
        disabled={loading}
        className="bg-blue-600 p-2 rounded mb-6 hover:bg-blue-500 mr-5"
      >
        {loading ? "Atualizando..." : "Atualizar Preço"}
      </button>

      <button
        onClick={excluirProduto}
        disabled={loading}
        className="bg-red-600 p-2 rounded hover:bg-red-500"
      >
        Excluir Produto
      </button>

      {/* Informações do Produto */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Informações do Produto</h2>
        <div className="space-y-2">
          <p><strong>Nome:</strong> {produto.nome}</p>
          <p><strong>Preço Atual:</strong> R$ {produto.preco.toFixed(2)}</p>
          <p><strong>Preço Alvo:</strong> R$ {produto.precoAlvo.toFixed(2)}</p>
          <p><strong>URL:</strong> <a href={produto.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{produto.url}</a></p>
        </div>
      </div>

      {/* Gráfico de Histórico */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Histórico de Preços</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={produto.historico}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="data"
                tickFormatter={(tick) => new Date(tick).toLocaleDateString()}
                interval="preserveStartEnd"
              />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip
                formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
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
    </div>
  );
}