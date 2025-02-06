import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ProductForm from '../components/ProductForm';
import ProductTable from '../components/ProductTable';
import PriceChart from '../components/PriceChart';
import { Produto, FormData, ProdutoAPIResponse } from '../types/index';

export default function Dashboard() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);
  const [termoPesquisa, setTermoPesquisa] = useState('');

  // 🔄 Buscar produtos do backend
  useEffect(() => {
    async function fetchProdutos() {
      const res = await fetch('/api/produtos');
      const data: ProdutoAPIResponse[] = await res.json();
      setProdutos(data);
    }
    fetchProdutos();
  }, []);

  // 📌 Cadastrar novo produto
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const res = await fetch('/api/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const novoProduto = await res.json();
    setProdutos([...produtos, novoProduto]);
    setLoading(false);
  };
  

  return (
    <div className="flex h-auto bg-gray-900 text-white">
      <Sidebar />

      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Produtos Monitorados</h2>

        <ProductForm onSubmit={onSubmit} loading={loading} />

        {/* Barra de Pesquisa */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Pesquisar produto..."
            value={termoPesquisa}
            onChange={(e) => setTermoPesquisa(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <ProductTable produtos={produtos} termoPesquisa={termoPesquisa} />

        <PriceChart produtos={produtos} />
      </main>
    </div>
  );
}