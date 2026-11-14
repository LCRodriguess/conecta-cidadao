// ==========================================================================
// CONECTA CIDADÃO - LÓGICA DA PÁGINA PRINCIPAL (main.js)
// Integra o Design Híbrido (NYC.gov + Unimed) e o Consumo de Dados Reais
// da pessoa logada (CPF, Cartão SUS, endereço, tributos, agendamentos e 156).
// ==========================================================================

let currentCityKey = (typeof getActiveCity === 'function') ? getActiveCity() : 'rio-das-ostras';
let currentTypeFilter = 'all';
let carouselAutoPlayTimer = null;

document.addEventListener('DOMContentLoaded', () => {
  currentCityKey = (typeof getActiveCity === 'function') ? getActiveCity() : 'rio-das-ostras';

  initMunicipalitySelector();
  initHeroSearchAndSpotlight();
  initDailyStatusWidget();
  initHomeCivicMap();
  initNewsCarousel();
  initAccessibilityFeatures();
  initModals();

  // Atualiza todo o conteúdo da tela com a cidade e o cidadão ativo
  updateCityContent(currentCityKey, 'all');

  // Ouve eventos globais de mudança de cidade ou de pessoa logada
  window.addEventListener('conectaCityChanged', (e) => {
    const nextCity = e.detail?.cityKey || getActiveCity();
    updateCityContent(nextCity, currentTypeFilter);
  });

  window.addEventListener('conectaCitizenChanged', (e) => {
    const nextCity = e.detail?.cityKey || getActiveCity();
    updateCityContent(nextCity, currentTypeFilter);
  });
});

// ==========================================================================
// 1. BUSCA HERO & FAIXA SPOTLIGHT (ESTRATÉGIA NYC.gov + UNIMED)
// ==========================================================================
function initHeroSearchAndSpotlight() {
  const heroForm = document.getElementById('hero-search-form');
  const heroInput = document.getElementById('hero-search-input');

  if (heroForm && heroInput) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = heroInput.value.trim().toLowerCase();
      if (!q) {
        window.location.href = 'occurrencePage.html';
        return;
      }
      if (q.includes('recicla') || q.includes('ecoponto') || q.includes('coleta') || q.includes('pev')) {
        if (typeof window.focusCivicMapCategory === 'function') {
          window.focusCivicMapCategory('waste');
        }
      } else if (q.includes('upa') || q.includes('ubs') || q.includes('hospital') || q.includes('posto')) {
        window.location.href = 'healthPage.html#mapa-saude';
      } else if (q.includes('iptu') || q.includes('pix') || q.includes('iss') || q.includes('boleto') || q.includes('taxa')) {
        window.location.href = 'invoicesPage.html';
      } else if (q.includes('saude') || q.includes('saúde') || q.includes('sus') || q.includes('vacina') || q.includes('médico') || q.includes('medico') || q.includes('consulta')) {
        window.location.href = 'healthPage.html';
      } else if (q.includes('protocolo') || q.includes('acompanhar') || q.includes('sim-')) {
        window.location.href = 'requestsPage.html';
      } else if (q.includes('emprego') || q.includes('vaga') || q.includes('trabalho') || q.includes('curso')) {
        window.location.href = 'worksPage.html';
      } else if (q.includes('evento') || q.includes('festa') || q.includes('feira') || q.includes('show')) {
        window.location.href = 'eventsPage.html';
      } else {
        window.location.href = 'occurrencePage.html';
      }
    });
  }

  const spotlightForm = document.getElementById('spotlight-form');
  const spotlightService = document.getElementById('spotlight-service');
  if (spotlightForm && spotlightService) {
    spotlightForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const targetUrl = spotlightService.value || 'occurrencePage.html';
      if (targetUrl.startsWith('#')) {
        const el = document.querySelector(targetUrl);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      window.location.href = targetUrl;
    });
  }
}

