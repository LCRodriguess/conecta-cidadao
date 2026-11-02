// ==========================================================================
// CONECTA CIDADÃO - GERENCIADOR GLOBAL DE MUNICÍPIO (cityManager.js)
// Garante persistência da cidade selecionada e sincronização em todas as abas:
// Reparos, Solicitações, Ocorrências, Empregos, Eventos, Saúde e Tributos.
// ==========================================================================

const CITY_STORAGE_KEY = 'conecta_cidadao_active_city';

const MUNICIPALITIES = {
  'rio-das-ostras': {
    key: 'rio-das-ostras',
    name: 'Rio das Ostras · RJ',
    nameClean: 'Rio das Ostras - RJ',
    state: 'RJ',
    shortName: 'Rio das Ostras',
    otherKey: 'sapucaia',
    otherName: 'Sapucaia do Sul · RS',
    otherClean: 'Sapucaia do Sul - RS',
    bairros: ['Costa Azul', 'Centro', 'Jardim Mariléa', 'Bela Vista', 'Extensão do Bosque', 'Enseada das Gaivotas', 'Cantagalo'],
    ouvidoriaPhone: '156 ou (22) 2764-1234',
    prefeitura: 'Prefeitura Municipal de Rio das Ostras',
    citizenAddress: 'Rua das Gaivotas, 124 — Costa Azul, Rio das Ostras · RJ',
    citizenEnrollment: 'RO-2026-9812',
    electoralZone: '184ª Zona Eleitoral · Rio das Ostras',
    taxOffice: 'Secretaria Municipal de Fazenda de Rio das Ostras (SEMF)',
    taxDoc: '01.04.182.0294.001',
    taxProperty: 'Rua das Gaivotas, 124 · Bairro Costa Azul · Rio das Ostras',
    taxPixKey: 'tributos@riodasostras.rj.gov.br',
    taxCnpj: '39.223.581/0001-25',
    taxDamAmount: '142,50',
    taxBarcode: '81670000001-4 42502124202-6 89202610281-2 01041820294-8'
  },
  'sapucaia': {
    key: 'sapucaia',
    name: 'Sapucaia do Sul · RS',
    nameClean: 'Sapucaia do Sul - RS',
    state: 'RS',
    shortName: 'Sapucaia do Sul',
    otherKey: 'rio-das-ostras',
    otherName: 'Rio das Ostras · RJ',
    otherClean: 'Rio das Ostras - RJ',
    bairros: ['Centro', 'Bairro Vargas', 'Lomba da Palmeira', 'Cohab', 'Piratini', 'Nova Sapucaia', 'Capão da Cruz'],
    ouvidoriaPhone: '156 ou (51) 3451-8000',
    prefeitura: 'Prefeitura Municipal de Sapucaia do Sul',
    citizenAddress: 'Av. Sapucaia, 850 — Centro, Sapucaia do Sul · RS',
    citizenEnrollment: 'SS-2026-4431',
    electoralZone: '108ª Zona Eleitoral · Sapucaia do Sul',
    taxOffice: 'Secretaria Municipal da Fazenda de Sapucaia do Sul (SMF)',
    taxDoc: '02.11.045.0118.001',
    taxProperty: 'Av. Sapucaia, 850 · Bairro Centro · Sapucaia do Sul',
    taxPixKey: 'tributos@sapucaiadosul.rs.gov.br',
    taxCnpj: '88.185.120/0001-28',
    taxDamAmount: '162,30',
    taxBarcode: '81670000001-8 62302124202-1 89202610282-5 02110450118-3'
  }
};

// Obtém os dados completos do município ativo ou especificado
function getActiveCityData(key) {
  const k = key || getActiveCity();
  return MUNICIPALITIES[k] || MUNICIPALITIES['rio-das-ostras'];
}

// Obtém a cidade atualmente ativa (ou padrão 'rio-das-ostras')
function getActiveCity() {
  try {
    const stored = localStorage.getItem(CITY_STORAGE_KEY);
    if (stored && MUNICIPALITIES[stored]) {
      return stored;
    }
  } catch (e) {
    console.warn('LocalStorage inacessível:', e);
  }
  return 'rio-das-ostras';
}

// Salva e notifica todas as partes da aplicação sobre a troca de cidade
function setActiveCity(cityKey) {
  if (!MUNICIPALITIES[cityKey]) return;
  try {
    localStorage.setItem(CITY_STORAGE_KEY, cityKey);
  } catch (e) {
    console.warn('Erro ao salvar cidade:', e);
  }

  // Atualiza elementos visuais do cabeçalho em qualquer página
  updateHeaderMunicipalityUI(cityKey);

  // Dispara evento customizado para que a página atualize seus dados
  const event = new CustomEvent('conectaCityChanged', {
    detail: {
      cityKey: cityKey,
      cityData: MUNICIPALITIES[cityKey]
    }
  });
  window.dispatchEvent(event);
}

// Atualiza o seletor do cabeçalho (SEU MUNICÍPIO)
function updateHeaderMunicipalityUI(cityKey) {
  const data = MUNICIPALITIES[cityKey] || MUNICIPALITIES['rio-das-ostras'];

  const activeNameEl = document.getElementById('muni-active-name') || document.getElementById('current-city-label');
  const altNameEl = document.getElementById('muni-alt-name') || document.getElementById('other-city-label');

  if (activeNameEl) activeNameEl.textContent = data.name;
  if (altNameEl) altNameEl.textContent = `Também disponível: ${data.otherName}`;

  // Atualiza cartões da conta, se existirem
  const cardActive = document.getElementById('card-muni-active');
  const cardAlt = document.getElementById('card-muni-alt');
  if (cardActive) cardActive.textContent = data.nameClean;
  if (cardAlt) cardAlt.textContent = `Também disponível: ${data.otherClean}`;

  // Atualiza opções ativas no dropdown
  document.querySelectorAll('.muni-opt, .city-option').forEach(opt => {
    const isThis = opt.dataset.city === cityKey;
    opt.classList.toggle('active', isThis);
  });
}

// Inicializa automaticamente seletores de município na página
document.addEventListener('DOMContentLoaded', () => {
  const currentCity = getActiveCity();
  updateHeaderMunicipalityUI(currentCity);

  // Seletor padrão de páginas filhas
  const muniToggle = document.getElementById('muni-toggle');
  const muniDropdown = document.getElementById('muni-dropdown');
  const btnChangeCity = document.getElementById('btn-change-city');

  if (muniToggle && muniDropdown) {
    muniToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      muniDropdown.classList.toggle('show');
    });
  }

  if (btnChangeCity && muniDropdown) {
    btnChangeCity.addEventListener('click', (e) => {
      e.stopPropagation();
      muniDropdown.classList.toggle('show');
    });
  }

  document.querySelectorAll('.muni-opt').forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      const city = opt.dataset.city;
      setActiveCity(city);
      if (muniDropdown) muniDropdown.classList.remove('show');
    });
  });

  document.addEventListener('click', () => {
    if (muniDropdown) muniDropdown.classList.remove('show');
  });
});
