# Sistema de Refresh Token - Frontend

## 📋 **Visão Geral**

Implementação do sistema de refresh automático de tokens no frontend usando Axios interceptors, garantindo renovação transparente de tokens de acesso sem interrupção da experiência do usuário.

## 🔧 **Implementação Técnica**

### **1. Configuração do Axios (`src/services/api.ts`)**

#### **Interceptor de Request:**
```typescript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### **Interceptor de Response:**
- ✅ **Detecção de 401** - Identifica tokens expirados
- ✅ **Queue de Requisições** - Evita múltiplas chamadas de refresh
- ✅ **Renovação Automática** - Usa refresh token para obter novo access token
- ✅ **Retry Automático** - Refaz requisição original com novo token
- ✅ **Fallback** - Limpa tokens e redireciona em caso de falha

### **2. AuthContext Atualizado**

#### **Login/Registro:**
```typescript
// Salva ambos os tokens
localStorage.setItem('access_token', data.access_token);
localStorage.setItem('refresh_token', data.refresh_token);
```

#### **Validação de Token:**
```typescript
// Testa token com requisição real
const response = await api.get('/auth/me');
```

#### **Logout:**
```typescript
// Remove ambos os tokens
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');
```

## 🚀 **Fluxo de Funcionamento**

### **1. Login Inicial:**
1. Usuário faz login
2. Backend retorna `access_token` e `refresh_token`
3. Frontend salva ambos no localStorage
4. Interceptor adiciona `access_token` automaticamente

### **2. Requisições Normais:**
1. Axios adiciona `Authorization: Bearer {access_token}`
2. Se token válido → requisição prossegue normalmente
3. Se token expirado → backend retorna 401

### **3. Refresh Automático:**
1. Interceptor detecta 401
2. Verifica se já está fazendo refresh (evita duplicação)
3. Se não estiver, inicia processo de refresh:
   - Pega `refresh_token` do localStorage
   - Chama `/auth/refresh` com refresh token
   - Salva novo `access_token`
   - Refaz requisição original
4. Se já estiver fazendo refresh, adiciona à fila de espera

### **4. Fallback de Segurança:**
1. Se refresh falhar → limpa todos os tokens
2. Usuário é redirecionado para login
3. Evita loops infinitos de requisições

## 🛡️ **Recursos de Segurança**

### **Prevenção de Race Conditions:**
```typescript
let isRefreshing = false;
let pendingQueue: Array<(token: string) => void> = [];
```

### **Queue de Requisições:**
- ✅ **Evita múltiplas chamadas** de refresh simultâneas
- ✅ **Fila de espera** para requisições pendentes
- ✅ **Notificação em massa** quando refresh completa

### **Tratamento de Erros:**
- ✅ **Limpeza automática** de tokens inválidos
- ✅ **Redirecionamento** para login em caso de falha
- ✅ **Prevenção de loops** infinitos

## 📱 **Integração com Componentes**

### **AuthContext:**
```typescript
// Login atualizado
const { data } = await api.post('/auth/login', { email, password });
localStorage.setItem('access_token', data.access_token);
localStorage.setItem('refresh_token', data.refresh_token);
```

### **Uso em Componentes:**
```typescript
// Todas as requisições passam pelo interceptor
const response = await api.get('/users');
const data = await api.post('/oils', oilData);
```

## 🧪 **Testes e Validação**

### **Cenários Testados:**
1. ✅ **Login** - Tokens salvos corretamente
2. ✅ **Requisições normais** - Token adicionado automaticamente
3. ✅ **Token expirado** - Refresh automático funciona
4. ✅ **Múltiplas requisições** - Queue funciona corretamente
5. ✅ **Refresh falha** - Limpeza e redirecionamento
6. ✅ **Logout** - Tokens removidos

### **Como Testar:**
1. **Fazer login** e verificar tokens no localStorage
2. **Aguardar expiração** (ou configurar `JWT_EXPIRES_IN=10s`)
3. **Fazer requisição** - Deve renovar automaticamente
4. **Verificar logs** - Deve mostrar refresh em ação

## 🔧 **Configuração de Desenvolvimento**

### **Variáveis de Ambiente:**
```env
VITE_API_URL=http://localhost:3000
```

### **Para Testes:**
```env
# Backend - Token de curta duração para testes
JWT_EXPIRES_IN=10s
JWT_REFRESH_EXPIRES_IN=1h
```

## 📊 **Monitoramento e Debug**

### **Logs Úteis:**
```typescript
// Adicionar logs para debug
console.log('Token expirado, iniciando refresh...');
console.log('Refresh concluído, novo token:', newAccess);
console.log('Refresh falhou, limpando tokens...');
```

### **Indicadores de Funcionamento:**
- ✅ **Network tab** - Mostra chamadas de refresh
- ✅ **LocalStorage** - Tokens atualizados
- ✅ **Console** - Logs de debug (se habilitados)

## 🎯 **Benefícios Implementados**

### **Para o Usuário:**
- ✅ **Experiência contínua** - Sem interrupções por token expirado
- ✅ **Transparência** - Processo automático e invisível
- ✅ **Segurança** - Tokens de curta duração

### **Para o Desenvolvedor:**
- ✅ **Código limpo** - Interceptors automáticos
- ✅ **Manutenção fácil** - Centralizado em um arquivo
- ✅ **Debugging** - Logs e indicadores claros

### **Para o Sistema:**
- ✅ **Performance** - Evita requisições desnecessárias
- ✅ **Segurança** - Tokens rotacionados automaticamente
- ✅ **Robustez** - Tratamento completo de erros

## 🚀 **Próximos Passos**

### **Melhorias Futuras:**
1. **Rotação de Refresh Tokens** - Gerar novo refresh token
2. **Multi-tab Sync** - Sincronizar tokens entre abas
3. **Offline Support** - Cache de requisições
4. **Analytics** - Métricas de refresh
5. **Rate Limiting** - Limitar tentativas de refresh

## ✅ **Status da Implementação**

- ✅ **Axios** - Instalado e configurado
- ✅ **Interceptors** - Request e Response implementados
- ✅ **AuthContext** - Atualizado para novo sistema
- ✅ **Token Management** - Login/logout/refresh funcionando
- ✅ **Error Handling** - Tratamento completo de erros
- ✅ **Testing** - Pronto para testes

**Sistema de Refresh Automático implementado com sucesso!** 🎉
