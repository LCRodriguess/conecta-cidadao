(function () {
  function escapeXml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  // Permite configurar a chave do Google Maps via window.GOOGLE_MAPS_API_KEY ou localStorage
  function getGoogleMapsApiKey() {
    if (typeof window !== 'undefined' && window.GOOGLE_MAPS_API_KEY) {
      return String(window.GOOGLE_MAPS_API_KEY).trim();
    }
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('GOOGLE_MAPS_API_KEY');
        if (stored) return stored.trim();
      }
    } catch (e) {
      // Ignora erro em navegadores restritos
    }
    return '';
  }

  // Gera URL do Google Street View Static API para as coordenadas exatas da fachada
  function getStreetViewStaticUrl(lat, lng, heading = 0, fov = 90, pitch = 5) {
    const key = getGoogleMapsApiKey();
    if (key) {
      return `https://maps.googleapis.com/maps/api/streetview?size=640x360&location=${lat},${lng}&fov=${fov}&heading=${heading}&pitch=${pitch}&key=${key}`;
    }
    return null;
  }

  // Gera fachada vetorial em SVG usada quando não há chave do Street View
  function createCivicFacadeSvg(type, mainLabel, subLabel) {
    const safeMain = escapeXml(mainLabel || 'REDE PÚBLICA MUNICIPAL');
    const safeSub = escapeXml(subLabel || 'CONECTA CIDADÃO');

    let bgSky = '#E0F2FE';
    let buildingColor = '#F8FAFC';
    let roofBannerColor = '#103FEF';
    let accentColor = '#38BDF8';
    let iconSvg = '';
    let emblemBadge = 'SERVIÇO PÚBLICO OFICIAL';

    switch (type) {
      case 'militarExército':
      case 'juntaMilitar':
        bgSky = '#DCFCE7';
        buildingColor = '#243B22';
        roofBannerColor = '#152514';
        accentColor = '#EAB308';
        iconSvg = `
          <!-- Brasão Exército Brasileiro / Junta -->
          <g transform="translate(320, 155)">
            <circle cx="0" cy="0" r="42" fill="#EAB308" stroke="#FFFFFF" stroke-width="3"/>
            <circle cx="0" cy="0" r="34" fill="#1E3A1A"/>
            <polygon points="0,-24 7,-8 24,-8 11,3 16,19 0,9 -16,19 -11,3 -24,-8 -7,-8" fill="#FACC15" stroke="#EAB308" stroke-width="1.5"/>
            <circle cx="0" cy="0" r="8" fill="#15803D" stroke="#FEF08A" stroke-width="2"/>
          </g>
          <!-- Mastro com Bandeira do Brasil -->
          <g transform="translate(90, 65)">
            <line x1="0" y1="0" x2="0" y2="185" stroke="#CBD5E1" stroke-width="3"/>
            <rect x="0" y="5" width="46" height="30" fill="#15803D" rx="2"/>
            <polygon points="23,7 43,20 23,33 3,20" fill="#FACC15"/>
            <circle cx="23" cy="20" r="6" fill="#1D4ED8"/>
            <path d="M18 20a6 6 0 0 0 10 1" stroke="#FFFFFF" stroke-width="1.2" fill="none"/>
          </g>
          <!-- Guarita Militar -->
          <g transform="translate(515, 170)">
            <rect x="0" y="0" width="34" height="80" fill="#FFFFFF" stroke="#152514" stroke-width="2"/>
            <polygon points="17,-15 -4,0 38,0" fill="#1E3A1A"/>
            <rect x="5" y="18" width="24" height="24" fill="#1E3A1A" rx="2"/>
            <line x1="5" y1="52" x2="29" y2="52" stroke="#EAB308" stroke-width="3"/>
          </g>
        `;
        emblemBadge = type === 'juntaMilitar'
          ? 'MINISTÉRIO DA DEFESA · JUNTA DE SERVIÇO MILITAR'
          : 'FORÇAS ARMADAS · EXÉRCITO BRASILEIRO';
        break;

      case 'upa24h':
      case 'prontoSocorro':
        bgSky = '#EFF6FF';
        buildingColor = '#FFFFFF';
        roofBannerColor = '#DC2626';
        accentColor = '#103FEF';
        iconSvg = `
          <g transform="translate(320, 155)">
            <circle cx="0" cy="0" r="40" fill="#FFFFFF" stroke="#DC2626" stroke-width="4"/>
            <rect x="-12" y="-30" width="24" height="60" fill="#DC2626" rx="4"/>
            <rect x="-30" y="-12" width="60" height="24" fill="#DC2626" rx="4"/>
            <circle cx="0" cy="0" r="10" fill="#FFFFFF"/>
            <text x="0" y="4" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="900" fill="#103FEF">24H</text>
          </g>
          <!-- Baia de Ambulância SAMU -->
          <g transform="translate(485, 195)">
            <rect x="0" y="0" width="75" height="52" fill="#FFFFFF" stroke="#DC2626" stroke-width="3" rx="6"/>
            <rect x="10" y="8" width="20" height="16" fill="#38BDF8" rx="2"/>
            <rect x="38" y="8" width="24" height="16" fill="#38BDF8" rx="2"/>
            <line x1="0" y1="34" x2="75" y2="34" stroke="#DC2626" stroke-width="5"/>
            <circle cx="18" cy="52" r="7" fill="#1E293B"/>
            <circle cx="58" cy="52" r="7" fill="#1E293B"/>
            <circle cx="36" cy="-3" r="5" fill="#DC2626"/>
          </g>
        `;
        emblemBadge = 'SISTEMA ÚNICO DE SAÚDE · UPA 24 HORAS';
        break;

      case 'hospital':
      case 'ubsMarilea':
      case 'ubsEdmeia':
      case 'ubsClaudio':
      case 'ubsPraiana':
      case 'farmacia':
        bgSky = '#F0FDF4';
        buildingColor = '#FFFFFF';
        roofBannerColor = '#103FEF';
        accentColor = '#10B981';
        iconSvg = `
          <g transform="translate(320, 155)">
            <circle cx="0" cy="0" r="40" fill="#FFFFFF" stroke="#103FEF" stroke-width="4"/>
            <rect x="-10" y="-26" width="20" height="52" fill="#103FEF" rx="3"/>
            <rect x="-26" y="-10" width="52" height="20" fill="#103FEF" rx="3"/>
            <circle cx="0" cy="0" r="8" fill="#FFFFFF"/>
          </g>
        `;
        emblemBadge = type === 'farmacia'
          ? 'FARMÁCIA BÁSICA MUNICIPAL · SUS'
          : 'SISTEMA ÚNICO DE SAÚDE · ATENDIMENTO SUS';
        break;

      case 'policiaMilitar':
        bgSky = '#F1F5F9';
        buildingColor = '#0F172A';
        roofBannerColor = '#1E3A8A';
        accentColor = '#3B82F6';
        iconSvg = `
          <g transform="translate(320, 155)">
            <polygon points="0,-42 35,-20 35,22 0,42 -35,22 -35,-20" fill="#1E3A8A" stroke="#FFFFFF" stroke-width="3"/>
            <polygon points="0,-24 6,-7 24,-7 10,4 15,20 0,10 -15,20 -10,4 -24,-7 -6,-7" fill="#FACC15"/>
            <circle cx="0" cy="3" r="7" fill="#0F172A"/>
          </g>
          <g transform="translate(320, 78)">
            <rect x="-18" y="-6" width="16" height="12" fill="#EF4444" rx="3"/>
            <rect x="2" y="-6" width="16" height="12" fill="#3B82F6" rx="3"/>
          </g>
        `;
        emblemBadge = 'POLÍCIA MILITAR · SEGURANÇA PÚBLICA 190';
        break;

      case 'policiaCivil':
        bgSky = '#F1F5F9';
        buildingColor = '#1E293B';
        roofBannerColor = '#0F172A';
        accentColor = '#EAB308';
        iconSvg = `
          <g transform="translate(320, 155)">
            <circle cx="0" cy="0" r="38" fill="#0F172A" stroke="#EAB308" stroke-width="3"/>
            <line x1="0" y1="-22" x2="0" y2="20" stroke="#FACC15" stroke-width="3"/>
            <line x1="-20" y1="-12" x2="20" y2="-12" stroke="#FACC15" stroke-width="3"/>
            <polygon points="-20,-12 -28,5 -12,5" fill="#EAB308"/>
            <polygon points="20,-12 12,5 28,5" fill="#EAB308"/>
          </g>
        `;
        emblemBadge = 'POLÍCIA CIVIL · DELEGACIA POLICIAL';
        break;

      case 'guardaMunicipal':
        bgSky = '#F1F5F9';
        buildingColor = '#0E2A47';
        roofBannerColor = '#0F172A';
        accentColor = '#D97706';
        iconSvg = `
          <g transform="translate(320, 155)">
            <polygon points="0,-40 32,-20 32,18 0,38 -32,18 -32,-20" fill="#0E2A47" stroke="#D97706" stroke-width="3"/>
            <circle cx="0" cy="0" r="14" fill="#D97706"/>
          </g>
        `;
        emblemBadge = 'GUARDA CIVIL MUNICIPAL · DISQUE 153';
        break;

      case 'bombeiros':
        bgSky = '#FEF2F2';
        buildingColor = '#991B1B';
        roofBannerColor = '#7F1D1D';
        accentColor = '#F59E0B';
        iconSvg = `
          <g transform="translate(320, 155)">
            <circle cx="0" cy="0" r="40" fill="#991B1B" stroke="#FFFFFF" stroke-width="3"/>
            <line x1="-22" y1="-22" x2="22" y2="22" stroke="#FDE047" stroke-width="3"/>
            <line x1="22" y1="-22" x2="-22" y2="22" stroke="#FDE047" stroke-width="3"/>
            <circle cx="0" cy="-6" r="14" fill="#EA580C" stroke="#FEF08A" stroke-width="2"/>
            <text x="0" y="24" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="900" fill="#FFFFFF">193</text>
          </g>
          <g transform="translate(475, 185)">
            <rect x="0" y="0" width="80" height="65" fill="#B91C1C" stroke="#FFFFFF" stroke-width="2" rx="4"/>
            <line x1="0" y1="16" x2="80" y2="16" stroke="#7F1D1D" stroke-width="2"/>
            <line x1="0" y1="32" x2="80" y2="32" stroke="#7F1D1D" stroke-width="2"/>
            <line x1="0" y1="48" x2="80" y2="48" stroke="#7F1D1D" stroke-width="2"/>
          </g>
        `;
        emblemBadge = 'CORPO DE BOMBEIROS MILITAR · RESGATE 193';
        break;

      case 'detran':
      case 'autoescola':
        bgSky = '#FEFCE8';
        buildingColor = '#1E293B';
        roofBannerColor = '#F59E0B';
        accentColor = '#0F172A';
        iconSvg = `
          <g transform="translate(320, 155)">
            <rect x="-35" y="-35" width="70" height="70" fill="#F59E0B" stroke="#1E293B" stroke-width="3" rx="8"/>
            <circle cx="0" cy="0" r="24" fill="none" stroke="#1E293B" stroke-width="5"/>
            <circle cx="0" cy="0" r="7" fill="#1E293B"/>
            <line x1="-22" y1="0" x2="22" y2="0" stroke="#1E293B" stroke-width="4"/>
            <line x1="0" y1="0" x2="0" y2="22" stroke="#1E293B" stroke-width="4"/>
          </g>
          <g transform="translate(475, 205)">
            <rect x="0" y="0" width="86" height="40" fill="#FFFFFF" stroke="#1E293B" stroke-width="2" rx="6"/>
            <rect x="14" y="-12" width="52" height="14" fill="#E2E8F0" rx="3"/>
            <rect x="0" y="15" width="86" height="12" fill="#FBBF24"/>
            <text x="43" y="24" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="900" fill="#000000">AUTOESCOLA</text>
            <circle cx="18" cy="40" r="7" fill="#1E293B"/>
            <circle cx="68" cy="40" r="7" fill="#1E293B"/>
          </g>
        `;
        emblemBadge = type === 'detran'
          ? 'DEPARTAMENTO DE TRÂNSITO · DETRAN'
          : 'CENTRO DE FORMAÇÃO DE CONDUTORES · CFC';
        break;

      case 'prefeitura':
      case 'crasSocial':
        bgSky = '#EEF2FF';
        buildingColor = '#312E81';
        roofBannerColor = '#1E1B4B';
        accentColor = '#6366F1';
        iconSvg = `
          <g transform="translate(320, 155)">
            <polygon points="0,-40 32,-20 32,18 0,38 -32,18 -32,-20" fill="#4338CA" stroke="#FACC15" stroke-width="3"/>
            <path d="M-22 -22 L-22 -30 L-14 -25 L-6 -30 L2 -25 L10 -30 L18 -25 L22 -30 L22 -22 Z" fill="#FACC15"/>
            <circle cx="0" cy="8" r="10" fill="#FACC15"/>
          </g>
        `;
        emblemBadge = 'PODER EXECUTIVO MUNICIPAL · PREFEITURA';
        break;

      case 'ecoponto':
      case 'reciclagemOrla':
        bgSky = '#ECFDF5';
        buildingColor = '#064E3B';
        roofBannerColor = '#047857';
        accentColor = '#34D399';
        iconSvg = `
          <g transform="translate(320, 155)">
            <circle cx="0" cy="0" r="40" fill="#059669" stroke="#FFFFFF" stroke-width="3"/>
            <path d="M-8 -24 L10 -24 L5 -16 M10 -24 L5 -32" stroke="#FFFFFF" stroke-width="3" fill="none" stroke-linecap="round"/>
            <path d="M22 6 L14 20 L6 14 M14 20 L22 22" stroke="#FFFFFF" stroke-width="3" fill="none" stroke-linecap="round"/>
            <path d="M-18 16 L-24 -2 L-14 2 M-24 -2 L-28 6" stroke="#FFFFFF" stroke-width="3" fill="none" stroke-linecap="round"/>
            <circle cx="0" cy="0" r="6" fill="#A7F3D0"/>
          </g>
        `;
        emblemBadge = 'GESTÃO AMBIENTAL · COLETA SELETIVA';
        break;

      case 'obrasViarias':
        bgSky = '#FFFBEB';
        buildingColor = '#78350F';
        roofBannerColor = '#D97706';
        accentColor = '#F59E0B';
        iconSvg = `
          <g transform="translate(320, 155)">
            <polygon points="0,-36 36,30 -36,30" fill="#D97706" stroke="#FFFFFF" stroke-width="3"/>
            <line x1="0" y1="-14" x2="0" y2="8" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
            <circle cx="0" cy="20" r="3" fill="#FFFFFF"/>
          </g>
        `;
        emblemBadge = 'OBRAS PÚBLICAS · MANUTENÇÃO VIÁRIA';
        break;

      case 'defesaCivil':
        bgSky = '#F0F9FF';
        buildingColor = '#0369A1';
        roofBannerColor = '#0284C7';
        accentColor = '#F97316';
        iconSvg = `
          <g transform="translate(320, 155)">
            <circle cx="0" cy="0" r="40" fill="#0284C7" stroke="#FFFFFF" stroke-width="3"/>
            <!-- Triângulo Laranja Internacional de Proteção e Defesa Civil -->
            <polygon points="0,-26 28,20 -28,20" fill="#EA580C" stroke="#FFFFFF" stroke-width="2"/>
            <circle cx="0" cy="2" r="5" fill="#FFFFFF"/>
          </g>
        `;
        emblemBadge = 'PROTEÇÃO E DEFESA CIVIL · DISQUE 199';
        break;

      default:
        bgSky = '#F8FAFC';
        buildingColor = '#0F172A';
        roofBannerColor = '#1E293B';
        accentColor = '#3B82F6';
        iconSvg = `
          <g transform="translate(320, 155)">
            <circle cx="0" cy="0" r="38" fill="#1E293B" stroke="#FFFFFF" stroke-width="3"/>
            <path d="M-15 0 L15 0 M0 -15 L0 15" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
          </g>
        `;
        emblemBadge = 'SERVIÇO PÚBLICO OFICIAL';
        break;
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="640" height="360">
      <defs>
        <linearGradient id="skyGrad_${type}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${bgSky}"/>
          <stop offset="100%" stop-color="#FFFFFF"/>
        </linearGradient>
        <linearGradient id="facadeGrad_${type}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${buildingColor}"/>
          <stop offset="100%" stop-color="${roofBannerColor}"/>
        </linearGradient>
      </defs>

      <!-- Céu de Fundo -->
      <rect width="640" height="360" fill="url(#skyGrad_${type})"/>

      <!-- Calçada e Rua -->
      <rect y="295" width="640" height="65" fill="#334155"/>
      <rect y="285" width="640" height="12" fill="#94A3B8"/>
      <line x1="0" y1="330" x2="640" y2="330" stroke="#F1F5F9" stroke-width="4" stroke-dasharray="24 16"/>

      <!-- Estrutura Principal do Edifício / Fachada -->
      <rect x="50" y="80" width="540" height="205" fill="url(#facadeGrad_${type})" rx="8" stroke="#0F172A" stroke-width="2"/>

      <!-- Testeira Superior Oficial -->
      <rect x="50" y="80" width="540" height="42" fill="${roofBannerColor}" rx="8 8 0 0"/>
      <rect x="50" y="118" width="540" height="4" fill="${accentColor}"/>
      <text x="320" y="106" text-anchor="middle" font-family="Plus Jakarta Sans, Arial, sans-serif" font-size="12" font-weight="900" fill="#FFFFFF" letter-spacing="1.5">${emblemBadge}</text>

      <!-- Esquadrias e Vidros Decorativos -->
      <g opacity="0.25">
        <rect x="80" y="145" width="55" height="110" fill="#38BDF8" rx="4"/>
        <line x1="80" y1="180" x2="135" y2="180" stroke="#0F172A" stroke-width="2"/>
        <line x1="80" y1="215" x2="135" y2="215" stroke="#0F172A" stroke-width="2"/>

        <rect x="505" y="145" width="55" height="110" fill="#38BDF8" rx="4"/>
        <line x1="505" y1="180" x2="560" y2="180" stroke="#0F172A" stroke-width="2"/>
        <line x1="505" y1="215" x2="560" y2="215" stroke="#0F172A" stroke-width="2"/>
      </g>

      <!-- Ícone Central / Brasão Oficial da Fachada -->
      ${iconSvg}

      <!-- Placa Inferior de Identificação da Unidade -->
      <rect x="90" y="215" width="460" height="52" fill="#0F172A" rx="6" opacity="0.94" stroke="#FFFFFF" stroke-width="1.5"/>
      <text x="320" y="238" text-anchor="middle" font-family="Plus Jakarta Sans, Arial, sans-serif" font-size="14" font-weight="800" fill="#FFFFFF">${safeMain}</text>
      <text x="320" y="256" text-anchor="middle" font-family="Plus Jakarta Sans, Arial, sans-serif" font-size="11" font-weight="600" fill="#CBD5E1">${safeSub}</text>
    </svg>`;

    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  const REAL_PHOTOS = {
    militarExército: createCivicFacadeSvg('militarExército', '18º BATALHÃO DE INFANTARIA MOTORIZADO', 'QUARTEL DO EXÉRCITO BRASILEIRO'),
    juntaMilitar: createCivicFacadeSvg('juntaMilitar', 'JUNTA DE SERVIÇO MILITAR', 'MINISTÉRIO DA DEFESA · ALISTAMENTO MILITAR'),
    upa24h: createCivicFacadeSvg('upa24h', 'UNIDADE DE PRONTO ATENDIMENTO 24H', 'REDE MUNICIPAL DE EMERGÊNCIA SUS'),
    hospital: createCivicFacadeSvg('hospital', 'HOSPITAL GERAL MUNICIPAL', 'INTERNAÇÃO E MATERNIDADE SUS'),
    prontoSocorro: createCivicFacadeSvg('prontoSocorro', 'PRONTO-SOCORRO MUNICIPAL 24H', 'ATENDIMENTO DE URGÊNCIA E TRAUMA'),
    ubsMarilea: createCivicFacadeSvg('hospital', 'UNIDADE BÁSICA DE SAÚDE', 'ESTRATÉGIA SAÚDE DA FAMÍLIA · SUS'),
    ubsEdmeia: createCivicFacadeSvg('hospital', 'UNIDADE BÁSICA DE SAÚDE', 'CONSULTAS E VACINAÇÃO · SUS'),
    ubsClaudio: createCivicFacadeSvg('hospital', 'ESTRATÉGIA SAÚDE DA FAMÍLIA', 'ATENDIMENTO MÉDICO E ODONTOLÓGICO'),
    ubsPraiana: createCivicFacadeSvg('hospital', 'UNIDADE DE SAÚDE DA FAMÍLIA', 'ATENDIMENTO COMUNITÁRIO · SUS'),
    farmacia: createCivicFacadeSvg('farmacia', 'FARMÁCIA CENTRAL MUNICIPAL', 'DISPENSAÇÃO GRATUITA DE MEDICAMENTOS SUS'),
    policiaMilitar: createCivicFacadeSvg('policiaMilitar', 'BATALHÃO DE POLÍCIA MILITAR', 'POLICIAMENTO OSTENSIVO E PREVENTIVO 190'),
    policiaCivil: createCivicFacadeSvg('policiaCivil', 'DELEGACIA DE POLÍCIA CIVIL', 'REGISTRO DE BOLETINS E PLANTÃO JUDICIÁRIO'),
    bombeiros: createCivicFacadeSvg('bombeiros', 'CORPO DE BOMBEIROS MILITAR', 'RESGATE, COMBATE A INCÊNDIOS E AMBULÂNCIA 193'),
    guardaMunicipal: createCivicFacadeSvg('guardaMunicipal', 'GUARDA CIVIL MUNICIPAL', 'PATRULHAMENTO COMUNITÁRIO 153'),
    detran: createCivicFacadeSvg('detran', 'POSTO DE ATENDIMENTO DETRAN', 'HABILITAÇÃO, IDENTIFICAÇÃO E VEÍCULOS'),
    autoescola: createCivicFacadeSvg('autoescola', 'CENTRO DE FORMAÇÃO DE CONDUTORES', 'AUTOESCOLA CREDENCIADA AO DETRAN'),
    prefeitura: createCivicFacadeSvg('prefeitura', 'PREFEITURA MUNICIPAL', 'PAÇO MUNICIPAL · SERVIÇOS AO CIDADÃO'),
    crasSocial: createCivicFacadeSvg('prefeitura', 'CENTRO DE REFERÊNCIA DE ASSISTÊNCIA SOCIAL', 'CADASTRO ÚNICO E BENEFÍCIOS SOCIAIS'),
    ecoponto: createCivicFacadeSvg('ecoponto', 'ECOPONTO MUNICIPAL', 'COLETA SELETIVA E DESCARTE CONSCIENTE'),
    reciclagemOrla: createCivicFacadeSvg('reciclagemOrla', 'PONTO DE COLETA SELETIVA', 'RECICLAGEM E SUSTENTABILIDADE'),
    obrasViarias: createCivicFacadeSvg('obrasViarias', 'CANTEIRO DE OBRAS MUNICIPAIS', 'PAVIMENTAÇÃO E MANUTENÇÃO VIÁRIA'),
    defesaCivil: createCivicFacadeSvg('defesaCivil', 'BASE OPERACIONAL DA DEFESA CIVIL', 'MONITORAMENTO CLIMÁTICO E ALERTA 199')
  };

  function resolveUnitPhoto(lat, lng, heading, fallbackUrl) {
    const sv = getStreetViewStaticUrl(lat, lng, heading);
    return sv || fallbackUrl;
  }

  function createFallbackPhotoDataUri(label, bgHex) {
    return createCivicFacadeSvg('generic', label, 'REDE MUNICIPAL DE ATENDIMENTO AO CIDADÃO');
  }

  // Pontos de interesse por município
  const CIVIC_MAP_LOCATIONS = {
    'rio-das-ostras': {
      cityName: 'Rio das Ostras · RJ',
      center: [-22.5165, -41.9365],
      zoom: 13,
      categories: {
        health: {
          label: 'UPAs 24h, Hospital e UBS',
          kicker: 'REDE MUNICIPAL DE SAÚDE · RIO DAS OSTRAS',
          items: [
            {
              id: 'ro-upa-ancora',
              name: 'UPA 24h Parque Âncora (Valmir Hespanhol)',
              shortLabel: 'UPA 24h Âncora',
              badge: 'Plantão 24h',
              badgeClass: 'badge-open-24h',
              is24h: true,
              categoryType: 'health',
              unitType: 'Unidade de Pronto Atendimento 24 Horas (Urgência e Emergência)',
              street: 'Rua das Acácias, s/n (próx. ao nº 615)',
              neighborhood: 'Parque Âncora',
              cep: '28899-422',
              cityState: 'Rio das Ostras · RJ',
              phone: '(22) 2771-3045 · SAMU 192',
              hours: 'Aberto 24 horas (todos os dias, inclusive domingos e feriados)',
              coords: [-22.4958, -41.9218],
              heading: 180,
              photo: resolveUnitPhoto(-22.4958, -41.9218, 180, REAL_PHOTOS.upa24h),
              fallbackPhoto: createFallbackPhotoDataUri('UPA 24H PARQUE ÂNCORA', '#DC2626'),
              services: 'Emergência clínica e pediátrica 24h, classificação de risco, raio-X digital, eletrocardiograma, exames laboratoriais de urgência e leitos de observação.'
            },
            {
              id: 'ro-hosp-naelma',
              name: 'Hospital Municipal Dra. Naelma Monteiro da Silva',
              shortLabel: 'Hosp. Naelma Monteiro',
              badge: 'Plantão 24h',
              badgeClass: 'badge-open-24h',
              is24h: true,
              categoryType: 'health',
              unitType: 'Hospital Geral Municipal e Maternidade 24 Horas',
              street: 'Rua Nildon Lustosa, s/n',
              neighborhood: 'Parque Zabulão',
              cep: '28893-800',
              cityState: 'Rio das Ostras · RJ',
              phone: '(22) 2771-3050 · SAMU 192',
              hours: 'Aberto 24 horas (Internação, Centro Cirúrgico e Emergência Obstétrica)',
              coords: [-22.5194, -41.9425],
              heading: 240,
              photo: resolveUnitPhoto(-22.5194, -41.9425, 240, REAL_PHOTOS.hospital),
              fallbackPhoto: createFallbackPhotoDataUri('HOSPITAL NAELMA MONTEIRO', '#1E3A8A'),
              services: 'Maternidade e emergência obstétrica 24h, internação clínica e cirúrgica, UTI adulto e neonatal, tomografia e suporte hospitalar de referência.'
            },
            {
              id: 'ro-pronto-socorro',
              name: 'Pronto-Socorro Municipal de Rio das Ostras',
              shortLabel: 'Pronto-Socorro 24h',
              badge: 'Plantão 24h',
              badgeClass: 'badge-open-24h',
              is24h: true,
              categoryType: 'health',
              unitType: 'Pronto Atendimento Clínico e Ortopédico 24 Horas',
              street: 'Rua Laércio Lúcio de Carvalho, 1075',
              neighborhood: 'Parque Zabulão',
              cep: '28893-392',
              cityState: 'Rio das Ostras · RJ',
              phone: '(22) 2771-3115 · SAMU 192',
              hours: 'Aberto 24 horas',
              coords: [-22.5178, -41.9441],
              heading: 90,
              photo: resolveUnitPhoto(-22.5178, -41.9441, 90, REAL_PHOTOS.prontoSocorro),
              fallbackPhoto: createFallbackPhotoDataUri('PRONTO-SOCORRO 24H', '#B91C1C'),
              services: 'Atendimento de urgência adulto, trauma ortopédico, sutura, imobilização, medicação venosa e retaguarda para o SAMU 192.'
            },
            {
              id: 'ro-ubs-marilea',
              name: 'UBS Jardim Mariléa',
              shortLabel: 'UBS Jd. Mariléa',
              badge: '07h às 17h',
              badgeClass: 'badge-open-hours',
              is24h: false,
              categoryType: 'health',
              unitType: 'Unidade Básica de Saúde e Sala de Vacinação',
              street: 'Rua Nova Friburgo, 21',
              neighborhood: 'Jardim Mariléa',
              cep: '28896-049',
              cityState: 'Rio das Ostras · RJ',
              phone: '(22) 2771-4120',
              hours: 'Segunda a Sexta, das 07h às 17h',
              coords: [-22.5112, -41.9310],
              heading: 320,
              photo: resolveUnitPhoto(-22.5112, -41.9310, 320, REAL_PHOTOS.ubsMarilea),
              fallbackPhoto: createFallbackPhotoDataUri('UBS JARDIM MARILÉA', '#103FEF'),
              services: 'Multivacinação (Influenza, COVID-19 e calendário infantil), clínico geral, pediatria, ginecologia, odontologia e farmácia básica municipal.'
            },
            {
              id: 'ro-ubs-dona-edmeia',
              name: 'Centro de Saúde Dona Edméia (Nova Esperança)',
              shortLabel: 'UBS Dona Edméia',
              badge: '07h às 17h',
              badgeClass: 'badge-open-hours',
              is24h: false,
              categoryType: 'health',
              unitType: 'Centro Municipal de Atenção Básica e Especialidades',
              street: 'Avenida Linda, s/n',
              neighborhood: 'Nova Esperança',
              cep: '28893-260',
              cityState: 'Rio das Ostras · RJ',
              phone: '(22) 2771-4010',
              hours: 'Segunda a Sexta, das 07h às 17h',
              coords: [-22.5231, -41.9378],
              heading: 110,
              photo: resolveUnitPhoto(-22.5231, -41.9378, 110, REAL_PHOTOS.ubsEdmeia),
              fallbackPhoto: createFallbackPhotoDataUri('UBS DONA EDMÉIA', '#103FEF'),
              services: 'Consultas médicas agendadas pelo SUS, sala de vacina, curativos, coleta laboratorial, pré-natal e acompanhamento de hipertensão e diabetes.'
            },
            {
              id: 'ro-esf-claudio-ribeiro',
              name: 'ESF Cláudio Ribeiro (Âncora)',
              shortLabel: 'ESF Cláudio Ribeiro',
              badge: '08h às 17h',
              badgeClass: 'badge-open-hours',
              is24h: false,
              categoryType: 'health',
              unitType: 'Estratégia Saúde da Família e Vacinação',
              street: 'Rua Peperônia, s/n',
              neighborhood: 'Cláudio Ribeiro / Âncora',
              cep: '28899-422',
              cityState: 'Rio das Ostras · RJ',
              phone: '(22) 2771-4280',
              hours: 'Segunda a Sexta, das 08h às 17h',
              coords: [-22.4985, -41.9242],
              heading: 45,
              photo: resolveUnitPhoto(-22.4985, -41.9242, 45, REAL_PHOTOS.ubsClaudio),
              fallbackPhoto: createFallbackPhotoDataUri('ESF CLÁUDIO RIBEIRO', '#103FEF'),
              services: 'Equipes de Saúde da Família, vacinação de rotina, puericultura, preventivo, visitas domiciliares e dispensação de medicamentos.'
            },
            {
              id: 'ro-esf-cidade-praiana',
              name: 'ESF Cidade Praiana',
              shortLabel: 'ESF Cidade Praiana',
              badge: '08h às 17h',
              badgeClass: 'badge-open-hours',
              is24h: false,
              categoryType: 'health',
              unitType: 'Estratégia Saúde da Família',
              street: 'Rua Santa Catarina, s/n',
              neighborhood: 'Cidade Praiana',
              cep: '28897-140',
              cityState: 'Rio das Ostras · RJ',
              phone: '(22) 2771-4310',
              hours: 'Segunda a Sexta, das 08h às 17h',
              coords: [-22.5362, -41.9615],
              heading: 270,
              photo: resolveUnitPhoto(-22.5362, -41.9615, 270, REAL_PHOTOS.ubsPraiana),
              fallbackPhoto: createFallbackPhotoDataUri('ESF CIDADE PRAIANA', '#103FEF'),
              services: 'Atendimento médico da família, vacinação infantil e adulto, aferição de pressão e glicemia, testes rápidos e acompanhamento odontológico.'
            },
            {
              id: 'ro-farmacia-central',
              name: 'Farmácia Municipal Central do SUS',
              shortLabel: 'Farmácia do SUS',
              badge: '08h às 17h',
              badgeClass: 'badge-open-hours',
              is24h: false,
              categoryType: 'health',
              unitType: 'Dispensação Municipal de Medicamentos Gratuitos',
              street: 'Rua Guanabara, 85 (esq. Rodovia Amaral Peixoto)',
              neighborhood: 'Jardim Campomar',
              cep: '28893-010',
              cityState: 'Rio das Ostras · RJ',
              phone: '(22) 2771-4025',
              hours: 'Segunda a Sexta, das 08h às 17h',
              coords: [-22.5210, -41.9390],
              heading: 190,
              photo: resolveUnitPhoto(-22.5210, -41.9390, 190, REAL_PHOTOS.farmacia),
              fallbackPhoto: createFallbackPhotoDataUri('FARMÁCIA CENTRAL SUS', '#103FEF'),
              services: 'Dispensação gratuita de medicamentos básicos, remédios de uso contínuo (hipertensão e diabetes) e insumos mediante apresentação de receita SUS e Cartão do Cidadão.'
            }
          ]
        },
        security: {
          label: 'Bases Militares e Segurança',
          kicker: 'SEGURANÇA PÚBLICA E FORÇAS ARMADAS · RIO DAS OSTRAS',
          items: [
            {
              id: 'ro-junta-militar',
              name: 'Junta de Serviço Militar de Rio das Ostras (JSM 095)',
              shortLabel: 'Junta Militar (Exército)',
              badge: '08h às 17h',
              badgeClass: 'badge-open-hours',
              is24h: false,
              categoryType: 'security',
              unitType: 'Serviço Militar Obrigatório e Emissão de Documentos',
              street: 'Rua Campo de Albacora, 75 (Centro Administrativo)',
              neighborhood: 'Loteamento Atlântica',
              cep: '28895-664',
              cityState: 'Rio das Ostras · RJ',
              phone: '(22) 2771-6100 · Exército Brasileiro',
              hours: 'Segunda a Sexta, das 08h às 17h',
              coords: [-22.4971, -41.9245],
              heading: 160,
              photo: resolveUnitPhoto(-22.4971, -41.9245, 160, REAL_PHOTOS.juntaMilitar),
              fallbackPhoto: createCivicFacadeSvg('juntaMilitar', 'JUNTA DE SERVIÇO MILITAR', 'RIO DAS OSTRAS · RJ'),
              services: 'Alistamento militar para jovens de 18 anos, emissão de Certificado de Dispensa de Incorporação (CDI), 2ª via de reservista, juramento à bandeira e atestados militares.'
            },
            {
              id: 'ro-pm-32bpm',
              name: '3ª Companhia do 32º Batalhão de Polícia Militar (PMERJ)',
              shortLabel: '32º BPM · Polícia Militar',
              badge: 'Plantão 24h',
              badgeClass: 'badge-open-24h',
              is24h: true,
              categoryType: 'security',
              unitType: 'Companhia de Policiamento Ostensivo e Rádio-Patrulha',
              street: 'Rodovia Amaral Peixoto, km 135 (próx. ao Bosque)',
              neighborhood: 'Costazul / Bosque',
              cep: '28895-000',
              cityState: 'Rio das Ostras · RJ',
              phone: '190 · (22) 2760-4663',
              hours: 'Plantão 24 horas (todos os dias)',
              coords: [-22.5215, -41.9320],
              heading: 90,
              photo: resolveUnitPhoto(-22.5215, -41.9320, 90, REAL_PHOTOS.policiaMilitar),
              fallbackPhoto: createFallbackPhotoDataUri('32º BPM POLÍCIA MILITAR', '#0F172A'),
              services: 'Policiamento preventivo e ostensivo municipal, viaturas de ronda rápida, atendimento telefônico de emergência 190 e suporte a operações integradas.'
            },
            {
              id: 'ro-pc-128dp',
              name: '128ª Delegacia de Polícia Civil de Rio das Ostras',
              shortLabel: '128ª DP · Polícia Civil',
              badge: 'Plantão 24h',
              badgeClass: 'badge-open-24h',
              is24h: true,
              categoryType: 'security',
              unitType: 'Delegacia de Polícia Judiciária e Registro de Ocorrências',
              street: 'Avenida Jane Maria Martins Figueira, s/n',
              neighborhood: 'Jardim Mariléa',
              cep: '28896-000',
              cityState: 'Rio das Ostras · RJ',
              phone: '(22) 2771-4003 · 197',
              hours: 'Plantão 24 horas (atendimento ao público ininterrupto)',
              coords: [-22.5144, -41.9308],
              heading: 200,
              photo: resolveUnitPhoto(-22.5144, -41.9308, 200, REAL_PHOTOS.policiaCivil),
              fallbackPhoto: createFallbackPhotoDataUri('128ª DP POLÍCIA CIVIL', '#0F172A'),
              services: 'Registro presencial de Boletim de Ocorrência (B.O.), flagrantes, investigação criminal, pedidos de medidas protetivas e plantão judiciário.'
            },
            {
              id: 'ro-guarda-municipal',
              name: 'Sede da Guarda Civil Municipal e ROMU de Rio das Ostras',
              shortLabel: 'Guarda Civil Municipal',
              badge: 'Plantão 24h',
              badgeClass: 'badge-open-24h',
              is24h: true,
              categoryType: 'security',
              unitType: 'Segurança Urbana, Trânsito e Proteção ao Cidadão',
              street: 'Rua Niterói, 1899 (Parque da Cidade)',
              neighborhood: 'Novo Rio das Ostras',
              cep: '28893-404',
              cityState: 'Rio das Ostras · RJ',
              phone: '153 · (22) 2760-6236',
              hours: 'Operação ininterrupta 24 horas',
              coords: [-22.5145, -41.9392],
              heading: 130,
              photo: resolveUnitPhoto(-22.5145, -41.9392, 130, REAL_PHOTOS.guardaMunicipal),
              fallbackPhoto: createFallbackPhotoDataUri('GUARDA CIVIL MUNICIPAL', '#0F172A'),
              services: 'Patrulhamento ostensivo comunitário com viaturas e motos (ROMU), fiscalização de trânsito, proteção escolar e atendimento emergencial pelo 153.'
            },
            {
              id: 'ro-bombeiros-9gbm',
              name: 'Destacamento do Corpo de Bombeiros Militar (9º GBM)',
              shortLabel: 'Bombeiros Militar 193',
              badge: 'Plantão 24h',
              badgeClass: 'badge-open-24h',
              is24h: true,
              categoryType: 'security',
              unitType: 'Resgate, Socorro Pré-Hospitalar e Combate a Incêndios',
              street: 'Rua Nildon Lustosa, s/n (ao lado do Hospital Municipal)',
              neighborhood: 'Parque Zabulão',
              cep: '28893-800',
              cityState: 'Rio das Ostras · RJ',
              phone: '193 · (22) 2771-3193',
              hours: 'Plantão de Prontidão 24 horas',
              coords: [-22.5190, -41.9435],
              heading: 45,
              photo: resolveUnitPhoto(-22.5190, -41.9435, 45, REAL_PHOTOS.bombeiros),
              fallbackPhoto: createFallbackPhotoDataUri('BOMBEIROS MILITAR 193', '#DC2626'),
              services: 'Atendimento de acidentes de trânsito, salvamento em altura e marítimo, combate a incêndios estruturais e florestais, corte de árvores caídas e ambulância 193.'
            }
          ]
        },
        transit: {
          label: 'Autoescolas e DETRAN',
          kicker: 'FORMAÇÃO DE CONDUTORES E HABILITAÇÃO · RIO DAS OSTRAS',
          items: [
            {
              id: 'ro-detran-posto',
              name: 'Posto Oficial de Atendimento DETRAN-RJ — Rio das Ostras',
              shortLabel: 'Posto DETRAN-RJ',
              badge: '08h às 17h',
              badgeClass: 'badge-open-hours',
              is24h: false,
              categoryType: 'transit',
              unitType: 'Habilitação, Identificação Civil e Serviços de Trânsito',
              street: 'Rodovia Amaral Peixoto, km 134 (Centro de Cidadania)',
              neighborhood: 'Parque Âncora',
              cep: '28899-422',
              cityState: 'Rio das Ostras · RJ',
              phone: '0800 020 4040 · (22) 2771-4200',
              hours: 'Segunda a Sexta, das 08h às 17h (mediante agendamento)',
              coords: [-22.5225, -41.9410],
              heading: 180,
              photo: resolveUnitPhoto(-22.5225, -41.9410, 180, REAL_PHOTOS.detran),
              fallbackPhoto: createFallbackPhotoDataUri('POSTO DETRAN-RJ', '#B45309'),
              services: 'Emissão e renovação de CNH, foto e biometria, 1ª e 2ª via de carteira de identidade (RG), certidão de prontuário e licenciamento de veículos.'
            },
            {
              id: 'ro-cfc-litoral',
              name: 'Autoescola e CFC Litoral Rio das Ostras',
              shortLabel: 'Autoescola Litoral',
              badge: '08h às 19h',
              badgeClass: 'badge-open-hours',
              is24h: false,
              categoryType: 'transit',
              unitType: 'Centro de Formação de Condutores Credenciado DETRAN-RJ',
              street: 'Avenida Jane Maria Martins, 1025',
              neighborhood: 'Jardim Mariléa',
              cep: '28896-030',
              cityState: 'Rio das Ostras · RJ',
              phone: '(22) 2764-1520 · WhatsApp (22) 99876-1122',
              hours: 'Segunda a Sexta, das 08h às 19h · Sábados, das 08h às 13h',
              coords: [-22.5130, -41.9325],
              heading: 10,
              photo: resolveUnitPhoto(-22.5130, -41.9325, 10, REAL_PHOTOS.autoescola),
              fallbackPhoto: createFallbackPhotoDataUri('AUTOESCOLA LITORAL', '#B45309'),
              services: '1ª Habilitação Categoria A (Moto) e B (Carro), curso teórico presencial e digital, simulador de direção, adição de categorias e aulas para habilitados com receio.'
            },
            {
              id: 'ro-cfc-rio-ostras',
              name: 'Autoescola e CFC Rio das Ostras (Centro)',
              shortLabel: 'Autoescola Rio das Ostras',
              badge: '08h às 19h',
              badgeClass: 'badge-open-hours',
              is24h: false,
              categoryType: 'transit',
              unitType: 'Centro de Formação de Condutores (Categorias A, B e D)',
              street: 'Rodovia Amaral Peixoto, 4520 (próx. ao trevo central)',
              neighborhood: 'Centro',
              cep: '28890-000',
              cityState: 'Rio das Ostras · RJ',
              phone: '(22) 2764-2030',
              hours: 'Segunda a Sexta, das 08h às 19h',
              coords: [-22.5250, -41.9440],
              heading: 210,
              photo: resolveUnitPhoto(-22.5250, -41.9440, 210, REAL_PHOTOS.autoescola),
              fallbackPhoto: createFallbackPhotoDataUri('AUTOESCOLA RIO DAS OSTRAS', '#B45309'),
              services: 'Aulas práticas com frota moderna de carros e motos, curso de reciclagem de condutores infratores, alteração para Categoria D (transporte de passageiros) e renovação rápida.'
            },
            {
              id: 'ro-cfc-costazul',
              name: 'Autoescola e CFC Costa Azul',
              shortLabel: 'Autoescola Costa Azul',
              badge: '08h às 18h',
              badgeClass: 'badge-open-hours',
              is24h: false,
              categoryType: 'transit',
              unitType: 'Treinamento Prático e Teórico para CNH',
              street: 'Rua Irene dos Santos, 120',
              neighborhood: 'Costazul',
              cep: '28895-150',
              cityState: 'Rio das Ostras · RJ',
              phone: '(22) 2764-5540',
              hours: 'Segunda a Sexta, das 08h às 18h · Sábado das 08h às 12h',
              coords: [-22.5235, -41.9280],
              heading: 300,
              photo: resolveUnitPhoto(-22.5235, -41.9280, 300, REAL_PHOTOS.autoescola),
              fallbackPhoto: createFallbackPhotoDataUri('AUTOESCOLA COSTA AZUL', '#B45309'),
              services: 'Aulas práticas de direção defensiva na orla e nas vias arteriais, curso preparatório para a prova de baliza do DETRAN e instrutores credenciados.'
            },
            {
              id: 'ro-detran-patio',
              name: 'Pátio Oficial de Exames Práticos de Direção DETRAN-RJ',
              shortLabel: 'Pátio de Provas DETRAN',
              badge: 'Dias de Prova',
              badgeClass: 'badge-open-hours',
              is24h: false,
              categoryType: 'transit',
              unitType: 'Circuito Oficial para Exames Práticos de Carro e Moto',
              street: 'Avenida Governador Roberto Silveira esq. Av. Costazul',
              neighborhood: 'Costazul',
              cep: '28895-190',
              cityState: 'Rio das Ostras · RJ',
              phone: 'DETRAN-RJ 0800 020 4040',
              hours: 'Conforme escala oficial de exames do DETRAN-RJ',
              coords: [-22.5210, -41.9260],
              heading: 140,
              photo: resolveUnitPhoto(-22.5210, -41.9260, 140, REAL_PHOTOS.detran),
              fallbackPhoto: createFallbackPhotoDataUri('PÁTIO DE EXAMES DETRAN', '#B45309'),
              services: 'Local sinalizado onde os candidatos realizam o teste prático de baliza, rampa e percurso com examinadores oficiais para obtenção da Carteira Nacional de Habilitação.'
            }
          ]
        },
        civicService: {
          label: 'Prefeitura e Cidadania',
          kicker: 'GESTÃO PÚBLICA, CIDADANIA E ASSISTÊNCIA · RIO DAS OSTRAS',
          items: [
            {
              id: 'ro-pref-sede',
              name: 'Prefeitura Municipal de Rio das Ostras (Sede Administrativa)',
              shortLabel: 'Prefeitura Municipal',
              badge: '08h às 17h',
              badgeClass: 'badge-open-hours',
              is24h: false,
              categoryType: 'civicService',
              unitType: 'Centro Administrativo, Gabinete e Secretaria de Fazenda',
              street: 'Rua Campo de Albacora, 75',
              neighborhood: 'Loteamento Atlântica',
              cep: '28895-664',
              cityState: 'Rio das Ostras · RJ',
              phone: '(22) 2771-6100 · 156',
              hours: 'Segunda a Sexta, das 08h às 17h',
              coords: [-22.4970, -41.9246],
              heading: 175,
              photo: resolveUnitPhoto(-22.4970, -41.9246, 175, REAL_PHOTOS.prefeitura),
              fallbackPhoto: createFallbackPhotoDataUri('PREFEITURA MUNICIPAL', '#4F46E5'),
              services: 'Atendimento presencial de IPTU, ISS, parcelamento tributário, certidão negativa de débitos, protocolo de processos administrativos e ouvidoria geral.'
            },
            {
              id: 'ro-balcao-cidadao',
              name: 'Centro de Cidadania / Balcão Poupatempo Municipal',
              shortLabel: 'Balcão do Cidadão',
              badge: '08h às 17h',
              badgeClass: 'badge-open-hours',
              is24h: false,
              categoryType: 'civicService',
              unitType: 'Serviços Unificados de Documentação e Cidadania',
              street: 'Rua das Casuarinas, 595',
              neighborhood: 'Parque Âncora',
              cep: '28899-422',
              cityState: 'Rio das Ostras · RJ',
              phone: '(22) 2771-4200 · 156',
              hours: 'Segunda a Sexta, das 08h às 17h',
              coords: [-22.4970, -41.9230],
              heading: 80,
              photo: resolveUnitPhoto(-22.4970, -41.9230, 80, REAL_PHOTOS.prefeitura),
              fallbackPhoto: createFallbackPhotoDataUri('BALCÃO DO CIDADÃO', '#4F46E5'),
              services: 'Balcão de Empregos SINE, Junta Comercial, Sala do Empreendedor (MEI), confecção de Carteira de Identidade e apoio ao Cartão Cidadão.'
            },
            {
              id: 'ro-cras-beira-mar',
              name: 'CRAS Sul — Centro de Referência de Assistência Social',
              shortLabel: 'CRAS Beira Mar',
              badge: '08h às 17h',
              badgeClass: 'badge-open-hours',
              is24h: false,
              categoryType: 'civicService',
              unitType: 'Assistência Social, Cadastro Único e Apoio à Família',
              street: 'Rua Fernando de Noronha, s/n',
              neighborhood: 'Cidade Beira Mar',
              cep: '28897-020',
              cityState: 'Rio das Ostras · RJ',
              phone: '(22) 2771-4155',
              hours: 'Segunda a Sexta, das 08h às 17h',
              coords: [-22.5290, -41.9510],
              heading: 260,
              photo: resolveUnitPhoto(-22.5290, -41.9510, 260, REAL_PHOTOS.crasSocial),
              fallbackPhoto: createFallbackPhotoDataUri('CRAS BEIRA MAR', '#4F46E5'),
              services: 'Inscrição e atualização do Cadastro Único (CadÚnico / Bolsa Família), Benefício de Prestação Continuada (BPC), acompanhamento psicológico e oficinas comunitárias.'
            },
            {
              id: 'ro-procon-sede',
              name: 'PROCON Municipal de Rio das Ostras',
              shortLabel: 'PROCON Municipal',
              badge: '09h às 16h',
              badgeClass: 'badge-open-hours',
              is24h: false,
              categoryType: 'civicService',
              unitType: 'Defesa e Orientação dos Direitos do Consumidor',
              street: 'Rodovia Amaral Peixoto, km 134 (Centro de Cidadania)',
              neighborhood: 'Parque Âncora',
              cep: '28899-422',
              cityState: 'Rio das Ostras · RJ',
              phone: '(22) 2771-6534 · (22) 2771-6535',
              hours: 'Segunda a Sexta, das 09h às 16h',
              coords: [-22.5222, -41.9412],
              heading: 190,
              photo: resolveUnitPhoto(-22.5222, -41.9412, 190, REAL_PHOTOS.prefeitura),
              fallbackPhoto: createFallbackPhotoDataUri('PROCON RIO DAS OSTRAS', '#4F46E5'),
              services: 'Abertura de reclamações contra empresas e concessionárias (água, luz, telefonia e bancos), cálculo revisional, fiscalização no comércio e audiências de conciliação.'
            }
          ]
        },
        waste: {
          label: 'Pontos de Reciclagem e Coleta',
          kicker: 'ECOPONTOS E COLETA SELETIVA · RIO DAS OSTRAS',
          items: [
            {
              id: 'ro-eco-cedro',
              name: 'Ecoponto Municipal CEDRO (Centro de Educação Ambiental)',
              shortLabel: 'Ecoponto CEDRO',
              badge: 'Área Externa 24h',
              badgeClass: 'badge-eco',
              is24h: false,
              categoryType: 'waste',
              unitType: 'Ecoponto Central de Reciclagem e Resíduos Especiais',
              street: 'Avenida Linda, s/n (próx. à ponte e ao Posto Dona Edméia)',
              neighborhood: 'Nova Esperança',
              cep: '28893-260',
              cityState: 'Rio das Ostras · RJ',
              phone: '(22) 2771-4350 · Meio Ambiente',
              hours: 'Coletores externos 24h · Sede administrativa Seg a Sex, 08h às 17h',
              coords: [-22.5238, -41.9385],
              heading: 100,
              photo: resolveUnitPhoto(-22.5238, -41.9385, 100, REAL_PHOTOS.ecoponto),
              fallbackPhoto: createFallbackPhotoDataUri('ECOPONTO CEDRO', '#059669'),
              services: 'Recebe papel, papelão, plástico, metal e vidro (24h na área externa) e lixo eletrônico, pilhas, baterias, lâmpadas e óleo de cozinha usado (08h às 17h).'
            },
            {
              id: 'ro-pev-costazul',
              name: 'PEV Costazul — Ponto de Entrega Voluntária da Orla',
              shortLabel: 'Reciclagem Costazul',
              badge: 'Disponível 24h',
              badgeClass: 'badge-eco',
              is24h: false,
              categoryType: 'waste',
              unitType: 'Ponto de Entrega Voluntária (Recicláveis Secos)',
              street: 'Av. Governador Roberto Silveira, s/n (próx. à Praça da Baleia)',
              neighborhood: 'Costazul',
              cep: '28895-240',
              cityState: 'Rio das Ostras · RJ',
              phone: '156 · Coleta Seletiva Municipal',
              hours: 'Acesso livre 24 horas · Caminhão coletor às Terças, Quintas e Sábados',
              coords: [-22.5245, -41.9255],
              heading: 230,
              photo: resolveUnitPhoto(-22.5245, -41.9255, 230, REAL_PHOTOS.reciclagemOrla),
              fallbackPhoto: createFallbackPhotoDataUri('PEV COSTAZUL', '#059669'),
              services: 'Ecoponto de orla com baias identificadas para garrafas PET, latas de alumínio, embalagens longa vida, papelão e vidro limpo.'
            },
            {
              id: 'ro-pev-marilea',
              name: 'PEV Jardim Mariléa — Estação de Coleta Seletiva',
              shortLabel: 'Reciclagem Mariléa',
              badge: 'Disponível 24h',
              badgeClass: 'badge-eco',
              is24h: false,
              categoryType: 'waste',
              unitType: 'Estação de Reciclagem e Coleta Domiciliar',
              street: 'Avenida Guanabara, 420',
              neighborhood: 'Jardim Mariléa',
              cep: '28896-020',
              cityState: 'Rio das Ostras · RJ',
              phone: '(22) 2771-4350 · 156',
              hours: 'Acesso 24h · Rota do caminhão de coleta: Seg, Qua e Sex a partir das 07h',
              coords: [-22.5092, -41.9335],
              heading: 15,
              photo: resolveUnitPhoto(-22.5092, -41.9335, 15, REAL_PHOTOS.ecoponto),
              fallbackPhoto: createFallbackPhotoDataUri('RECICLAGEM MARILÉA', '#059669'),
              services: 'Ponto de descarte seletivo para moradores do Jardim Mariléa e Jardim Campomar. Aceita recicláveis secos e óleo vegetal engarrafado.'
            },
            {
              id: 'ro-pev-parque-cidade',
              name: 'Ecoponto Parque da Cidade (Novo Rio das Ostras)',
              shortLabel: 'Ecoponto Pq. Cidade',
              badge: '08h às 18h',
              badgeClass: 'badge-eco',
              is24h: false,
              categoryType: 'waste',
              unitType: 'Ecoponto Comunitário e Educação Ambiental',
              street: 'Rua Niterói, 1899 (Parque da Cidade)',
              neighborhood: 'Novo Rio das Ostras',
              cep: '28893-404',
              cityState: 'Rio das Ostras · RJ',
              phone: '(22) 2771-4350',
              hours: 'Segunda a Sábado, das 08h às 18h',
              coords: [-22.5142, -41.9388],
              heading: 75,
              photo: resolveUnitPhoto(-22.5142, -41.9388, 75, REAL_PHOTOS.reciclagemOrla),
              fallbackPhoto: createFallbackPhotoDataUri('ECOPONTO PQ. CIDADE', '#059669'),
              services: 'Entrega de recicláveis secos, tampinhas plásticas solidárias, livros para reutilização e pequenos resíduos eletroeletrônicos.'
            }
          ]
        },
        works: {
          label: 'Obras e Trânsito nas Vias',
          kicker: 'INTERDIÇÕES E FRENTES DE OBRAS · RIO DAS OSTRAS',
          items: [
            {
              id: 'ro-obra-costazul',
              name: 'Obra de Macrodrenagem e Pavimentação — Orla Costazul',
              shortLabel: 'Obra Av. Roberto Silveira',
              badge: 'Meia Pista · Ativa',
              badgeClass: 'badge-warn',
              is24h: false,
              categoryType: 'works',
              unitType: 'Drenagem Pluvial e Recapeamento Asfáltico',
              street: 'Av. Governador Roberto Silveira (trecho próx. ao Emissário)',
              neighborhood: 'Costazul',
              cep: '28895-190',
              cityState: 'Rio das Ostras · RJ',
              phone: '156 · Secretaria de Manutenção de Infraestrutura',
              hours: 'Equipes em operação das 07h30 às 17h · Sinalização noturna ativa',
              coords: [-22.5218, -41.9275],
              heading: 120,
              photo: resolveUnitPhoto(-22.5218, -41.9275, 120, REAL_PHOTOS.obrasViarias),
              fallbackPhoto: createFallbackPhotoDataUri('OBRA ORLA COSTAZUL', '#D97706'),
              services: 'Assentamento de manilhas pluviais e recomposição asfáltica. Trânsito operando em meia pista com orientação da Guarda Municipal.'
            },
            {
              id: 'ro-obra-marilea',
              name: 'Operação Tapa-Buraco e Calçadas Acessíveis — Jardim Mariléa',
              shortLabel: 'Obra Rua Niterói',
              badge: 'Em andamento',
              badgeClass: 'badge-warn',
              is24h: false,
              categoryType: 'works',
              unitType: 'Manutenção Viária e Acessibilidade Urbana',
              street: 'Rua Niterói esq. Rua Nova Friburgo',
              neighborhood: 'Jardim Mariléa',
              cep: '28896-049',
              cityState: 'Rio das Ostras · RJ',
              phone: '156 · Zeladoria Urbana',
              hours: 'Hoje, das 08h às 16h30',
              coords: [-22.5125, -41.9298],
              heading: 340,
              photo: resolveUnitPhoto(-22.5125, -41.9298, 340, REAL_PHOTOS.obrasViarias),
              fallbackPhoto: createFallbackPhotoDataUri('OBRA JARDIM MARILÉA', '#D97706'),
              services: 'Fresagem e aplicação de massa asfáltica a quente, construção de rampas de acessibilidade NBR 9050 e pintura de faixas de pedestres.'
            }
          ]
        },
        civilDefense: {
          label: 'Defesa Civil e Clima',
          kicker: 'MONITORAMENTO E APOIO 199 · RIO DAS OSTRAS',
          items: [
            {
              id: 'ro-defesa-base',
              name: 'Base Operacional da Defesa Civil de Rio das Ostras',
              shortLabel: 'Defesa Civil 199',
              badge: 'Plantão 24h · Estável',
              badgeClass: 'badge-open-hours',
              is24h: false,
              categoryType: 'civilDefense',
              unitType: 'Coordenadoria Municipal de Proteção e Defesa Civil',
              street: 'Rua Niterói, 1899 (Parque da Cidade)',
              neighborhood: 'Novo Rio das Ostras',
              cep: '28893-404',
              cityState: 'Rio das Ostras · RJ',
              phone: '199 · (22) 2760-8394',
              hours: 'Plantão de Emergência 24 horas',
              coords: [-22.5148, -41.9395],
              heading: 50,
              photo: resolveUnitPhoto(-22.5148, -41.9395, 50, REAL_PHOTOS.defesaCivil),
              fallbackPhoto: createFallbackPhotoDataUri('DEFESA CIVIL 199', '#0284C7'),
              services: 'Monitoramento meteorológico e tábua de marés em tempo real, vistoria técnica de imóveis, poda de árvores em risco e atendimento pelo telefone 199.'
            },
            {
              id: 'ro-defesa-praiana',
              name: 'Ponto de Apoio e Pluviômetro Automático — Cidade Praiana',
              shortLabel: 'Apoio Cidade Praiana',
              badge: 'Monitorado 24h',
              badgeClass: 'badge-open-hours',
              is24h: false,
              categoryType: 'civilDefense',
              unitType: 'Estação Hidrometeorológica e Abrigo Preventivo',
              street: 'Rua Santa Catarina, 350',
              neighborhood: 'Cidade Praiana',
              cep: '28897-140',
              cityState: 'Rio das Ostras · RJ',
              phone: '199 · Defesa Civil',
              hours: 'Monitoramento telemétrico contínuo 24h',
              coords: [-22.5349, -41.9598],
              heading: 190,
              photo: resolveUnitPhoto(-22.5349, -41.9598, 190, REAL_PHOTOS.defesaCivil),
              fallbackPhoto: createFallbackPhotoDataUri('APOIO CIDADE PRAIANA', '#0284C7'),
              services: 'Estação pluviométrica conectada ao CEMADEN e ponto de apoio comunitário cadastrado para contingências climáticas na zona sul do município.'
            }
          ]
        }
      }
    },
    'sapucaia': {
      cityName: 'Sapucaia do Sul · RS',
      center: [-29.8260, -51.1490],
      zoom: 13,
      categories: {
        health: {
          label: 'UPAs 24h, Hospital e UBS',
          kicker: 'REDE MUNICIPAL DE SAÚDE · SAPUCAIA DO SUL',
          items: [
            {
              id: 'sap-upa-24h',
              name: 'UPA 24h Sapucaia do Sul',
              shortLabel: 'UPA 24h Sapucaia',
              badge: 'Plantão 24h',
              badgeClass: 'badge-open-24h',
              is24h: true,
              categoryType: 'health',
              unitType: 'Unidade de Pronto Atendimento 24 Horas',
              street: 'Rodovia ERS-118, nº 4400 (esq. Rua Ursa Maior)',
              neighborhood: 'Nova Sapucaia',
              cep: '93226-312',
              cityState: 'Sapucaia do Sul · RS',
              phone: '(51) 3450-3082 · SAMU 192',
              hours: 'Aberto 24 horas (todos os dias)',
              coords: [-29.8446, -51.1389],
              heading: 220,
              photo: resolveUnitPhoto(-29.8446, -51.1389, 220, REAL_PHOTOS.upa24h),
              fallbackPhoto: createCivicFacadeSvg('upa24h', 'UPA 24H SAPUCAIA DO SUL', 'EMERGÊNCIA E URGÊNCIA SUS'),
              services: 'Pronto atendimento médico adulto e pediátrico 24h, raio-X, eletrocardiograma, medicação de urgência e estabilização de pacientes.'
            },
            {
              id: 'sap-hmgv',
              name: 'Hospital Municipal Getúlio Vargas (HMGV)',
              shortLabel: 'Hosp. Getúlio Vargas',
              badge: 'Plantão 24h',
              badgeClass: 'badge-open-24h',
              is24h: true,
              categoryType: 'health',
              unitType: 'Hospital Geral Municipal e Emergência 24 Horas',
              street: 'Rua Pinheiro Machado, 331',
              neighborhood: 'Bairro Diehl',
              cep: '93210-180',
              cityState: 'Sapucaia do Sul · RS',
              phone: '(51) 3451-8200 · SAMU 192',
              hours: 'Aberto 24 horas',
              coords: [-29.8244, -51.1655],
              heading: 100,
              photo: resolveUnitPhoto(-29.8244, -51.1655, 100, REAL_PHOTOS.hospital),
              fallbackPhoto: createCivicFacadeSvg('hospital', 'HOSPITAL MUNICIPAL GETÚLIO VARGAS', 'INTERNAÇÃO E EMERGÊNCIA · SAPUCAIA'),
              services: 'Emergência hospitalar 24h, maternidade, bloco cirúrgico, UTI, tomografia computadorizada e internação pelo SUS.'
            },
            {
              id: 'sap-ubs-centro',
              name: 'UBS Centro — Sapucaia do Sul',
              shortLabel: 'UBS Centro',
              badge: '07h às 18h',
              badgeClass: 'badge-open-hours',
              is24h: false,
              categoryType: 'health',
              unitType: 'Unidade Básica de Saúde e Sala de Vacinação Central',
              street: 'Rua Nossa Senhora da Conceição esq. Rua Justino Camboim',
              neighborhood: 'Centro',
              cep: '93210-240',
              cityState: 'Sapucaia do Sul · RS',
              phone: '(51) 3451-8000',
              hours: 'Segunda a Sexta, das 07h às 18h',
              coords: [-29.8278, -51.1475],
              heading: 310,
              photo: resolveUnitPhoto(-29.8278, -51.1475, 310, REAL_PHOTOS.ubsMarilea),
              fallbackPhoto: createFallbackPhotoDataUri('UBS CENTRO SAPUCAIA', '#103FEF'),
              services: 'Vacinação completa do calendário SUS, consultas de clínica médica, pediatria, enfermagem, preventivo e dispensação de medicamentos.'
            },
            {
              id: 'sap-ubs-vargas',
              name: 'Centro de Especialidades e UBS Bairro Vargas',
              shortLabel: 'UBS Bairro Vargas',
              badge: '07h30 às 17h',
              badgeClass: 'badge-open-hours',
              is24h: false,
              categoryType: 'health',
              unitType: 'Atenção Básica e Consultórios Médicos',
              street: 'Rua Santa Luzia, 46',
              neighborhood: 'Bairro Vargas',
              cep: '93222-340',
              cityState: 'Sapucaia do Sul · RS',
              phone: '(51) 3452-1130',
              hours: 'Segunda a Sexta, das 07h30 às 17h',
              coords: [-29.8201, -51.1393],
              heading: 45,
              photo: resolveUnitPhoto(-29.8201, -51.1393, 45, REAL_PHOTOS.ubsEdmeia),
              fallbackPhoto: createFallbackPhotoDataUri('UBS BAIRRO VARGAS', '#103FEF'),
              services: 'Atendimento médico da comunidade, curativos, vacinas de rotina, teste rápido e pré-natal com acolhimento humanizado.'
            },
            {
              id: 'sap-esf-pasqualini',
              name: 'ESF Alberto Pasqualini',
              shortLabel: 'ESF Pasqualini',
              badge: '08h às 17h',
              badgeClass: 'badge-open-hours',
              is24h: false,
              categoryType: 'health',
              unitType: 'Estratégia Saúde da Família e Odontologia',
              street: 'Rua Ciro Silva, 195',
              neighborhood: 'Pasqualini',
              cep: '93224-661',
              cityState: 'Sapucaia do Sul · RS',
              phone: '(51) 3450-4200',
              hours: 'Segunda a Sexta, das 08h às 17h',
              coords: [-29.8383, -51.1359],
              heading: 180,
              photo: resolveUnitPhoto(-29.8383, -51.1359, 180, REAL_PHOTOS.ubsClaudio),
              fallbackPhoto: createFallbackPhotoDataUri('ESF ALBERTO PASQUALINI', '#103FEF'),
              services: 'Saúde bucal e odontologia pelo SUS, vacinas, acompanhamento de gestantes, idosos e visitas dos agentes comunitários.'
            },
            {
              id: 'sap-farmacia-central',
              name: 'Farmácia Municipal Central do SUS — Sapucaia do Sul',
              shortLabel: 'Farmácia Municipal SUS',
              badge: '08h às 17h',
              badgeClass: 'badge-open-hours',
              is24h: false,
              categoryType: 'health',
              unitType: 'Dispensação de Medicamentos e Insumos Médicos',
              street: 'Rua Coronel Serafim Pereira, 350',
              neighborhood: 'Centro',
              cep: '93210-220',
              cityState: 'Sapucaia do Sul · RS',
              phone: '(51) 3451-8150',
              hours: 'Segunda a Sexta, das 08h às 17h',
              coords: [-29.8270, -51.1480],
              heading: 270,
              photo: resolveUnitPhoto(-29.8270, -51.1480, 270, REAL_PHOTOS.farmacia),
              fallbackPhoto: createFallbackPhotoDataUri('FARMÁCIA CENTRAL SAPUCAIA', '#103FEF'),
              services: 'Fornecimento gratuito de remédios da rede básica municipal e medicamentos controlados de farmácia especial do Estado (RENAME).'
            }
          ]
        },
        security: {
          label: 'Bases Militares e Segurança',
          kicker: 'FORÇAS ARMADAS E SEGURANÇA PÚBLICA · SAPUCAIA DO SUL',
          items: [
            {
              id: 'sap-exercito-18bimtz',
              name: '18º Batalhão de Infantaria Motorizado (18º BI Mtz — Batalhão Passo da Pátria)',
              shortLabel: '18º BI Mtz (Exército)',
              badge: 'Quartel Militar',
              badgeClass: 'badge-open-24h',
              is24h: true,
              categoryType: 'security',
              unitType: 'Base Militar do Exército Brasileiro (Infantaria Motorizada)',
              street: 'Rua Major de Souza Lima, 507',
              neighborhood: 'Bairro São José',
              cep: '93218-240',
              cityState: 'Sapucaia do Sul · RS',
              phone: '(51) 3451-2244 · Exército Brasileiro',
              hours: 'Regime Militar de Prontidão 24 horas',
              coords: [-29.8105, -51.1402],
              heading: 80,
              photo: resolveUnitPhoto(-29.8105, -51.1402, 80, REAL_PHOTOS.militarExército),
              fallbackPhoto: createCivicFacadeSvg('militarExército', '18º BATALHÃO DE INFANTARIA MOTORIZADO', 'BATALHÃO PASSO DA PÁTRIA · SAPUCAIA DO SUL'),
              services: 'Unidade tradicional do Comando Militar do Sul (CMS), instrução de tropas de infantaria, apoio a calamidades públicas e operações de Garantia da Lei e da Ordem (GLO).'
            },
            {
              id: 'sap-bm-33bpm',
              name: '33º Batalhão de Polícia Militar (33º BPM — Brigada Militar)',
              shortLabel: '33º BPM · Brigada Militar',
              badge: 'Plantão 24h',
              badgeClass: 'badge-open-24h',
              is24h: true,
              categoryType: 'security',
              unitType: 'Comando de Policiamento Ostensivo e Rádio-Patrulha',
              street: 'Rua Modesto Dias, s/n (sede operacional)',
              neighborhood: 'Bairro Nova Sapucaia',
              cep: '93226-050',
              cityState: 'Sapucaia do Sul · RS',
              phone: '190 · (51) 3451-2400',
              hours: 'Plantão ininterrupto 24 horas',
              coords: [-29.8365, -51.1424],
              heading: 190,
              photo: resolveUnitPhoto(-29.8365, -51.1424, 190, REAL_PHOTOS.policiaMilitar),
              fallbackPhoto: createCivicFacadeSvg('policiaMilitar', '33º BPM BRIGADA MILITAR', 'SAPUCAIA DO SUL · RS'),
              services: 'Policiamento ostensivo e preventivo em todos os bairros, viaturas de ronda motorizada, atendimento ao cidadão pelo telefone 190 e Força Tática.'
            },
            {
              id: 'sap-junta-militar',
              name: 'Junta de Serviço Militar de Sapucaia do Sul (JSM 170)',
              shortLabel: 'Junta Militar (Alistamento)',
              badge: '08h às 17h',
              badgeClass: 'badge-open-hours',
              is24h: false,
              categoryType: 'security',
              unitType: 'Serviço Militar Obrigatório e Documentação',
              street: 'Rua Capitão Camboim, 200',
              neighborhood: 'Centro',
              cep: '93210-250',
              cityState: 'Sapucaia do Sul · RS',
              phone: '(51) 3451-8080 · Exército Brasileiro',
              hours: 'Segunda a Sexta, das 08h às 17h',
              coords: [-29.8236, -51.1475],
              heading: 15,
              photo: resolveUnitPhoto(-29.8236, -51.1475, 15, REAL_PHOTOS.juntaMilitar),
              fallbackPhoto: createCivicFacadeSvg('juntaMilitar', 'JUNTA DE SERVIÇO MILITAR (JSM 170)', 'ALISTAMENTO MILITAR · SAPUCAIA DO SUL'),
              services: 'Alistamento militar para jovens de 18 anos, emissão de Certificado de Dispensa de Incorporação (CDI), atestados de desobrigação e cerimônias de juramento.'
            },
            {
              id: 'sap-pc-2dp',
              name: '2ª Delegacia de Polícia Civil de Sapucaia do Sul',
              shortLabel: '2ª Delegacia · Polícia Civil',
              badge: 'Plantão 24h',
              badgeClass: 'badge-open-24h',
              is24h: true,
              categoryType: 'security',
              unitType: 'Polícia Judiciária, Boletim de Ocorrência e Plantão',
              street: 'Rua Assis Brasil, 70',
              neighborhood: 'Centro',
              cep: '93220-050',
              cityState: 'Sapucaia do Sul · RS',
              phone: '(51) 3451-1255 · 197',
              hours: 'Plantão 24 horas',
              coords: [-29.8234, -51.1441],
              heading: 260,
              photo: resolveUnitPhoto(-29.8234, -51.1441, 260, REAL_PHOTOS.policiaCivil),
              fallbackPhoto: createCivicFacadeSvg('policiaCivil', '2ª DELEGACIA POLÍCIA CIVIL', 'SAPUCAIA DO SUL · RS'),
              services: 'Registro presencial de Boletim de Ocorrência (B.O.), pedidos de medidas protetivas da Lei Maria da Penha, investigação e cartório de plantão.'
            },
            {
              id: 'sap-bombeiros-pelotao',
              name: 'Pelotão de Bombeiro Militar de Sapucaia do Sul',
              shortLabel: 'Bombeiro Militar 193',
              badge: 'Plantão 24h',
              badgeClass: 'badge-open-24h',
              is24h: true,
              categoryType: 'security',
              unitType: 'Quartel de Resgate, Salvamento e Combate a Incêndios',
              street: 'Rua Henrique Dias, 58',
              neighborhood: 'Bairro Santa Catarina',
              cep: '93214-130',
              cityState: 'Sapucaia do Sul · RS',
              phone: '193 · (51) 3474-0211',
              hours: 'Plantão de Prontidão 24 horas',
              coords: [-29.8243, -51.1593],
              heading: 120,
              photo: resolveUnitPhoto(-29.8243, -51.1593, 120, REAL_PHOTOS.bombeiros),
              fallbackPhoto: createCivicFacadeSvg('bombeiros', 'CORPO DE BOMBEIROS MILITAR 193', 'PELOTÃO DE SAPUCAIA DO SUL'),
              services: 'Socorro pré-hospitalar em acidentes com viatura de resgate, combate a incêndios residenciais e industriais, vistoria predial e emergências 193.'
            }
          ]
        },
        transit: {
          label: 'Autoescolas e DETRAN',
          kicker: 'FORMAÇÃO DE CONDUTORES E HABILITAÇÃO · SAPUCAIA DO SUL',
          items: [
            {
              id: 'sap-detran-posto',
              name: 'Posto Avançado DETRAN-RS / TudoFácil — Sapucaia do Sul',
              shortLabel: 'Posto DETRAN-RS',
              badge: '08h às 17h',
              badgeClass: 'badge-open-hours',
              is24h: false,
              categoryType: 'transit',
              unitType: 'Habilitação, CNH e Identificação Civil',
              street: 'Avenida Sapucaia, 850 (Centro Comercial)',
              neighborhood: 'Centro',
              cep: '93210-240',
              cityState: 'Sapucaia do Sul · RS',
              phone: '0800 905 5555 · (51) 3451-8050',
              hours: 'Segunda a Sexta, das 08h às 17h',
              coords: [-29.8258, -51.1452],
              heading: 10,
              photo: resolveUnitPhoto(-29.8258, -51.1452, 10, REAL_PHOTOS.detran),
              fallbackPhoto: createFallbackPhotoDataUri('POSTO DETRAN-RS', '#B45309'),
              services: 'Renovação de CNH, consulta de pontuação, transferência de prontuário, emissão de certidões de trânsito e carteira de identidade oficial.'
            },
            {
              id: 'sap-cfc-sapucaiense',
              name: 'Autoescola e CFC Sapucaiense',
              shortLabel: 'Autoescola Sapucaiense',
              badge: '08h às 19h',
              badgeClass: 'badge-open-hours',
              is24h: false,
              categoryType: 'transit',
              unitType: 'Centro de Formação de Condutores Credenciado DETRAN-RS',
              street: 'Rua Coronel Serafim Pereira, 185',
              neighborhood: 'Centro',
              cep: '93210-220',
              cityState: 'Sapucaia do Sul · RS',
              phone: '(51) 3451-3322 · WhatsApp (51) 99765-4321',
              hours: 'Segunda a Sexta, das 08h às 19h · Sábado das 08h às 12h',
              coords: [-29.8272, -51.1478],
              heading: 180,
              photo: resolveUnitPhoto(-29.8272, -51.1478, 180, REAL_PHOTOS.autoescola),
              fallbackPhoto: createFallbackPhotoDataUri('AUTOESCOLA SAPUCAIENSE', '#B45309'),
              services: '1ª Habilitação Categoria A (Moto) e B (Carro), curso teórico presencial e EAD homologado, simulador veicular e aulas para habilitados.'
            },
            {
              id: 'sap-cfc-via-sul',
              name: 'Autoescola e CFC Via Sul',
              shortLabel: 'Autoescola Via Sul',
              badge: '08h às 19h',
              badgeClass: 'badge-open-hours',
              is24h: false,
              categoryType: 'transit',
              unitType: 'Centro de Formação de Condutores (Categorias A, B e C)',
              street: 'Avenida Sapucaia, 1420',
              neighborhood: 'Centro',
              cep: '93210-240',
              cityState: 'Sapucaia do Sul · RS',
              phone: '(51) 3452-4400',
              hours: 'Segunda a Sexta, das 08h às 19h',
              coords: [-29.8240, -51.1465],
              heading: 85,
              photo: resolveUnitPhoto(-29.8240, -51.1465, 85, REAL_PHOTOS.autoescola),
              fallbackPhoto: createFallbackPhotoDataUri('AUTOESCOLA VIA SUL', '#B45309'),
              services: 'Frota atualizada de veículos manuais e automáticos, curso de reciclagem de pontuação, adição de categorias profissionais e renovação ágil.'
            },
            {
              id: 'sap-cfc-nova-sapucaia',
              name: 'Autoescola e CFC Nova Sapucaia',
              shortLabel: 'Autoescola Nova Sapucaia',
              badge: '08h às 18h',
              badgeClass: 'badge-open-hours',
              is24h: false,
              categoryType: 'transit',
              unitType: 'Formação e Aperfeiçoamento de Condutores',
              street: 'Rua Ursa Maior, 310',
              neighborhood: 'Nova Sapucaia',
              cep: '93226-390',
              cityState: 'Sapucaia do Sul · RS',
              phone: '(51) 3450-8800',
              hours: 'Segunda a Sexta, das 08h às 18h',
              coords: [-29.8446, -51.1389],
              heading: 270,
              photo: resolveUnitPhoto(-29.8446, -51.1389, 270, REAL_PHOTOS.autoescola),
              fallbackPhoto: createFallbackPhotoDataUri('AUTOESCOLA NOVA SAPUCAIA', '#B45309'),
              services: 'Aulas práticas na zona leste do município e região da ERS-118, preparação completa para baliza e teste de rua com acompanhamento personalizado.'
            },
            {
              id: 'sap-detran-patio',
              name: 'Pátio Oficial de Exames Práticos DETRAN-RS — Sapucaia do Sul',
              shortLabel: 'Pátio de Provas DETRAN',
              badge: 'Dias de Prova',
              badgeClass: 'badge-open-hours',
              is24h: false,
              categoryType: 'transit',
              unitType: 'Pista de Prova Prática Veicular (Baliza e Percurso)',
              street: 'Rua Justino Camboim esq. Rua do Parque',
              neighborhood: 'Bairro Paraíso',
              cep: '93214-200',
              cityState: 'Sapucaia do Sul · RS',
              phone: 'DETRAN-RS 0800 905 5555',
              hours: 'Dias úteis conforme agendamento do exame',
              coords: [-29.8290, -51.1440],
              heading: 320,
              photo: resolveUnitPhoto(-29.8290, -51.1440, 320, REAL_PHOTOS.detran),
              fallbackPhoto: createFallbackPhotoDataUri('PÁTIO DE EXAMES DETRAN', '#B45309'),
              services: 'Área com marcações oficiais de baliza e rampa onde examinadores credenciados do DETRAN-RS realizam o teste prático de direção.'
            }
          ]
        },
        civicService: {
          label: 'Prefeitura e Cidadania',
          kicker: 'GESTÃO PÚBLICA, CIDADANIA E ASSISTÊNCIA · SAPUCAIA DO SUL',
          items: [
            {
              id: 'sap-pref-centro-adm',
              name: 'Centro Administrativo Municipal / Prefeitura de Sapucaia do Sul',
              shortLabel: 'Prefeitura Municipal',
              badge: '08h às 17h',
              badgeClass: 'badge-open-hours',
              is24h: false,
              categoryType: 'civicService',
              unitType: 'Gabinete do Prefeito, Secretaria da Fazenda e Protocolo',
              street: 'Avenida Leônidas de Souza, 1289',
              neighborhood: 'Santa Catarina',
              cep: '93210-140',
              cityState: 'Sapucaia do Sul · RS',
              phone: '(51) 3451-8000 · 156',
              hours: 'Segunda a Sexta, das 08h às 17h',
              coords: [-29.8291, -51.1604],
              heading: 90,
              photo: resolveUnitPhoto(-29.8291, -51.1604, 90, REAL_PHOTOS.prefeitura),
              fallbackPhoto: createCivicFacadeSvg('prefeitura', 'PREFEITURA MUNICIPAL DE SAPUCAIA DO SUL', 'CENTRO ADMINISTRATIVO MUNICIPAL'),
              services: 'Sede do Poder Executivo municipal, Secretaria da Fazenda, IPTU, ITBI, certidões negativas de débitos, licenciamentos e protocolo geral.'
            },
            {
              id: 'sap-balcao-cidadao',
              name: 'Balcão Cidadão / Central de Atendimento 156',
              shortLabel: 'Balcão Cidadão 156',
              badge: '08h às 17h',
              badgeClass: 'badge-open-hours',
              is24h: false,
              categoryType: 'civicService',
              unitType: 'Atendimento Unificado e Central de Ouvidoria',
              street: 'Rua Vigário Geral, 48',
              neighborhood: 'Centro',
              cep: '93210-210',
              cityState: 'Sapucaia do Sul · RS',
              phone: '156 · (51) 3451-8020',
              hours: 'Segunda a Sexta, das 08h às 17h',
              coords: [-29.8268, -51.1458],
              heading: 190,
              photo: resolveUnitPhoto(-29.8268, -51.1458, 190, REAL_PHOTOS.prefeitura),
              fallbackPhoto: createFallbackPhotoDataUri('BALCÃO CIDADÃO 156', '#4F46E5'),
              services: 'Atendimento unificado para solicitações de serviços urbanos (tapa-buraco, poda e iluminação), certidões, ouvidoria e suporte ao contribuinte.'
            },
            {
              id: 'sap-cras-central',
              name: 'CRAS Central de Sapucaia do Sul',
              shortLabel: 'CRAS Central',
              badge: '08h às 17h',
              badgeClass: 'badge-open-hours',
              is24h: false,
              categoryType: 'civicService',
              unitType: 'Centro de Referência de Assistência Social',
              street: 'Rua Santa Catarina, 230',
              neighborhood: 'Santa Catarina',
              cep: '93210-140',
              cityState: 'Sapucaia do Sul · RS',
              phone: '(51) 3451-8190',
              hours: 'Segunda a Sexta, das 08h às 17h',
              coords: [-29.8210, -51.1480],
              heading: 45,
              photo: resolveUnitPhoto(-29.8210, -51.1480, 45, REAL_PHOTOS.crasSocial),
              fallbackPhoto: createFallbackPhotoDataUri('CRAS CENTRAL SAPUCAIA', '#4F46E5'),
              services: 'Cadastro Único para programas sociais federais e estaduais, acompanhamento familiar pelo PAIF, auxílio funeral e benefício eventual.'
            },
            {
              id: 'sap-procon-sede',
              name: 'PROCON Municipal de Sapucaia do Sul',
              shortLabel: 'PROCON Sapucaia',
              badge: '09h às 16h',
              badgeClass: 'badge-open-hours',
              is24h: false,
              categoryType: 'civicService',
              unitType: 'Órgão de Defesa e Fiscalização do Consumidor',
              street: 'Rua Assis Brasil, 115',
              neighborhood: 'Centro',
              cep: '93210-230',
              cityState: 'Sapucaia do Sul · RS',
              phone: '(51) 3451-8160',
              hours: 'Segunda a Sexta, das 09h às 16h',
              coords: [-29.8252, -51.1470],
              heading: 150,
              photo: resolveUnitPhoto(-29.8252, -51.1470, 150, REAL_PHOTOS.prefeitura),
              fallbackPhoto: createFallbackPhotoDataUri('PROCON SAPUCAIA', '#4F46E5'),
              services: 'Orientação a consumidores lesados, abertura de processos administrativos contra empresas, conciliação de dívidas e fiscalização de preços.'
            }
          ]
        },
        waste: {
          label: 'Pontos de Reciclagem e Coleta',
          kicker: 'ECOPONTOS E COLETA SELETIVA · SAPUCAIA DO SUL',
          items: [
            {
              id: 'sap-eco-cohab',
              name: 'Ecoponto Municipal Cohab / Piratini',
              shortLabel: 'Ecoponto Cohab',
              badge: '08h às 17h',
              badgeClass: 'badge-eco',
              is24h: false,
              categoryType: 'waste',
              unitType: 'Ecoponto Oficial para Recicláveis, Volumosos e Eletrônicos',
              street: 'Rua Monteiro Lobato, 244',
              neighborhood: 'Cohab / Piratini',
              cep: '93212-620',
              cityState: 'Sapucaia do Sul · RS',
              phone: '(51) 3451-8000 · Meio Ambiente',
              hours: 'Segunda a Sábado, das 08h às 12h e das 13h às 17h',
              coords: [-29.8149, -51.1618],
              heading: 270,
              photo: resolveUnitPhoto(-29.8149, -51.1618, 270, REAL_PHOTOS.ecoponto),
              fallbackPhoto: createFallbackPhotoDataUri('ECOPONTO MUNICIPAL', '#059669'),
              services: 'Recebe gratuitamente recicláveis secos, móveis desmontados, restos de poda, pequenos volumes de caliça, eletrônicos, lâmpadas e óleo de cozinha.'
            },
            {
              id: 'sap-pev-centro',
              name: 'Estação de Coleta Conteinerizada e Reciclagem — Centro',
              shortLabel: 'Reciclagem Centro',
              badge: 'Disponível 24h',
              badgeClass: 'badge-eco',
              is24h: false,
              categoryType: 'waste',
              unitType: 'Contêineres de Coleta Seletiva e Orgânica',
              street: 'Avenida Sapucaia, 850 (próx. à Praça General Freitas)',
              neighborhood: 'Centro',
              cep: '93210-240',
              cityState: 'Sapucaia do Sul · RS',
              phone: '156 · Limpeza Urbana',
              hours: 'Acesso livre 24 horas',
              coords: [-29.8258, -51.1452],
              heading: 180,
              photo: resolveUnitPhoto(-29.8258, -51.1452, 180, REAL_PHOTOS.reciclagemOrla),
              fallbackPhoto: createFallbackPhotoDataUri('COLETA SELETIVA CENTRO', '#059669'),
              services: 'Contêineres diferenciados por cor para descarte de resíduos recicláveis secos (papel, plástico, metal e vidro) e coleta mecanizada diária.'
            }
          ]
        },
        works: {
          label: 'Obras e Trânsito nas Vias',
          kicker: 'INTERDIÇÕES E FRENTES DE OBRAS · SAPUCAIA DO SUL',
          items: [
            {
              id: 'sap-obra-centro',
              name: 'Manutenção de Rede Pluvial com Hidrojato — Av. Sapucaia',
              shortLabel: 'Obra Av. Sapucaia',
              badge: '1 faixa em serviço',
              badgeClass: 'badge-warn',
              is24h: false,
              categoryType: 'works',
              unitType: 'Desobstrução Pluvial e Recuperação de Pavimento',
              street: 'Avenida Sapucaia esq. Rua Sete de Setembro',
              neighborhood: 'Centro',
              cep: '93210-240',
              cityState: 'Sapucaia do Sul · RS',
              phone: '156 · Secretaria de Obras e Mobilidade',
              hours: 'Hoje, das 08h30 às 16h30',
              coords: [-29.8266, -51.1462],
              heading: 45,
              photo: resolveUnitPhoto(-29.8266, -51.1462, 45, REAL_PHOTOS.obrasViarias),
              fallbackPhoto: createFallbackPhotoDataUri('OBRA AV. SAPUCAIA', '#D97706'),
              services: 'Limpeza preventiva de bocas de lobo com caminhão hidrojato e nivelamento de tampões. Estreitamento pontual de faixa direita.'
            }
          ]
        },
        civilDefense: {
          label: 'Defesa Civil e Clima',
          kicker: 'MONITORAMENTO E APOIO 199 · SAPUCAIA DO SUL',
          items: [
            {
              id: 'sap-defesa-base',
              name: 'Coordenadoria Municipal de Defesa Civil de Sapucaia do Sul',
              shortLabel: 'Defesa Civil 199',
              badge: 'Plantão 24h · Estável',
              badgeClass: 'badge-open-hours',
              is24h: false,
              categoryType: 'civilDefense',
              unitType: 'Central de Monitoramento Hidrometeorológico e Emergência',
              street: 'Avenida Leônidas de Souza, 1289',
              neighborhood: 'Santa Catarina',
              cep: '93210-140',
              cityState: 'Sapucaia do Sul · RS',
              phone: '199 · (51) 3451-8000',
              hours: 'Plantão 24 horas',
              coords: [-29.8291, -51.1604],
              heading: 210,
              photo: resolveUnitPhoto(-29.8291, -51.1604, 210, REAL_PHOTOS.defesaCivil),
              fallbackPhoto: createCivicFacadeSvg('defesaCivil', 'COORDENADORIA DE DEFESA CIVIL 199', 'SAPUCAIA DO SUL · RS'),
              services: 'Monitoramento de cota do Rio dos Sinos e arroios municipais, emissão de alertas preventivos e atendimento emergencial pelo telefone 199.'
            }
          ]
        }
      }
    }
  };

  const activeMapInstances = {};

  function getBubbleRingClass(item) {
    if (item.categoryType === 'health') {
      return item.is24h ? 'type-upa-24h' : 'type-ubs';
    }
    if (item.categoryType === 'security') return 'type-security';
    if (item.categoryType === 'transit') return 'type-transit';
    if (item.categoryType === 'civicService') return 'type-civic';
    if (item.categoryType === 'waste') return 'type-waste';
    if (item.categoryType === 'works') return 'type-works';
    return 'type-civil';
  }

  function getCategoryIconSvg(item, size = 20) {
    const nameLower = (item.name || '').toLowerCase();
    if (item.categoryType === 'health') {
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"></path></svg>`;
    }
    if (item.categoryType === 'security') {
      if (nameLower.includes('bombeiro')) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>`;
      }
      if (nameLower.includes('exército') || nameLower.includes('junta') || nameLower.includes('batalhão de infantaria')) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
      }
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`;
    }
    if (item.categoryType === 'transit') {
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><circle cx="17" cy="17" r="2"></circle></svg>`;
    }
    if (item.categoryType === 'civicService') {
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"></path><path d="M5 21V7l7-4 7 4v14"></path><path d="M9 21v-6h6v6"></path></svg>`;
    }
    if (item.categoryType === 'waste') {
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;
    }
    if (item.categoryType === 'works') {
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
    }
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>`;
  }

  function createBubbleHtml(item, isSelected) {
    const ringClass = getBubbleRingClass(item);
    const activeClass = isSelected ? 'active-marker' : '';
    const badge24h = item.is24h ? '<span class="bubble-24h-pill">24H</span>' : '';

    return `
      <div class="civic-photo-bubble civic-pin-marker ${activeClass}" data-place-id="${item.id}" title="${item.name} — ${item.street} (CEP ${item.cep})">
        <div class="bubble-avatar-ring civic-pin-circle ${ringClass}">
          ${badge24h}
          <span class="civic-pin-icon">${getCategoryIconSvg(item, 20)}</span>
        </div>
        <span class="bubble-pointer"></span>
        <span class="bubble-floating-label">${item.shortLabel}</span>
      </div>
    `;
  }

  function buildPrimaryActionHtml(item, widgetMode, btnClass = 'btn-detail-primary') {
    if (item.categoryType === 'health') {
      if (widgetMode === 'healthPage') {
        return `<button type="button" class="${btnClass}" data-schedule-unit="${item.name} — ${item.street} (${item.neighborhood})">Agendar Atendimento</button>`;
      }
      return `<a href="healthPage.html?unit=${encodeURIComponent(item.id)}#mapa-saude" class="${btnClass}">Agendar Consulta</a>`;
    }
    if (item.categoryType === 'security') {
      const isJunta = (item.name || '').toLowerCase().includes('junta');
      const isDelegacia = (item.name || '').toLowerCase().includes('delegacia');
      if (isJunta) {
        return `<a href="https://alistamento.eb.mil.br/" target="_blank" rel="noopener noreferrer" class="${btnClass}">Alistamento Online</a>`;
      }
      if (isDelegacia) {
        return `<a href="https://delegaciaonline.rj.gov.br/" target="_blank" rel="noopener noreferrer" class="${btnClass}">Delegacia Online</a>`;
      }
      return `<a href="tel:${(item.phone || '').split('·')[0].replace(/\D/g, '')}" class="${btnClass}">Ligar para Unidade</a>`;
    }
    if (item.categoryType === 'transit') {
      const isDetran = (item.name || '').toLowerCase().includes('detran');
      if (isDetran) {
        return `<a href="https://www.detran.rj.gov.br/" target="_blank" rel="noopener noreferrer" class="${btnClass}">Agendar DETRAN</a>`;
      }
      return `<a href="https://www.detran.rj.gov.br/_documento.asp?cod=140" target="_blank" rel="noopener noreferrer" class="${btnClass}">Consultar Requisitos</a>`;
    }
    if (item.categoryType === 'civicService') {
      const isCras = (item.name || '').toLowerCase().includes('cras');
      const isProcon = (item.name || '').toLowerCase().includes('procon');
      if (isCras) {
        return `<a href="requestsPage.html" class="${btnClass}">Cadastro Único</a>`;
      }
      if (isProcon) {
        return `<a href="occurrencePage.html?cat=DefesaConsumidor" class="${btnClass}">Reclamação PROCON</a>`;
      }
      return `<a href="invoicesPage.html" class="${btnClass}">Serviços da Prefeitura</a>`;
    }
    if (item.categoryType === 'waste') {
      return `<a href="occurrencePage.html?cat=LimpezaEntulho" class="${btnClass}">Solicitar Coleta</a>`;
    }
    if (item.categoryType === 'works') {
      return `<a href="occurrencePage.html?cat=AsfaltoBuracos" class="${btnClass}">Relatar Problema</a>`;
    }
    return `<a href="occurrencePage.html?cat=EsgotoBueiro" class="${btnClass}">Emergência 199</a>`;
  }

  function renderPopupHtml(item, widgetMode) {
    const primaryActionHtml = buildPrimaryActionHtml(item, widgetMode, 'btn-popup-primary');
    const streetView360Link = `https://www.google.com/maps?layer=c&cbll=${item.coords[0]},${item.coords[1]}`;
    const gmapsRouteLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(item.name + ', ' + item.street + ', ' + item.cityState)}`;

    return `
      <div class="civic-leaflet-popup">
        <div class="civic-popup-top">
          <span class="detail-status-badge ${item.badgeClass || 'badge-open-hours'}">${item.badge}</span>
          <span class="civic-popup-cep">CEP ${item.cep}</span>
        </div>
        <span class="civic-popup-kicker">${item.unitType}</span>
        <h4 class="civic-popup-title">${item.name}</h4>
        <p class="civic-popup-meta"><strong>Endereço:</strong> ${item.street} — ${item.neighborhood}</p>
        <p class="civic-popup-meta"><strong>Horário:</strong> ${item.hours}</p>
        <p class="civic-popup-meta"><strong>Telefone:</strong> ${item.phone}</p>
        <div class="civic-popup-actions">
          ${primaryActionHtml}
          <div class="civic-popup-quick-grid">
            <a href="${streetView360Link}" target="_blank" rel="noopener noreferrer" class="btn-popup-action" title="Abrir Street View 360°">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              <span>Ver Fachada</span>
            </a>
            <a href="${gmapsRouteLink}" target="_blank" rel="noopener noreferrer" class="btn-popup-action btn-popup-route" title="Traçar rota no Google Maps">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
              <span>Traçar Rota</span>
            </a>
          </div>
        </div>
      </div>
    `;
  }

  function renderDetailPanelHtml(item, widgetMode) {
    const primaryActionHtml = buildPrimaryActionHtml(item, widgetMode, 'btn-detail-primary');
    const ringClass = getBubbleRingClass(item);
    const streetView360Link = `https://www.google.com/maps?layer=c&cbll=${item.coords[0]},${item.coords[1]}`;
    const gmapsRouteLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(item.name + ', ' + item.street + ', ' + item.cityState)}`;

    return `
      <div class="detail-clean-header ${ringClass}">
        <div class="detail-header-top-row">
          <span class="detail-status-badge ${item.badgeClass || 'badge-open-hours'}">${item.badge}</span>
          <span class="detail-cep-pill">CEP ${item.cep}</span>
        </div>
        <div class="detail-header-icon-row">
          <div class="detail-header-icon-box ${ringClass}">
            ${getCategoryIconSvg(item, 22)}
          </div>
          <div class="detail-header-title-wrap">
            <span class="detail-type-kicker">${item.unitType}</span>
            <h3 class="detail-title">${item.name}</h3>
          </div>
        </div>
      </div>

      <div class="detail-body">

        <div class="detail-meta-list">
          <div class="detail-meta-row">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 21s-7-4.5-7-10a7 7 0 1 1 14 0c0 5.5-7 10-7 10z"></path>
              <circle cx="12" cy="11" r="2.5"></circle>
            </svg>
            <div>
              <strong>Endereço Oficial e CEP:</strong>
              <span>${item.street} — Bairro ${item.neighborhood} · CEP <strong>${item.cep}</strong> (${item.cityState})</span>
            </div>
          </div>

          <div class="detail-meta-row">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <div>
              <strong>Horário de Funcionamento:</strong>
              <span>${item.hours}</span>
            </div>
          </div>

          <div class="detail-meta-row">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <div>
              <strong>Telefone / Plantão:</strong>
              <span>${item.phone}</span>
            </div>
          </div>
        </div>

        <div class="detail-services-box">
          <strong>Serviços e Atendimento ao Cidadão:</strong>
          ${item.services}
        </div>

        <div class="detail-actions-row">
          ${primaryActionHtml}
          <div class="detail-quick-actions-grid">
            <a href="${streetView360Link}" target="_blank" rel="noopener noreferrer" class="btn-detail-streetview" title="Ver foto esférica da fachada no Google Street View">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              <span>Ver Fachada</span>
            </a>
            <a href="${gmapsRouteLink}" target="_blank" rel="noopener noreferrer" class="btn-detail-secondary" title="Abrir GPS do Google Maps para traçar trajeto">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
              </svg>
              <span>Traçar Rota</span>
            </a>
          </div>
        </div>
      </div>
    `;
  }

  function initCivicMapWidget(config) {
    const {
      instanceKey = 'main',
      mapContainerId,
      detailContainerId,
      pillsContainerId,
      tabsContainerId,
      cityLabelId,
      defaultCategory = 'all',
      widgetMode = 'mainPage',
      onScheduleUnitClick = null
    } = config;

    const mapEl = document.getElementById(mapContainerId);
    const detailEl = document.getElementById(detailContainerId);
    const pillsEl = document.getElementById(pillsContainerId);
    const tabsEl = tabsContainerId ? document.getElementById(tabsContainerId) : null;
    const cityLabelEl = cityLabelId ? document.getElementById(cityLabelId) : null;

    if (!mapEl || !detailEl || typeof L === 'undefined') return null;

    let currentCity = (typeof getActiveCity === 'function') ? getActiveCity() : 'rio-das-ostras';
    if (!CIVIC_MAP_LOCATIONS[currentCity]) currentCity = 'rio-das-ostras';

    let currentCategory = defaultCategory;
    let selectedPlaceId = null;
    let markersById = {};
    const markersLayer = L.layerGroup();

    const initialCityObj = CIVIC_MAP_LOCATIONS[currentCity];
    const map = L.map(mapContainerId, {
      center: initialCityObj.center,
      zoom: initialCityObj.zoom,
      scrollWheelZoom: false
    });

    const googleStreetsLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=m&hl=pt-BR&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      attribution: 'Dados cartográficos &copy; Google Maps · Conecta Cidadão'
    });

    const googleHybridLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=y&hl=pt-BR&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      attribution: 'Imagens de satélite &copy; Google Maps · Conecta Cidadão'
    });

    googleStreetsLayer.addTo(map);
    markersLayer.addTo(map);

    // Adiciona seletor Mapa / Satélite no canto superior direito do mapa
    const parentWrap = mapEl.parentElement;
    if (parentWrap) {
      parentWrap.style.position = 'relative';
      const existingSwitcher = parentWrap.querySelector('.gmaps-layer-switcher');
      if (!existingSwitcher) {
        const switcher = document.createElement('div');
        switcher.className = 'gmaps-layer-switcher';
        switcher.innerHTML = `
          <button type="button" class="gmaps-layer-btn active" data-layer="streets">Mapa</button>
          <button type="button" class="gmaps-layer-btn" data-layer="hybrid">Satélite</button>
        `;
        parentWrap.insertBefore(switcher, mapEl);

        switcher.querySelectorAll('.gmaps-layer-btn').forEach((btn) => {
          btn.addEventListener('click', () => {
            const mode = btn.getAttribute('data-layer');
            switcher.querySelectorAll('.gmaps-layer-btn').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            if (mode === 'hybrid') {
              if (map.hasLayer(googleStreetsLayer)) map.removeLayer(googleStreetsLayer);
              googleHybridLayer.addTo(map);
            } else {
              if (map.hasLayer(googleHybridLayer)) map.removeLayer(googleHybridLayer);
              googleStreetsLayer.addTo(map);
            }
          });
        });
      }
    }

    function getCategoryItems(cityKey, catKey) {
      const cityObj = CIVIC_MAP_LOCATIONS[cityKey] || CIVIC_MAP_LOCATIONS['rio-das-ostras'];
      if (catKey === 'all') {
        const all = [];
        Object.values(cityObj.categories).forEach((c) => {
          if (c && Array.isArray(c.items)) {
            all.push(...c.items);
          }
        });
        return all;
      }
      return cityObj.categories[catKey]?.items || cityObj.categories.health?.items || [];
    }

    function updateTabCounts(cityKey) {
      if (!tabsEl) return;
      tabsEl.querySelectorAll('[data-map-cat]').forEach((btn) => {
        const cat = btn.getAttribute('data-map-cat');
        const countSpan = btn.querySelector('.tab-count');
        if (countSpan) {
          const items = getCategoryItems(cityKey, cat);
          countSpan.textContent = String(items.length);
        }
        btn.classList.toggle('active', cat === currentCategory);
        btn.setAttribute('aria-selected', String(cat === currentCategory));
      });
    }

    function selectPlace(placeId, shouldFly = true) {
      const items = getCategoryItems(currentCity, currentCategory);
      const target = items.find((i) => i.id === placeId) || items[0];
      if (!target) return;

      selectedPlaceId = target.id;
      detailEl.innerHTML = renderDetailPanelHtml(target, widgetMode);

      const scheduleBtn = detailEl.querySelector('[data-schedule-unit]');
      if (scheduleBtn && typeof onScheduleUnitClick === 'function') {
        scheduleBtn.addEventListener('click', () => {
          onScheduleUnitClick(target);
        });
      }

      if (pillsEl) {
        pillsEl.querySelectorAll('.civic-unit-quick-pill').forEach((pill) => {
          pill.classList.toggle('active', pill.getAttribute('data-place-id') === selectedPlaceId);
        });
      }

      mapEl.querySelectorAll('.civic-photo-bubble').forEach((b) => {
        const pid = b.getAttribute('data-place-id');
        b.classList.toggle('active-marker', pid === selectedPlaceId);
      });

      if (shouldFly && target.coords) {
        map.flyTo(target.coords, Math.max(map.getZoom(), 15), {
          duration: 0.75,
          easeLinearity: 0.25
        });
        const targetMarker = markersById[target.id];
        if (targetMarker) {
          targetMarker.openPopup();
        }
      }
    }

    function renderCategoryMarkers(cityKey, catKey, forceSelectId = null, fitMapBounds = true) {
      currentCity = cityKey;
      currentCategory = catKey;
      markersLayer.clearLayers();
      markersById = {};

      const cityObj = CIVIC_MAP_LOCATIONS[cityKey] || CIVIC_MAP_LOCATIONS['rio-das-ostras'];
      if (cityLabelEl) {
        cityLabelEl.textContent = cityObj.cityName;
      }

      updateTabCounts(cityKey);

      const items = getCategoryItems(cityKey, catKey);
      const latLngs = [];

      let chosenItem = null;
      if (forceSelectId) {
        chosenItem = items.find((i) => i.id === forceSelectId);
      }
      if (!chosenItem && items.length > 0) {
        chosenItem = items[0];
      }

      items.forEach((item) => {
        latLngs.push(item.coords);

        const icon = L.divIcon({
          className: 'civic-bubble-leaflet-icon',
          html: createBubbleHtml(item, item.id === (chosenItem ? chosenItem.id : null)),
          iconSize: [72, 68],
          iconAnchor: [36, 58],
          popupAnchor: [0, -54]
        });

        const marker = L.marker(item.coords, { icon });
        marker.bindPopup(renderPopupHtml(item, widgetMode), {
          maxWidth: 320,
          minWidth: 260,
          className: 'civic-map-popup-wrap'
        });

        marker.on('popupopen', (e) => {
          const popupEl = e.popup.getElement();
          if (popupEl && typeof onScheduleUnitClick === 'function') {
            const btn = popupEl.querySelector('[data-schedule-unit]');
            if (btn) {
              btn.addEventListener('click', () => {
                onScheduleUnitClick(item);
              });
            }
          }
        });

        marker.on('click', () => {
          selectPlace(item.id, false);
        });

        markersById[item.id] = marker;
        markersLayer.addLayer(marker);
      });

      if (pillsEl) {
        pillsEl.innerHTML = items
          .map((item) => {
            const ringClass = getBubbleRingClass(item);
            return `
              <button type="button" class="civic-unit-quick-pill ${item.id === (chosenItem ? chosenItem.id : '') ? 'active' : ''}" data-place-id="${item.id}">
                <span class="quick-pill-icon ${ringClass}">${getCategoryIconSvg(item, 18)}</span>
                <div class="quick-pill-info">
                  <strong>${item.shortLabel}</strong>
                  <span>${item.neighborhood} · CEP ${item.cep}</span>
                </div>
              </button>
            `;
          })
          .join('');

        pillsEl.querySelectorAll('.civic-unit-quick-pill').forEach((btn) => {
          btn.addEventListener('click', () => {
            const pid = btn.getAttribute('data-place-id');
            selectPlace(pid, true);
          });
        });
      }

      if (chosenItem) {
        selectPlace(chosenItem.id, false);
      }

      if (fitMapBounds && latLngs.length > 0) {
        if (latLngs.length === 1) {
          map.setView(latLngs[0], 15);
        } else {
          const bounds = L.latLngBounds(latLngs);
          map.fitBounds(bounds, { padding: [52, 52], maxZoom: 15 });
        }
      }

      setTimeout(() => {
        map.invalidateSize();
      }, 150);
    }

    if (tabsEl) {
      tabsEl.querySelectorAll('[data-map-cat]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const nextCat = btn.getAttribute('data-map-cat');
          renderCategoryMarkers(currentCity, nextCat, null, true);
        });
      });
    }

    renderCategoryMarkers(currentCity, currentCategory, null, true);

    window.addEventListener('conectaCityChanged', (e) => {
      const nextCity = e.detail?.cityKey || (typeof getActiveCity === 'function' ? getActiveCity() : 'rio-das-ostras');
      renderCategoryMarkers(nextCity, currentCategory, null, true);
    });

    const controller = {
      map,
      setCategory: (catKey, placeId = null) => {
        renderCategoryMarkers(currentCity, catKey, placeId, true);
      },
      focusPlaceById: (placeId) => {
        selectPlace(placeId, true);
      },
      getCityItems: (cityKey, catKey) => getCategoryItems(cityKey || currentCity, catKey || currentCategory)
    };

    activeMapInstances[instanceKey] = controller;
    return controller;
  }

  window.CIVIC_MAP_LOCATIONS = CIVIC_MAP_LOCATIONS;
  window.initCivicMapWidget = initCivicMapWidget;

  window.focusCivicMapCategory = function (categoryKey, placeId = null) {
    const section = document.getElementById('mapa-operacional-section') || document.getElementById('mapa-saude');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    const inst = activeMapInstances.main || activeMapInstances.health;
    if (inst) {
      inst.setCategory(categoryKey, placeId);
    }
  };

  window.focusHealthMapUnit = function (placeId) {
    const section = document.getElementById('mapa-saude');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    const inst = activeMapInstances.health;
    if (inst) {
      inst.focusPlaceById(placeId);
    }
  };
})();
