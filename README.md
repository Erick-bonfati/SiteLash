# 💄 CleoLash - Sistema de Agendamentos

Um sistema completo de gerenciamento de agendamentos e produtos/serviços para mulheres, com design rosa suave e moderno.

## ✨ Funcionalidades

### Frontend
- **Página Inicial**: Exibe todos os produtos e serviços disponíveis com preços
- **Sistema de Agendamento**: Interface intuitiva para agendar horários
- **Design Responsivo**: Layout moderno e adaptável para todos os dispositivos
- **Tema Rosa Suave**: Cores pensadas especialmente para mulheres

### Backend
- **Central Administrativa**: Login seguro para administradores
- **Gestão de Produtos/Serviços**: Cadastrar, editar e remover produtos
- **Controle de Preços**: Definir e gerenciar preços facilmente
- **Visualização de Agendamentos**: Ver todos os agendamentos realizados
- **API RESTful**: Endpoints organizados e documentados

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
- **Node.js**: Runtime JavaScript
- **Express.js**: Framework web
- **MongoDB**: Banco de dados NoSQL
- **Mongoose**: ODM para MongoDB
- **JWT**: Autenticação segura
- **Bcrypt**: Criptografia de senhas
- **Express Validator**: Validação de dados

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 16 ou superior)
- MongoDB (local ou Atlas)
- npm ou yarn

### Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd SiteLash
```

2. **Instale as dependências**
```bash
npm run install-all
```

3. **Configure o banco de dados**
- Instale o MongoDB localmente ou use MongoDB Atlas
- O banco será criado automaticamente como `sitelash`

4. **Execute o projeto**
```bash
npm run dev
```

Isso iniciará:
- Backend na porta 5000
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
├── client/                 # Frontend React
│   ├── public/            # Arquivos públicos
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── context/       # Context API para estado global
│   │   └── App.js         # Componente principal
│   └── package.json
├── server/                # Backend Node.js
│   ├── config/           # Configurações
│   ├── middleware/       # Middlewares personalizados
│   ├── models/          # Modelos do banco de dados
│   ├── routes/          # Rotas da API
│   ├── index.js         # Servidor principal
│   └── package.json
└── package.json         # Scripts principais
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

## 🌟 Próximas Funcionalidades

- [ ] Sistema de notificações por email
- [ ] Calendário visual de agendamentos
- [ ] Relatórios e estatísticas
- [ ] Sistema de avaliações
- [ ] Integração com pagamentos
- [ ] App mobile

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 💖 Feito com Amor

Desenvolvido especialmente para mulheres incríveis que merecem se sentir lindas e confiantes todos os dias! ✨

---

**CleoLash** - Seu espaço de beleza e bem-estar 💄
