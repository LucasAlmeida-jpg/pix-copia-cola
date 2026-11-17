# pix-copia-e-cola

Gera o código Pix "copia e cola" (BR Code estático). Sem dependências, funciona no navegador e no Node.

```sh
npm i pix-copia-e-cola
```

```js
import { pix } from 'pix-copia-e-cola'

const codigo = pix({
  chave: 'voce@email.com',
  nome: 'Fulano de Tal',
  cidade: 'Sao Paulo',
  valor: 25.9,           // opcional
  descricao: 'Pedido 42', // opcional
  txid: 'PED42',          // opcional
})
```

Para virar QR Code, passe `codigo` para qualquer lib de QR (ex.: `qrcode`).

| Opção | Obrigatória | Regra |
|---|---|---|
| `chave` | sim | CPF/CNPJ, e-mail, telefone `+55...` ou chave aleatória |
| `nome` | sim | até 25 caracteres (acentos removidos) |
| `cidade` | sim | até 15 caracteres (acentos removidos) |
| `valor` | não | número > 0; sem ele, quem paga digita o valor |
| `descricao` | não | mensagem para quem paga |
| `txid` | não | alfanumérico, até 25; padrão `***` |

Entradas inválidas lançam `Error`.

## Licença

MIT
