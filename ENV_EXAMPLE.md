# Exemplo de Configuração do .env - Frontend

Crie um arquivo `.env` na raiz da pasta `FrondEnd` com o seguinte conteúdo:

```env
VITE_API_URL=http://localhost:3000
```

## Configurações para diferentes ambientes

### Desenvolvimento Local
```env
VITE_API_URL=http://localhost:3000
```

### Produção
```env
VITE_API_URL=https://api.seudominio.com
```

## Nota Importante

- O Vite requer que variáveis de ambiente comecem com `VITE_` para serem expostas ao código do cliente
- Após alterar o `.env`, reinicie o servidor de desenvolvimento (`npm run dev`)
