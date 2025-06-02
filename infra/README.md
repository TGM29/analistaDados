# Infraestrutura e Deploy

## Deploy Backend (Cloudflare Workers)
- O deploy é feito via GitHub Actions e Wrangler.
- Configure secrets no GitHub: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.

## Deploy Frontend (Cloudflare Pages)
- Configure o projeto no Cloudflare Pages apontando para a pasta `frontend`.
- O build é feito com `npm run build` e o output é `dist/`.

## GitHub Actions
- Adicione workflows para deploy automático ao fazer push na branch principal.
