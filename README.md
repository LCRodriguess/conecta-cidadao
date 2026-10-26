# 🏛️ Conecta Cidadão

Projeto base para a plataforma **Conecta Cidadão**, estruturado em HTML, CSS e JavaScript puros (Vanilla), com arquitetura dividida em `backend`, `frontend` e `css`.

---

## 📁 Estrutura de Pastas

```text
Projeto ConectaCidadao/
├── backend/
│   ├── server.js              # Servidor HTTP Node.js (serve arquivos estáticos e mock API)
│   ├── package.json           # Scripts de inicialização
│   └── README.md              # Documentação do backend
├── css/
│   ├── global.css             # Design System, reset, variáveis, navbar, botões e footer
│   ├── mainPage.css           # Estilos específicos da página principal
│   ├── registerPage.css       # Estilos da página de cadastro
│   ├── loginPage.css          # Estilos da página de login
│   ├── worksPage.css          # Estilos da página de obras
│   ├── eventsPage.css         # Estilos da página de eventos
│   ├── recoveryPage.css       # Estilos da página de recuperação de senha
│   ├── invoicesPage.css       # Estilos da página de faturas e IPTU
│   ├── healthPage.css         # Estilos da página de saúde
│   ├── occurrencePage.css     # Estilos da página de ocorrências
│   └── requestsPage.css       # Estilos da página de solicitações
├── frontend/
│   ├── mainPage.html          # Início / Dashboard do Cidadão
│   ├── registerPage.html      # Cadastro de novo usuário
│   ├── loginPage.html         # Login / Acesso com Gov.br
│   ├── worksPage.html         # Acompanhamento de obras públicas
│   ├── eventsPage.html        # Agenda de eventos e campanhas
│   ├── recoveryPage.html      # Redefinição de senha
│   ├── invoicesPage.html      # 2ª via de IPTU e taxas
│   ├── healthPage.html        # Agendamento SUS e postos UBS
│   ├── occurrencePage.html    # Reportar buracos, iluminação, etc.
│   └── requestsPage.html      # Consulta de protocolos e andamento
├── js/
│   └── main.js                # Interatividade, feedback de formulários e navegação ativa
├── index.html                 # Ponto de entrada raiz (redireciona para frontend/mainPage.html)
└── README.md                  # Documentação geral
```

---

## 🚀 Como Executar o Projeto

Você tem duas formas muito simples para rodar:

### Opção 1: Abrir diretamente no Navegador
- Basta abrir o arquivo `index.html` ou qualquer arquivo dentro da pasta `frontend/` (por exemplo, com duplo clique ou usando extensões como *Live Server* no VS Code).

### Opção 2: Iniciar pelo Servidor Node.js (Backend)
No terminal, entre na pasta do backend e execute:

```bash
cd backend
npm start
```
Acesse no seu navegador:
👉 **[http://localhost:3000](http://localhost:3000)** (redireciona automaticamente para `mainPage.html`)

---

## 🎨 Características Implementadas
- **Identificação Visual em Todas as Páginas**: Cada página conta com o seu nome visível no título e no banner de identificação de página (`mainPage`, `registerPage`, etc.).
- **CSS Modular**: Cada página possui seu arquivo `.css` exclusivo na pasta `css/`, além do compartilhamento dos padrões globais via `global.css`.
- **Barra de Navegação Rápida**: Presente em todas as páginas para facilitar o trânsito entre as 10 telas durante o desenvolvimento.
