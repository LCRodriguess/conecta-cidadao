// ==========================================================================
// CONECTA CIDADÃO - GERENCIADOR GLOBAL DE MUNICÍPIO, AUTENTICAÇÃO E DADOS REAIS (cityManager.js)
// Simula consumo de dados reais de cidadãos (CPF, Cartão SUS, endereço,
// tributos, agendamentos médicos e protocolos de zeladoria) sincronizados
// com o município selecionado (Rio das Ostras · RJ e Sapucaia do Sul · RS).
// ==========================================================================

const CITY_STORAGE_KEY = 'conecta_cidadao_active_city';
const CITIZEN_STORAGE_KEY = 'conecta_cidadao_active_citizen_id';
const CUSTOM_CITIZENS_KEY = 'conecta_cidadao_custom_citizens';
const LOCAL_OCCURRENCES_KEY = 'conecta_cidadao_local_occurrences';

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
    bairros: ['Costa Azul', 'Centro', 'Jardim Mariléa', 'Bela Vista', 'Extensão do Bosque', 'Enseada das Gaivotas', 'Cantagalo', 'Parque Âncora'],
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
    taxDamAmount: '148,50',
    taxBarcode: '81670000001-4 48502124202-6 89202610281-2 01041820294-8',
    dailyStatus: {
      waste: { status: 'Operação Normal', badgeClass: 'status-ok', detail: 'Coleta domiciliar e seletiva operando normalmente em Costa Azul, Centro e Jardim Mariléa (turno manhã/noite).' },
      works: { status: '2 frentes ativas', badgeClass: 'status-warn', detail: 'Obras de macrodrenagem na Av. Governador Roberto Silveira (Costazul) e recapeamento em Jardim Mariléa. Trânsito em meia pista.' },
      health: { status: 'UPAs 24h e 14 UBS abertas', badgeClass: 'status-ok', detail: 'UPA Parque Âncora e Hospital Dra. Naelma Monteiro com plantão 24h completo. Campanha de Multivacinação ativa nas UBS.' },
      civilDefense: { status: 'Estável · 26°C', badgeClass: 'status-ok', detail: 'Sem alertas de maré alta ou chuvas intensas nas próximas 24h na Região dos Lagos. Ventos fracos a moderados.' }
    }
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
    taxBarcode: '81670000001-8 62302124202-1 89202610282-5 02110450118-3',
    dailyStatus: {
      waste: { status: 'Operação Normal', badgeClass: 'status-ok', detail: 'Caminhões de coleta orgânica e conteinerizada operando dentro do cronograma no Centro, Bairro Vargas e Cohab.' },
      works: { status: '1 interdição parcial', badgeClass: 'status-warn', detail: 'Manutenção de rede pluvial com caminhão hidrojato na Av. Sapucaia esq. Sete de Setembro das 08h às 17h.' },
      health: { status: 'HMGV 24h e UBS abertas', badgeClass: 'status-ok', detail: 'Nova ala do Hospital Municipal Getúlio Vargas em funcionamento 24h. UBS Centro e Bairro Vargas com vacinação até 17h.' },
      civilDefense: { status: 'Atenção Preventiva · 21°C', badgeClass: 'status-info', detail: 'Monitoramento preventivo da bacia hidrográfica sem ocorrências. Equipes de poda e drenagem em prontidão.' }
    }
  }
};

