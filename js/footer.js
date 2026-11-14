/**
 * Rodapé + "Próximo passo" + Rodapé Cívico de Alto Contraste (NYC.gov 3 colunas)
 * + Barra de Selos de Confiança Pública & Widget Assistivo Libras (Estratégia Unimed).
 */
const FLOW_ICONS = {
  report: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s2.5-2.14 4.5-4.88"/><circle cx="12" cy="10" r="3"/><line x1="19" y1="13" x2="19" y2="19"/><line x1="16" y1="16" x2="22" y2="16"/></svg>',
  track: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="15" y2="16"/></svg>',
  health: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l.77.78L12 20.66l7.65-7.65.77-.78a5.4 5.4 0 0 0 0-7.65z"/></svg>',
  bill: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
  jobs: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
  events: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  user: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="9.5" r="3.2"/><path d="M6.8 18.2a5.5 5.5 0 0 1 10.4 0"/></svg>',
  shield: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  home: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.2L12 3l9 7.2V20a1.8 1.8 0 0 1-1.8 1.8H4.8A1.8 1.8 0 0 1 3 20V10.2z"/></svg>'
};

const FLOW_ARROW = '<svg class="flow-next-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';

const FLOW_STEPS = {
  mainpage: null,
  loginpage: null,
  registerpage: null,
  occurrencepage: [
    { href: 'requestsPage.html', icon: 'track', title: 'Acompanhar solicitações', desc: 'Veja o andamento dos seus protocolos' },
    { href: 'mainPage.html', icon: 'home', title: 'Voltar ao início', desc: 'Seu resumo e serviços' }
  ],
  requestspage: [
    { href: 'occurrencePage.html', icon: 'report', title: 'Registrar nova ocorrência', desc: 'Buraco, iluminação, vazamento' },
    { href: 'mainPage.html', icon: 'home', title: 'Voltar ao início', desc: 'Seu resumo e serviços' }
  ],
  healthpage: [
    { href: 'eventsPage.html', icon: 'events', title: 'Eventos na cidade', desc: 'Cultura, lazer e atividades' },
    { href: 'invoicesPage.html', icon: 'bill', title: 'IPTU e ISS', desc: 'Débitos, guia PDF ou Pix' }
  ],
  invoicespage: [
    { href: 'healthPage.html', icon: 'health', title: 'Saúde', desc: 'Consultas e agendamentos' },
    { href: 'requestsPage.html', icon: 'track', title: 'Acompanhar solicitações', desc: 'Protocolos e etapas' }
  ],
  workspage: [
    { href: 'eventsPage.html', icon: 'events', title: 'Eventos na cidade', desc: 'Cultura, lazer e atividades' },
    { href: 'accountPage.html', icon: 'user', title: 'Minha conta', desc: 'Mantenha seus dados atualizados' }
  ],
  eventspage: [
    { href: 'worksPage.html', icon: 'jobs', title: 'Empregos', desc: 'Oportunidades e orientação' },
    { href: 'healthPage.html', icon: 'health', title: 'Saúde', desc: 'Consultas e vacinação' }
  ],
  accountpage: [
    { href: 'privacyPage.html', icon: 'shield', title: 'Privacidade e dados', desc: 'Você escolhe como informar' },
    { href: 'mainPage.html', icon: 'home', title: 'Voltar ao início', desc: 'Seu resumo e serviços' }
  ],
  privacypage: [
    { href: 'accountPage.html', icon: 'user', title: 'Minha conta', desc: 'Seu perfil e preferências' },
    { href: 'mainPage.html', icon: 'home', title: 'Voltar ao início', desc: 'Seu resumo e serviços' }
  ]
};

