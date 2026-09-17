# API de Produtos

Projeto da aula de rotas e métodos HTTP com Node.js e Express.

## Como executar

```bash
npm install
npm start
```

O servidor será iniciado na porta `3000`.

## Rotas

- `GET /produtos`: lista os produtos.
- `GET /produtos/:id`: busca um produto pelo ID.
- `POST /produtos`: cria um produto.

Exemplo de corpo para criar um produto:

```json
{
  "nome": "Teclado",
  "preco": 180
}
```
