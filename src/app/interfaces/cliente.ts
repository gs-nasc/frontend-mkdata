export interface Cliente {
  id: number;
  nome: string;
  tipo: "PF" | "PJ";
  document: string;
  ie?: string;
  created_at: Date;
  active: boolean;
}