// ==========================================================================
// BASE SIMULADA DE DADOS REAIS DE PESSOAS (CIDADÃOS CADASTRADOS)
// ==========================================================================
const DEFAULT_CITIZENS = [
  {
    id: 'cit-ro-01',
    name: 'Mariana Costa Almeida',
    socialName: '',
    cpf: '142.890.517-34',
    birthDate: '1988-04-15',
    email: 'mariana.almeida@email.com.br',
    phone: '(22) 99814-7721',
    susCard: '898 0012 3456 7891',
    cityKey: 'rio-das-ostras',
    cep: '28895-240',
    street: 'Rua das Gaivotas',
    number: '124',
    complement: 'Casa 2',
    neighborhood: 'Costa Azul',
    enrollment: 'RO-2026-9812',
    electoralZone: '184ª Zona Eleitoral · Seção 042 · Rio das Ostras',
    accountLevel: 'Conta Cidadã Verificada · Nível Ouro',
    avatarInitials: 'MA',
    memberSince: 'Março de 2024',
    bills: [
      {
        id: 'bill-ro-1',
        title: 'IPTU 2026 · Cota 10/12',
        val: 'R$ 148,50',
        rawVal: '148,50',
        due: '26 nov 2026',
        status: 'A vencer',
        docNumber: '01.04.182.0294.001',
        property: 'Rua das Gaivotas, 124 — Costa Azul'
      },
      {
        id: 'bill-ro-2',
        title: 'Taxa de Coleta e Manejo (TCRS)',
        val: 'R$ 64,90',
        rawVal: '64,90',
        due: '10 dez 2026',
        status: 'A vencer',
        docNumber: '01.04.182.0294.002',
        property: 'Rua das Gaivotas, 124 — Costa Azul'
      }
    ],
    appointment: {
      day: '21',
      month: 'NOV',
      title: 'Clínico Geral · Dra. Mariana Vasconcellos',
      specialty: 'Clínica Médica (CRM-RJ 84920)',
      time: 'Quarta-feira · 09h30',
      place: 'UBS Central — Av. das Flores, 80 · Centro, Rio das Ostras',
      status: 'Confirmado',
      protocol: 'SUS-RO-88412'
    },
    activeRequest: {
      protocol: 'SIM-2026-0042',
      title: 'Iluminação pública apagada',
      category: 'IluminacaoPublica',
      categoryLabel: 'Iluminação Pública',
      status: 'EmAnalise',
      badge: 'Em Análise',
      step: 2,
      openedAt: '18 out 2026',
      address: 'Rua das Gaivotas, 120 · Costa Azul',
      updateDate: 'Atualização técnica · Equipe SEMP',
      updateText: 'Vistoria noturna agendada pela Secretaria de Serviços Públicos na Rua das Gaivotas (Costa Azul) para troca de reatores LED.'
    }
  },
  {
    id: 'cit-ro-02',
    name: 'Carlos Eduardo Ribeiro',
    socialName: '',
    cpf: '084.512.907-18',
    birthDate: '1975-11-02',
    email: 'carlos.ribeiro@comercioostras.com.br',
    phone: '(22) 99702-3310',
    susCard: '898 0044 8821 1034',
    cityKey: 'rio-das-ostras',
    cep: '28890-010',
    street: 'Av. Amazonas',
    number: '450',
    complement: 'Apto 202',
    neighborhood: 'Centro',
    enrollment: 'RO-2026-6410',
    electoralZone: '184ª Zona Eleitoral · Seção 011 · Rio das Ostras',
    accountLevel: 'Conta Cidadã Verificada · Nível Prata',
    avatarInitials: 'CR',
    memberSince: 'Janeiro de 2025',
    bills: [
      {
        id: 'bill-ro-3',
        title: 'ISSQN Autônomo · Nov/2026',
        val: 'R$ 195,00',
        rawVal: '195,00',
        due: '28 nov 2026',
        status: 'A vencer',
        docNumber: '01.09.402.0110.001',
        property: 'Av. Amazonas, 450, Ap 202 — Centro'
      },
      {
        id: 'bill-ro-4',
        title: 'IPTU 2026 · Cota 11/12',
        val: 'R$ 210,40',
        rawVal: '210,40',
        due: '15 dez 2026',
        status: 'A vencer',
        docNumber: '01.09.402.0110.002',
        property: 'Av. Amazonas, 450, Ap 202 — Centro'
      }
    ],
    appointment: {
      day: '25',
      month: 'NOV',
      title: 'Cardiologia · Dr. Henrique Tavares',
      specialty: 'Exame de Eletrocardiograma + Consulta',
      time: 'Segunda-feira · 14h00',
      place: 'Hospital Municipal Dra. Naelma Monteiro — Jardim Mariléa',
      status: 'Confirmado',
      protocol: 'SUS-RO-91204'
    },
    activeRequest: {
      protocol: 'SIM-2026-0031',
      title: 'Reparo de buraco profundo na via',
      category: 'AsfaltoBuracos',
      categoryLabel: 'Asfalto e Buracos',
      status: 'Concluida',
      badge: 'Concluído',
      step: 4,
      openedAt: '10 out 2026',
      address: 'Av. Amazonas, 450 · Centro',
      updateDate: 'Serviço Concluído · Operação Tapa-Buraco',
      updateText: 'Operação tapa-buraco finalizada com aplicação de massa asfáltica a quente em frente ao nº 450 da Av. Amazonas.'
    }
  },
  {
    id: 'cit-ss-01',
    name: 'Helena Vargas Silveira',
    socialName: '',
    cpf: '031.765.420-89',
    birthDate: '1992-08-23',
    email: 'helena.silveira@email.com.br',
    phone: '(51) 99645-8812',
    susCard: '898 0098 7654 3210',
    cityKey: 'sapucaia',
    cep: '93210-240',
    street: 'Av. Sapucaia',
    number: '850',
    complement: 'Bloco B, Ap 304',
    neighborhood: 'Centro',
    enrollment: 'SS-2026-4431',
    electoralZone: '108ª Zona Eleitoral · Seção 118 · Sapucaia do Sul',
    accountLevel: 'Conta Cidadã Verificada · Nível Ouro',
    avatarInitials: 'HS',
    memberSince: 'Junho de 2023',
    bills: [
      {
        id: 'bill-ss-1',
        title: 'IPTU 2026 · Parcela 10',
        val: 'R$ 162,30',
        rawVal: '162,30',
        due: '28 nov 2026',
        status: 'A vencer',
        docNumber: '02.11.045.0118.001',
        property: 'Av. Sapucaia, 850 — Centro, Sapucaia do Sul'
      },
      {
        id: 'bill-ss-2',
        title: 'Taxa Ambiental e Coleta Urbana',
        val: 'R$ 58,20',
        rawVal: '58,20',
        due: '14 dez 2026',
        status: 'A vencer',
        docNumber: '02.11.045.0118.004',
        property: 'Av. Sapucaia, 850 — Centro, Sapucaia do Sul'
      }
    ],
    appointment: {
      day: '24',
      month: 'NOV',
      title: 'Odontologia Preventiva · Dr. Rafael Nogueira',
      specialty: 'Saúde Bucal (CRO-RS 19420)',
      time: 'Quinta-feira · 14h00',
      place: 'UBS Centro — Rua Tiradentes, 340 · Sapucaia do Sul',
      status: 'Confirmado',
      protocol: 'SUS-SS-44109'
    },
    activeRequest: {
      protocol: 'SIM-2026-0058',
      title: 'Limpeza de bueiro obstruído',
      category: 'EsgotoBueiro',
      categoryLabel: 'Esgoto e Bueiros',
      status: 'EquipeEnviada',
      badge: 'Equipe Enviada',
      step: 3,
      openedAt: '25 out 2026',
      address: 'Av. Sapucaia, 810 · Centro',
      updateDate: 'Equipe em campo · 26 out',
      updateText: 'Caminhão hidrojato deslocado pela Secretaria de Obras de Sapucaia do Sul para desobstrução preventiva na esquina com a Rua Sete de Setembro.'
    }
  },
  {
    id: 'cit-ss-02',
    name: 'Roberto Nascimento Farias',
    socialName: '',
    cpf: '619.204.880-05',
    birthDate: '1968-02-11',
    email: 'roberto.farias@vargasrs.com.br',
    phone: '(51) 99128-0490',
    susCard: '898 0077 1290 4512',
    cityKey: 'sapucaia',
    cep: '93222-180',
    street: 'Rua Tiradentes',
    number: '312',
    complement: 'Fundos',
    neighborhood: 'Bairro Vargas',
    enrollment: 'SS-2026-5190',
    electoralZone: '108ª Zona Eleitoral · Seção 205 · Sapucaia do Sul',
    accountLevel: 'Conta Cidadã Verificada · Nível Ouro',
    avatarInitials: 'RF',
    memberSince: 'Agosto de 2024',
    bills: [
      {
        id: 'bill-ss-3',
        title: 'IPTU 2026 · Cota Única Residual',
        val: 'R$ 134,80',
        rawVal: '134,80',
        due: '30 nov 2026',
        status: 'A vencer',
        docNumber: '02.18.091.0312.001',
        property: 'Rua Tiradentes, 312 — Bairro Vargas'
      }
    ],
    appointment: {
      day: '27',
      month: 'NOV',
      title: 'Clínico Geral · Dra. Luciana Dorneles',
      specialty: 'Acompanhamento de Hipertensão (Hiperdia)',
      time: 'Quarta-feira · 08h30',
      place: 'UBS Bairro Vargas — Av. Cel. Theodomiro · Sapucaia do Sul',
      status: 'Confirmado',
      protocol: 'SUS-SS-50921'
    },
    activeRequest: {
      protocol: 'SIM-2026-0089',
      title: 'Poda preventiva de árvore junto à rede',
      category: 'PodaArvore',
      categoryLabel: 'Poda e Árvores',
      status: 'EmAnalise',
      badge: 'Em Análise',
      step: 2,
      openedAt: '01 nov 2026',
      address: 'Rua Tiradentes, 312 · Bairro Vargas',
      updateDate: 'Laudo técnico emitido · Meio Ambiente',
      updateText: 'Engenheiro agrônomo da Secretaria de Meio Ambiente realizou vistoria e autorizou poda de condução programada para esta semana.'
    }
  }
];

