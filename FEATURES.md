# Recuperação de senha

**RF**

[//]: # (requisitos funcionais são as funcionalidades daquela feature, o que o usuário espera que o sistema faça)

- O usuário deve poder recuperar sua senha informando o seu e-mail;
- O usuário deve receber um e-mail com instruções de recuperação de senha;
- O usuário deve poder resetar sua senha;

**RNF**

[//]: # (requisitos não funcionais estão relacionados às decisões técnicas da aplicação, o usuário não sabe com qual tecnologia foi implementada)

- Utilizar Mailtrap para testar envios de email em ambiente de dev;
- Utilizar Amazon SES para envios de email em produção;
- O envio de e-mails deve acontecer em segundo plano (background job);

**RN**

[//]: # (regras de negócio definem como uma funcionalidade deve ser implementada seguindo as políticas da empresa)

- O link enviado por email para resetar a senha deve expirar em 2h;
- O usuário precisa confirmar a nova senha ao resetar sua senha;

# Atualização do perfil

**RF**

- O usuário deve poder atualizar seu nome, email e senha;

**RN**

- O usuário não pode alterar seu email para um email já utilizado;
- Para atualizar sua senha o usuário deve informar a senha antiga;
- Para atualizar sua senha o usuário precisa confirmar a nova senha;

# Painel do prestador

**RF**

- O usuário deve poder listar seus agendamentos de um dia específico;
- O prestador deve receber uma notificação sempre que houver um novo agendamento;
- O prestador deve poder visualizar as notificações não lidas;

**RNF**

- Os agendamentos do prestador no dia devem ser armazenados em cache;
- As notificações do prestador devem ser armazenadas no MongoDB;
- As notificações do prestador devem ser enviadas em tempo-real utilizando Socket.io;

**RN**

- A notificação deve ter um status de lida ou não-lida;

# Agendamento de serviços

**RF**

- O usuário deve poder listar todos prestadores de serviço cadastrados;
- O usuário deve poder listar os dias de um mês, do prestador selecionado, com pelo menos um horário disponível;
- O usuário deve poder listar horários disponíveis em um dia específico do prestador selecionado;
- O usuário deve poder realizar o agendamento com o prestador;

**RNF**

- A listagem de prestadores deve ser armazenada em cache;

**RN**

- Cada agendamento deve durar 1h exatamente;
- Os agendamentos devem estar disponíveis entre 8h às 18h (Primeiro às 8h, último às 17h);
- O usuário não pode agendar em um horário já ocupado;
- O usuário não pode agendar em um horário que já passou;
- O usuário não pode agendar serviços consigo mesmo;