class AppFooter extends HTMLElement {
  connectedCallback() {
    const path = (window.location.pathname || '').replace(/\\/g, '/').toLowerCase();
    const file = path.substring(path.lastIndexOf('/') + 1).replace('.html', '');
    const steps = FLOW_STEPS[file];

    const nextHtml = steps
      ? `
      <section class="flow-next" aria-label="Próximos passos">
        <h2 class="flow-next-title">Continue por aqui</h2>
        <div class="flow-next-list">
          ${steps.map(s => `
            <a class="flow-next-card" href="${s.href}">
              <span class="flow-next-icon">${FLOW_ICONS[s.icon]}</span>
              <span class="flow-next-text"><strong>${s.title}</strong><span>${s.desc}</span></span>
              ${FLOW_ARROW}
            </a>`).join('')}
        </div>
      </section>`
      : '';

    this.innerHTML = `
      ${nextHtml}

      <!-- RODAPÉ DE ALTO CONTRASTE (Inspiração NYC.gov 3 Colunas + Selos Unimed) -->
      <footer class="nyc-civic-footer" role="contentinfo">
        <div class="nyc-footer-inner">
          <div class="nyc-footer-top">
            <div class="nyc-footer-brand">
              <div class="nyc-footer-logo">
                <span class="nyc-block-mark">CC</span>
                <div>
                  <strong>ConectaCidadão</strong>
                  <span>Plataforma Pública de Serviços e Zeladoria</span>
                </div>
              </div>
              <p class="nyc-footer-mission">
                Cuidar da nossa cidade começa por ouvir você. Serviços públicos em linguagem simples, sem filas e com acompanhamento transparente em tempo real.
              </p>
              <div class="unimed-trust-seals">
                <span class="trust-seal-pill">📞 Central 156 / 311</span>
                <span class="trust-seal-pill">🛡️ Protegido pela LGPD</span>
                <span class="trust-seal-pill">🏛️ Transparência Ativa</span>
              </div>
            </div>

            <!-- 3 Colunas Focadas (15 Links Essenciais — Padrão NYC.gov) -->
            <div class="nyc-footer-columns">
              <div class="nyc-footer-col">
                <h3>Navegação Principal</h3>
                <ul>
                  <li><a href="mainPage.html">Início · Painel do Cidadão</a></li>
                  <li><a href="occurrencePage.html">Relatar Problema (156)</a></li>
                  <li><a href="requestsPage.html">Consultar Protocolos</a></li>
                  <li><a href="healthPage.html">Saúde e Vacinação SUS</a></li>
                  <li><a href="invoicesPage.html">IPTU, ISS e Guias Pix</a></li>
                </ul>
              </div>

              <div class="nyc-footer-col">
                <h3>Cidadania & Oportunidades</h3>
                <ul>
                  <li><a href="worksPage.html">Balcão de Empregos Municipal</a></li>
                  <li><a href="eventsPage.html">Agenda Cultural & Eventos</a></li>
                  <li><a href="loginPage.html">Entrar / Trocar Cidadão</a></li>
                  <li><a href="registerPage.html">Cadastro Único Cidadão</a></li>
                  <li><a href="accountPage.html">Meu Perfil e Notificações</a></li>
                </ul>
              </div>

              <div class="nyc-footer-col">
                <h3>Governança & Apoio</h3>
                <ul>
                  <li><a href="privacyPage.html">Política de Privacidade e LGPD</a></li>
                  <li><a href="mainPage.html#utilidade-antifraude">Segurança: Prevenção a Golpes</a></li>
                  <li><a href="mainPage.html#status-diario">Status Operacional da Cidade</a></li>
                  <li><a href="mainPage.html#cidade-viva">Programa Cidade Viva · Prevenção</a></li>
                  <li><a href="#acessibilidade" id="footer-accessibility-trigger">Recursos de Acessibilidade e Libras</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div class="nyc-footer-bottom">
            <p>© 2026 ConectaCidadão · Municípios Integrados: <strong>Rio das Ostras (RJ)</strong> e <strong>Sapucaia do Sul (RS)</strong>.</p>
            <div class="nyc-footer-apps">
              <span class="app-store-badge">📱 App ConectaCidadão (iOS / Android)</span>
            </div>
          </div>
        </div>
      </footer>

      <!-- WIDGET FLUTUANTE DE ACESSIBILIDADE & LIBRAS (Inspiração Unimed Hand Talk / Hugo) -->
      <aside class="floating-assistive-dock" aria-label="Recursos de Acessibilidade e Libras">
        <button type="button" class="assistive-dock-btn assistive-tools-btn" id="floating-contrast-btn" title="Alternar Alto Contraste e Fonte Ampliada">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="4" r="2"/>
            <path d="M4 9h16"/>
            <path d="M12 9v11"/>
            <path d="M9 20l3-5 3 5"/>
          </svg>
          <span class="assistive-tooltip">Acessibilidade (A+ / Contraste)</span>
        </button>

        <button type="button" class="assistive-dock-btn assistive-libras-btn" id="floating-libras-btn" title="Abrir Tradutor Virtual de Língua Brasileira de Sinais (Libras)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>
            <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/>
            <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/>
            <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
          </svg>
          <span class="assistive-tooltip">Tradutor Libras</span>
        </button>
      </aside>
    `;

    this.setupAssistiveControls();
  }