// Obtém todos os cidadãos (padrão + cadastrados pelo usuário na tela de Register)
function getAllCitizens() {
  try {
    const raw = localStorage.getItem(CUSTOM_CITIZENS_KEY);
    const custom = raw ? JSON.parse(raw) : [];
    if (Array.isArray(custom) && custom.length > 0) {
      const customIds = new Set(custom.map(c => c.id));
      return [...custom, ...DEFAULT_CITIZENS.filter(d => !customIds.has(d.id))];
    }
  } catch (e) {
    console.warn('Erro ao ler cidadãos customizados:', e);
  }
  return [...DEFAULT_CITIZENS];
}

// Obtém o cidadão ativo logado (ou seleciona automaticamente o primeiro da cidade ativa)
function getActiveCitizen() {
  const all = getAllCitizens();
  try {
    const storedId = localStorage.getItem(CITIZEN_STORAGE_KEY);
    if (storedId) {
      const found = all.find(c => c.id === storedId);
      if (found) return found;
    }
  } catch (e) {
    console.warn('Erro ao obter cidadão ativo:', e);
  }
  const activeCity = getActiveCity();
  return all.find(c => c.cityKey === activeCity) || all[0];
}

// Define o cidadão ativo logado e sincroniza o município correspondente
function setActiveCitizen(citizenId, syncCity = true) {
  const all = getAllCitizens();
  const citizen = all.find(c => c.id === citizenId);
  if (!citizen) return null;

  try {
    localStorage.setItem(CITIZEN_STORAGE_KEY, citizen.id);
  } catch (e) {
    console.warn('Erro ao salvar cidadão ativo:', e);
  }

  if (syncCity && citizen.cityKey && MUNICIPALITIES[citizen.cityKey]) {
    try {
      localStorage.setItem(CITY_STORAGE_KEY, citizen.cityKey);
    } catch (e) {}
  }

  updateHeaderMunicipalityUI(citizen.cityKey || getActiveCity());

  window.dispatchEvent(new CustomEvent('conectaCitizenChanged', {
    detail: { citizen, cityKey: citizen.cityKey }
  }));

  window.dispatchEvent(new CustomEvent('conectaCityChanged', {
    detail: {
      cityKey: citizen.cityKey,
      cityData: getActiveCityData(citizen.cityKey),
      citizen
    }
  }));

  return citizen;
}

// Simula autenticação assíncrona de pessoa real por CPF, e-mail ou ID rápido
async function authenticateCitizenAsync(identifier, password) {
  await new Promise(resolve => setTimeout(resolve, 380));
  const all = getAllCitizens();
  const cleanInput = String(identifier || '').trim().toLowerCase();
  const digitsInput = cleanInput.replace(/\D/g, '');

  let matched = all.find(c => {
    const cpfDigits = c.cpf.replace(/\D/g, '');
    return (
      c.id.toLowerCase() === cleanInput ||
      c.email.toLowerCase() === cleanInput ||
      (digitsInput.length >= 6 && cpfDigits.includes(digitsInput))
    );
  });

  if (!matched && digitsInput.length === 11) {
    // Se digitou um CPF novo válido de 11 dígitos no login rápido, cria sessão simulada realista
    matched = registerNewCitizenSync({
      name: 'Cidadão Conecta Verificado',
      cpf: formatCpfMask(digitsInput),
      email: `cidadao.${digitsInput.slice(0, 4)}@conectacidadao.gov.br`,
      phone: '(22) 99800-1234',
      cityKey: getActiveCity(),
      neighborhood: getActiveCity() === 'rio-das-ostras' ? 'Costa Azul' : 'Centro',
      street: getActiveCity() === 'rio-das-ostras' ? 'Rua das Gaivotas' : 'Av. Sapucaia',
      number: '100'
    });
  }

  if (!matched) {
    throw new Error('CPF ou e-mail não encontrado na base municipal. Utilize um dos perfis reais ao lado ou cadastre-se gratuitamente.');
  }

  setActiveCitizen(matched.id, true);
  return matched;
}

