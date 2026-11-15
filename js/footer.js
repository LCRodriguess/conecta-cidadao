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
                <span class="trust-seal-pill">Central 156 / 311</span>
                <span class="trust-seal-pill">Protegido pela LGPD</span>
                <span class="trust-seal-pill">Transparência Ativa</span>
              </div>
            </div>

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
              <span class="app-store-badge">App ConectaCidadão (iOS / Android)</span>
            </div>
          </div>
        </div>
      </footer>

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

window.openOfficialChannelsModal = function (options = {}) {
  const cfg = {
    title: options.title || 'Canais Oficiais ConectaCidadão',
    subtitle: options.subtitle || 'Copie os dados de contato ou envie um e-mail diretamente pelo provedor de sua preferência.',
    phone: options.phone || '156 / 311',
    phoneDesc: options.phoneDesc || 'Atendimento telefônico gratuito',
    email: options.email || 'ouvidoria@conectacidadao.gov.br',
    hours: options.hours || 'Segunda a Sexta, das 08h às 17h',
    extraLabel: options.extraLabel || '',
    extraValue: options.extraValue || '',
    subject: options.subject || 'Atendimento - Portal ConectaCidadão'
  };

  if (!document.getElementById('official-channels-modal-style')) {
    const style = document.createElement('style');
    style.id = 'official-channels-modal-style';
    style.textContent = `
      .cc-channels-backdrop {
        position: fixed; inset: 0; z-index: 9999;
        background: rgba(15, 23, 42, 0.58);
        backdrop-filter: blur(3px);
        display: flex; align-items: center; justify-content: center;
        padding: 18px;
      }
      .cc-channels-dialog {
        width: 100%; max-width: 500px;
        background: #ffffff; color: #0f172a;
        border: 1px solid #e2e8f0; border-radius: 18px;
        box-shadow: 0 24px 60px rgba(15, 23, 42, 0.28);
        padding: 24px; font-family: inherit;
      }
      .cc-channels-head {
        display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
        margin-bottom: 14px;
      }
      .cc-channels-head h3 { margin: 0 0 4px; font-size: 19px; font-weight: 800; color: #0f172a; }
      .cc-channels-head p { margin: 0; font-size: 13.5px; color: #475569; line-height: 1.45; }
      .cc-channels-close {
        background: #f1f5f9; border: 1px solid #cbd5e1; color: #334155;
        width: 32px; height: 32px; border-radius: 8px; font-size: 18px;
        line-height: 1; cursor: pointer; flex-shrink: 0;
      }
      .cc-channels-list { display: flex; flex-direction: column; gap: 10px; margin: 16px 0 18px; }
      .cc-channel-row {
        display: flex; align-items: center; justify-content: space-between; gap: 12px;
        background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;
        padding: 11px 14px;
      }
      .cc-channel-meta strong { display: block; font-size: 11.5px; text-transform: uppercase; letter-spacing: .04em; color: #64748b; margin-bottom: 2px; }
      .cc-channel-meta span { font-size: 14.5px; font-weight: 700; color: #0f172a; word-break: break-word; }
      .cc-channel-meta small { display: block; font-size: 12px; color: #64748b; margin-top: 2px; }
      .cc-copy-btn {
        background: #ffffff; border: 1px solid #cbd5e1; color: #1e293b;
        border-radius: 8px; padding: 6px 12px; font-size: 12.5px; font-weight: 700;
        cursor: pointer; white-space: nowrap; transition: background .15s, border-color .15s;
      }
      .cc-copy-btn:hover { background: #eef2ff; border-color: #103fef; color: #103fef; }
      .cc-copy-btn.copied { background: #dcfce7; border-color: #16a34a; color: #15803d; }
      .cc-email-section { border-top: 1px solid #e2e8f0; padding-top: 16px; }
      .cc-email-title { display: block; font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 10px; }
      .cc-email-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      .cc-mail-btn {
        display: inline-flex; align-items: center; justify-content: center; gap: 8px;
        padding: 10px 14px; border-radius: 10px; font-size: 13.5px; font-weight: 700;
        text-decoration: none; border: 1px solid transparent; cursor: pointer;
      }
      .cc-mail-gmail { background: #fef2f2; color: #b91c1c; border-color: #fecaca; }
      .cc-mail-gmail:hover { background: #fee2e2; }
      .cc-mail-outlook { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
      .cc-mail-outlook:hover { background: #dbeafe; }
      .cc-mail-default {
        grid-column: span 2; background: #f8fafc; color: #334155; border-color: #cbd5e1;
      }
      .cc-mail-default:hover { background: #f1f5f9; }
      body.alto-contraste .cc-channels-dialog,
      body.modo-acessibilidade .cc-channels-dialog {
        background: #0b0f19; color: #ffffff; border-color: #facc15;
      }
      body.alto-contraste .cc-channels-head h3,
      body.modo-acessibilidade .cc-channels-head h3 { color: #facc15; }
      body.alto-contraste .cc-channels-head p,
      body.alto-contraste .cc-channel-meta strong,
      body.alto-contraste .cc-channel-meta small,
      body.alto-contraste .cc-email-title,
      body.modo-acessibilidade .cc-channels-head p,
      body.modo-acessibilidade .cc-channel-meta strong,
      body.modo-acessibilidade .cc-channel-meta small,
      body.modo-acessibilidade .cc-email-title { color: #e2e8f0; }
      body.alto-contraste .cc-channel-row,
      body.modo-acessibilidade .cc-channel-row { background: #111827; border-color: #475569; }
      body.alto-contraste .cc-channel-meta span,
      body.modo-acessibilidade .cc-channel-meta span { color: #ffffff; }
      body.alto-contraste .cc-copy-btn,
      body.alto-contraste .cc-mail-default,
      body.modo-acessibilidade .cc-copy-btn,
      body.modo-acessibilidade .cc-mail-default {
        background: #1e293b; color: #facc15; border-color: #facc15;
      }
      @media (max-width: 480px) {
        .cc-email-actions { grid-template-columns: 1fr; }
        .cc-mail-default { grid-column: span 1; }
      }
    `;
    document.head.appendChild(style);
  }

  document.getElementById('official-channels-modal-backdrop')?.remove();

  const backdrop = document.createElement('div');
  backdrop.id = 'official-channels-modal-backdrop';
  backdrop.className = 'cc-channels-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(cfg.email)}&su=${encodeURIComponent(cfg.subject)}`;
  const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(cfg.email)}&subject=${encodeURIComponent(cfg.subject)}`;
  const mailtoUrl = `mailto:${encodeURIComponent(cfg.email)}?subject=${encodeURIComponent(cfg.subject)}`;

  backdrop.innerHTML = `
    <div class="cc-channels-dialog">
      <div class="cc-channels-head">
        <div>
          <h3>${cfg.title}</h3>
          <p>${cfg.subtitle}</p>
        </div>
        <button type="button" class="cc-channels-close" aria-label="Fechar">×</button>
      </div>
      <div class="cc-channels-list">
        <div class="cc-channel-row">
          <div class="cc-channel-meta">
            <strong>Central Telefônica</strong>
            <span>${cfg.phone}</span>
            <small>${cfg.phoneDesc}</small>
          </div>
          <button type="button" class="cc-copy-btn" data-copy="${cfg.phone}">Copiar</button>
        </div>
        <div class="cc-channel-row">
          <div class="cc-channel-meta">
            <strong>E-mail Oficial</strong>
            <span>${cfg.email}</span>
          </div>
          <button type="button" class="cc-copy-btn" data-copy="${cfg.email}">Copiar</button>
        </div>
        ${cfg.extraValue ? `
        <div class="cc-channel-row">
          <div class="cc-channel-meta">
            <strong>${cfg.extraLabel}</strong>
            <span>${cfg.extraValue}</span>
          </div>
          <button type="button" class="cc-copy-btn" data-copy="${cfg.extraValue}">Copiar</button>
        </div>` : ''}
        <div class="cc-channel-row">
          <div class="cc-channel-meta">
            <strong>Atendimento</strong>
            <span>${cfg.hours}</span>
          </div>
        </div>
      </div>
      <div class="cc-email-section">
        <span class="cc-email-title">Enviar e-mail agora</span>
        <div class="cc-email-actions">
          <a href="${gmailUrl}" target="_blank" rel="noopener noreferrer" class="cc-mail-btn cc-mail-gmail">Abrir no Gmail</a>
          <a href="${outlookUrl}" target="_blank" rel="noopener noreferrer" class="cc-mail-btn cc-mail-outlook">Abrir no Outlook</a>
          <a href="${mailtoUrl}" class="cc-mail-btn cc-mail-default">Usar aplicativo de e-mail padrão</a>
        </div>
      </div>
    </div>
  `;

  function closeModal() {
    backdrop.remove();
    document.removeEventListener('keydown', onEsc);
  }

  function onEsc(e) {
    if (e.key === 'Escape') closeModal();
  }

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });
  backdrop.querySelector('.cc-channels-close').addEventListener('click', closeModal);
  document.addEventListener('keydown', onEsc);

  backdrop.querySelectorAll('.cc-copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const value = btn.getAttribute('data-copy') || '';
      try {
        await navigator.clipboard.writeText(value);
      } catch (_) {
        const tmp = document.createElement('textarea');
        tmp.value = value;
        document.body.appendChild(tmp);
        tmp.select();
        document.execCommand('copy');
        tmp.remove();
      }
      btn.textContent = 'Copiado!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'Copiar';
        btn.classList.remove('copied');
      }, 1800);
    });
  });

  document.body.appendChild(backdrop);
};