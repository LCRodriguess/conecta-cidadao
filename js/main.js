// ==========================================================================
// CONECTA CIDADÃO - LÓGICA DA PÁGINA PRINCIPAL (main.js)
// Notícias & Eventos filtrados estritamente pela cidade selecionada
// ==========================================================================

let currentCityKey = (typeof getActiveCity === 'function') ? getActiveCity() : 'rio-das-ostras';
let currentTypeFilter = 'all';
let carouselAutoPlayTimer = null;

const CITY_DASHBOARD_DATA = {
  'rio-das-ostras': {
    bill: {
      title: 'IPTU 2026',
      val: 'R$ 148,50',
      rawVal: '148,50',
      due: '26 out 2026',
      place: 'Prefeitura Municipal de Rio das Ostras'
    },
    appointment: {
      day: '21',
      month: 'OUT',
      title: 'Clínico geral',
      time: 'Quarta-feira · 09h30',
      place: 'UBS Central — Rua das Flores, 80 · Rio das Ostras'
    },
    request: {
      title: 'Iluminação pública apagada',
      protocol: 'SIM-2026-0042 · Aberto em 18 out 2026',
      badge: 'Em Análise',
      updateDate: 'Nova atualização · 19 out',
      updateText: 'Seu pedido de reparo na Rua das Gaivotas (Costa Azul) está em análise com os técnicos municipais de Rio das Ostras.'
    }
  },
  'sapucaia': {
    bill: {
      title: 'IPTU 2026',
      val: 'R$ 162,30',
      rawVal: '162,30',
      due: '28 out 2026',
      place: 'Prefeitura Municipal de Sapucaia do Sul'
    },
    appointment: {
      day: '22',
      month: 'OUT',
      title: 'Clínico geral',
      time: 'Quinta-feira · 10h15',
      place: 'UBS Bairro Vargas — Av. Cel. Theodomiro · Sapucaia do Sul'
    },
    request: {
      title: 'Reparo asfáltico e drenagem',
      protocol: 'SIM-2026-0089 · Aberto em 19 out 2026',
      badge: 'Em Análise',
      updateDate: 'Nova atualização · 20 out',
      updateText: 'Vistoria programada na Av. Sapucaia (Lomba da Palmeira) pelo Departamento de Obras e Pavimentação de Sapucaia do Sul.'
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  currentCityKey = (typeof getActiveCity === 'function') ? getActiveCity() : 'rio-das-ostras';
  initMunicipalitySelector();
  initNewsCarousel();
  initAccessibilityFeatures();
  initModals();

  // Atualiza todo o conteúdo da tela com a cidade ativa
  updateCityContent(currentCityKey, 'all');

  // Ouve evento global do cityManager para trocar de cidade em tempo real
  window.addEventListener('conectaCityChanged', (e) => {
    if (e.detail && e.detail.cityKey) {
      updateCityContent(e.detail.cityKey, currentTypeFilter);
    }
  });
});

// ==========================================================================
// 1. SELETOR DE MUNICÍPIO (RIO DAS OSTRAS / SAPUCAIA DO SUL)
// ==========================================================================
function initMunicipalitySelector() {
  const toggleBtn = document.getElementById('municipality-toggle');
  const menu = document.getElementById('municipality-menu');
  const currentCityLabel = document.getElementById('current-city-label');
  const otherCityLabel = document.getElementById('other-city-label');
  const modalCityBadge = document.getElementById('modal-bill-city');
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
// 2. SISTEMA DE BANNER & CARROSSEL (NOTÍCIAS & EVENTOS DA CIDADE SELECIONADA)
// ==========================================================================
function initNewsCarousel() {
  const wrapper = document.getElementById('carousel-wrapper');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const filterChips = document.querySelectorAll('.filter-chip');

  if (!wrapper) return;

  // Navegação Prev / Next
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

  // Atualização dos pontos ao rolar
  wrapper.addEventListener('scroll', updateActiveDot);

  // Filtros de Tipo de Conteúdo (Todos / Notícias / Eventos da cidade ativa)
  filterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      filterChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      const filterType = chip.dataset.filter;
      updateCityContent(currentCityKey, filterType);
    });
  });

  // Rotação Automática do Carrossel (com pausa no hover)
  startCarouselAutoPlay();

  wrapper.addEventListener('mouseenter', stopCarouselAutoPlay);
  wrapper.addEventListener('mouseleave', startCarouselAutoPlay);
}

