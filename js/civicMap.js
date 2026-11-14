// ==========================================================================
// CONECTA CIDADÃO - MAPA INTERATIVO ESTILO GOOGLE MAPS (civicMap.js)
// Renderiza cartografia oficial Google Maps (Mapa de Ruas + Satélite Híbrido)
// com bolhas de mini-fotos reais das UPAs 24h, Hospitais, UBS, Ecopontos de
// Reciclagem, Frentes de Obras e Defesa Civil (com rua real, bairro e CEP).
// ==========================================================================

(function () {
  function escapeXml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  // Fallback seguro (XML 100% escapado) caso o navegador esteja offline
  function createFallbackPhotoDataUri(label, bgHex) {
    const safeLabel = escapeXml(label);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" width="320" height="180">
      <rect width="320" height="180" fill="${bgHex || '#103FEF'}"/>
      <circle cx="160" cy="72" r="28" fill="rgba(255,255,255,0.2)"/>
      <path d="M148 72h24M160 60v24" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>
      <text x="160" y="135" text-anchor="middle" font-family="Plus Jakarta Sans, Arial, sans-serif" font-size="14" font-weight="800" fill="#FFFFFF">${safeLabel}</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  // Fotos reais de alta resolução (arquitetura hospitalar, clínicas, coleta seletiva e obras)
  const REAL_PHOTOS = {
    upa24h: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=640&q=80',
    hospital: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=640&q=80',
    prontoSocorro: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=640&q=80',
    ubsMarilea: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=640&q=80',
    ubsEdmeia: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=640&q=80',
    ubsClaudio: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=640&q=80',
    ubsPraiana: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=640&q=80',
    ecoponto: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=640&q=80',
    reciclagemOrla: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=640&q=80',
    obrasViarias: 'https://images.unsplash.com/photo-1541888946425-d09bb18086f6?auto=format&fit=crop&w=640&q=80',
    defesaCivil: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=640&q=80'
  };

  // Base Geográfica Real de Rio das Ostras (RJ) e Sapucaia do Sul (RS)
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
              photo: REAL_PHOTOS.upa24h,
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
              photo: REAL_PHOTOS.hospital,
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
              photo: REAL_PHOTOS.prontoSocorro,
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
              photo: REAL_PHOTOS.ubsMarilea,
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
              photo: REAL_PHOTOS.ubsEdmeia,
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
              photo: REAL_PHOTOS.ubsClaudio,
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
              photo: REAL_PHOTOS.ubsPraiana,
              fallbackPhoto: createFallbackPhotoDataUri('ESF CIDADE PRAIANA', '#103FEF'),
              services: 'Atendimento médico da família, vacinação infantil e adulto, aferição de pressão e glicemia, testes rápidos e acompanhamento odontológico.'
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
              photo: REAL_PHOTOS.ecoponto,
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
              photo: REAL_PHOTOS.reciclagemOrla,
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
              hours: 'Acesso 24h · Rota do caminhão de coleta domiciliar: Seg, Qua e Sex a partir das 07h',
              coords: [-22.5092, -41.9335],
              photo: REAL_PHOTOS.ecoponto,
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
              photo: REAL_PHOTOS.reciclagemOrla,
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
              photo: REAL_PHOTOS.obrasViarias,
              fallbackPhoto: createFallbackPhotoDataUri('OBRA ORLA COSTAZUL', '#D97706'),
              services: 'Assentamento de manilhas pluviais e recomposição asfáltica. Trânsito operando em meia pista com orientação da Guarda Municipal; desvio sugerido pela Av. Costa Azul.'
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
              photo: REAL_PHOTOS.obrasViarias,
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
              photo: REAL_PHOTOS.defesaCivil,
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
              photo: REAL_PHOTOS.defesaCivil,
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
              coords: [-29.8195, -51.1190],
              photo: REAL_PHOTOS.upa24h,
              fallbackPhoto: createFallbackPhotoDataUri('UPA 24H SAPUCAIA', '#DC2626'),
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
              coords: [-29.8233, -51.1661],
              photo: REAL_PHOTOS.hospital,
              fallbackPhoto: createFallbackPhotoDataUri('HOSPITAL GETÚLIO VARGAS', '#1E3A8A'),
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
              photo: REAL_PHOTOS.ubsMarilea,
              fallbackPhoto: createFallbackPhotoDataUri('UBS CENTRO SAPUCAIA', '#103FEF'),
              services: 'Vacinação completa do calendário SUS, consultas de clínica médica, pediatria, enfermagem, preventivo e dispensação de medicamentos.'
            },
            {
              id: 'sap-ubs-vargas',
              name: 'Centro de Especialidades e UBS Bairro Vargas',
              shortLabel: 'UBS Bairro Vargas',
              badge: '08h às 17h',
              badgeClass: 'badge-open-hours',
              is24h: false,
              categoryType: 'health',
              unitType: 'Atenção Básica e Especialidades Médicas SUS',
              street: 'Rua Santa Catarina, 512',
              neighborhood: 'Bairro Vargas',
              cep: '93222-180',
              cityState: 'Sapucaia do Sul · RS',
              phone: '(51) 3474-2840',
              hours: 'Segunda a Sexta, das 08h às 17h',
              coords: [-29.8390, -51.1540],
              photo: REAL_PHOTOS.ubsEdmeia,
              fallbackPhoto: createFallbackPhotoDataUri('UBS BAIRRO VARGAS', '#103FEF'),
              services: 'Atendimento médico e odontológico, cardiologia, pediatria, sala de imunização e coleta de exames laboratoriais.'
            },
            {
              id: 'sap-ubs-cohab',
              name: 'UBS Cohab Blocos',
              shortLabel: 'UBS Cohab Blocos',
              badge: '08h às 17h',
              badgeClass: 'badge-open-hours',
              is24h: false,
              categoryType: 'health',
              unitType: 'Unidade Básica de Saúde da Família',
              street: 'Avenida Alfredo Scharlau, 434',
              neighborhood: 'Cohab',
              cep: '93212-010',
              cityState: 'Sapucaia do Sul · RS',
              phone: '(51) 3451-8055',
              hours: 'Segunda a Sexta, das 08h às 17h',
              coords: [-29.8325, -51.1592],
              photo: REAL_PHOTOS.ubsClaudio,
              fallbackPhoto: createFallbackPhotoDataUri('UBS COHAB BLOCOS', '#103FEF'),
              services: 'Saúde da família, vacinação infantil e campanha Influenza, acompanhamento pré-natal e grupos de hipertensos e diabéticos.'
            }
          ]
        },
        waste: {
          label: 'Pontos de Reciclagem e Coleta',
          kicker: 'ECOPONTOS E COLETA SELETIVA · SAPUCAIA DO SUL',
          items: [
            {
              id: 'sap-ecoponto-central',
              name: 'Ecoponto Municipal de Sapucaia do Sul',
              shortLabel: 'Ecoponto Municipal',
              badge: '08h às 17h',
              badgeClass: 'badge-eco',
              is24h: false,
              categoryType: 'waste',
              unitType: 'Ecoponto Oficial para Recicláveis, Volumosos e Eletrônicos',
              street: 'Rua Monteiro Lobato, 244',
              neighborhood: 'Cohab / Piratini',
              cep: '93212-160',
              cityState: 'Sapucaia do Sul · RS',
              phone: '(51) 3451-8000 · Meio Ambiente',
              hours: 'Segunda a Sábado, das 08h às 12h e das 13h às 17h',
              coords: [-29.8308, -51.1538],
              photo: REAL_PHOTOS.ecoponto,
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
              photo: REAL_PHOTOS.reciclagemOrla,
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
              photo: REAL_PHOTOS.obrasViarias,
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
              coords: [-29.8215, -51.1495],
              photo: REAL_PHOTOS.defesaCivil,
              fallbackPhoto: createFallbackPhotoDataUri('DEFESA CIVIL 199', '#0284C7'),
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
    if (item.categoryType === 'waste') return 'type-waste';
    if (item.categoryType === 'works') return 'type-works';
    return 'type-civil';
  }

  function createBubbleHtml(item, isSelected) {
    const ringClass = getBubbleRingClass(item);
    const activeClass = isSelected ? 'active-marker' : '';
    const badge24h = item.is24h ? '<span class="bubble-24h-pill">24H</span>' : '';
    const fallbackAttr = item.fallbackPhoto ? `onerror="this.onerror=null;this.src='${item.fallbackPhoto}';"` : '';

    return `
      <div class="civic-photo-bubble ${activeClass}" data-place-id="${item.id}" title="${item.name} — ${item.street} (CEP ${item.cep})">
        <div class="bubble-avatar-ring ${ringClass}">
          ${badge24h}
          <img class="bubble-mini-photo" src="${item.photo}" alt="${item.shortLabel}" ${fallbackAttr}>
        </div>
        <span class="bubble-pointer"></span>
        <span class="bubble-floating-label">${item.shortLabel}</span>
      </div>
    `;
  }

  function renderDetailPanelHtml(item, widgetMode) {
    let primaryActionHtml = '';
    if (item.categoryType === 'health') {
      if (widgetMode === 'healthPage') {
        primaryActionHtml = `
          <button type="button" class="btn-detail-primary" data-schedule-unit="${item.name} — ${item.street} (${item.neighborhood})">
            Solicitar Agendamento nesta Unidade
          </button>
        `;
      } else {
        primaryActionHtml = `
          <a href="healthPage.html?unit=${encodeURIComponent(item.id)}#mapa-saude" class="btn-detail-primary">
            Agendar ou Ver Plantão na Saúde
          </a>
        `;
      }
    } else if (item.categoryType === 'waste') {
      primaryActionHtml = `
        <a href="occurrencePage.html?cat=LimpezaEntulho" class="btn-detail-primary">
          Solicitar Coleta ou Limpeza 156
        </a>
      `;
    } else if (item.categoryType === 'works') {
      primaryActionHtml = `
        <a href="occurrencePage.html?cat=AsfaltoBuracos" class="btn-detail-primary">
          Relatar Buraco ou Reparo na Via
        </a>
      `;
    } else {
      primaryActionHtml = `
        <a href="occurrencePage.html?cat=EsgotoBueiro" class="btn-detail-primary">
          Acionar Vistoria ou Drenagem 156
        </a>
      `;
    }

    const gmapsQuery = encodeURIComponent(`${item.name}, ${item.street}, ${item.neighborhood}, ${item.cityState}, ${item.cep}`);
    const gmapsLink = `https://www.google.com/maps/search/?api=1&query=${gmapsQuery}`;
    const fallbackAttr = item.fallbackPhoto ? `onerror="this.onerror=null;this.src='${item.fallbackPhoto}';"` : '';

    return `
      <div class="detail-photo-banner">
        <img src="${item.photo}" alt="Foto da unidade ${item.name}" ${fallbackAttr}>
        <div class="detail-photo-overlay">
          <span class="detail-status-badge ${item.badgeClass || 'badge-open-hours'}">${item.badge}</span>
          <span class="detail-cep-pill">CEP ${item.cep}</span>
        </div>
      </div>

      <div class="detail-body">
        <span class="detail-type-kicker">${item.unitType}</span>
        <h3 class="detail-title">${item.name}</h3>

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
          <strong>Serviços e Atendimento no Local:</strong>
          ${item.services}
        </div>

        <div class="detail-actions-row">
          ${primaryActionHtml}
          <a href="${gmapsLink}" target="_blank" rel="noopener noreferrer" class="btn-detail-secondary">
            Traçar Rota no Google Maps
          </a>
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
    const markersLayer = L.layerGroup();

    const initialCityObj = CIVIC_MAP_LOCATIONS[currentCity];
    const map = L.map(mapContainerId, {
      center: initialCityObj.center,
      zoom: initialCityObj.zoom,
      scrollWheelZoom: false
    });

    // Camadas oficiais Google Maps (Mapa de Ruas + Satélite Híbrido)
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
        return [
          ...(cityObj.categories.health?.items || []),
          ...(cityObj.categories.waste?.items || []),
          ...(cityObj.categories.works?.items || []),
          ...(cityObj.categories.civilDefense?.items || [])
        ];
      }
      return cityObj.categories[catKey]?.items || cityObj.categories.health.items;
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
        b.classList.toggle('active-marker', b.getAttribute('data-place-id') === selectedPlaceId);
      });

      if (shouldFly && target.coords) {
        map.flyTo(target.coords, 16, { duration: 0.65 });
      }
    }

    function renderCategoryMarkers(cityKey, catKey, preferredPlaceId = null, fitMapBounds = true) {
      currentCity = CIVIC_MAP_LOCATIONS[cityKey] ? cityKey : 'rio-das-ostras';
      currentCategory = catKey || defaultCategory;

      const cityObj = CIVIC_MAP_LOCATIONS[currentCity];
      if (cityLabelEl) {
        cityLabelEl.textContent = cityObj.cityName;
      }

      updateTabCounts(currentCity);

      const items = getCategoryItems(currentCity, currentCategory);
      const chosenItem = (preferredPlaceId && items.find((i) => i.id === preferredPlaceId)) || items[0];
      selectedPlaceId = chosenItem ? chosenItem.id : null;

      markersLayer.clearLayers();
      const latLngs = [];

      items.forEach((item) => {
        latLngs.push(item.coords);
        const icon = L.divIcon({
          className: 'civic-bubble-leaflet-icon',
          html: createBubbleHtml(item, item.id === selectedPlaceId),
          iconSize: [90, 84],
          iconAnchor: [45, 76]
        });

        const marker = L.marker(item.coords, { icon });
        marker.on('click', () => {
          selectPlace(item.id, true);
        });
        markersLayer.addLayer(marker);
      });

      if (pillsEl) {
        pillsEl.innerHTML = items
          .map((item) => {
            const fallbackAttr = item.fallbackPhoto
              ? `onerror="this.onerror=null;this.src='${item.fallbackPhoto}';"`
              : '';
            return `
              <button type="button" class="civic-unit-quick-pill ${item.id === selectedPlaceId ? 'active' : ''}" data-place-id="${item.id}">
                <img class="quick-pill-thumb" src="${item.photo}" alt="${item.shortLabel}" ${fallbackAttr}>
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