// Registra uma nova pessoa real simulada no banco local e já ativa sua sessão
function registerNewCitizenSync(payload) {
  const cityKey = payload.cityKey && MUNICIPALITIES[payload.cityKey] ? payload.cityKey : getActiveCity();
  const isRio = cityKey === 'rio-das-ostras';
  const name = (payload.name || 'Cidadão Municipal').trim();
  const parts = name.split(/\s+/);
  const initials = ((parts[0]?.[0] || 'C') + (parts[parts.length - 1]?.[0] || 'M')).toUpperCase();
  const randNum = Math.floor(1000 + Math.random() * 8999);
  const susRandom = `898 00${Math.floor(10 + Math.random() * 89)} ${Math.floor(1000 + Math.random() * 8999)} ${Math.floor(1000 + Math.random() * 8999)}`;

  const newCitizen = {
    id: `cit-custom-${Date.now()}`,
    name,
    socialName: payload.socialName || '',
    cpf: payload.cpf || '111.222.333-44',
    birthDate: payload.birthDate || '1990-05-20',
    email: payload.email || 'cidadao@email.com.br',
    phone: payload.phone || (isRio ? '(22) 99822-1040' : '(51) 99711-2080'),
    susCard: payload.susCard || susRandom,
    cityKey,
    cep: payload.cep || (isRio ? '28895-000' : '93210-000'),
    street: payload.street || (isRio ? 'Rua das Gaivotas' : 'Av. Sapucaia'),
    number: payload.number || '150',
    complement: payload.complement || '',
    neighborhood: payload.neighborhood || (isRio ? 'Costa Azul' : 'Centro'),
    enrollment: `${isRio ? 'RO' : 'SS'}-2026-${randNum}`,
    electoralZone: isRio ? '184ª Zona Eleitoral · Rio das Ostras' : '108ª Zona Eleitoral · Sapucaia do Sul',
    accountLevel: 'Conta Cidadã Verificada · Nível Ouro',
    avatarInitials: initials,
    memberSince: 'Novembro de 2026',
    bills: [
      {
        id: `bill-${Date.now()}-1`,
        title: 'IPTU 2026 · Parcela Atual',
        val: isRio ? 'R$ 148,50' : 'R$ 162,30',
        rawVal: isRio ? '148,50' : '162,30',
        due: '28 nov 2026',
        status: 'A vencer',
        docNumber: isRio ? '01.04.182.0294.001' : '02.11.045.0118.001',
        property: `${payload.street || 'Rua Principal'}, ${payload.number || '150'} — ${payload.neighborhood || 'Centro'}`
      }
    ],
    appointment: {
      day: '26',
      month: 'NOV',
      title: isRio ? 'Clínico Geral · Dra. Mariana Vasconcellos' : 'Clínico Geral · Dra. Luciana Dorneles',
      specialty: 'Atendimento Preventivo SUS',
      time: 'Quinta-feira · 10h00',
      place: isRio ? 'UBS Central — Av. das Flores, 80 · Rio das Ostras' : 'UBS Centro — Rua Tiradentes, 340 · Sapucaia do Sul',
      status: 'Confirmado',
      protocol: `SUS-${isRio ? 'RO' : 'SS'}-${randNum}`
    },
    activeRequest: {
      protocol: `SIM-2026-${randNum}`,
      title: isRio ? 'Manutenção de iluminação em via pública' : 'Limpeza preventiva e desobstrução pluvial',
      category: isRio ? 'IluminacaoPublica' : 'EsgotoBueiro',
      categoryLabel: isRio ? 'Iluminação Pública' : 'Esgoto e Bueiros',
      status: 'EmAnalise',
      badge: 'Em Análise',
      step: 2,
      openedAt: 'Hoje',
      address: `${payload.street || 'Via Principal'}, ${payload.number || '150'} · ${payload.neighborhood || 'Centro'}`,
      updateDate: 'Cadastro vinculado · Equipe Técnica',
      updateText: `Solicitação vinculada ao cadastro de ${name} em análise pela equipe de zeladoria municipal.`
    }
  };

  try {
    const raw = localStorage.getItem(CUSTOM_CITIZENS_KEY);
    const custom = raw ? JSON.parse(raw) : [];
    const filtered = custom.filter(c => c.id !== newCitizen.id);
    filtered.unshift(newCitizen);
    localStorage.setItem(CUSTOM_CITIZENS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.warn('Erro ao persistir novo cidadão:', e);
  }

  setActiveCitizen(newCitizen.id, true);
  return newCitizen;
}

// Atualiza dados de um cidadão existente
function updateActiveCitizenProfile(updates) {
  const current = getActiveCitizen();
  const updated = { ...current, ...updates };
  try {
    const raw = localStorage.getItem(CUSTOM_CITIZENS_KEY);
    const custom = raw ? JSON.parse(raw) : [];
    const filtered = custom.filter(c => c.id !== updated.id);
    filtered.unshift(updated);
    localStorage.setItem(CUSTOM_CITIZENS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.warn('Erro ao salvar atualização de perfil:', e);
  }
  setActiveCitizen(updated.id, true);
  return updated;
}

function formatCpfMask(value) {
  const d = String(value || '').replace(/\D/g, '').slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9, 11)}`;
}

// Obtém os dados completos do município ativo mesclados com os dados reais do cidadão ativo
function getActiveCityData(key) {
  const k = key || getActiveCity();
  const baseCity = MUNICIPALITIES[k] || MUNICIPALITIES['rio-das-ostras'];
  const citizen = getActiveCitizen();

  if (citizen && citizen.cityKey === k) {
    return {
      ...baseCity,
      citizenName: citizen.name,
      citizenCpf: citizen.cpf,
      citizenEmail: citizen.email,
      citizenPhone: citizen.phone,
      citizenSusCard: citizen.susCard,
      citizenAddress: `${citizen.street}, ${citizen.number}${citizen.complement ? ' (' + citizen.complement + ')' : ''} — ${citizen.neighborhood}, ${baseCity.name}`,
      citizenEnrollment: citizen.enrollment,
      electoralZone: citizen.electoralZone,
      taxProperty: `${citizen.street}, ${citizen.number} · Bairro ${citizen.neighborhood} · ${baseCity.shortName}`,
      taxDamAmount: citizen.bills?.[0]?.rawVal || baseCity.taxDamAmount
    };
  }
  return baseCity;
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
// Também seleciona automaticamente um cidadão real daquela cidade caso o atual seja de outra
function setActiveCity(cityKey) {
  if (!MUNICIPALITIES[cityKey]) return;
  try {
    localStorage.setItem(CITY_STORAGE_KEY, cityKey);
  } catch (e) {
    console.warn('Erro ao salvar cidade:', e);
  }

  const currentCit = getActiveCitizen();
  if (!currentCit || currentCit.cityKey !== cityKey) {
    const cityCitizen = getAllCitizens().find(c => c.cityKey === cityKey);
    if (cityCitizen) {
      try {
        localStorage.setItem(CITIZEN_STORAGE_KEY, cityCitizen.id);
      } catch (e) {}
    }
  }

  updateHeaderMunicipalityUI(cityKey);

  const event = new CustomEvent('conectaCityChanged', {
    detail: {
      cityKey: cityKey,
      cityData: getActiveCityData(cityKey),
      citizen: getActiveCitizen()
    }
  });
  window.dispatchEvent(event);
}

// Atualiza o seletor do cabeçalho (SEU MUNICÍPIO) e dados de perfil visíveis
function updateHeaderMunicipalityUI(cityKey) {
  const data = getActiveCityData(cityKey);
  const citizen = getActiveCitizen();

  const activeNameEl = document.getElementById('muni-active-name') || document.getElementById('current-city-label');
  const altNameEl = document.getElementById('muni-alt-name') || document.getElementById('other-city-label');

  if (activeNameEl) activeNameEl.textContent = data.name;
  if (altNameEl) altNameEl.textContent = `Também disponível: ${data.otherName}`;

  const cardActive = document.getElementById('card-muni-active');
  const cardAlt = document.getElementById('card-muni-alt');
  if (cardActive) cardActive.textContent = data.nameClean;
  if (cardAlt) cardAlt.textContent = `Também disponível: ${data.otherClean}`;

  // Atualiza chip do cidadão na navbar, se presente
  const navCitizenName = document.getElementById('nav-citizen-name');
  const navCitizenSub = document.getElementById('nav-citizen-sub');
  const navCitizenAvatar = document.getElementById('nav-citizen-avatar');
  if (citizen) {
    if (navCitizenName) navCitizenName.textContent = citizen.name.split(' ').slice(0, 2).join(' ');
    if (navCitizenSub) navCitizenSub.textContent = `CPF ${citizen.cpf.slice(0, 7)}... · ${data.shortName}`;
    if (navCitizenAvatar) navCitizenAvatar.textContent = citizen.avatarInitials || 'CC';
  }

  document.querySelectorAll('.muni-opt, .city-option').forEach(opt => {
    const isThis = opt.dataset.city === cityKey;
    opt.classList.toggle('active', isThis);
  });
}

// Inicializa automaticamente seletores de município na página
document.addEventListener('DOMContentLoaded', () => {
  const currentCity = getActiveCity();
  updateHeaderMunicipalityUI(currentCity);

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

/* ==========================================================================
   MOTOR OFICIAL DE EMISSÃO E IMPRESSÃO DE COMPROVANTES E GUIAS MUNICIPAIS
   ========================================================================== */

function generateAuthHash(seedStr) {
  let hash = 0x811c9dc5;
  const input = String(seedStr || '') + '-CONECTA-2026';
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  const hex = (hash >>> 0).toString(16).toUpperCase().padStart(8, '0');
  return `${hex.slice(0, 4)}.${hex.slice(4, 8)}.9B2E.74C1.ICP-BR`;
}

function getBarcodeSvgHtml() {
  const widths = [3,1,2,2,1,3,1,1,2,3,1,2,1,3,2,1,1,3,2,1,2,2,1,3,1,2,1,1,3,2,1,2,3,1,1,2,2,1,3,1,2,1,3];
  let x = 4;
  const rects = widths.map((w, idx) => {
    const bar = idx % 2 === 0
      ? `<rect x="${x}" y="2" width="${w * 2.5}" height="40" fill="#000000"/>`
      : '';
    x += w * 2.5;
    return bar;
  }).join('');
  return `<svg viewBox="0 0 ${x + 4} 44" width="100%" height="44" preserveAspectRatio="none" aria-label="Código de Barras Oficial FEBRABAN">${rects}</svg>`;
}

function getQrCodeSvgHtml() {
  return `
    <svg viewBox="0 0 100 100" width="56" height="56" fill="#000000" aria-label="QR Code de Validação Eletrônica">
      <rect x="6" y="6" width="28" height="28" fill="none" stroke="#000" stroke-width="6"/>
      <rect x="14" y="14" width="12" height="12"/>
      <rect x="66" y="6" width="28" height="28" fill="none" stroke="#000" stroke-width="6"/>
      <rect x="74" y="14" width="12" height="12"/>
      <rect x="6" y="66" width="28" height="28" fill="none" stroke="#000" stroke-width="6"/>
      <rect x="14" y="74" width="12" height="12"/>
      <rect x="42" y="10" width="8" height="8"/>
      <rect x="42" y="26" width="8" height="16"/>
      <rect x="52" y="18" width="8" height="8"/>
      <rect x="10" y="44" width="16" height="8"/>
      <rect x="34" y="44" width="24" height="8"/>
      <rect x="44" y="56" width="12" height="12"/>
      <rect x="66" y="44" width="10" height="18"/>
      <rect x="82" y="50" width="12" height="12"/>
      <rect x="64" y="68" width="14" height="8"/>
      <rect x="82" y="72" width="12" height="20"/>
      <rect x="44" y="78" width="16" height="14"/>
    </svg>
  `;
}

function ensureReceiptModalContainer() {
  let overlay = document.getElementById('conecta-official-receipt-overlay');
  if (overlay) return overlay;

  overlay = document.createElement('div');
  overlay.id = 'conecta-official-receipt-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Visualização Oficial de Comprovante Municipal');

  overlay.innerHTML = `
    <div class="receipt-modal-shell">
      <div class="receipt-modal-toolbar no-print">
        <div class="receipt-toolbar-left">
          <span class="receipt-toolbar-badge" id="receipt-toolbar-badge">DOCUMENTO OFICIAL</span>
          <span class="receipt-toolbar-title" id="receipt-toolbar-title">Emissão Eletrônica · Conecta Cidadão</span>
        </div>
        <div class="receipt-toolbar-actions">
          <button type="button" class="btn-receipt-copy" id="btn-receipt-copy-code">📋 Copiar Autenticação</button>
          <button type="button" class="btn-receipt-print" id="btn-receipt-trigger-print">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            <span>Imprimir / Salvar PDF</span>
          </button>
          <button type="button" class="btn-receipt-close" id="btn-receipt-close-x" title="Fechar visualização">✕</button>
        </div>
      </div>

      <div class="receipt-modal-body">
        <div id="conecta-printable-sheet">
          <!-- Conteúdo dinâmico do documento oficial -->
        </div>
      </div>

      <div class="receipt-modal-footer-actions no-print">
        <span class="receipt-footer-hint">💡 Dica: Na janela de impressão, escolha <strong>"Salvar como PDF"</strong> ou selecione sua impressora.</span>
        <div style="display: flex; gap: 10px;">
          <button type="button" class="btn-receipt-close" id="btn-receipt-close-bottom" style="width: auto; height: auto; border-radius: 999px; padding: 8px 18px; color: #0F172A; border-color: #CBD5E1; font-size: 13px;">Fechar</button>
          <button type="button" class="btn-receipt-print" id="btn-receipt-trigger-print-bottom">🖨️ Imprimir Agora</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const closeReceipt = () => {
    overlay.classList.remove('active');
  };

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeReceipt();
  });

  document.getElementById('btn-receipt-close-x')?.addEventListener('click', closeReceipt);
  document.getElementById('btn-receipt-close-bottom')?.addEventListener('click', closeReceipt);

  const triggerBrowserPrint = () => {
    window.print();
  };

  document.getElementById('btn-receipt-trigger-print')?.addEventListener('click', triggerBrowserPrint);
  document.getElementById('btn-receipt-trigger-print-bottom')?.addEventListener('click', triggerBrowserPrint);

  document.getElementById('btn-receipt-copy-code')?.addEventListener('click', (e) => {
    const btn = e.currentTarget;
    const codeToCopy = overlay.dataset.copyCode || 'CONECTA-DOC-2026';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(codeToCopy).catch(() => {});
    }
    const prev = btn.textContent;
    btn.textContent = '✓ Copiado!';
    btn.style.background = '#00995D';
    setTimeout(() => {
      btn.textContent = prev;
      btn.style.background = '';
    }, 2000);
  });

  return overlay;
}

