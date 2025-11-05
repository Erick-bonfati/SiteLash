# 📁 Sistema de Persistência de Dados

Este diretório contém os arquivos JSON que armazenam os dados do sistema SiteLash.

## 📄 Arquivos de Dados

- **`products.json`** - Armazena todos os produtos e serviços
- **`appointments.json`** - Armazena todos os agendamentos
- **`admins.json`** - Armazena os administradores do sistema

## 🔄 Como Funciona

1. **Carregamento**: Os dados são carregados do JSON na inicialização do servidor
2. **Persistência**: Toda alteração nos dados é automaticamente salva no arquivo JSON
3. **Backup**: Os dados ficam salvos mesmo após reiniciar o servidor

## 📸 Imagens

As imagens dos produtos são salvas na pasta `frontend/public/images/` e podem ser acessadas diretamente pelo frontend.

## ⚠️ Importante

- **Não edite** os arquivos JSON manualmente
- **Faça backup** regularmente desta pasta
- Os dados são **automaticamente gerenciados** pelo sistema