// ==========================================================================
// 2. WIDGET INTERATIVO DE STATUS DIÁRIO DA CIDADE (ESTRATÉGIA NYC.gov)
// ==========================================================================
function initDailyStatusWidget() {
  const dateLabel = document.getElementById('daily-status-date-label');
  const listEl = document.getElementById('daily-status-list');
  const detailBox = document.getElementById('daily-status-detail-box');
  const detailTitle = document.getElementById('daily-detail-title');
  const detailDesc = document.getElementById('daily-detail-desc');
  const backBtn = document.getElementById('btn-status-back');
  const openMapBtn = document.getElementById('btn-daily-open-map');
  const openMapBtnLabel = document.getElementById('daily-detail-map-btn-label');
  const secondaryLink = document.getElementById('btn-daily-secondary-link');

  const STATUS_TITLES = {
    waste: 'Coleta de Lixo e Pontos de Reciclagem',
    works: 'Obras e Trânsito nas Vias',
    health: 'UPAs 24h, UBS e Vacinação',
    civilDefense: 'Defesa Civil e Alerta Climático'
  };

  if (dateLabel) {
    const today = new Date();
    const formatted = today.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
    dateLabel.textContent = formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  document.querySelectorAll('.daily-status-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.statusKey;
      const cityData = getActiveCityData(currentCityKey);
      const info = cityData.dailyStatus?.[key];
      if (!info || !detailBox || !listEl) return;

      if (detailTitle) detailTitle.textContent = STATUS_TITLES[key] || 'Status Municipal';
      if (detailDesc) detailDesc.textContent = info.detail;

      if (openMapBtn) {
        openMapBtn.dataset.mapCat = info.mapCategory || key;
      }
      if (openMapBtnLabel) {
        openMapBtnLabel.textContent = info.primaryActionLabel || 'Ver pontos no Mapa Interativo';
      }
      if (secondaryLink) {
        secondaryLink.href = info.secondaryUrl || 'healthPage.html';
        secondaryLink.textContent = `${info.secondaryLabel || 'Ir para a aba do serviço'} →`;
      }

      listEl.setAttribute('hidden', '');
      detailBox.removeAttribute('hidden');
    });
  });

  if (openMapBtn) {
    openMapBtn.addEventListener('click', () => {
      const cat = openMapBtn.dataset.mapCat || 'health';
      if (typeof window.focusCivicMapCategory === 'function') {
        window.focusCivicMapCategory(cat);
      }
    });
  }

  if (backBtn && listEl && detailBox) {
    backBtn.addEventListener('click', () => {
      detailBox.setAttribute('hidden', '');
      listEl.removeAttribute('hidden');
    });
  }
}

// ==========================================================================
// 2.5. MAPA INTERATIVO DE UPAs, UBS, ECOPONTOS E OBRAS NA HOME
// ==========================================================================
function initHomeCivicMap() {
  if (typeof window.initCivicMapWidget !== 'function') return;
  window.initCivicMapWidget({
    instanceKey: 'main',
    mapContainerId: 'home-civic-leaflet-map',
    detailContainerId: 'home-civic-map-detail',
    pillsContainerId: 'home-civic-map-pills',
    tabsContainerId: 'home-civic-map-tabs',
    cityLabelId: 'home-map-city-label',
    defaultCategory: 'all',
    widgetMode: 'mainPage'
  });
}

