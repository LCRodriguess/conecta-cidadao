---
name: govtech-civic-design
description: >-
  Cria designs, interfaces (UI/UX), páginas, componentes e sistemas visuais para
  sites e portais de órgãos públicos, prefeituras, zeladoria urbana e GovTech
  (incluindo o projeto ConectaCidadão). Combina a Beleza e Estratégia Visual do
  portal NYC.gov (layout contemporâneo, alto contraste, hero funcional com status
  diário, arquitetura orientada a tarefas do cidadão e módulo estilo 311) com a
  Estratégia de Comunicação Visual da Unimed (tom acolhedor e humano, menu de
  Acesso Rápido com subtítulos, seções editoriais de qualidade de vida/prevenção,
  alertas antifraude/utilidade pública e acessibilidade em Libras). Use esta
  skill sempre que o usuário pedir para criar, estilizar, prototipar ou refatorar
  telas, páginas, landing pages ou componentes frontend voltados ao cidadão ou à
  gestão pública.
---

# GovTech Civic Design System (NYC.gov Visual Strategy + Unimed Visual Communication)

Esta skill define a diretriz oficial de **UI/UX e Comunicação Visual para Portais Públicos e Cívicos (GovTech)**, projetada especificamente para ser reutilizada no **ConectaCidadão** e em sistemas de órgãos públicos.

## 1. Filosofia Central da Fusão (O "Mix" de Design)

Toda interface criada com esta skill deve equilibrar duas forças complementares:

1. **Beleza, Estrutura e Estratégia Visual (`NYC.gov`)**:
   - **Design System Cívico Contemporâneo**: Layout limpo, cantos arredondados generosos (`8px` a `24px` em cards, `40px` em botões pílula), amplo respiro visual (whitespace) e fundo em gradiente atmosférico suave (`#E3EFFB` azul-celeste no topo transicionando para `#F7EFE2` areia/bege suave, com cards brancos puros `#FFFFFF` ou translúcidos `rgba(255, 255, 255, 0.78)`).
   - **Arquitetura Orientada a Tarefas (Task-First)**: O cidadão nunca precisa conhecer o organograma da prefeitura ou siglas de secretarias para resolver um problema. Serviços são apresentados em linguagem simples (*"Buraco na rua"*, *"Falta de iluminação"*, *"Coleta de entulho"*, *"Barulho excessivo"*).
   - **Hero Funcional Dividido (Split Functional Hero)**: Zero carrosséis puramente publicitários empurrando o conteúdo útil para baixo. O topo divide-se entre a chamada principal/busca à esquerda e um **Widget Interativo de Status Diário da Cidade / Zeladoria** à direita.
   - **Módulo Central de Zeladoria ("Estilo 311")**: Destaque explícito para abertura e acompanhamento de ocorrências com dupla ação lado a lado: CTA primário sólido (*Relatar Problema / Nova Ocorrência*) + CTA secundário contornado (*Consultar Protocolo / Acompanhar*).

2. **Estratégia de Comunicação Visual e Acolhimento (`Unimed`)**:
   - **Humanização do Serviço Público**: O órgão público não se comunica com frieza burocrática, mas como uma cooperativa de cuidado urbano e cidadania. Fotografias reais de pessoas e agentes públicos, microcopy empático e hierarquia visual acolhedora.
   - **Gatilhos de Autoatendimento Imediato (`ACESSO RÁPIDO`)**: No cabeçalho, além da navegação enxuta, há um gatilho direto de localização (`📍 MAPA DE OCORRÊNCIAS` ou `📍 SERVIÇOS PERTO DE VOCÊ`) e um mega-dropdown **`ACESSO RÁPIDO ⌄`** contendo as 6 tarefas mais críticas com **Título + Subtítulo curto explicativo**.
   - **Faixa Spotlight Acima/Abaixo da Dobra**: Uma barra horizontal de ação direta logo após o Hero (inspirada na faixa do *Guia Médico*) para busca ou filtragem imediata de serviços/ocorrências por bairro ou categoria.
   - **Comunicação Editorial de Qualidade de Vida ("Cidade Viva / Viver Bem")**: Seção em fundo escuro profundo (`#004E4C` ou `#0A192F`) que cria forte contraste visual com cards brancos e badges de destaque em verde-lima (`#B1D34B`), voltada a campanhas sazonais de saúde, defesa civil, educação ambiental e bem-estar comunitário.
   - **Tríade de Utilidade Pública, Transparência e Prevenção a Golpes**: Faixa de 3 cards utilitários combinando: (1) Educação Cidadã/Programas, (2) **Segurança e Checagem Antifraude** (*"Dúvida na mensagem? Melhor checar — Como identificar comunicados oficiais"*), e (3) **Avisos Operacionais/Substituições** (interdições de vias, mudanças de horário de atendimento, relatórios de transparência).
   - **Acessibilidade Visível e Selos de Confiança**: Presença clara de recursos assistivos (tradutor Libras, alto contraste), links para App Mobile e selos oficiais (Transparência, Ouvidoria, LGPD).

---

## 2. Passo a Passo para Criar ou Refatorar Interfaces

