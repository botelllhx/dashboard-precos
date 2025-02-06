import React from 'react';
import { useState, useEffect } from 'react';
import { Produto } from '../types/index';


export default function Sidebar() {

    const [loading, setLoading] = useState(false);
    const [produtos, setProdutos] = useState<Produto[]>([]);

    // Função para atualizar todos os produtos
    const atualizarTodos = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/atualizar-todos", { method: "POST" });
            const data = await res.json();
            setProdutos(data);
        } catch (error) {
            console.error("Erro ao atualizar produtos:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <aside className="sticky top-0 w-64 bg-gray-800 p-6">
            <h1 className="sticky top-10 text-xl font-bold">📊 Dashboard</h1>
            <p className="sticky top-20 text-gray-400 mt-2">Gerencie e acompanhe os produtos.</p>
            {/* Botão "Atualizar Todos" */}
            <button
                onClick={atualizarTodos}
                disabled={loading}
                className="sticky top-40 bg-blue-600 p-2 rounded mb-6 hover:bg-blue-500"
            >
                {loading ? "Atualizando..." : "Atualizar Todos"}
            </button>
        </aside>
    );
}