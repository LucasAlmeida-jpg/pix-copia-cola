import { test } from 'node:test'
import assert from 'node:assert/strict'
import { pix, crc16 } from './index.js'

test('bate com o exemplo do Manual BR Code do Banco Central', () => {
  assert.equal(
    pix({ chave: '123e4567-e12b-12d1-a456-426655440000', nome: 'Fulano de Tal', cidade: 'BRASILIA' }),
    '00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-4266554400005204000053039865802BR5913Fulano de Tal6008BRASILIA62070503***63041D3D'
  )
})

test('valor, descrição, txid e acentos', () => {
  const code = pix({ chave: 'a@b.com', nome: 'João', cidade: 'São Paulo', valor: 10.5, descricao: 'Café', txid: 'PED123' })
  assert.match(code, /540510\.50/)
  assert.match(code, /0204Cafe/)
  assert.match(code, /5904Joao6009Sao Paulo/)
  assert.match(code, /62100506PED123/)
  assert.equal(code.slice(-4), crc16(code.slice(0, -4)))
})

test('rejeita entradas inválidas', () => {
  const ok = { chave: 'x', nome: 'A', cidade: 'B' }
  assert.throws(() => pix({ ...ok, chave: '' }))
  assert.throws(() => pix({ ...ok, nome: 'A'.repeat(26) }))
  assert.throws(() => pix({ ...ok, valor: -1 }))
  assert.throws(() => pix({ ...ok, txid: 'com espaço' }))
})