Sempre que construir uma página ou componente seguindo esta skill:

### Passo 1: Carregar Tokens Visuais e Componentes de Referência
Consulte o guia detalhado de tokens CSS, paleta de cores híbrida, tipografia e anatomia de componentes em:
- [design-tokens-and-components.md](./references/design-tokens-and-components.md)

### Passo 2: Estruturar a Anatomia Vertical da Página (Ordem Recomendada)
Para portais principais, homepages de prefeituras ou dashboards públicos do **ConectaCidadão**, siga este ritmo vertical validado:

1. **Top Trust & Utility Bar + Global Header (Fusão NYC + Unimed)**:
   - Barra superior de verificação oficial (`"Portal Oficial do Município ⌄ — Como verificar"`).
   - Navegação principal enxuta (máximo de 3 a 4 links: `Serviços`, `Mapa da Cidade`, `Transparência`) + Gatilho `📍 PERTO DE VOCÊ` + Dropdown **`ACESSO RÁPIDO ⌄`** + Botão pílula de `🔍 Busca` e CTA primário `Entrar / Cidadão`.
2. **Split Functional Hero (Estratégia Visual NYC)**:
   - **Coluna Esquerda**: Título de alto impacto em fonte neo-grotesca (`Clash Grotesk` / `Plus Jakarta Sans`), subtítulo acolhedor (tom Unimed) e barra de busca rápida por palavra-chave ou protocolo.
   - **Coluna Direita**: **Card Interativo "Status da Cidade Hoje"** (Data selecionável + status em tempo real de *Coleta de Lixo*, *Obras/Trânsito*, *Defesa Civil/Clima* e *Unidades de Saúde/Escolas* com badges de status).
3. **Spotlight Action Strip (Comunicação Visual Unimed)**:
   - Faixa de destaque horizontal logo abaixo do Hero: *"Encontre ou registre ocorrências no seu bairro em segundos"* com seletor rápido de categoria + botão pílula `Consultar Agora`.
4. **Grid "Serviços Mais Buscados" (8 Cards Task-First — NYC)**:
   - Grid de 4 colunas × 2 linhas no desktop com superfícies translúcidas (`rgba(255,255,255,0.82)`), ícone semântico, texto na linguagem do cidadão e chevron `>` à direita.
5. **Módulo Destaque de Zeladoria / ConectaCidadão ("Estilo 311" — NYC)**:
   - Card amplo de alto impacto focado em resolução de problemas urbanos não-emergenciais, apresentando dois botões pílula lado a lado:
     - Primário: `Registrar Ocorrência` (Sólido)
     - Secundário: `Acompanhar Protocolo` (Contornado)
6. **Seção Editorial & Preventiva "Cidade Viva / Cuidar de Todos" (Comunicação Unimed)**:
   - Banda de largura total com fundo profundo (`#004E4C` Teal Cívico), cards brancos arredondados e CTAs em verde-lima (`#B1D34B` com texto `#00401A`) para campanhas sazonais (ex: *Combate à Dengue*, *Vacinação*, *Defesa Civil nas Chuvas*).
7. **Acordeão Interativo "Novos Programas & Ações" (NYC) + Tríade de Utilidade Pública & Antifraude (Unimed)**:
   - Destaque para programas sociais/municipais respondendo *"O que está acontecendo?"* e *"Para quem é?"*, seguido pela faixa de 3 banners utilitários (Prevenção a Golpes/Fake News, Avisos de Interdições/Serviços e Participação Cidadã).
8. **Rodapé Enxuto de Alto Contraste + Barra de Confiança Cívica**:
   - Fundo preto (`#000000`) ou carvão profundo (`#111827`) com 3 a 4 colunas enxutas de links essenciais + barra inferior com selos de Ouvidoria, Portal da Transparência, LGPD e botões da App Store / Google Play.

---

## 3. Checklist de Validação (Auto-Auditoria antes de entregar)

Antes de concluir qualquer entrega visual com esta skill, verifique:
- [ ] **Linguagem Simples (Plain Language)**: Os nomes nos botões e cards usam termos do cotidiano do cidadão em vez de jargão burocrático?
- [ ] **Estética NYC Aplicada**: Há botões em formato pílula (`border-radius: 40px`), contraste nítido, tipografia expressiva nos títulos (`Clash Grotesk` / `Plus Jakarta Sans`) + `Noto Sans`/`Inter` no corpo (`>= 16px–18px`), e fundo com gradiente suave ou superfícies bem demarcadas?
- [ ] **Comunicação Unimed Aplicada**: O tom textual é humano e acolhedor? Existe acesso rápido desmembrado com título + subtítulo, seção de prevenção/bem-estar e card de segurança/utilidade pública?
- [ ] **Dupla Ação de Zeladoria (311)**: Os fluxos de *Abrir Ocorrência* e *Consultar Protocolo* estão imediatamente visíveis e lado a lado?
- [ ] **Acessibilidade (WCAG AA/AAA)**: Alvos de clique têm no mínimo `48px` de altura, contraste de cores é seguro e existem atributos semânticos (`aria-live`, `role`, skip-links e suporte visual a acessibilidade/Libras)?

