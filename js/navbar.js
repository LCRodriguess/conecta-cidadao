class AppNavbar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
      <nav class="topbar">
        <div class="topbar-container">
          <!-- 1. Nome / Logotipo -->
          <div class="topbar-brand">
            <a href="mainPage.html" class="brand-link">
              <span class="brand-icon">🏛️</span>
              <span class="brand-name">Conecta <strong>Cidadão</strong></span>
            </a>
          </div>

          <!-- 2. Centro: Botões e Select -->
          <div class="topbar-nav">
            <button type="button" class="nav-btn"><a href="mainPage.html">Início</a></button>

            <select name="servicos" id="servicos" class="nav-select" onchange="if (this.value) window.location.href = this.value">
              <option value="" disabled selected>Serviços</option>
              <option value="healthPage.html">Saúde</option>
              <option value="invoicesPage.html">Faturas</option>
              <option value="occurrencePage.html">Ocorrências</option>
              <option value="worksPage.html">Empregos</option>
              <option value="eventsPage.html">Eventos</option>
            </select>

            <button type="button" class="nav-btn"><a href="requestsPage.html">Solicitações</a></button>
          </div>

          <!-- 3. Lado Direito: Minha Conta -->
          <div class="topbar-user">
            <button type="button" class="btn-account">
              <a href="accountPage.html">👤 Minha Conta</a>
            </button>
          </div>
        </div>
      </nav>
    `;
    }
}

customElements.define('app-navbar', AppNavbar);