// ==========================================================================
// 3. SELETOR DE MUNICÍPIO (RIO DAS OSTRAS / SAPUCAIA DO SUL)
// ==========================================================================
function initMunicipalitySelector() {
  const toggleBtn = document.getElementById('municipality-toggle');
  const menu = document.getElementById('municipality-menu');
  const cityOptions = document.querySelectorAll('.city-option');

  if (!toggleBtn || !menu) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = menu.classList.contains('show');
    menu.classList.toggle('show', !isOpen);
    toggleBtn.setAttribute('aria-expanded', String(!isOpen));
  });

  cityOptions.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const cityKey = btn.dataset.city;

      if (typeof setActiveCity === 'function') {
        setActiveCity(cityKey);
      } else {
        updateCityContent(cityKey, 'all');
      }

      menu.classList.remove('show');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !toggleBtn.contains(e.target)) {
      menu.classList.remove('show');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

// ==========================================================================
// 4. ATUALIZAÇÃO DE CONTEÚDO COM DADOS REAIS DO CIDADÃO E DO MUNICÍPIO
// ==========================================================================
function updateCityContent(cityKey, typeFilter = 'all') {
  currentCityKey = cityKey;
  currentTypeFilter = typeFilter;

  const citizen = (typeof getActiveCitizen === 'function') ? getActiveCitizen() : null;
  const cityData = (typeof getActiveCityData === 'function') ? getActiveCityData(cityKey) : null;

  // 1. Atualiza Hero com os dados reais da pessoa logada
  if (citizen) {
    const firstName = citizen.name.split(' ')[0];
    const greetingEl = document.getElementById('page-greeting');
    const summaryEl = document.getElementById('page-citizen-summary');
    const tagEl = document.getElementById('hero-citizen-tag');
    const syncLabel = document.getElementById('dashboard-sync-label');

    if (greetingEl) greetingEl.textContent = `Olá, ${firstName}! O que você precisa resolver hoje?`;
    if (summaryEl) {
      summaryEl.innerHTML = `CPF <strong>${citizen.cpf}</strong> · Matrícula <strong>${citizen.enrollment}</strong> · ${citizen.street}, ${citizen.number} (${citizen.neighborhood})`;
    }
    if (tagEl) tagEl.textContent = `SESSÃO VERIFICADA · ${citizen.accountLevel.toUpperCase()}`;
    if (syncLabel) syncLabel.innerHTML = `Dados reais de: <strong>${citizen.name}</strong> (${citizen.cpf})`;

    // Mini Card de Perfil na Coluna 1
    const avEl = document.getElementById('dash-cit-avatar');
    const nameEl = document.getElementById('dash-cit-name');
    const lvlEl = document.getElementById('dash-cit-level');
    const cpfEl = document.getElementById('dash-cit-cpf');
    const susEl = document.getElementById('dash-cit-sus');
    const addrEl = document.getElementById('dash-cit-addr');

    if (avEl) avEl.textContent = citizen.avatarInitials || 'CC';
    if (nameEl) nameEl.textContent = citizen.name;
    if (lvlEl) lvlEl.textContent = citizen.accountLevel;
    if (cpfEl) cpfEl.textContent = citizen.cpf;
    if (susEl) susEl.textContent = citizen.susCard;
    if (addrEl) addrEl.textContent = `${citizen.street}, ${citizen.number} · ${citizen.neighborhood}`;
  }

  // 2. Atualiza Widget de Status Diário da Cidade e Bairros na Faixa Spotlight
  if (cityData && cityData.dailyStatus) {
    const wBadge = document.getElementById('status-badge-waste');
    const wkBadge = document.getElementById('status-badge-works');
    const hBadge = document.getElementById('status-badge-health');
    const cBadge = document.getElementById('status-badge-civil');

    if (wBadge) wBadge.textContent = cityData.dailyStatus.waste.status;
    if (wkBadge) wkBadge.textContent = cityData.dailyStatus.works.status;
    if (hBadge) hBadge.textContent = cityData.dailyStatus.health.status;
    if (cBadge) cBadge.textContent = cityData.dailyStatus.civilDefense.status;

    const spotlightBairro = document.getElementById('spotlight-bairro');
    if (spotlightBairro && Array.isArray(cityData.bairros)) {
      const preferredBairro = citizen?.neighborhood || cityData.bairros[0];
      spotlightBairro.innerHTML = cityData.bairros.map(b =>
        `<option value="${b}" ${b === preferredBairro ? 'selected' : ''}>${b} (${cityData.shortName})</option>`
      ).join('');
    }
  }

  // 3. Atualiza Carrossel de Notícias & Eventos
  const wrapper = document.getElementById('carousel-wrapper');
  const carouselCityName = document.getElementById('carousel-city-name');
  const modalCityBadge = document.getElementById('modal-bill-city');
  const cityNameFull = cityKey === 'rio-das-ostras' ? 'Rio das Ostras · RJ' : 'Sapucaia do Sul · RS';

  if (carouselCityName) carouselCityName.textContent = cityNameFull;
  if (modalCityBadge) modalCityBadge.textContent = cityNameFull;

  if (wrapper) {
    const cards = wrapper.querySelectorAll('.news-card');
    const visibleCards = [];

    cards.forEach((card) => {
      const isThisCity = card.dataset.city === currentCityKey;
      const isThisType = typeFilter === 'all' || card.dataset.type === typeFilter;
      const shouldShow = isThisCity && isThisType;

      card.style.display = shouldShow ? 'flex' : 'none';
      if (shouldShow) visibleCards.push(card);
    });

    wrapper.scrollTo({ left: 0, behavior: 'smooth' });
    rebuildCarouselDots(visibleCards.length);
  }

  // 4. Atualiza Tributos (Coluna 2) com os boletos reais do Cidadão
  if (citizen && Array.isArray(citizen.bills) && citizen.bills.length > 0) {
    const bill1 = citizen.bills[0];
    const bill2 = citizen.bills[1];

    const billsCount = document.getElementById('dash-bills-count');
    if (billsCount) billsCount.textContent = `${citizen.bills.length} a resolver`;

    const billTitle = document.getElementById('main-bill-title');
    const billProp = document.getElementById('main-bill-prop');
    const billVal = document.getElementById('main-bill-val');
    const billDue = document.getElementById('main-bill-due');
    const billBtn = document.getElementById('main-bill-btn');

    if (billTitle) billTitle.textContent = bill1.title;
    if (billProp) billProp.textContent = bill1.property || `${citizen.street}, ${citizen.number}`;
    if (billVal) billVal.textContent = bill1.val;
    if (billDue) billDue.textContent = bill1.due;
    if (billBtn) {
      billBtn.dataset.bill = bill1.title;
      billBtn.dataset.value = bill1.rawVal;
      billBtn.dataset.due = bill1.due;
    }

    const secondCard = document.getElementById('second-bill-card');
    if (bill2 && secondCard) {
      secondCard.style.display = 'block';
      const b2Title = document.getElementById('main-bill2-title');
      const b2Val = document.getElementById('main-bill2-val');
      const b2Due = document.getElementById('main-bill2-due');
      const b2Btn = document.getElementById('main-bill2-btn');
      if (b2Title) b2Title.textContent = bill2.title;
      if (b2Val) b2Val.textContent = bill2.val;
      if (b2Due) b2Due.textContent = bill2.due;
      if (b2Btn) {
        b2Btn.dataset.bill = bill2.title;
        b2Btn.dataset.value = bill2.rawVal;
        b2Btn.dataset.due = bill2.due;
      }
    } else if (secondCard) {
      secondCard.style.display = 'none';
    }
  }

  // 5. Atualiza Agendamento SUS (Coluna 2) com os dados reais do Cidadão
  if (citizen && citizen.appointment) {
    const app = citizen.appointment;
    const appDay = document.getElementById('main-app-day');
    const appMonth = document.getElementById('main-app-month');
    const appTitle = document.getElementById('main-app-title');
    const appTime = document.getElementById('main-app-time');
    const appPlace = document.getElementById('main-app-place');
    const appSusTag = document.getElementById('main-app-sus-tag');

    if (appDay) appDay.textContent = app.day;
    if (appMonth) appMonth.textContent = app.month;
    if (appTitle) appTitle.textContent = app.title;
    if (appTime) appTime.textContent = app.time;
    if (appPlace) appPlace.textContent = app.place;
    if (appSusTag) appSusTag.textContent = `SUS: ${citizen.susCard}`;
  }

  // 6. Atualiza Solicitação 156 e Stepper de 4 Etapas (Coluna 3)
  if (citizen && citizen.activeRequest) {
    const req = citizen.activeRequest;
    const reqCat = document.getElementById('main-req-category');
    const reqBadge = document.getElementById('main-req-badge');
    const reqTitle = document.getElementById('main-req-title');
    const reqMeta = document.getElementById('main-req-meta');
    const reqUpdateBox = document.getElementById('main-req-update-box');

    if (reqCat) reqCat.textContent = req.categoryLabel || 'Zeladoria Municipal';
    if (reqBadge) {
      reqBadge.textContent = req.badge || 'Em Análise';
      reqBadge.className = `status-pill ${req.step === 4 ? 'confirmed' : 'in-analysis'}`;
    }
    if (reqTitle) reqTitle.textContent = req.title;
    if (reqMeta) reqMeta.textContent = `${req.protocol} · ${req.address || citizen.neighborhood}`;
    if (reqUpdateBox) {
      reqUpdateBox.innerHTML = `
        <strong>${req.updateDate}</strong>
        <p>${req.updateText}</p>
      `;
    }

    // Atualiza visualmente o Stepper de 1 a 4
    const activeStep = Number(req.step) || 2;
    const stepEls = document.querySelectorAll('#main-req-stepper .stepper-step');
    const lineEls = document.querySelectorAll('#main-req-stepper .stepper-line');

    stepEls.forEach(el => {
      const s = Number(el.dataset.step);
      const circle = el.querySelector('.step-circle');
      el.classList.remove('completed', 'active');
      if (s < activeStep || activeStep === 4) {
        el.classList.add('completed');
        if (circle) circle.textContent = '✓';
      } else if (s === activeStep) {
        el.classList.add('active');
        if (circle) circle.textContent = String(s);
      } else {
        if (circle) circle.textContent = String(s);
      }
    });

    lineEls.forEach(line => {
      const l = Number(line.dataset.line);
      line.classList.toggle('completed', l < activeStep);
    });
  }
}

// ==========================================================================
// 5. CARROSSEL DE NOTÍCIAS & EVENTOS
// ==========================================================================
function initNewsCarousel() {
  const wrapper = document.getElementById('carousel-wrapper');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const filterChips = document.querySelectorAll('.filter-chip');

  if (!wrapper) return;

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      wrapper.scrollBy({ left: -360, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      wrapper.scrollBy({ left: 360, behavior: 'smooth' });
    });
  }

  wrapper.addEventListener('scroll', updateActiveDot);

  filterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      filterChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      const filterType = chip.dataset.filter;
      updateCityContent(currentCityKey, filterType);
    });
  });

  startCarouselAutoPlay();
  wrapper.addEventListener('mouseenter', stopCarouselAutoPlay);
  wrapper.addEventListener('mouseleave', startCarouselAutoPlay);
}

