export interface Produto {
    id: string; // Altere para string
    nome: string;
    preco: number;
    precoAlvo: number;
    url?: string;
  }
  
  export interface ProdutoAPIResponse {
    id: string;
    nome: string;
    preco: number;
    precoAlvo: number;
  }
  
  export interface FormData {
    nome: string;
    url: string;
    preco: number;
    precoAlvo: number;
  }