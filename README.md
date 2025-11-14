### Link do projeto

[Repositório do projeto no GitHub](https://github.com/thiagoambiel/OpenTicket)

### Tema do Projeto

O **Open Ticket** é uma plataforma digital para a **gestão de ingressos de eventos**, com foco principal no cenário universitário. O projeto foi concebido para atender às necessidades de uma república estudantil chamada Open Beach que organiza festas como forma de arrecadar fundos para seus custos de moradia.

### Cliente do projeto

*   **Organizadores (A República):** Responsáveis por criar e configurar os eventos, gerar lotes de ingressos e realizar o check-in na portaria.
*   **Cliente secundário (Participantes):** O público do evento, que recebe e utiliza os ingressos para acessar a festa.


### Tecnologias Principais:

*   **Framework:** **Next.js 14** com **React** e **TypeScript**, usando a nova estrutura de App Router. Isso significa que é uma aplicação web moderna, rápida e com código bem estruturado.
*   **Banco de Dados:** **Prisma** com **SQLite**. O Prisma facilita a comunicação com o banco de dados de forma segura, e o SQLite é usado para o ambiente de desenvolvimento.
*   **Autenticação:** **Clerk**. Um serviço externo que cuida de todo o processo de login (neste caso, com contas Google), segurança e gerenciamento de usuários.
*   **Estilização:** **Tailwind CSS**. Para criar a interface de forma rápida e customizável, com suporte a tema claro/escuro (`next-themes`).

### Funcionalidades Implementadas:

1.  **Autenticação de Usuários:**
    *   Usuários fazem login exclusivamente através de suas contas Google.
    *   Existe um sistema de permissão que diferencia um "Organizador" de um usuário comum, liberando acesso a funcionalidades administrativas.

2.  **Gestão de Eventos (para Organizadores):**
    *   Organizadores podem criar novos eventos, fornecendo nome, data e local.
    *   É possível editar eventos existentes e fazer o upload de uma imagem (banner) para cada um.

3.  **Geração de Convites (para Organizadores):**
    *   Para cada evento, um organizador pode gerar convites únicos.
    *   Cada convite é associado ao e-mail e a um apelido do destinatário.

4.  **Sistema de Promoters (para Organizadores):**
    *   Organizadores podem designar usuários específicos como "promoters" de um evento, pessoas autorizadas a gerar ingressos do evento.

5.  **Visualização de Ingressos (para Participantes):**
    *   Usuários logados podem ver uma lista com todos os seus ingressos/convites.
    *   Ao clicar em um ingresso, uma página de detalhe é exibida com um **QR Code** para o check-in.

6.  **Check-in de Ingressos (para Organizadores):**
    *   Há uma interface dedicada para que os organizadores validem os ingressos na entrada do evento. Eles podem buscar um convite pelo código e marcá-lo como "usado".

### Funcionalidades não implementadas

1.  **Dashboard de Estatísticas do Evento:**
    *   **O quê?** Uma nova seção será adicionada à área do organizador, apresentando um painel visual com estatísticas em tempo real sobre os ingressos do evento.
    *   **Benefício:** Os organizadores terão uma visão clara e imediata do desempenho do evento, incluindo o número total de ingressos gerados, quantos foram utilizados (check-in). 

2.  **Gestão Detalhada de Ingressos:**
    *   **O quê?** Será implementada uma interface completa para a gestão individual de cada ingresso. Isso incluirá a visualização de detalhes do convite (como nome do convidado, status de uso), a capacidade de buscar ingressos específicos e cancelamento de um ingresso.
    *   **Benefício:** Oferece ao organizador controle granular sobre cada convite, facilitando a resolução de problemas e a administração da lista de acesso.

3.  **Exportação da Lista de Ingressos (CSV):**
    *   **O quê?** Uma opção para exportar a lista completa de ingressos de um evento para um arquivo CSV (Comma Separated Values).
    *   **Benefício:** Permite que os organizadores utilizem os dados dos ingressos em outras ferramentas (planilhas, sistemas de CRM) para análises mais aprofundadas, backups ou comunicação externa.


### Intagrantes do projeto

*   **Artur Zahn** 13751211
*   **Thiago Ambiel** 13875101