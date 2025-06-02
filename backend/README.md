# Backend - AnalistaDados

## Como rodar localmente

1. Instale as dependências:
   ```bash
   cd backend
   npm install
   ```
2. Crie o banco D1 e aplique o schema:
   ```bash
   wrangler d1 create analista-d1
   wrangler d1 execute analista-d1 --file=schema.sql
   ```
3. Rode em modo dev:
   ```bash
   npm run dev
   ```

## Deploy

- O deploy é feito via `wrangler deploy`.
- Configure as secrets e variáveis no Cloudflare conforme o `wrangler.toml`.
