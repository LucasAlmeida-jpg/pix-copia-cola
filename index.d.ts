export interface PixOptions {
  /** Chave Pix (CPF/CNPJ, e-mail, telefone +55..., ou aleatória) */
  chave: string
  /** Nome do recebedor (até 25 caracteres, acentos são removidos) */
  nome: string
  /** Cidade do recebedor (até 15 caracteres, acentos são removidos) */
  cidade: string
  /** Valor em reais; sem valor, quem paga digita */
  valor?: number
  /** Mensagem exibida para quem paga */
  descricao?: string
  /** Identificador alfanumérico (até 25), padrão "***" */
  txid?: string
}

export function pix(opts: PixOptions): string
export function crc16(str: string): string
