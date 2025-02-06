import React from 'react';
import { useForm } from 'react-hook-form';
import { FormData } from '../types/index';

interface ProductFormProps {
  onSubmit: (data: FormData) => void;
  loading: boolean;
}

export default function ProductForm({ onSubmit, loading }: ProductFormProps) {
  const { register, handleSubmit } = useForm<FormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-800 p-4 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-3">Adicionar Produto</h3>
      <div className="grid grid-cols-2 gap-4">
        <input {...register('nome')} placeholder="Nome" className="p-2 bg-gray-700 rounded" />
        <input {...register('url')} placeholder="URL" className="p-2 bg-gray-700 rounded" />
        <input
          {...register('preco', { valueAsNumber: true })}
          placeholder="Preço Inicial"
          className="p-2 bg-gray-700 rounded"
          type="number"
        />
        <input
          {...register('precoAlvo', { valueAsNumber: true })}
          placeholder="Preço Alvo"
          className="p-2 bg-gray-700 rounded"
          type="number"
        />
      </div>
      <button className="mt-4 w-full bg-green-600 p-2 rounded hover:bg-green-500" disabled={loading}>
        {loading ? 'Salvando...' : 'Adicionar'}
      </button>
    </form>
  );
}