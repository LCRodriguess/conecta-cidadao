# Design Tokens & Component Blueprints (NYC.gov + Unimed Fusion)

Este documento detalha os tokens de design (CSS Custom Properties / Tailwind) e os padrões de componentes que materializam a fusão entre a **Beleza e Estratégia Visual do NYC.gov** e a **Estratégia de Comunicação Visual da Unimed**.

---

## 1. Paleta de Cores Híbrida (Civic Authority + Human Care)

A paleta combina a **autoridade cívica e nitidez de alto contraste de Nova York** com a **psicologia cromática de cuidado, saúde urbana e orientação visual da Unimed**:

```css
:root {
  /* === SUPERFÍCIES & ATMOSFERA (Inspiração NYC.gov) === */
  --bg-civic-gradient: linear-gradient(180deg, #E3EFFB 0%, #EFF5F8 45%, #F7EFE2 100%);
  --surface-white: #FFFFFF;
  --surface-frosted: rgba(255, 255, 255, 0.80);
  --surface-neutral-light: #F4F4F4;
  --surface-pitch-black: #000000;

  /* === CORES DE AÇÃO & AUTORIDADE CÍVICA (NYC.gov) === */
  --civic-royal-blue: #103FEF;        /* CTAs primários de serviço, links ativos e foco */
  --civic-royal-blue-hover: #0B2EC4;  /* Hover de alta resposta */

  /* === CORES DE COMUNICAÇÃO VISUAL, CUIDADO & PREVENÇÃO (Unimed) === */
  --care-emerald-green: #00995D;      /* Login do Cidadão, Status "Resolvido", Acesso Rápido e Ações Positivas */
  --care-deep-teal: #004E4C;          /* Fundo da seção editorial "Cidade Viva / Viver Bem" e overlays */
  --care-forest-dark: #00401A;        /* Texto de alto contraste sobre badges verde-lima */
  --care-lime-accent: #B1D34B;        /* Badges de destaque e CTAs dentro de fundos escuros (#004E4C) */
  --utility-alert-orange: #F47920;    /* Avisos operacionais, interdições, Defesa Civil e atenção */

  /* === TIPOGRAFIA & BORDAS === */
  --text-primary: #000000;            /* Títulos e textos principais em alto contraste (NYC) */
  --text-charcoal: #333333;           /* Corpo de texto editorial (Unimed) */
  --text-secondary: #5B5C65;          /* Subtítulos de Acesso Rápido e metadados */
  --border-subtle: rgba(0, 0, 0, 0.10);
  --border-strong: #000000;

  /* === GEOMETRIA & ELEVAÇÃO (Estética NYC.gov) === */
  --radius-card-sm: 12px;
  --radius-card-lg: 24px;
  --radius-pill: 9999px;              /* Botões em formato pílula (40px+ height) */
  --shadow-civic-card: 0 8px 24px rgba(16, 63, 239, 0.06), 0 2px 6px rgba(0, 0, 0, 0.04);
  --shadow-civic-hover: 0 12px 32px rgba(16, 63, 239, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08);
}
```

### Regra de Uso Semântico das Cores
- **Azul Royal Cívico (`#103FEF`)**: Usado para navegação global de serviços, botões primários de abertura de solicitação (*"Relatar Problema"*, *"Selecionar Data"*, *"Ver todos os serviços"*) e links de tarefas.
- **Verde Cuidado (`#00995D`)**: Usado para identificação do cidadão (*"Área do Cidadão / Login"*), confirmações, indicadores de ocorrências concluídas e faixa spotlight de busca local.
- **Verde Profundo (`#004E4C`) + Verde-Lima (`#B1D34B`)**: Exclusivo para a banda de comunicação preventiva, qualidade de vida urbana e campanhas comunitárias.
- **Laranja Utilidade (`#F47920`)**: Usado para avisos de manutenção programada, substituição de rotas/serviços, alertas meteorológicos e cards de prevenção a fraudes.
- **Preto Puro (`#000000`)**: Usado no Header Global, no Rodapé e nos painéis expandidos do acordeão de programas municipais para garantir contraste máximo e sobriedade moderna.

---

## 2. Tipografia e Escala Visual