// Atualiza o carrossel e todo o painel de serviços para exibir SOMENTE os dados da cidade selecionada
function updateCityContent(cityKey, typeFilter = 'all') {
  currentCityKey = cityKey;
  currentTypeFilter = typeFilter;

  const wrapper = document.getElementById('carousel-wrapper');
  const carouselCityName = document.getElementById('carousel-city-name');
  const modalCityBadge = document.getElementById('modal-bill-city');

  // Atualiza nome da cidade no título do carrossel e no modal
  const cityNameFull = cityKey === 'rio-das-ostras' ? 'Rio das Ostras · RJ' : 'Sapucaia do Sul · RS';
  if (carouselCityName) carouselCityName.textContent = cityNameFull;
  if (modalCityBadge) modalCityBadge.textContent = cityNameFull;

  // 1. Atualiza notícias e eventos do carrossel
  if (wrapper) {
    const cards = wrapper.querySelectorAll('.news-card');
    const visibleCards = [];

    cards.forEach((card) => {
      const isThisCity = card.dataset.city === currentCityKey;
      const isThisType = typeFilter === 'all' || card.dataset.type === typeFilter;
      const shouldShow = isThisCity && isThisType;

      card.style.display = shouldShow ? 'flex' : 'none';
      if (shouldShow) {
        visibleCards.push(card);
      }
    });

    wrapper.scrollTo({ left: 0, behavior: 'smooth' });
    rebuildCarouselDots(visibleCards.length);
  }

  // 2. Atualiza os dados específicos da cidade na Dashboard (Reparos, Solicitações, Saúde, Tributos)
  const cityData = CITY_DASHBOARD_DATA[cityKey] || CITY_DASHBOARD_DATA['rio-das-ostras'];

  // Pendência / IPTU
  const billTitle = document.getElementById('main-bill-title');
  const billVal = document.getElementById('main-bill-val');
  const billDue = document.getElementById('main-bill-due');
  const billBtn = document.getElementById('main-bill-btn');
  if (billTitle) billTitle.textContent = cityData.bill.title;
  if (billVal) billVal.textContent = cityData.bill.val;
  if (billDue) billDue.textContent = cityData.bill.due;
  if (billBtn) {
    billBtn.dataset.bill = cityData.bill.title;
    billBtn.dataset.value = cityData.bill.rawVal;
    billBtn.dataset.due = cityData.bill.due;
  }

  // Agendamento de Saúde
  const appDay = document.getElementById('main-app-day');
  const appMonth = document.getElementById('main-app-month');
  const appTitle = document.getElementById('main-app-title');
  const appTime = document.getElementById('main-app-time');
  const appPlace = document.getElementById('main-app-place');
  if (appDay) appDay.textContent = cityData.appointment.day;
  if (appMonth) appMonth.textContent = cityData.appointment.month;
  if (appTitle) appTitle.textContent = cityData.appointment.title;
  if (appTime) appTime.textContent = cityData.appointment.time;
  if (appPlace) appPlace.textContent = cityData.appointment.place;

  // Solicitação / Reparo Urbano
  const reqTitle = document.getElementById('main-req-title');
  const reqMeta = document.getElementById('main-req-meta');
  const reqUpdateBox = document.getElementById('main-req-update-box');
  if (reqTitle) reqTitle.textContent = cityData.request.title;
  if (reqMeta) reqMeta.textContent = cityData.request.protocol;
  if (reqUpdateBox) {
    reqUpdateBox.innerHTML = `
      <strong>${cityData.request.updateDate}</strong>
      <p>${cityData.request.updateText}</p>
    `;
  }
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
  const cardWidth = 356; // 340px card + 16px gap
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
// 3. RECURSOS DE ACESSIBILIDADE
// ==========================================================================
function initAccessibilityFeatures() {
  // Aumentar / Diminuir Fonte
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

  // Alto Contraste
  const btnContrast = document.getElementById('btn-toggle-contrast');
  if (btnContrast) {
    btnContrast.addEventListener('click', () => {
      document.body.classList.toggle('alto-contraste');
    });
  }

  // Ouvir Esta Página (Web Speech API)
  const btnListen = document.getElementById('btn-listen');
  const listenText = document.getElementById('listen-btn-text');

  if (btnListen && 'speechSynthesis' in window) {
    let isPlaying = false;

    btnListen.addEventListener('click', () => {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        isPlaying = false;
        btnListen.classList.remove('playing');
        if (listenText) listenText.textContent = 'Ouvir esta página';
        return;
      }

      const cityName = document.getElementById('current-city-label')?.textContent || 'Sua cidade';
      const cityHighlight = currentCityKey === 'rio-das-ostras'
        ? 'Principais destaques de Rio das Ostras: obras de macrodrenagem em Costazul e o Festival de Frutos do Mar e Jazz na Praia do Bosque.'
        : 'Principais destaques de Sapucaia do Sul: nova ala no Hospital Getúlio Vargas e a Feira de Artesanato na Praça General Freitas.';

      const textToRead = `Olá! Bem-vindo ao Conecta Cidadão de ${cityName}. ` +
        `Você tem 2 pendências a resolver: IPTU no valor de 148 reais e 50 centavos, e fatura de energia no valor de 350 reais. ` +
        `Você possui um agendamento de clínico geral confirmado para quarta-feira, 21 de outubro às 9h30. ` +
        `Sua solicitação de iluminação pública apagada está na etapa 2, em análise com a equipe técnica. ` +
        `${cityHighlight}`;

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
        if (listenText) listenText.textContent = 'Ouvir esta página';
      };

      utterance.onerror = () => {
        isPlaying = false;
        btnListen.classList.remove('playing');
        if (listenText) listenText.textContent = 'Ouvir esta página';
      };

      window.speechSynthesis.speak(utterance);
    });
  }
}