  setupAssistiveControls() {
    const contrastBtn = this.querySelector('#floating-contrast-btn');
    const footerTrigger = this.querySelector('#footer-accessibility-trigger');
    const librasBtn = this.querySelector('#floating-libras-btn');

    const toggleAccessibility = (e) => {
      if (e) e.preventDefault();
      document.body.classList.toggle('alto-contraste');
      document.documentElement.classList.toggle('font-large');
    };

    if (contrastBtn) contrastBtn.addEventListener('click', toggleAccessibility);
    if (footerTrigger) footerTrigger.addEventListener('click', toggleAccessibility);

    // O VLibras só é carregado quando o usuário clica no botão personalizado.
    if (librasBtn) {
      librasBtn.addEventListener('click', () => {
        // Se já estiver carregado, apenas abre o tradutor.
        if (window.__vlibrasReady) {
          document.querySelector('[vw-access-button]')?.click();
          return;
        }

        // Evita iniciar vários carregamentos com cliques repetidos.
        if (window.__vlibrasLoading) return;

        window.__vlibrasLoading = true;

        const container = document.createElement('div');
        container.setAttribute('vw', '');
        container.className = 'enabled';

        container.innerHTML = `
          <div vw-access-button class="active"></div>
          <div vw-plugin-wrapper>
            <div class="vw-plugin-top-wrapper"></div>
          </div>
        `;

        document.body.appendChild(container);

        // Esconde somente o botão padrão do VLibras.
        if (!document.getElementById('vlibras-custom-button-style')) {
          const style = document.createElement('style');
          style.id = 'vlibras-custom-button-style';
          style.textContent = '[vw-access-button] { display: none !important; }';
          document.head.appendChild(style);
        }

        const script = document.createElement('script');
        script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
        script.async = true;

        script.onload = () => {
          if (window.VLibras && window.VLibras.Widget) {
            new window.VLibras.Widget('https://vlibras.gov.br/app');

            window.__vlibrasReady = true;
            window.__vlibrasLoading = false;

            // Aguarda a criação do widget antes de acionar sua abertura.
            const openWidget = (attempt = 0) => {
              const vlibrasButton = document.querySelector('[vw-access-button]');

              if (vlibrasButton) {
                vlibrasButton.click();
              } else if (attempt < 20) {
                setTimeout(() => openWidget(attempt + 1), 250);
              }
            };

            openWidget();
          } else {
            window.__vlibrasLoading = false;
            container.remove();
            console.error('Não foi possível inicializar o widget VLibras.');
          }
        };

        script.onerror = () => {
          window.__vlibrasLoading = false;
          container.remove();
          document.getElementById('vlibras-custom-button-style')?.remove();
          console.error('Erro ao carregar o VLibras.');
        };

        document.body.appendChild(script);
      });
    }
  }
}

customElements.define('app-footer', AppFooter);