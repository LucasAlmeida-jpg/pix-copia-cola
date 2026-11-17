// Gera o código Pix "copia e cola" (BR Code estático) conforme o Manual BR Code do Banco Central.

const field = (id, value) => {
  if (value.length > 99) throw new Error(`Campo ${id} passa de 99 caracteres`)
  return id + String(value.length).padStart(2, '0') + value
}

// Remove acentos e qualquer coisa fora do ASCII imprimível
const ascii = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\x20-\x7E]/g, '').trim()

// CRC16-CCITT (polinômio 0x1021, valor inicial 0xFFFF)
export function crc16(str) {
  let crc = 0xffff
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

/**
 * @param {object} opts
 * @param {string} opts.chave       Chave Pix (CPF/CNPJ, e-mail, telefone +55..., ou aleatória)
 * @param {string} opts.nome        Nome do recebedor (até 25 caracteres)
 * @param {string} opts.cidade      Cidade do recebedor (até 15 caracteres)
 * @param {number} [opts.valor]     Valor em reais; sem valor, quem paga digita
 * @param {string} [opts.descricao] Mensagem exibida para quem paga
 * @param {string} [opts.txid]      Identificador alfanumérico (até 25), padrão "***"
 * @returns {string}
 */
export function pix({ chave, nome, cidade, valor, descricao, txid = '***' }) {
  if (!chave?.trim()) throw new Error('chave é obrigatória')
  nome = ascii(nome ?? '')
  cidade = ascii(cidade ?? '')
  if (!nome || nome.length > 25) throw new Error('nome deve ter de 1 a 25 caracteres')
  if (!cidade || cidade.length > 15) throw new Error('cidade deve ter de 1 a 15 caracteres')
  if (txid !== '***' && !/^[A-Za-z0-9]{1,25}$/.test(txid)) throw new Error('txid deve ser alfanumérico com até 25 caracteres')
  if (valor != null && !(Number.isFinite(valor) && valor > 0 && valor < 1e10)) throw new Error('valor inválido')

  const conta = field('00', 'br.gov.bcb.pix') + field('01', chave.trim()) + (descricao ? field('02', ascii(descricao)) : '')

  const payload =
    field('00', '01') +
    field('26', conta) +
    field('52', '0000') +
    field('53', '986') +
    (valor != null ? field('54', valor.toFixed(2)) : '') +
    field('58', 'BR') +
    field('59', nome) +
    field('60', cidade) +
    field('62', field('05', txid)) +
    '6304'

  return payload + crc16(payload)
}