function rebuildCarouselDots(count) {
  const dotsContainer = document.getElementById('carousel-dots');
  if (!dotsContainer) return;

  dotsContainer.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    dot.className = `dot ${i === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => {
      scrollToVisibleCard(i);
    });
    dotsContainer.appendChild(dot);
  }
}

function scrollToVisibleCard(index) {
  const wrapper = document.getElementById('carousel-wrapper');
  if (!wrapper) return;
  const visibleCards = wrapper.querySelectorAll('.news-card:not([style*="display: none"])');
  if (visibleCards[index]) {
    visibleCards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  }
}

function updateActiveDot() {
  const wrapper = document.getElementById('carousel-wrapper');
  const dots = document.querySelectorAll('.carousel-dots .dot');
  if (!wrapper || !dots.length) return;

  const scrollLeft = wrapper.scrollLeft;
  const cardWidth = 356;
  const activeIndex = Math.min(Math.round(scrollLeft / cardWidth), dots.length - 1);

  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === activeIndex);
  });
}

function startCarouselAutoPlay() {
  stopCarouselAutoPlay();
  carouselAutoPlayTimer = setInterval(() => {
    const wrapper = document.getElementById('carousel-wrapper');
    if (!wrapper) return;
    const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
    if (wrapper.scrollLeft >= maxScroll - 20) {
      wrapper.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      wrapper.scrollBy({ left: 360, behavior: 'smooth' });
    }
  }, 5000);
}

function stopCarouselAutoPlay() {
  if (carouselAutoPlayTimer) {
    clearInterval(carouselAutoPlayTimer);
    carouselAutoPlayTimer = null;
  }
}

// ==========================================================================
// 6. RECURSOS DE ACESSIBILIDADE & LEITURA DE VOZ PERSONALIZADA
// ==========================================================================
function initAccessibilityFeatures() {
  const btnFont = document.getElementById('btn-increase-font');
  if (btnFont) {
    btnFont.addEventListener('click', () => {
      document.documentElement.classList.toggle('font-large');
      const isLarge = document.documentElement.classList.contains('font-large');
      btnFont.innerHTML = isLarge
        ? '<strong>A-</strong> Normalizar fonte'
        : '<strong>A+</strong> Aumentar fonte';
    });
  }

  const btnContrast = document.getElementById('btn-toggle-contrast');
  if (btnContrast) {
    btnContrast.addEventListener('click', () => {
      document.body.classList.toggle('alto-contraste');
    });
  }

  const btnListen = document.getElementById('btn-listen');
  const listenText = document.getElementById('listen-btn-text');

  if (btnListen && 'speechSynthesis' in window) {
    let isPlaying = false;

    btnListen.addEventListener('click', () => {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        isPlaying = false;
        btnListen.classList.remove('playing');
        if (listenText) listenText.textContent = 'Ouvir meu resumo';
        return;
      }

      const citizen = (typeof getActiveCitizen === 'function') ? getActiveCitizen() : null;
      const cityName = document.getElementById('current-city-label')?.textContent || 'Sua cidade';
      const citName = citizen ? citizen.name : 'Cidadão';
      const billTitle = citizen?.bills?.[0]?.title || 'IPTU 2026';
      const billVal = citizen?.bills?.[0]?.val || 'R$ 148,50';
      const appTitle = citizen?.appointment?.title || 'Clínico Geral';
      const reqTitle = citizen?.activeRequest?.title || 'Iluminação pública';
      const reqStatus = citizen?.activeRequest?.badge || 'Em análise';

      const textToRead = `Olá, ${citName}! Bem-vindo ao Portal Oficial Conecta Cidadão de ${cityName}. ` +
        `No seu CPF constam tributos como ${billTitle} no valor de ${billVal}. ` +
        `Seu agendamento do SUS para ${appTitle} está confirmado. ` +
        `O seu protocolo de zeladoria sobre ${reqTitle} encontra-se com status: ${reqStatus}.`;

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.05;

      utterance.onstart = () => {
        isPlaying = true;
        btnListen.classList.add('playing');
        if (listenText) listenText.textContent = 'Pausar leitura';
      };

      utterance.onend = () => {
        isPlaying = false;
        btnListen.classList.remove('playing');
        if (listenText) listenText.textContent = 'Ouvir meu resumo';
      };

      utterance.onerror = () => {
        isPlaying = false;
        btnListen.classList.remove('playing');
        if (listenText) listenText.textContent = 'Ouvir meu resumo';
      };

      window.speechSynthesis.speak(utterance);
    });
  }
}

// ==========================================================================
// 7. MODAIS INTERATIVOS (GUIA PIX E AGENDAMENTO SUS DO CIDADÃO)
// ==========================================================================
function initModals() {
  const modalBill = document.getElementById('modal-bill');
  const btnCloseBill = document.getElementById('modal-bill-close');
  const btnDoneBill = document.getElementById('btn-close-modal-bill');
  const billButtons = document.querySelectorAll('.debt-action-btn');

  const modalTitle = document.getElementById('modal-bill-title');
  const modalTaxpayer = document.getElementById('modal-bill-taxpayer');
  const modalAmount = document.getElementById('modal-bill-amount');
  const modalDue = document.getElementById('modal-bill-due');
  const btnCopyPix = document.getElementById('btn-copy-pix');
  const pixInput = document.getElementById('pix-input-code');
  const btnDownloadPdf = document.getElementById('btn-download-pdf');

  let activeBillContext = { title: 'IPTU 2026 · Parcela Atual', amount: 'R$ 148,50', due: '28 nov 2026' };

  billButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const citizen = (typeof getActiveCitizen === 'function') ? getActiveCitizen() : null;
      const bill = btn.dataset.bill || 'Guia Municipal';
      const val = btn.dataset.value || '148,50';
      const due = btn.dataset.due || 'Vencimento próximo';

      activeBillContext = { title: bill, amount: `R$ ${val}`, due };

      if (modalTitle) modalTitle.textContent = `${bill} - Guia Oficial`;
      if (modalTaxpayer && citizen) {
        modalTaxpayer.textContent = `Contribuinte: ${citizen.name} (CPF ${citizen.cpf})`;
      }
      if (modalAmount) modalAmount.textContent = `R$ ${val}`;
      if (modalDue) modalDue.textContent = `Vencimento em ${due}`;

      if (modalBill && typeof modalBill.showModal === 'function') {
        modalBill.showModal();
      }
    });
  });

  const closeBillModal = () => {
    if (modalBill) modalBill.close();
  };

  if (btnCloseBill) btnCloseBill.addEventListener('click', closeBillModal);
  if (btnDoneBill) btnDoneBill.addEventListener('click', closeBillModal);

  if (btnCopyPix && pixInput) {
    btnCopyPix.addEventListener('click', () => {
      pixInput.select();
      navigator.clipboard.writeText(pixInput.value).then(() => {
        const originalText = btnCopyPix.textContent;
        btnCopyPix.textContent = 'Copiado! ✓';
        btnCopyPix.style.backgroundColor = '#00995D';
        setTimeout(() => {
          btnCopyPix.textContent = originalText;
          btnCopyPix.style.backgroundColor = '';
        }, 2200);
      });
    });
  }

  if (btnDownloadPdf) {
    btnDownloadPdf.addEventListener('click', () => {
      closeBillModal();
      if (typeof openOfficialReceiptModal === 'function') {
        openOfficialReceiptModal({
          type: 'dam',
          title: activeBillContext.title,
          amount: activeBillContext.amount,
          dueDate: activeBillContext.due
        });
      }
    });
  }

  // Modal de Agendamento SUS
  const modalAppointment = document.getElementById('modal-appointment');
  const btnOpenAppointment = document.getElementById('btn-open-appointment');
  const btnCloseAppointment = document.getElementById('modal-appointment-close');
  const btnOkAppointment = document.getElementById('btn-confirm-appointment-ok');
  const btnReschedule = document.getElementById('btn-reschedule');
  const btnPrintSusVoucher = document.getElementById('btn-print-sus-voucher');
  const btnMainPrintProtocol = document.getElementById('btn-main-print-protocol');

  if (btnOpenAppointment && modalAppointment) {
    btnOpenAppointment.addEventListener('click', () => {
      const citizen = (typeof getActiveCitizen === 'function') ? getActiveCitizen() : null;
      if (citizen && citizen.appointment) {
        const pEl = document.getElementById('modal-app-patient');
        const profEl = document.getElementById('modal-app-prof');
        const dtEl = document.getElementById('modal-app-datetime');
        const locEl = document.getElementById('modal-app-location');

        if (pEl) pEl.textContent = `${citizen.name} · Cartão SUS ${citizen.susCard}`;
        if (profEl) profEl.textContent = citizen.appointment.title;
        if (dtEl) dtEl.textContent = `${citizen.appointment.day}/${citizen.appointment.month} · ${citizen.appointment.time}`;
        if (locEl) locEl.textContent = citizen.appointment.place;
      }
      modalAppointment.showModal();
    });
  }

  const closeAppointmentModal = () => {
    if (modalAppointment) modalAppointment.close();
  };

  if (btnCloseAppointment) btnCloseAppointment.addEventListener('click', closeAppointmentModal);
  if (btnOkAppointment) btnOkAppointment.addEventListener('click', closeAppointmentModal);

  if (btnPrintSusVoucher) {
    btnPrintSusVoucher.addEventListener('click', () => {
      closeAppointmentModal();
      if (typeof openOfficialReceiptModal === 'function') {
        openOfficialReceiptModal({
          type: 'sus'
        });
      }
    });
  }

  if (btnMainPrintProtocol) {
    btnMainPrintProtocol.addEventListener('click', () => {
      if (typeof openOfficialReceiptModal === 'function') {
        openOfficialReceiptModal({
          type: 'protocol'
        });
      }
    });
  }

  if (btnReschedule) {
    btnReschedule.addEventListener('click', () => {
      window.location.href = 'healthPage.html';
    });
  }

  const btnHelp = document.getElementById('btn-open-help');
  if (btnHelp) {
    btnHelp.addEventListener('click', () => {
      alert(
        'Canais Oficiais ConectaCidadão:\n\n' +
        '• Central 156 / 311: Atendimento gratuito 24h\n' +
        '• Ouvidoria Municipal: ouvidoria@conectacidadao.gov.br\n' +
        '• Atendimento Presencial: Segunda a Sexta, das 08h às 17h'
      );
    });
  }

  const btnPrivacy = document.getElementById('btn-open-privacy');
  if (btnPrivacy) {
    btnPrivacy.addEventListener('click', () => {
      window.location.href = 'privacyPage.html';
    });
  }
}
