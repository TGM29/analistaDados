# Setup do Cloudflare D1 em Produção

1. Crie o banco D1 no painel do Cloudflare:
   - Vá em Workers & D1 > D1 > Create Database
   - Nomeie como `analista-d1`

2. Execute o schema:
   - No painel do D1, use a opção de executar SQL e cole o conteúdo de `backend/schema.sql`.

3. No `wrangler.toml`, garanta que o binding e nome do banco estão corretos:
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "analista-d1"
   ```

4. No deploy, o Worker já estará conectado ao D1.