Combina a personalidade neo-grotesca de sinalização urbana de Nova York com a clareza acolhedora de leitura da Unimed:

- **Família de Títulos (`--font-display`)**: `'Clash Grotesk'`, `'Plus Jakarta Sans'`, ou `'Space Grotesk'`, sans-serif.
  - **H1 (Hero Principal)**: `clamp(2.25rem, 4vw, 3.5rem)` (`36px` a `56px`), `font-weight: 600`, `line-height: 1.08`, `letter-spacing: -0.02em`.
  - **H2 (Títulos de Seção)**: `clamp(1.75rem, 2.5vw, 2.25rem)` (`28px` a `36px`), `font-weight: 600`, `line-height: 1.15`.
  - **H3 (Títulos de Módulos/Cards)**: `1.375rem` a `1.5rem` (`22px` a `24px`), `font-weight: 600`.
- **Família de Corpo e Controles (`--font-sans`)**: `'Noto Sans'`, `'Inter'`, ou `'Plus Jakarta Sans'`, sans-serif.
  - **Corpo Base**: `1.125rem` (`18px`), `font-weight: 400` ou `500`, `line-height: 1.55` (garante leitura fácil para todas as faixas etárias).
  - **Botões Pílula (CTAs)**: `1.125rem` a `1.25rem` (`18px` a `20px`), `font-weight: 600`, `min-height: 48px`, `padding: 12px 24px`.
  - **Microcopy de "Acesso Rápido"**: Título em `16px` (`700`) + Subtítulo explicativo em `13px–14px` (`400`, cor `#5B5C65`).

---

## 3. Anatomia dos Componentes-Chave

### A. Header Híbrido (Minimalismo NYC + Acesso Rápido Unimed)
1. **Top Trust Strip (Inspirado no `.gov` de NYC)**:
   - Fundo escuro ou sutil com o selo: `🏛️ Portal Oficial ConectaCidadão — Um serviço público verificável [Saiba como identificar ⌄]`.
2. **Barra Principal (`height: 76px`, fundo `#000000` ou `#FFFFFF` com borda forte)**:
   - **Esquerda**: Logo forte + 3 links essenciais (`Serviços`, `Mapa de Ocorrências`, `Transparência`).
   - **Direita (Estratégia Unimed + NYC)**:
     - Link direto com ícone: `📍 PERTO DE MIM` (abre mapa/filtro geográfico).
     - Gatilho **`ACESSO RÁPIDO ⌄`**: Abre um painel estruturado com 6 atalhos compostos por **Ícone + Título em Negrito + Subtítulo curto** (ex: *1. Nova Ocorrência — Relate buracos, iluminação ou limpeza; 2. Consultar Protocolo — Veja o andamento pelo número; 3. Mapa do Bairro — Ocorrências ativas na sua região; 4. Telefones de Emergência — 190, 192, 193 e Defesa Civil; 5. Ouvidoria Municipal — Elogios, sugestões e denúncias; 6. Perguntas Frequentes — Tire suas dúvidas*).
     - Botão Pílula `🔍 Buscar` (abre busca global ou foca no input).
     - Botão Pílula `Área do Cidadão` em Verde Cuidado (`#00995D`).

### B. Split Functional Hero + Widget "Status da Cidade Hoje"
Em vez de um banner meramente decorativo:
- **Lado Esquerdo (55% da largura)**:
  - Tag de boas-vindas acolhedora (Tom Unimed): *"Cuidar da nossa cidade começa por ouvir você."*
  - `H1` direto (Estilo NYC): *"O que você precisa resolver hoje?"*
  - Barra de busca em formato pílula com sugestões rápidas clicáveis abaixo (*"Iluminação pública"*, *"Tapa-buraco"*, *"Coleta de entulho"*).
