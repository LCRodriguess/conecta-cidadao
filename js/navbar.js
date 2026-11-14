class AppNavbar extends HTMLElement {
  connectedCallback() {
    const currentPath = (window.location.pathname || '').replace(/\\/g, '/').toLowerCase();
    const filename = currentPath.substring(currentPath.lastIndexOf('/') + 1);

    const isInicio = filename === 'mainpage.html' || filename === 'index.html' || filename === '';
    const isServicos = ['healthpage', 'invoicespage', 'occurrencepage', 'workspage', 'eventspage'].some(page => currentPath.includes(page));
    const isSolicitacoes = currentPath.includes('requestspage');
    const isMinhaConta = currentPath.includes('accountpage') || currentPath.includes('loginpage') || currentPath.includes('registerpage');

    const activeCitizen = (typeof getActiveCitizen === 'function')
      ? getActiveCitizen()
      : {
          id: 'cit-ro-01',
          name: 'Mariana Costa Almeida',
          cpf: '142.890.517-34',
          cityKey: 'rio-das-ostras',
          enrollment: 'RO-2026-9812',
          avatarInitials: 'MA'
        };

    const allCitizens = (typeof getAllCitizens === 'function') ? getAllCitizens() : [activeCitizen];
    const firstName = activeCitizen.name.split(' ').slice(0, 2).join(' ');
    const cityShort = activeCitizen.cityKey === 'sapucaia' ? 'Sapucaia do Sul' : 'Rio das Ostras';

    this.innerHTML = `
      <!-- FAIXA SUPERIOR DE CONFIANÇA OFICIAL (Inspiração NYC.gov + Simulador de Dados Reais) -->
      <div class="civic-trust-bar">
        <div class="civic-trust-container">
          <div class="civic-trust-left">
            <span class="civic-flag-badge" aria-hidden="true">GOV</span>
            <span class="civic-trust-text">Portal Oficial Municipal · <strong>ConectaCidadão</strong></span>
            <button type="button" class="civic-verify-btn" id="civic-verify-toggle" aria-expanded="false">
              <span>Como verificar</span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>

          <!-- Seletor de Cidadão Simulado (Consumo de Dados Reais) -->
          <div class="civic-trust-right">
            <div class="citizen-switcher-wrapper" id="citizen-switcher-wrapper">
              <button type="button" class="citizen-switcher-btn" id="citizen-switcher-toggle" title="Alternar pessoa real simulada para testar dados de CPF, SUS, IPTU e protocolos">
                <span class="live-citizen-dot"></span>
                <span class="citizen-switcher-label">Cidadão ativo: <strong id="trust-citizen-name">${firstName}</strong> (${activeCitizen.cpf})</span>
                <span class="citizen-switcher-Action">Trocar perfil ⌵</span>
              </button>

              <div class="citizen-switcher-menu" id="citizen-switcher-menu">
                <div class="citizen-menu-header">
                  <strong>Simulador de Dados Reais de Pessoas</strong>
                  <span>Selecione um cidadão para carregar CPF, SUS, IPTU e protocolos reais:</span>
                </div>
                <div class="citizen-menu-list" id="citizen-menu-list">
                  ${allCitizens.map(cit => {
                    const isCurrent = cit.id === activeCitizen.id;
                    const citCity = cit.cityKey === 'sapucaia' ? 'Sapucaia do Sul · RS' : 'Rio das Ostras · RJ';
                    return `
                      <button type="button" class="citizen-option-item ${isCurrent ? 'active' : ''}" data-citizen-id="${cit.id}">
                        <div class="cit-opt-avatar">${cit.avatarInitials || 'CC'}</div>
                        <div class="cit-opt-info">
                          <strong>${cit.name}</strong>
                          <span>CPF: ${cit.cpf} · ${citCity}</span>
                          <small>Matrícula: ${cit.enrollment} · SUS: ${cit.susCard.slice(0, 11)}...</small>
                        </div>
                        ${isCurrent ? '<span class="cit-opt-active-tag">Ativo</span>' : ''}
                      </button>
                    `;
                  }).join('')}
                </div>
                <div class="citizen-menu-footer">
                  <a href="loginPage.html" class="cit-footer-link login-link">Entrar com outra conta</a>
                  <a href="registerPage.html" class="cit-footer-link register-link">+ Cadastrar nova pessoa</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Painel Expansível "Como Verificar" (Estilo NYC.gov Official Website) -->
        <div class="civic-verify-drawer" id="civic-verify-drawer" hidden>
          <div class="civic-verify-grid">
            <div class="verify-item">
              <div class="verify-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="3" y1="22" x2="21" y2="22"/>
                  <line x1="6" y1="18" x2="6" y2="11"/>
                  <line x1="10" y1="18" x2="10" y2="11"/>
                  <line x1="14" y1="18" x2="14" y2="11"/>
                  <line x1="18" y1="18" x2="18" y2="11"/>
                  <polygon points="12 2 20 7 4 7"/>
                </svg>
              </div>
              <div>
                <strong>Canais Oficiais nunca pedem senha ou Pix por WhatsApp</strong>
                <p>Guias de IPTU/ISS e protocolos de zeladoria são gerados exclusivamente dentro deste ambiente oficial verificado.</p>
              </div>
            </div>
            <div class="verify-item">
              <div class="verify-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <div>
                <strong>Conexão Criptografada e Proteção LGPD (Lei 13.709/2018)</strong>
                <p>Seus dados de CPF, Cartão SUS e endereço são utilizados apenas para vincular seus serviços públicos municipais.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- BARRA DE NAVEGAÇÃO PRINCIPAL (Fusão NYC.gov + Unimed) -->
      <nav class="topbar" aria-label="Navegação Principal">
        <div class="topbar-container">
          <!-- 1. Marca / Logo -->
          <a href="mainPage.html" class="topbar-brand" title="Conecta Cidadão - Página Inicial">
            <div class="brand-logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="2" />
                <rect x="14" y="3" width="7" height="7" rx="2" />
                <rect x="3" y="14" width="7" height="7" rx="2" />
                <rect x="14" y="14" width="7" height="7" rx="2" />
              </svg>
            </div>
            <div class="brand-text">
              <span class="brand-name">conecta cidadão</span>
              <span class="brand-sub">Portal Cívico Municipal</span>
            </div>
          </a>

          <!-- 2. Navegação Central Enxuta (NYC.gov Task-First) -->
          <div class="topbar-nav" id="topbar-nav">
            <span class="nav-indicator" id="nav-indicator" aria-hidden="true"></span>

            <!-- Início -->
            <a href="mainPage.html" class="nav-item ${isInicio ? 'active' : ''}" id="nav-inicio">
              <div class="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 10.2L12 3l9 7.2V20a1.8 1.8 0 0 1-1.8 1.8H4.8A1.8 1.8 0 0 1 3 20V10.2z"/>
                  <path d="M9 21.8V12h6v9.8"/>
                </svg>
              </div>
              <span class="nav-label">Início</span>
            </a>

            <!-- Serviços (Dropdown com Linguagem Simples) -->
            <div class="nav-dropdown-wrapper" id="servicos-dropdown-wrapper">
              <button type="button" class="nav-item nav-servicos-btn ${isServicos ? 'active' : ''}" id="servicos-toggle" aria-expanded="false" aria-haspopup="true">
                <div class="nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1.5"/>
                    <rect x="14" y="3" width="7" height="7" rx="1.5"/>
                    <rect x="14" y="14" width="7" height="7" rx="1.5"/>
                    <rect x="3" y="14" width="7" height="7" rx="1.5"/>
                  </svg>
                </div>
                <div class="nav-label-with-chevron">
                  <span class="nav-label">Serviços</span>
                  <svg class="chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </button>

              <div class="nav-dropdown-menu" id="servicos-menu">
                <div class="dropdown-section">
                  <span class="dropdown-section-title">Serviços do dia a dia (Linguagem Cidadã)</span>
                  <div class="dropdown-plain-list">
                    <a href="occurrencePage.html" class="dropdown-row ${currentPath.includes('occurrencepage') ? 'active' : ''}">
                      <div class="dropdown-row-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s2.5-2.14 4.5-4.88"/>
                          <circle cx="12" cy="10" r="3"/>
                          <line x1="19" y1="13" x2="19" y2="19"/>
                          <line x1="16" y1="16" x2="22" y2="16"/>
                        </svg>
                      </div>
                      <div class="dropdown-row-content">
                        <strong class="dropdown-row-title">Relatar problema na rua (Zeladoria 156)</strong>
                        <span class="dropdown-row-desc">Buracos, lâmpada apagada, entulho, poda ou bueiro.</span>
                      </div>
                      <svg class="dropdown-row-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </a>

                    <a href="requestsPage.html" class="dropdown-row ${currentPath.includes('requestspage') ? 'active' : ''}">
                      <div class="dropdown-row-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                          <rect x="8" y="2" width="8" height="4" rx="1"/>
                          <line x1="9" y1="11" x2="15" y2="11"/>
                          <line x1="9" y1="15" x2="15" y2="15"/>
                        </svg>
                      </div>
                      <div class="dropdown-row-content">
                        <strong class="dropdown-row-title">Consultar protocolos abertos</strong>
                        <span class="dropdown-row-desc">Acompanhe etapas e envie fotos complementares.</span>
                      </div>
                      <svg class="dropdown-row-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </a>

                    <a href="healthPage.html" class="dropdown-row ${currentPath.includes('healthpage') ? 'active' : ''}">
                      <div class="dropdown-row-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l.77.78L12 20.66l7.65-7.65.77-.78a5.4 5.4 0 0 0 0-7.65z"/>
                          <path d="M3.5 12h3.5l2-3 3 6 2-3h4.5"/>
                        </svg>
                      </div>
                      <div class="dropdown-row-content">
                        <strong class="dropdown-row-title">Saúde, Consultas e Vacinação</strong>
                        <span class="dropdown-row-desc">Agendamentos SUS, UBS abertas e campanhas.</span>
                      </div>
                      <svg class="dropdown-row-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </a>

                    <a href="invoicesPage.html" class="dropdown-row ${currentPath.includes('invoicespage') ? 'active' : ''}">
                      <div class="dropdown-row-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/>
                          <line x1="8" y1="7" x2="16" y2="7"/>
                          <line x1="8" y1="11" x2="16" y2="11"/>
                        </svg>
                      </div>
                      <div class="dropdown-row-content">
                        <strong class="dropdown-row-title">IPTU, ISS e Certidões (2ª Via Pix)</strong>
                        <span class="dropdown-row-desc">Emita guia DAM em PDF ou pague com QR Code Pix.</span>
                      </div>
                      <svg class="dropdown-row-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </a>
                  </div>
                </div>

                <div class="dropdown-section">
                  <span class="dropdown-section-title">Desenvolvimento, Cultura & Lazer</span>
                  <div class="dropdown-blue-card">
                    <a href="worksPage.html" class="dropdown-row ${currentPath.includes('workspage') ? 'active' : ''}">
                      <div class="dropdown-row-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                        </svg>
                      </div>
                      <div class="dropdown-row-content">
                        <strong class="dropdown-row-title">Balcão de Empregos & Qualificação</strong>
                        <span class="dropdown-row-desc">Vagas abertas no município e cursos gratuitos.</span>
                      </div>
                      <svg class="dropdown-row-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </a>

                    <a href="eventsPage.html" class="dropdown-row ${currentPath.includes('eventspage') ? 'active' : ''}">
                      <div class="dropdown-row-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                      </div>
                      <div class="dropdown-row-content">
                        <strong class="dropdown-row-title">Agenda Cultural & Eventos Gratuitos</strong>
                        <span class="dropdown-row-desc">Feiras, esportes, shows e oficinas para a família.</span>
                      </div>
                      <svg class="dropdown-row-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </a>
                  </div>
                </div>

                <div class="dropdown-footer">
                  <button type="button" class="dropdown-footer-btn" id="btn-acessibilidade" title="Alternar Alto Contraste">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 2a10 10 0 0 1 0 20z" fill="currentColor"/>
                    </svg>
                    <span>Alto Contraste</span>
                  </button>

                  <button type="button" class="dropdown-footer-btn" id="btn-privacidade" title="Políticas de Privacidade e LGPD">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <span>Privacidade LGPD</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Solicitações -->
            <a href="requestsPage.html" class="nav-item ${isSolicitacoes ? 'active' : ''}" id="nav-solicitacoes">
              <div class="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                  <rect x="8" y="2" width="8" height="4" rx="1"/>
                  <path d="M10 11h4"/>
                  <path d="M10 15h4"/>
                </svg>
              </div>
              <span class="nav-label">Solicitações</span>
            </a>

            <!-- Minha Conta -->
            <a href="accountPage.html" class="nav-item ${isMinhaConta ? 'active' : ''}" id="nav-conta">
              <div class="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="9"/>
                  <circle cx="12" cy="9.5" r="3.2"/>
                  <path d="M6.8 18.2a5.5 5.5 0 0 1 10.4 0"/>
                </svg>
              </div>
              <span class="nav-label">Minha conta</span>
            </a>
          </div>

          <!-- 3. Lado Direito: Gatilho ACESSO RÁPIDO (Unimed) + Avisos + Botão Cidadão (#00995D) -->
          <div class="topbar-right-cluster">
            <!-- Gatilho ACESSO RÁPIDO (Estratégia de Comunicação Visual Unimed) -->
            <div class="quick-access-wrapper" id="quick-access-wrapper">
              <button type="button" class="btn-quick-access-trigger" id="quick-access-toggle" aria-expanded="false">
                <span>ACESSO RÁPIDO</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              <div class="quick-access-drawer" id="quick-access-drawer">
                <div class="qa-drawer-header">
                  <strong>Autoatendimento Rápido</strong>
                  <span>Resolva sem filas — selecione o serviço desejado:</span>
                </div>
                <div class="qa-drawer-grid">
                  <a href="invoicesPage.html" class="qa-drawer-item">
                    <strong>2ª Via de IPTU e Pix</strong>
                    <span>Emita boleto DAM ou pague com QR Code</span>
                  </a>
                  <a href="occurrencePage.html" class="qa-drawer-item">
                    <strong>Relatar Problema (156)</strong>
                    <span>Buraco, iluminação, limpeza ou esgoto</span>
                  </a>
                  <a href="healthPage.html" class="qa-drawer-item">
                    <strong>Guia de Saúde & UBS</strong>
                    <span>Encontre médicos, postos e vacinas perto de você</span>
                  </a>
                  <a href="requestsPage.html" class="qa-drawer-item">
                    <strong>Consultar Protocolo</strong>
                    <span>Veja em qual etapa está sua solicitação</span>
                  </a>
                  <a href="worksPage.html" class="qa-drawer-item">
                    <strong>Trabalhe na Cidade</strong>
                    <span>Vagas do Balcão de Empregos Municipal</span>
                  </a>
                  <a href="accountPage.html" class="qa-drawer-item">
                    <strong>Meu Cadastro Cidadão</strong>
                    <span>Atualize CPF, Cartão SUS e notificações</span>
                  </a>
                </div>
              </div>
            </div>

            <!-- Sino de Avisos -->
            <div class="topbar-alerts-wrapper" id="alerts-wrapper">
              <button type="button" class="nav-item nav-alert-btn" id="alerts-toggle" title="Avisos e atualizações do seu CPF">
                <div class="nav-bell-container">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                  <span class="nav-bell-badge" id="alerts-badge">2</span>
                </div>
              </button>

              <div class="nav-alerts-menu" id="alerts-menu">
                <div class="alerts-menu-header">
                  <strong>Notificações de ${firstName}</strong>
                  <span class="alerts-unread-tag">2 novas</span>
                </div>
                <div class="alerts-menu-list">
                  <div class="alert-item unread">
                    <div class="alert-dot"></div>
                    <div class="alert-content">
                      <p class="alert-title">Protocolo ${activeCitizen.activeRequest?.protocol || 'SIM-2026-0042'}</p>
                      <p class="alert-desc">${activeCitizen.activeRequest?.updateText || 'Sua solicitação recebeu nova atualização da equipe técnica.'}</p>
                      <span class="alert-time">Vinculado ao CPF ${activeCitizen.cpf}</span>
                    </div>
                  </div>
                  <div class="alert-item unread" style="margin-top: 8px;">
                    <div class="alert-dot"></div>
                    <div class="alert-content">
                      <p class="alert-title">Agendamento SUS Confirmado</p>
                      <p class="alert-desc">${activeCitizen.appointment?.title || 'Consulta Médica'} · ${activeCitizen.appointment?.time || '09h30'}.</p>
                      <span class="alert-time">${activeCitizen.appointment?.place || cityShort}</span>
                    </div>
                  </div>
                </div>
                <div class="alerts-menu-footer">
                  <button type="button" class="btn-clear-alerts" id="btn-mark-alerts-read">Marcar como lido</button>
                </div>
              </div>
            </div>

            <!-- Botão Pílula Verde Cuidado (Unimed #00995D) — Área do Cidadão / Login -->
            <a href="loginPage.html" class="btn-citizen-pill" title="Acessar Login, Trocar Conta ou Cadastrar Cidadão">
              <span class="citizen-pill-avatar" id="nav-citizen-avatar">${activeCitizen.avatarInitials || 'MA'}</span>
              <div class="citizen-pill-meta">
                <strong id="nav-citizen-name">${firstName}</strong>
                <span id="nav-citizen-sub">${cityShort} · Trocar</span>
              </div>
            </a>
          </div>
        </div>
      </nav>
    `;

    this.setupInteractivity();
  }

  setupInteractivity() {
    // 1. Verificar Portal Oficial (NYC.gov Trust Drawer)
    const verifyToggle = this.querySelector('#civic-verify-toggle');
    const verifyDrawer = this.querySelector('#civic-verify-drawer');
    if (verifyToggle && verifyDrawer) {
      verifyToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = verifyDrawer.hasAttribute('hidden');
        if (isHidden) {
          verifyDrawer.removeAttribute('hidden');
          verifyToggle.setAttribute('aria-expanded', 'true');
        } else {
          verifyDrawer.setAttribute('hidden', '');
          verifyToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // 2. Seletor de Cidadão Simulado (Dados Reais)
    const citToggle = this.querySelector('#citizen-switcher-toggle');
    const citMenu = this.querySelector('#citizen-switcher-menu');
    if (citToggle && citMenu) {
      citToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = citMenu.classList.contains('show');
        this.closeAllMenus();
        if (!isOpen) citMenu.classList.add('show');
      });
    }

    this.querySelectorAll('.citizen-option-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const citizenId = btn.dataset.citizenId;
        if (typeof setActiveCitizen === 'function') {
          const updated = setActiveCitizen(citizenId, true);
          if (updated) {
            this.showToast(`Dados reais carregados: ${updated.name} (${updated.cpf})`);
            this.connectedCallback();
          }
        }
      });
    });

    // 3. Dropdown ACESSO RÁPIDO (Unimed)
    const qaToggle = this.querySelector('#quick-access-toggle');
    const qaDrawer = this.querySelector('#quick-access-drawer');
    if (qaToggle && qaDrawer) {
      qaToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = qaDrawer.classList.contains('show');
        this.closeAllMenus();
        if (!isOpen) {
          qaDrawer.classList.add('show');
          qaToggle.setAttribute('aria-expanded', 'true');
        }
      });
    }

    // 4. Dropdown de Serviços
    const servicosToggle = this.querySelector('#servicos-toggle');
    const servicosMenu = this.querySelector('#servicos-menu');

    if (servicosToggle && servicosMenu) {
      servicosToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = servicosMenu.classList.contains('show');
        this.closeAllMenus();
        if (!isOpen) {
          servicosMenu.classList.add('show');
          servicosToggle.classList.add('open');
          servicosToggle.setAttribute('aria-expanded', 'true');
          if (this._refreshIndicator) this._refreshIndicator();
        }
      });
    }

    // 5. Dropdown de Avisos
    const alertsToggle = this.querySelector('#alerts-toggle');
    const alertsMenu = this.querySelector('#alerts-menu');
    const alertsBadge = this.querySelector('#alerts-badge');
    const markReadBtn = this.querySelector('#btn-mark-alerts-read');

    if (alertsToggle && alertsMenu) {
      alertsToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = alertsMenu.classList.contains('show');
        this.closeAllMenus();
        if (!isOpen) {
          alertsMenu.classList.add('show');
          alertsToggle.classList.add('open');
        }
      });
    }

    if (markReadBtn && alertsBadge) {
      markReadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        alertsBadge.style.display = 'none';
        const unreadItems = this.querySelectorAll('.alert-item.unread');
        unreadItems.forEach(item => item.classList.remove('unread'));
        const tag = this.querySelector('.alerts-unread-tag');
        if (tag) tag.textContent = '0 novas';
        markReadBtn.textContent = 'Tudo lido';
        markReadBtn.disabled = true;
      });
    }

    // Acessibilidade: Alternar Alto Contraste
    const btnAcessibilidade = this.querySelector('#btn-acessibilidade');
    if (btnAcessibilidade) {
      btnAcessibilidade.addEventListener('click', (e) => {
        e.stopPropagation();
        document.body.classList.toggle('modo-acessibilidade');
        document.body.classList.toggle('alto-contraste');
        const isActive = document.body.classList.contains('modo-acessibilidade');
        this.showToast(isActive ? 'Modo de alto contraste ativado' : 'Modo de alto contraste desativado');
        this.closeAllMenus();
      });
    }

    // Privacidade
    const btnPrivacidade = this.querySelector('#btn-privacidade');
    if (btnPrivacidade) {
      btnPrivacidade.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeAllMenus();
        window.location.href = 'privacyPage.html';
      });
    }

    this.setupIndicator();

    // Sincroniza quando a cidade ou cidadão muda em outra parte da tela
    if (!this._boundCitizenListener) {
      this._boundCitizenListener = () => {
        const cit = (typeof getActiveCitizen === 'function') ? getActiveCitizen() : null;
        if (!cit) return;
        const first = cit.name.split(' ').slice(0, 2).join(' ');
        const cShort = cit.cityKey === 'sapucaia' ? 'Sapucaia do Sul' : 'Rio das Ostras';
        const trustName = this.querySelector('#trust-citizen-name');
        const pillName = this.querySelector('#nav-citizen-name');
        const pillSub = this.querySelector('#nav-citizen-sub');
        const pillAv = this.querySelector('#nav-citizen-avatar');
        if (trustName) trustName.textContent = first;
        if (pillName) pillName.textContent = first;
        if (pillSub) pillSub.textContent = `${cShort} · Trocar`;
        if (pillAv) pillAv.textContent = cit.avatarInitials || 'CC';
      };
      window.addEventListener('conectaCitizenChanged', this._boundCitizenListener);
      window.addEventListener('conectaCityChanged', this._boundCitizenListener);
    }

    document.addEventListener('click', (e) => {
      if (!this.contains(e.target)) {
        this.closeAllMenus();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllMenus();
      }
    });
  }

  setupIndicator() {
    const nav = this.querySelector('#topbar-nav');
    const indicator = this.querySelector('#nav-indicator');
    if (!nav || !indicator) return;

    const items = Array.from(nav.querySelectorAll(':scope > .nav-item, :scope > .nav-dropdown-wrapper > .nav-item'));
    const isMobile = () => window.matchMedia('(max-width: 860px)').matches;

    const moveTo = (el, instant = false) => {
      if (!el || isMobile()) {
        indicator.classList.remove('ready');
        return;
      }
      const navRect = nav.getBoundingClientRect();
      const rect = el.getBoundingClientRect();
      indicator.classList.toggle('instant', instant);
      indicator.style.width = `${rect.width}px`;
      indicator.style.transform = `translateX(${rect.left - navRect.left}px)`;
      indicator.classList.add('ready');
      if (instant) {
        void indicator.offsetWidth;
        indicator.classList.remove('instant');
      }
    };

    const resting = () => items.find(i => i.classList.contains('open')) || items.find(i => i.classList.contains('active'));

    nav.classList.add('has-indicator');
    items.forEach(item => {
      item.addEventListener('mouseenter', () => moveTo(item));
      item.addEventListener('focus', () => moveTo(item));
    });
    nav.addEventListener('mouseleave', () => moveTo(resting()));
    nav.addEventListener('focusout', () => moveTo(resting()));
    window.addEventListener('resize', () => moveTo(resting(), true));
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => moveTo(resting(), true));
    }
    requestAnimationFrame(() => moveTo(resting(), true));

    this._refreshIndicator = () => moveTo(resting());
  }

  showToast(message) {
    let toast = document.querySelector('.app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'app-toast';
      toast.setAttribute('role', 'status');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  }

  closeAllMenus() {
    const servicosMenu = this.querySelector('#servicos-menu');
    const servicosToggle = this.querySelector('#servicos-toggle');
    const alertsMenu = this.querySelector('#alerts-menu');
    const alertsToggle = this.querySelector('#alerts-toggle');
    const qaDrawer = this.querySelector('#quick-access-drawer');
    const qaToggle = this.querySelector('#quick-access-toggle');
    const citMenu = this.querySelector('#citizen-switcher-menu');

    if (servicosMenu) servicosMenu.classList.remove('show');
    if (servicosToggle) {
      servicosToggle.classList.remove('open');
      servicosToggle.setAttribute('aria-expanded', 'false');
    }
    if (alertsMenu) alertsMenu.classList.remove('show');
    if (alertsToggle) alertsToggle.classList.remove('open');
    if (qaDrawer) qaDrawer.classList.remove('show');
    if (qaToggle) qaToggle.setAttribute('aria-expanded', 'false');
    if (citMenu) citMenu.classList.remove('show');
    if (this._refreshIndicator) this._refreshIndicator();
  }
}

customElements.define('app-navbar', AppNavbar);