// ==========================================================================
// 4. MODAIS INTERATIVOS (GUIA PIX, AGENDAMENTO, AJUDA E PRIVACIDADE)
// ==========================================================================
function initModals() {
  // Modal de Guia Pix
  const modalBill = document.getElementById('modal-bill');
  const btnCloseBill = document.getElementById('modal-bill-close');
  const btnDoneBill = document.getElementById('btn-close-modal-bill');
  const billButtons = document.querySelectorAll('.debt-action-btn');

  const modalTitle = document.getElementById('modal-bill-title');
  const modalAmount = document.getElementById('modal-bill-amount');
  const modalDue = document.getElementById('modal-bill-due');
  const btnCopyPix = document.getElementById('btn-copy-pix');
  const pixInput = document.getElementById('pix-input-code');
  const btnDownloadPdf = document.getElementById('btn-download-pdf');

  billButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const bill = btn.dataset.bill || 'Guia Municipal';
      const val = btn.dataset.value || '0,00';
      const due = btn.dataset.due || 'Vencimento próximo';

      if (modalTitle) modalTitle.textContent = `${bill} - Guia de Pagamento`;
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

  // Copiar Código Pix
  if (btnCopyPix && pixInput) {
    btnCopyPix.addEventListener('click', () => {
      pixInput.select();
      navigator.clipboard.writeText(pixInput.value).then(() => {
        const originalText = btnCopyPix.textContent;
        btnCopyPix.textContent = 'Copiado! ✓';
        btnCopyPix.style.backgroundColor = '#16a34a';
        setTimeout(() => {
          btnCopyPix.textContent = originalText;
          btnCopyPix.style.backgroundColor = '';
        }, 2200);
      });
    });
  }

  // Download fictício do PDF
  if (btnDownloadPdf) {
    btnDownloadPdf.addEventListener('click', () => {
      alert('Guia DAM (Documento de Arrecadação Municipal) gerada com sucesso! O download do PDF iniciará.');
    });
  }

  // Modal de Agendamento
  const modalAppointment = document.getElementById('modal-appointment');
  const btnOpenAppointment = document.getElementById('btn-open-appointment');
  const btnCloseAppointment = document.getElementById('modal-appointment-close');
  const btnOkAppointment = document.getElementById('btn-confirm-appointment-ok');
  const btnReschedule = document.getElementById('btn-reschedule');

  if (btnOpenAppointment && modalAppointment) {
    btnOpenAppointment.addEventListener('click', () => {
      modalAppointment.showModal();
    });
  }

  const closeAppointmentModal = () => {
    if (modalAppointment) modalAppointment.close();
  };

  if (btnCloseAppointment) btnCloseAppointment.addEventListener('click', closeAppointmentModal);
  if (btnOkAppointment) btnOkAppointment.addEventListener('click', closeAppointmentModal);

  if (btnReschedule) {
    btnReschedule.addEventListener('click', () => {
      alert('Para remarcar a sua consulta médica, você será direcionado à página de Saúde Municipal.');
      window.location.href = 'healthPage.html';
    });
  }

  // Links de Apoio do Rodapé
  const btnHelp = document.getElementById('btn-open-help');
  if (btnHelp) {
    btnHelp.addEventListener('click', () => {
      alert(
        'Canais de Atendimento Conecta Cidadão:\n\n' +
        '• Central Telefônica: 156 (Ligações gratuitas)\n' +
        '• WhatsApp Oficial: (22) 99876-5432 (Atendimento 24h)\n' +
        '• Ouvidoria Geral: ouvidoria@conectacidadao.gov.br\n' +
        '• Horário presencial: Seg a Sex das 08h às 17h'
      );
    });
  }

  const btnPrivacy = document.getElementById('btn-open-privacy');
  if (btnPrivacy) {
    btnPrivacy.addEventListener('click', () => {
      alert(
        'Conecta Cidadão - Privacidade e Proteção de Dados:\n\n' +
        'Seus dados pessoais (CPF, endereço, protocolos e tributos) são protegidos em conformidade rigorosa com a LGPD (Lei 13.709/2018).\n\n' +
        'Utilizamos criptografia de ponta a ponta e seus dados nunca são compartilhados com terceiros.'
      );
    });
  }
}