- **Lado Direito (45% da largura) — Card "Status Diário do Município" (`region="status diário"`)**:
  - Card branco arredondado (`border-radius: 24px`) com cabeçalho mostrando a data atual + botão pílula azul `📅 Alterar data`.
  - Lista de 4 indicadores operacionais clicáveis (com drill-down interno sem recarregar a página):
    1. 🚛 **Coleta de Lixo e Reciclagem** → Badge: `Operação Normal` (`#00995D`)
    2. 🚧 **Obras e Interdições de Vias** → Badge: `3 avisos ativos` (`#F47920`)
    3. ⛈️ **Defesa Civil e Alerta Climático** → Badge: `Sem alertas`
    4. 🏥 **Plantão de Saúde e Atendimento** → Badge: `UPAs abertas 24h`

### C. Faixa Spotlight de Autoatendimento (Inspiração "Guia Médico" Unimed)
Logo abaixo do Hero, uma barra horizontal (`border-radius: 20px`, fundo branco com borda destacada ou verde suave):
- **Título + Subtítulo**: *"Busca Rápida por Bairro — Veja o que já está sendo resolvido na sua rua antes de abrir um chamado."*
- **Controles Inline**: Select de `Bairro/Região` + Select de `Categoria` + Botão Pílula `Consultar Agora` (`#00995D`).

### D. Grid "Serviços Mais Buscados" (8 Action Tiles — NYC)
- Grid responsivo (`grid-template-columns: repeat(auto-fit, minmax(260px, 1fr))`).
- 8 cards em `rgba(255, 255, 255, 0.85)` com `backdrop-filter: blur(8px)`, `border-radius: 16px`, `padding: 20px 24px`.
- Escritos **100% na linguagem do cidadão**:
  1. *Buraco ou asfalto danificado*
  2. *Lâmpada queimada ou rua escura*
  3. *Descarte irregular de lixo ou entulho*
  4. *Poda de árvore ou risco de queda*
  5. *Vazamento de água ou esgoto*
  6. *Barulho ou perturbação do sossego*
  7. *Limpeza de bueiro ou alagamento*
  8. *Sinalização ou semáforo com defeito*
- No hover: borda assume `--civic-royal-blue` (`#103FEF`), leve elevação `translateY(-2px)` e seta `→` avança `4px`.

### E. Módulo Dedicado de Zeladoria ("Estilo 311" para ConectaCidadão)
- Card de largura total com layout em 2 colunas (texto/ação à esquerda + ilustração/foto humanizada de agentes trabalhando na cidade à direita).
- **Copywriting**:
  - Título: *"Central ConectaCidadão — Zeladoria Urbana"*
  - Descrição: *"Relate problemas que não são emergências policiais ou médicas — como conservação de ruas, iluminação e limpeza. Você também pode enviar fotos, complementar informações e acompanhar cada etapa da solução."*
- **Dupla Ação Obrigatória (Botões Pílula `border-radius: 9999px`)**:
  - Botão 1 (Sólido `#103FEF` texto branco): `Registrar problema`
  - Botão 2 (Fundo branco, borda `2px solid #000000`, texto preto): `Consultar protocolo`

### F. Seção Editorial "Cidade Viva / Cuidar de Todos" (Inspiração "Viver Bem" Unimed)
- Seção full-bleed com fundo `--care-deep-teal` (`#004E4C`).
- Cabeçalho em branco com subtítulo acolhedor sobre prevenção, saúde comunitária e cidadania.
- Grid de 4 cards brancos com imagem superior, tag de categoria, título humano e botão CTA em **Verde-Lima (`#B1D34B`) com texto escuro (`#00401A`)** (`LEIA MAIS` / `SAIBA COMO PARTICIPAR`).

### G. Tríade de Utilidade Pública e Prevenção a Fraudes (Inspiração Unimed)
- Linha de 3 cards informativos antes do rodapé:
  1. **Segurança Digital**: *"Dúvida na mensagem? Melhor checar. A Prefeitura nunca pede senhas ou pagamentos via PIX por WhatsApp para agilizar serviços."* → Link: `Verificar canais oficiais`.
  2. **Transparência & Prestação de Contas**: *"Acompanhe os indicadores de resolução do seu bairro: 84% das ocorrências atendidas no prazo este mês."* → Link: `Ver painel de dados`.
  3. **Avisos Operacionais (Carrossel/Card Laranja `#F47920`)**: *"Mudanças temporárias de trânsito e cronograma de manutenção preventiva da semana."* → Link: `Consultar avisos`.

