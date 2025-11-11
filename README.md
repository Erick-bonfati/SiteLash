# 💄 CleoLash - Sistema de Agendamentos

Um sistema completo de gerenciamento de agendamentos e produtos/serviços para mulheres, com design rosa suave e moderno.

## ✨ Funcionalidades

### Frontend
- **Página Inicial**: Exibe todos os produtos e serviços disponíveis com preços
- **Sistema de Agendamento**: Interface intuitiva para agendar horários
- **Filtro para Novas Clientes**: Direciona primeiras visitas para confirmação pelo WhatsApp
- **Design Responsivo**: Layout moderno e adaptável para todos os dispositivos
- **Tema Rosa Suave**: Cores pensadas especialmente para mulheres

### Backend
- **Central Administrativa**: Login seguro para administradores
- **Gestão de Produtos/Serviços**: Cadastrar, editar e remover produtos
- **Controle de Preços**: Definir e gerenciar preços facilmente
- **Visualização de Agendamentos**: Ver todos os agendamentos realizados
- **Confirmação Automática**: Envio de email via Nodemailer após cada reserva
- **API RESTful**: Endpoints organizados e documentados
- **MongoDB + Mongoose**: Persistência em banco NoSQL, sem depender de arquivos JSON

### Funcionalidades Extras
- **Validação de Formulários**: Validação completa no frontend e backend
- **Interface Amigável**: UX/UI pensada para facilitar o uso
- **Segurança**: Autenticação JWT e validação de dados
- **Responsividade**: Funciona perfeitamente em mobile, tablet e desktop

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18**: Framework JavaScript moderno
- **React Router**: Navegação entre páginas
- **Axios**: Cliente HTTP para comunicação com API
- **React Hook Form**: Gerenciamento de formulários
- **React Toastify**: Notificações elegantes
- **CSS3**: Estilização com design rosa suave

### Backend
- **Node.js + Express**: API REST em JavaScript
- **MongoDB + Mongoose**: Dados salvos em um cluster local/remoto
- **Camada de Segurança**: Helmet, sanitização de payloads, rate limiting e CORS configurável
- **JWT**: Autenticação segura
- **Bcrypt**: Criptografia de senhas
- **Express Validator**: Validação de dados

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd SiteLash
```

2. **Instale as dependências do frontend (raiz)**
```bash
npm install
```

3. **Instale as dependências do backend**
```bash
cd backend
npm install
cd ..
```

4. **Configure as variáveis de ambiente**
- Crie um arquivo `.env` dentro da pasta `backend/`
- Parâmetros gerais disponíveis: `PORT`, `NODE_ENV`, `JWT_SECRET`
- Configure `MONGODB_URI` apontando para seu cluster (ex.: `mongodb://127.0.0.1:27017/sitelash`). Caso não defina, o backend tentará esse endereço local automaticamente.
- Opcional: personalize as credenciais do primeiro administrador com `DEFAULT_ADMIN_USERNAME`, `DEFAULT_ADMIN_EMAIL` e `DEFAULT_ADMIN_PASSWORD`. Se não informar, é criado `admin@sitelash.com` / `admin123` na primeira execução.
- Para habilitar o envio automático de emails, adicione as variáveis abaixo:
```env
EMAIL_HOST=smtp.seuprovedor.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=contato@seudominio.com
EMAIL_PASS=sua_senha_ou_token
EMAIL_FROM="CleoLash <contato@seudominio.com>"
EMAIL_REPLY_TO=contato@seudominio.com
EMAIL_ENABLED=true
# Opcional: cópia oculta para acompanhar novas reservas
EMAIL_COPY_TO=adm@seudominio.com
```
- Defina os canais oficiais (WhatsApp e suporte) no backend, impedindo alterações pelo frontend:
```env
CONTACT_WHATSAPP_NUMBER=5511999999999
CONTACT_WHATSAPP_DISPLAY="(11) 99999-9999"
CONTACT_SUPPORT_EMAIL=contato@seudominio.com
```
- Endureça o CORS e o rate limiting conforme o ambiente:
```env
# Lista separada por vírgula (deixe vazio para liberar todas as origens em desenvolvimento)
ALLOWED_ORIGINS=https://app.sitelash.com,https://admin.sitelash.com

# Rate limiting global
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=200

# Rate limiting específico
RATE_LIMIT_AUTH_WINDOW_MS=900000
RATE_LIMIT_AUTH_MAX=10
RATE_LIMIT_APPOINTMENT_WINDOW_MS=3600000
RATE_LIMIT_APPOINTMENT_MAX=30

# Quando estiver atrás de proxy/reverso (Vercel, Render, Nginx, etc.). Valor padrão 'loopback'.
# Ajuste para false se não quiser confiar em cabeçalhos X-Forwarded-For.
TRUST_PROXY=1
```

5. **Execute o projeto**
```bash
npm run dev
```

Isso iniciará:
- Backend na porta 5000 (conectado ao MongoDB configurado)
- Frontend na porta 3000

### Acesso
- **Site**: http://localhost:3000
- **API**: http://localhost:5000
- **Admin**: http://localhost:3000/admin/login

## 👤 Conta de Teste

Para testar o sistema administrativo, use:
- **Email**: admin@sitelash.com
- **Senha**: admin123

## 📱 Estrutura do Projeto

```
SiteLash/
├── public/                # Arquivos públicos do React (imagens, index.html, etc.)
├── src/                   # Código fonte do frontend React
│   ├── components/        # Componentes reutilizáveis
│   ├── pages/             # Páginas da aplicação
│   ├── context/           # Context API para estado global
│   └── App.js             # Componente principal
├── backend/               # Backend Node.js com MongoDB
│   ├── src/
│   │   ├── config/       # Configurações (porta, JWT, etc.)
│   │   ├── controllers/  # Lógica dos endpoints
│   │   ├── routes/       # Rotas da API
│   │   ├── services/     # Regras de negócio
│   │   ├── models/       # Schemas do Mongoose
│   │   ├── utils/        # Helpers (ex.: cálculo financeiro, email)
│   │   └── server.js     # Servidor principal
│   └── package.json
├── package.json          # Scripts/dependências do frontend
└── craco.config.js       # Configuração do build React
```

## 🎨 Design

O design foi pensado especialmente para mulheres, com:
- **Cores Principais**: Rosa suave (#f8b5c1, #fce7f3, #ec4899)
- **Tipografia**: Poppins (moderna e elegante)
- **Layout**: Centralizado e responsivo
- **Elementos**: Emojis e ícones femininos
- **Gradientes**: Suaves e delicados

## 🔒 Segurança

- Autenticação JWT com expiração
- Validação de dados no frontend e backend
- Criptografia de senhas com bcrypt
- Middleware de autenticação
- Sanitização de inputs

## 📊 Funcionalidades do Admin

### Gestão de Produtos/Serviços
- ✅ Criar novos produtos/serviços
- ✅ Editar informações existentes
- ✅ Definir preços e durações
- ✅ Ativar/desativar produtos
- ✅ Upload de imagens (URL)

### Gestão de Agendamentos
- ✅ Visualizar todos os agendamentos
- ✅ Alterar status (pendente, confirmado, cancelado, concluído)
- ✅ Filtrar por data e status
- ✅ Ver detalhes completos do cliente