/**
 * Abre o visualizador oficial de comprovante/guia/certidão e prepara a folha de impressão (@media print).
 * @param {Object} spec Configuração do documento ('dam' | 'payment' | 'cnd' | 'sus' | 'protocol')
 * @param {boolean} autoPrint Se true, aciona window.print() automaticamente após abrir o documento
 */
function openOfficialReceiptModal(spec = {}, autoPrint = false) {
  const citizen = getActiveCitizen();
  const cityKey = citizen?.cityKey || getActiveCity();
  const cityData = getActiveCityData(cityKey);
  const isRio = cityKey === 'rio-das-ostras';

  const muniOfficialName = isRio
    ? 'PREFEITURA MUNICIPAL DE RIO DAS OSTRAS · ESTADO DO RIO DE JANEIRO'
    : 'PREFEITURA MUNICIPAL DE SAPUCAIA DO SUL · ESTADO DO RIO GRANDE DO SUL';
  const muniCnpj = isRio ? '39.224.812/0001-80' : '88.185.020/0001-25';

  const nowStr = new Date().toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  const type = spec.type || 'dam';
  const docNumber = spec.docNumber || citizen?.bills?.[0]?.docNumber || `DOC-2026-${Math.floor(1000 + Math.random() * 8999)}`;
  const authHash = generateAuthHash(`${citizen?.cpf}-${docNumber}-${type}`);
  const barcodeLine = spec.barcodeLine || (isRio
    ? '81660000001-8  48500104202-6  61128010418-2  20294001202-9'
    : '81690000001-2  62300211202-4  61128021104-5  50118001202-1');

  const overlay = ensureReceiptModalContainer();
  const sheet = document.getElementById('conecta-printable-sheet');
  const toolbarBadge = document.getElementById('receipt-toolbar-badge');
  const toolbarTitle = document.getElementById('receipt-toolbar-title');
  const copyBtn = document.getElementById('btn-receipt-copy-code');

  let departmentName = 'Secretaria Municipal de Fazenda e Administração Tributária';
  let pillLabel = 'GUIA DE ARRECADAÇÃO (DAM)';
  let pillClass = '';
  let bannerTitle = spec.title || 'Documento de Arrecadação Municipal — DAM';
  let stampText = spec.status || 'EMITIDO ELETRONICAMENTE';
  let bodyContentHtml = '';

  const fullAddress = `${citizen.street}, ${citizen.number}${citizen.complement ? ' (' + citizen.complement + ')' : ''} — Bairro ${citizen.neighborhood} · CEP ${citizen.cep}`;

  if (type === 'dam') {
    departmentName = 'Secretaria Municipal de Fazenda · Subsecretaria de Receita Tributária';
    pillLabel = 'GUIA DAM · FEBRABAN / PIX';
    bannerTitle = spec.title || citizen.bills?.[0]?.title || 'IPTU 2026 · Guia de Arrecadação Municipal (DAM)';
    stampText = spec.status || 'A VENCER · PAGÁVEL EM QUALQUER BANCO';
    const valStr = spec.amount || citizen.bills?.[0]?.val || `R$ ${cityData.taxDamAmount}`;
    const dueStr = spec.dueDate || citizen.bills?.[0]?.due || '28 nov 2026';
    const propertyStr = spec.property || citizen.bills?.[0]?.property || fullAddress;

    overlay.dataset.copyCode = barcodeLine;
    if (copyBtn) copyBtn.textContent = '📋 Copiar Linha Digitável';

    bodyContentHtml = `
      <p class="doc-section-label">1. Identificação do Contribuinte e Imóvel / Inscrição</p>
      <div class="doc-grid">
        <div class="doc-field">
          <span class="doc-field-label">Contribuinte / Titular Verificado</span>
          <span class="doc-field-value">${citizen.name}</span>
        </div>
        <div class="doc-field">
          <span class="doc-field-label">CPF do Contribuinte</span>
          <span class="doc-field-value">${citizen.cpf}</span>
        </div>
        <div class="doc-field">
          <span class="doc-field-label">Inscrição Municipal / Documento</span>
          <span class="doc-field-value">${docNumber}</span>
        </div>
        <div class="doc-field">
          <span class="doc-field-label">Matrícula Cidadã</span>
          <span class="doc-field-value">${citizen.enrollment}</span>
        </div>
        <div class="doc-field span-full">
          <span class="doc-field-label">Endereço do Imóvel / Estabelecimento Tributado</span>
          <span class="doc-field-value">${propertyStr} · ${cityData.name}</span>
        </div>
      </div>

      <p class="doc-section-label">2. Demonstrativo de Valores e Vencimento</p>
      <div class="doc-grid cols-3">
        <div class="doc-field">
          <span class="doc-field-label">Data de Vencimento</span>
          <span class="doc-field-value">${dueStr}</span>
        </div>
        <div class="doc-field">
          <span class="doc-field-label">Multa / Juros / Encargos</span>
          <span class="doc-field-value">R$ 0,00 (Em dia)</span>
        </div>
        <div class="doc-field">
          <span class="doc-field-label">Valor Total a Recolher</span>
          <span class="doc-field-value highlight">${valStr}</span>
        </div>
      </div>

      <div class="doc-barcode-section">
        <span class="doc-field-label" style="display:block; font-weight:800; color:#000;">LINHA DIGITÁVEL FEBRABAN (PAGÁVEL EM QUALQUER BANCO, LOTÉRICA OU PIX):</span>
        <div class="doc-digitable-line">${barcodeLine}</div>
        ${getBarcodeSvgHtml()}
      </div>
    `;
  } else if (type === 'payment') {
    departmentName = 'Secretaria Municipal de Fazenda · Tesouraria Geral do Município';
    pillLabel = 'COMPROVANTE DE QUITAÇÃO';
    pillClass = 'paid';
    bannerTitle = spec.title || 'Comprovante Oficial de Quitação de Tributo Municipal';
    stampText = 'PAGO / LIQUIDADO VIA PIX';
    const valStr = spec.amount || citizen.bills?.[0]?.val || `R$ ${cityData.taxDamAmount}`;
    const paidDate = spec.paidAt || nowStr;
    const txId = spec.txId || `E3922481220261108${Math.floor(100000 + Math.random() * 899999)}PIX`;

    overlay.dataset.copyCode = txId;
    if (copyBtn) copyBtn.textContent = '📋 Copiar ID Transação Pix';

    bodyContentHtml = `
      <div class="doc-legal-box">
        <strong>QUITAÇÃO CONFIRMADA:</strong> A Secretaria Municipal de Fazenda certifica o recebimento integral do tributo abaixo discriminado por meio do Sistema de Pagamentos Instantâneos (Pix Banco Central), dando plena quitação para a respectiva parcela/referência.
      </div>

      <p class="doc-section-label">1. Dados do Contribuinte Pagador</p>
      <div class="doc-grid">
        <div class="doc-field">
          <span class="doc-field-label">Nome do Contribuinte</span>
          <span class="doc-field-value">${citizen.name}</span>
        </div>
        <div class="doc-field">
          <span class="doc-field-label">CPF Verificado</span>
          <span class="doc-field-value">${citizen.cpf}</span>
        </div>
        <div class="doc-field span-full">
          <span class="doc-field-label">Imóvel / Endereço Vinculado</span>
          <span class="doc-field-value">${fullAddress} · ${cityData.name}</span>
        </div>
      </div>

      <p class="doc-section-label">2. Detalhes da Liquidação Financeira</p>
      <div class="doc-grid cols-3">
        <div class="doc-field">
          <span class="doc-field-label">Tributo / Referência Quitada</span>
          <span class="doc-field-value">${spec.reference || citizen.bills?.[0]?.title || 'IPTU 2026'}</span>
        </div>
        <div class="doc-field">
          <span class="doc-field-label">Data/Hora da Liquidação</span>
          <span class="doc-field-value">${paidDate}</span>
        </div>
        <div class="doc-field">
          <span class="doc-field-label">Valor Total Liquidado</span>
          <span class="doc-field-value highlight-green">${valStr}</span>
        </div>
        <div class="doc-field span-full">
          <span class="doc-field-label">Identificador End-to-End (ID da Transação Pix BACEN)</span>
          <span class="doc-field-value" style="font-family: monospace;">${txId}</span>
        </div>
        <div class="doc-field span-full">
          <span class="doc-field-label">Favorecido Oficial</span>
          <span class="doc-field-value">${muniOfficialName} · CNPJ ${muniCnpj}</span>
        </div>
      </div>
    `;
  } else if (type === 'cnd') {
    departmentName = 'Procuradoria Geral e Secretaria Municipal de Fazenda';
    pillLabel = 'CERTIDÃO NEGATIVA (CND)';
    pillClass = 'confirmed';
    bannerTitle = 'Certidão Negativa de Débitos Municipais e Imobiliários';
    stampText = 'NADA CONSTA · SITUAÇÃO REGULAR';

    overlay.dataset.copyCode = authHash;
    if (copyBtn) copyBtn.textContent = '📋 Copiar Chave CND';

    bodyContentHtml = `
      <div class="doc-legal-box">
        <strong>CERTIFICAMOS</strong>, nos termos do Código Tributário Municipal e para os devidos fins de direito, que revendo os cadastros da Fazenda Pública Municipal em nome do(a) contribuinte abaixo qualificado(a), <strong>NÃO CONSTA DÉBITO VENCIDO OU INSCRITO EM DÍVIDA ATIVA</strong> até a presente data.
      </div>

      <p class="doc-section-label">1. Qualificação do Contribuinte e Cadastro Imobiliário</p>
      <div class="doc-grid">
        <div class="doc-field">
          <span class="doc-field-label">Nome / Razão Social</span>
          <span class="doc-field-value">${citizen.name}</span>
        </div>
        <div class="doc-field">
          <span class="doc-field-label">CPF / Documento Fiscal</span>
          <span class="doc-field-value">${citizen.cpf}</span>
        </div>
        <div class="doc-field">
          <span class="doc-field-label">Inscrição Imobiliária Municipal</span>
          <span class="doc-field-value">${docNumber}</span>
        </div>
        <div class="doc-field">
          <span class="doc-field-label">Situação Fiscal Consolidada</span>
          <span class="doc-field-value highlight-green">REGULAR · SEM PENDÊNCIAS VENCIDAS</span>
        </div>
        <div class="doc-field span-full">
          <span class="doc-field-label">Endereço do Imóvel Certificado</span>
          <span class="doc-field-value">${fullAddress} · ${cityData.name}</span>
        </div>
      </div>

      <p class="doc-section-label">2. Validade e Finalidade Legal</p>
      <div class="doc-grid cols-3">
        <div class="doc-field">
          <span class="doc-field-label">Finalidade</span>
          <span class="doc-field-value">Fins Gerais / Licitações / Averbação</span>
        </div>
        <div class="doc-field">
          <span class="doc-field-label">Data de Emissão</span>
          <span class="doc-field-value">${nowStr.split(',')[0]}</span>
        </div>
        <div class="doc-field">
          <span class="doc-field-label">Válida por</span>
          <span class="doc-field-value">90 (noventa) dias corridos</span>
        </div>
      </div>
    `;
  } else if (type === 'sus') {
    departmentName = 'Secretaria Municipal de Saúde · Central de Regulação SUS';
    pillLabel = 'COMPROVANTE SUS';
    pillClass = 'confirmed';
    const app = citizen.appointment || {};
    bannerTitle = spec.title || app.title || 'Comprovante de Agendamento na Rede Municipal SUS';
    stampText = spec.status || app.status || 'AGENDAMENTO CONFIRMADO';

    overlay.dataset.copyCode = spec.protocol || app.protocol || docNumber;
    if (copyBtn) copyBtn.textContent = '📋 Copiar Protocolo SUS';

    bodyContentHtml = `
      <p class="doc-section-label">1. Identificação do Paciente (Cadastro Nacional de Saúde)</p>
      <div class="doc-grid">
        <div class="doc-field">
          <span class="doc-field-label">Nome Completo do Paciente</span>
          <span class="doc-field-value">${citizen.name}</span>
        </div>
        <div class="doc-field">
          <span class="doc-field-label">CPF do Paciente</span>
          <span class="doc-field-value">${citizen.cpf}</span>
        </div>
        <div class="doc-field">
          <span class="doc-field-label">Cartão Nacional de Saúde (Cartão SUS)</span>
          <span class="doc-field-value highlight">${spec.susCard || citizen.susCard}</span>
        </div>
        <div class="doc-field">
          <span class="doc-field-label">Protocolo de Regulação</span>
          <span class="doc-field-value">${spec.protocol || app.protocol || docNumber}</span>
        </div>
      </div>

      <p class="doc-section-label">2. Dados do Atendimento e Unidade de Saúde</p>
      <div class="doc-grid">
        <div class="doc-field">
          <span class="doc-field-label">Especialidade / Atendimento</span>
          <span class="doc-field-value">${spec.specialty || app.title || 'Consulta Médica SUS'}</span>
        </div>
        <div class="doc-field">
          <span class="doc-field-label">Data e Horário Agendados</span>
          <span class="doc-field-value highlight-green">${spec.dateTime || `${app.day || '18'} ${app.month || 'NOV'} 2026 · ${app.time || '09h30'}`}</span>
        </div>
        <div class="doc-field span-full">
          <span class="doc-field-label">Unidade Básica / Especializada de Saúde (Local de Apresentação)</span>
          <span class="doc-field-value">${spec.location || app.place || cityData.healthUnit}</span>
        </div>
      </div>

      <div class="doc-legal-box">
        <strong>ORIENTAÇÕES DE PREPARO E APRESENTAÇÃO:</strong><br>
        ${spec.instructions || 'Compareça à unidade com 15 minutos de antecedência portando Documento Oficial com Foto, CPF, Cartão SUS e exames ou receitas anteriores.'}
      </div>
    `;
  } else if (type === 'protocol') {
    departmentName = 'Ouvidoria Geral e Central de Atendimento 156 · Zeladoria Urbana';
    pillLabel = 'PROTOCOLO OFICIAL 156';
    pillClass = 'confirmed';
    const req = citizen.activeRequest || {};
    const protoNum = spec.protocol || req.protocol || docNumber;
    bannerTitle = `Comprovante de Protocolo 156 — ${protoNum}`;
    stampText = spec.statusText || req.badge || 'PROTOCOLO REGISTRADO';

    overlay.dataset.copyCode = protoNum;
    if (copyBtn) copyBtn.textContent = '📋 Copiar Nº Protocolo';

    const timelineItems = Array.isArray(spec.timeline) && spec.timeline.length > 0
      ? spec.timeline.map(t => `<li style="margin-bottom:6px;"><strong>${t.date}:</strong> ${t.text}</li>`).join('')
      : `<li><strong>${req.updateDate || nowStr}:</strong> ${req.updateText || 'Solicitação registrada e encaminhada à equipe técnica da secretaria responsável.'}</li>`;

    bodyContentHtml = `
      <p class="doc-section-label">1. Dados do Cidadão Solicitante</p>
      <div class="doc-grid">
        <div class="doc-field">
          <span class="doc-field-label">Solicitante Identificado</span>
          <span class="doc-field-value">${citizen.name}</span>
        </div>
        <div class="doc-field">
          <span class="doc-field-label">CPF / Contato Registrado</span>
          <span class="doc-field-value">${citizen.cpf} · ${citizen.phone}</span>
        </div>
      </div>

      <p class="doc-section-label">2. Dados da Ocorrência / Solicitação de Serviço Urbano</p>
      <div class="doc-grid">
        <div class="doc-field">
          <span class="doc-field-label">Número do Protocolo Oficial</span>
          <span class="doc-field-value highlight">${protoNum}</span>
        </div>
        <div class="doc-field">
          <span class="doc-field-label">Etapa Atual de Atendimento</span>
          <span class="doc-field-value highlight-green">${stampText}</span>
        </div>
        <div class="doc-field span-full">
          <span class="doc-field-label">Serviço Solicitado</span>
          <span class="doc-field-value">${spec.serviceTitle || req.title || 'Solicitação de Zeladoria Urbana'}</span>
        </div>
        <div class="doc-field span-full">
          <span class="doc-field-label">Endereço / Localização da Ocorrência</span>
          <span class="doc-field-value">${spec.address || req.address || fullAddress}</span>
        </div>
      </div>

      <div class="doc-legal-box">
        <strong>HISTÓRICO OFICIAL DE MOVIMENTAÇÕES TÉCNICAS:</strong>
        <ul style="margin: 8px 0 0 18px; padding: 0;">
          ${timelineItems}
        </ul>
      </div>
    `;
  }

  if (toolbarBadge) toolbarBadge.textContent = pillLabel;
  if (toolbarTitle) toolbarTitle.textContent = `${bannerTitle} · ${cityData.nameClean}`;

  sheet.innerHTML = `
    <header class="doc-header">
      <div class="doc-header-brand">
        <div class="doc-coat-box">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <path d="m9 12 2 2 4-4"></path>
          </svg>
        </div>
        <div class="doc-org-texts">
          <span class="doc-org-country">REPÚBLICA FEDERATIVA DO BRASIL · PORTAL CONECTA CIDADÃO</span>
          <strong class="doc-org-muni">${muniOfficialName}</strong>
          <span class="doc-org-dept">${departmentName} · CNPJ ${muniCnpj}</span>
        </div>
      </div>
      <div class="doc-header-meta">
        <span class="doc-type-pill ${pillClass}">${pillLabel}</span>
        <span class="doc-control-num">Nº ${docNumber}</span>
        <span class="doc-timestamp">Emitido em: ${nowStr}</span>
      </div>
    </header>

    <div class="doc-title-banner">
      <h2>${bannerTitle}</h2>
      <span class="doc-status-stamp">${stampText}</span>
    </div>

    ${bodyContentHtml}

    <footer class="doc-auth-footer">
      <div class="doc-auth-info">
        <strong>AUTENTICAÇÃO ELETRÔNICA OFICIAL — PADRÃO GOVTECH / ICP-BRASIL</strong>
        A autenticidade deste documento pode ser confirmada no portal oficial da Prefeitura (${cityData.nameClean}) informando o código abaixo:
        <span class="doc-auth-hash">CHAVE DE VALIDAÇÃO: ${authHash} · MATRÍCULA CIDADÃ: ${citizen.enrollment}</span>
      </div>
      <div class="doc-qr-box">
        ${getQrCodeSvgHtml()}
      </div>
    </footer>
  `;

  overlay.classList.add('active');

  if (autoPrint) {
    setTimeout(() => {
      window.print();
    }, 220);
  }
}

window.openOfficialReceiptModal = openOfficialReceiptModal;
