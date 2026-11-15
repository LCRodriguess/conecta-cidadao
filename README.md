# Conecta Cidadão

Portal cívico municipal desenvolvido para aproximar o cidadão dos serviços públicos da sua cidade em um único ambiente simples, acessível e responsivo — atualmente configurado com dados de **Rio das Ostras (RJ)** e **Sapucaia do Sul (RS)**.

---

## Objetivo do Projeto

Em muitas cidades, os serviços públicos ficam espalhados em diferentes sites, telefones e atendimentos presenciais. O **Conecta Cidadão** centraliza as principais demandas do dia a dia do morador em um portal único, permitindo:

- **Zeladoria Urbana (156):** registrar problemas na rua (iluminação, buracos, limpeza, bueiros, poda, sinalização) com localização e foto comprimida automaticamente, além de acompanhar o andamento por protocolo.
- **Mapa Cívico Interativo:** localizar unidades públicas essenciais (UPAs, UBSs, hospitais, delegacias, bombeiros, defesa civil, ecopontos e órgãos municipais) com popup interativo, **Ver Fachada** (Street View) e **Traçar Rota** (Google Maps).
- **Saúde e Vacinação:** consultar unidades de saúde, campanhas de vacinação e agendamentos.
- **Mural e Calendário de Eventos:** explorar atividades culturais, esportivas, oficinas e eventos para famílias por cidade e data, com sincronização automática a partir dos portais municipais e publicação manual.
- **Balcão de Empregos:** consultar vagas disponíveis para a cidade selecionada.
- **Painel Administrativo Segmentado:** interface dedicada para equipes internas com três visões distintas:
  - **Admin TI / Infra:** status do servidor e banco PostgreSQL/Supabase, latência dos endpoints, memória JVM e logs de auditoria.
  - **Equipe de Zeladoria:** quadro Kanban de chamados 156 com prioridade automática, movimentação por arrastar e soltar (*drag-and-drop*), despacho técnico e visualização ampliada da foto enviada pelo cidadão.
  - **Equipe de Suporte:** quadro Kanban de chamados para atendimento e resposta às dúvidas dos cidadãos.

> **Nota:** Os perfis de login rápido e dados pessoais exibidos para demonstração são **fictícios**, criados exclusivamente para testes e apresentação acadêmica.

---

## Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (ES6+), Web Components (`app-navbar`, `app-footer`) e [Leaflet](https://leafletjs.com/) para o mapa interativo.
- **Backend:** Java 17, Spring Boot 4, Spring Data JPA, Spring Scheduling, Flyway Migrations e Maven Wrapper (`mvnw`).
- **Banco de Dados:** PostgreSQL (hospedado no Supabase), com versionamento de schema em `backend/src/main/resources/db/migration/` (`V1`, `V2`, `V3`).

---

## Como Iniciar o Projeto

### Pré-requisitos

- **Java 17+** instalado (`java -version`)
- Acesso a um banco **PostgreSQL / Supabase**
- Um servidor estático simples para o frontend (extensão **Live Server** no VS Code, `npx serve`, ou `python -m http.server`)

### 1. Configurar variáveis de ambiente do Backend

Copie o arquivo de exemplo `backend/.env.example` para `backend/.env` e preencha com as credenciais do seu banco PostgreSQL/Supabase:

```bash
cp backend/.env.example backend/.env
```

Conteúdo esperado em `backend/.env`:

```properties
SUPABASE_DB_URL=jdbc:postgresql://aws-0-sa-east-1.pooler.supabase.com:5432/postgres?sslmode=require
SUPABASE_DB_USER=postgres.seu_project_ref
SUPABASE_DB_PASSWORD=[PASSWORD]
```

*(O arquivo `.env` está listado no `.gitignore` e não é versionado.)*

> **Modo demonstração automático (H2):** se `backend/.env` não existir, estiver incompleto ou o Supabase estiver indisponível, o backend ativa automaticamente um banco **H2 em memória** (`MODE=PostgreSQL`) populado com exatamente o mesmo schema e dados iniciais (`classpath:db/h2`). Isso permite rodar e avaliar o sistema completo sem precisar configurar credenciais externas.

### 2. Iniciar o Backend (Spring Boot)

No terminal, entre na pasta `backend` e execute o Maven Wrapper:

**Windows (PowerShell):**
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

**Linux / macOS:**
```bash
cd backend
./mvnw spring-boot:run
```

O servidor iniciará em **`http://localhost:8080`**, aplicando automaticamente as migrations do Flyway (`V1__schema_inicial.sql`, `V2__seed_dados_iniciais.sql` e `V3__events_sync_fields.sql`).

### 3. Iniciar o Frontend

Na raiz do projeto (`Projeto ConectaCidadao`), sirva os arquivos estáticos em um navegador moderno (**Chrome** ou **Edge** recomendados para links externos como Street View e Google Maps):

- **Via VS Code:** clique com o botão direito em `index.html` (ou `frontend/mainPage.html`) e selecione **Open with Live Server**.
- **Via Node.js:**
  ```bash
  npx serve . -l 3000
  ```
- **Via Python:**
  ```bash
  python -m http.server 3000
  ```

Depois, acesse **`http://localhost:3000/frontend/mainPage.html`** (ou `http://localhost:3000/`).

---

## Estrutura Básica de Pastas

```text
Projeto ConectaCidadao/
├── index.html                  # Entrada / redirecionamento inicial
├── frontend/                   # Páginas da aplicação (mainPage, eventsPage, adminPage, etc.)
├── css/                        # Folhas de estilo por módulo e tema global
├── js/                         # Lógica de interface, mapa, Kanban, eventos e cityManager
└── backend/
    ├── pom.xml                 # Dependências Maven / Spring Boot
    ├── .env.example            # Modelo de variáveis de ambiente
    └── src/main/
        ├── java/...            # Controllers, Services, Entities e Repositories
        └── resources/
            ├── application.properties
            └── db/migration/   # Scripts SQL versionados (Flyway V1..V3)
```

---

## Testando os Perfis e Fluxos

- **Troca de cidade e perfil:** use o menu superior na barra preta para alternar entre perfis de demonstração ou acessar o **Painel Admin**.
- **Perfis Administrativos:** no **Painel Admin** (`frontend/adminPage.html`), utilize o seletor **Visão** (ou entre pelo login com um dos perfis internos) para explorar separadamente as áreas de **Admin TI / Infra**, **Equipe de Zeladoria** e **Equipe de Suporte**.


> **Prévia estática (GitHub Pages):** caso queira apenas visualizar a interface e a responsividade sem rodar um servidor local para o frontend, o projeto também está publicado no GitHub Pages em `https://lcrodriguess.github.io/conecta-cidadao/`.  
> *(Nota: por ser hospedagem estática e o backend rodar localmente em `http://localhost:8080`, as funcionalidades integradas à API e ao banco exigem que o backend Spring Boot esteja em execução na sua máquina.)*
