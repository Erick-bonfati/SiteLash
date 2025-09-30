# 📅 Regras de Agendamento - SiteLash

## ⏰ **Horários de Funcionamento**

O sistema agora funciona em **3 períodos específicos por dia**:

### 🌅 **Período 1: Manhã**
- **Horário**: 8h00 às 10h30
- **Intervalos**: A cada 30 minutos
- **Horários disponíveis**: 8:00, 8:30, 9:00, 9:30, 10:00, 10:30

### ☀️ **Período 2: Tarde**
- **Horário**: 13h00 às 15h30
- **Intervalos**: A cada 30 minutos
- **Horários disponíveis**: 13:00, 13:30, 14:00, 14:30, 15:00, 15:30

### 🌆 **Período 3: Noite**
- **Horário**: 17h00 às 20h00
- **Intervalos**: A cada 30 minutos
- **Horários disponíveis**: 17:00, 17:30, 18:00, 18:30, 19:00, 19:30, 20:00

## 🚫 **Regras de Bloqueio**

### ❌ **Horários Ocupados**
- Se já houver um agendamento em um horário, ele fica **indisponível**
- O sistema verifica **conflitos de duração** automaticamente
- Exemplo: Se há um serviço de 90min às 9h00, os horários 9h00, 9h30 e 10h00 ficam bloqueados

### ⏱️ **Validação de Duração**
- O sistema considera a duração do serviço para evitar sobreposições
- Serviços de 30min ocupam 1 slot
- Serviços de 60min ocupam 2 slots
- Serviços de 90min ocupam 3 slots

## 🔄 **Como Funciona**

1. **Cliente seleciona data** → Sistema mostra apenas os 3 períodos
2. **Cliente escolhe período** → Sistema mostra horários disponíveis
3. **Sistema verifica conflitos** → Bloqueia horários ocupados
4. **Agendamento confirmado** → Horário fica indisponível para outros

## 📱 **Interface do Usuário**

- **Períodos claramente identificados** na tela de agendamento
- **Horários indisponíveis** aparecem desabilitados
- **Mensagens de erro** explicam por que um horário não está disponível

## ✅ **Benefícios**

- ✅ **Organização**: 3 períodos bem definidos
- ✅ **Eficiência**: Evita conflitos de horários
- ✅ **Clareza**: Usuário sabe exatamente quando pode agendar
- ✅ **Automação**: Sistema gerencia tudo automaticamente

## 🎯 **Exemplo Prático**

**Cenário**: Cliente quer agendar para 15/10/2024

1. **Sistema mostra**: 3 períodos (Manhã, Tarde, Noite)
2. **Cliente escolhe**: Tarde (13h-15h30)
3. **Sistema mostra**: 13:00, 13:30, 14:00, 14:30, 15:00, 15:30
4. **Se 14:00 estiver ocupado**: Aparece desabilitado
5. **Cliente escolhe**: 14:30 (disponível)
6. **Agendamento confirmado**: 14:30 fica indisponível

---

**🚀 Sistema implementado e funcionando!**
