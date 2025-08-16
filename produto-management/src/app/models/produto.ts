export interface Produto {
  id: number;
  codigo: string;
  descricao: string;
  departamentoId: number;
  preco: number;
  status: boolean;
}

export interface Departamento {
  id: number;
  nome: string;
}
