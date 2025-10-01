# 📅 Regras de Agendamento - SiteLash

## ⏰ **Horários de Funcionamento**

O sistema funciona com **horários específicos por dia da semana**:

### 📅 **Segunda a Sexta-feira**
- **Horários disponíveis**: 9:00, 11:00, 15:00, 18:00
- **Total**: 4 horários por dia

### 🗓️ **Sábado**
- **Horários disponíveis**: 8:00, 11:00, 14:00
- **Total**: 3 horários por dia

### 🚫 **Domingo**
- **Funcionamento**: Fechado
- **Horários disponíveis**: Nenhum

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

1. **Cliente seleciona data** → Sistema verifica o dia da semana
2. **Sistema define horários** → Baseado no dia (seg-sex: 4 horários, sáb: 3 horários, dom: fechado)
3. **Sistema verifica conflitos** → Bloqueia horários já ocupados
4. **Agendamento confirmado** → Horário fica indisponível para outros

## 📱 **Interface do Usuário**

- **Horários específicos** mostrados conforme o dia da semana
- **Domingos bloqueados** - não aparecem horários disponíveis
- **Horários indisponíveis** aparecem desabilitados
- **Mensagens de erro** explicam por que um horário não está disponível

## ✅ **Benefícios**

- ✅ **Organização**: Horários fixos por dia da semana
- ✅ **Eficiência**: Evita conflitos de horários
- ✅ **Clareza**: Usuário sabe exatamente quando pode agendar
- ✅ **Automação**: Sistema gerencia tudo automaticamente
- ✅ **Flexibilidade**: Diferentes horários para diferentes dias

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
