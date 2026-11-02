class AppNavbar extends HTMLElement {
  connectedCallback() {
    // Identifica com precisão o caminho e o nome do arquivo da página atual
    const currentPath = (window.location.pathname || '').replace(/\\/g, '/').toLowerCase();
    const filename = currentPath.substring(currentPath.lastIndexOf('/') + 1);

    // Regra estrita de aba ativa: apenas UMA aba fica ativa
    const isInicio = filename === 'mainpage.html' || filename === 'index.html' || filename === '';
    const isServicos = ['healthpage', 'invoicespage', 'occurrencepage', 'workspage', 'eventspage'].some(page => currentPath.includes(page));
    const isSolicitacoes = currentPath.includes('requestspage');
    const isMinhaConta = currentPath.includes('accountpage');

    this.innerHTML = `
      <nav class="topbar">
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
              <span class="brand-sub">Serviços perto de você</span>
            </div>
          </a>

          <!-- 2. Navegação Central -->
          <div class="topbar-nav">
            <!-- Início -->
            <a href="mainPage.html" class="nav-item ${isInicio ? 'active' : ''}" id="nav-inicio">
              <div class="nav-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 10.2L12 3l9 7.2V20a1.8 1.8 0 0 1-1.8 1.8H4.8A1.8 1.8 0 0 1 3 20V10.2z"/>
                  <path d="M9 21.8V12h6v9.8"/>
                </svg>
              </div>
              <span class="nav-label">Início</span>
            </a>

            <!-- Serviços (Dropdown Fiel à Referência) -->
            <div class="nav-dropdown-wrapper" id="servicos-dropdown-wrapper">
              <button type="button" class="nav-item nav-servicos-btn ${isServicos ? 'active' : ''}" id="servicos-toggle" aria-expanded="false" aria-haspopup="true">
                <div class="nav-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
                <!-- Seção 1: Explore sua cidade -->
                <div class="dropdown-section">
                  <span class="dropdown-section-title">Explore sua cidade</span>
                  <div class="dropdown-blue-card">
                    <!-- Empregos -->
                    <a href="worksPage.html" class="dropdown-row ${currentPath.includes('workspage') ? 'active' : ''}">
                      <div class="dropdown-row-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                        </svg>
                      </div>
                      <div class="dropdown-row-content">
                        <strong class="dropdown-row-title">Empregos</strong>
                        <span class="dropdown-row-desc">Oportunidades de trabalho e orientação profissional.</span>
                      </div>
                      <svg class="dropdown-row-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </a>

                    <!-- Eventos -->
                    <a href="eventsPage.html" class="dropdown-row ${currentPath.includes('eventspage') ? 'active' : ''}">
                      <div class="dropdown-row-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                          <circle cx="8" cy="14" r="0.75" fill="currentColor"/>
                          <circle cx="12" cy="14" r="0.75" fill="currentColor"/>
                          <circle cx="16" cy="14" r="0.75" fill="currentColor"/>
                          <circle cx="8" cy="17" r="0.75" fill="currentColor"/>
                          <circle cx="12" cy="17" r="0.75" fill="currentColor"/>
                          <circle cx="16" cy="17" r="0.75" fill="currentColor"/>
                        </svg>
                      </div>
                      <div class="dropdown-row-content">
                        <strong class="dropdown-row-title">Eventos</strong>
                        <span class="dropdown-row-desc">Cultura, lazer e atividades na sua cidade.</span>
                      </div>
                      <svg class="dropdown-row-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </a>
                  </div>
                </div>

                <!-- Seção 2: Serviços do dia a dia -->
                <div class="dropdown-section">
                  <span class="dropdown-section-title">Serviços do dia a dia</span>
                  <div class="dropdown-plain-list">
                    <!-- Saúde -->
                    <a href="healthPage.html" class="dropdown-row ${currentPath.includes('healthpage') ? 'active' : ''}">
                      <div class="dropdown-row-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l.77.78L12 20.66l7.65-7.65.77-.78a5.4 5.4 0 0 0 0-7.65z"/>
                          <path d="M3.5 12h3.5l2-3 3 6 2-3h4.5"/>
                        </svg>
                      </div>
                      <div class="dropdown-row-content">
                        <strong class="dropdown-row-title">Saúde</strong>
                        <span class="dropdown-row-desc">Consultas e agendamentos.</span>
                      </div>
                      <svg class="dropdown-row-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </a>

                    <!-- IPTU e ISS -->
                    <a href="invoicesPage.html" class="dropdown-row ${currentPath.includes('invoicespage') ? 'active' : ''}">
                      <div class="dropdown-row-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/>
                          <line x1="8" y1="7" x2="16" y2="7"/>
                          <line x1="8" y1="11" x2="16" y2="11"/>
                          <line x1="8" y1="15" x2="13" y2="15"/>
                        </svg>
                      </div>
                      <div class="dropdown-row-content">
                        <strong class="dropdown-row-title">IPTU e ISS</strong>
                        <span class="dropdown-row-desc">Consultar débitos e emitir guia PDF ou Pix.</span>
                      </div>
                      <svg class="dropdown-row-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </a>

                    <!-- Registrar ocorrência -->
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
                        <strong class="dropdown-row-title">Registrar ocorrência</strong>
                        <span class="dropdown-row-desc">Buracos, iluminação e vazamentos.</span>
                      </div>
                      <svg class="dropdown-row-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </a>

                    <!-- Acompanhar solicitações -->
                    <a href="requestsPage.html" class="dropdown-row ${currentPath.includes('requestspage') ? 'active' : ''}">
                      <div class="dropdown-row-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                          <rect x="8" y="2" width="8" height="4" rx="1"/>
                          <line x1="9" y1="11" x2="15" y2="11"/>
                          <line x1="9" y1="15" x2="15" y2="15"/>
                          <circle cx="9" cy="8" r="0.75" fill="currentColor"/>
                        </svg>
                      </div>
                      <div class="dropdown-row-content">
                        <strong class="dropdown-row-title">Acompanhar solicitações</strong>
                        <span class="dropdown-row-desc">Consultar protocolos e acompanhar etapas.</span>
                      </div>
                      <svg class="dropdown-row-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </a>
                  </div>
                </div>

                <!-- Rodapé do Menu: Acessibilidade e Privacidade -->
                <div class="dropdown-footer">
                  <button type="button" class="dropdown-footer-btn" id="btn-acessibilidade" title="Recursos de Acessibilidade">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="4" r="2"/>
                      <path d="M4 9h16"/>
                      <path d="M12 9v11"/>
                      <path d="M9 20l3-5 3 5"/>
                    </svg>
                    <span>Acessibilidade</span>
                  </button>

                  <button type="button" class="dropdown-footer-btn" id="btn-privacidade" title="Políticas de Privacidade e LGPD">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <span>Privacidade</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Solicitações -->
            <a href="requestsPage.html" class="nav-item ${isSolicitacoes ? 'active' : ''}" id="nav-solicitacoes">
              <div class="nav-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="9"/>
                  <circle cx="12" cy="9.5" r="3.2"/>
                  <path d="M6.8 18.2a5.5 5.5 0 0 1 10.4 0"/>
                </svg>
              </div>
              <span class="nav-label">Minha conta</span>
            </a>
          </div>

          <!-- 3. Lado Direito: Avisos (Notificações) -->
          <div class="topbar-alerts-wrapper" id="alerts-wrapper">
            <button type="button" class="nav-item nav-alert-btn" id="alerts-toggle" title="Você possui avisos pendentes">
              <div class="nav-bell-container">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <span class="nav-bell-badge" id="alerts-badge">1</span>
              </div>
              <span class="nav-label">Avisos</span>
            </button>

            <!-- Dropdown de Notificações -->
            <div class="nav-alerts-menu" id="alerts-menu">
              <div class="alerts-menu-header">
                <strong>Avisos & Comunicados</strong>
                <span class="alerts-unread-tag">1 novo</span>
              </div>
              <div class="alerts-menu-list">
                <div class="alert-item unread">
                  <div class="alert-dot"></div>
                  <div class="alert-content">
                    <p class="alert-title">Estamos de cara nova!</p>
                    <p class="alert-desc">O Conecta Cidadão recebeu um novo visual! Confira as novidades e aproveite os serviços com mais agilidade.</p>
                    <span class="alert-time">Hoje, 15:30</span>
                  </div>
                </div>
              </div>
              <div class="alerts-menu-footer">
                <button type="button" class="btn-clear-alerts" id="btn-mark-alerts-read">Marcar como lido</button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    `;

    this.setupInteractivity();
  }

  setupInteractivity() {
    // Dropdown de Serviços
    const servicosWrapper = this.querySelector('#servicos-dropdown-wrapper');
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
        }
      });
    }

    // Dropdown de Avisos
    const alertsWrapper = this.querySelector('#alerts-wrapper');
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
        if (tag) tag.textContent = '0 novos';
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
        const isActive = document.body.classList.contains('modo-acessibilidade');
        alert(isActive ? 'Modo de Alto Contraste / Acessibilidade ativado!' : 'Modo de acessibilidade desativado.');
        this.closeAllMenus();
      });
    }

    // Privacidade
    const btnPrivacidade = this.querySelector('#btn-privacidade');
    if (btnPrivacidade) {
      btnPrivacidade.addEventListener('click', (e) => {
        e.stopPropagation();
        alert('Conecta Cidadão - Privacidade e Segurança:\nSeus dados estão protegidos em conformidade com a LGPD (Lei Geral de Proteção de Dados).');
        this.closeAllMenus();
      });
    }

    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
      if (!this.contains(e.target)) {
        this.closeAllMenus();
      }
    });

    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllMenus();
      }
    });
  }

  closeAllMenus() {
    const servicosMenu = this.querySelector('#servicos-menu');
    const servicosToggle = this.querySelector('#servicos-toggle');
    const alertsMenu = this.querySelector('#alerts-menu');
    const alertsToggle = this.querySelector('#alerts-toggle');

    if (servicosMenu) servicosMenu.classList.remove('show');
    if (servicosToggle) {
      servicosToggle.classList.remove('open');
      servicosToggle.setAttribute('aria-expanded', 'false');
    }
    if (alertsMenu) alertsMenu.classList.remove('show');
    if (alertsToggle) alertsToggle.classList.remove('open');
  }
}

customElements.define('app-navbar', AppNavbar);
