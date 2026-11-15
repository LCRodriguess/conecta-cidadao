document.addEventListener('DOMContentLoaded', () => {

  const API_URL = 'http://localhost:8080/api/jobs';

  const cityNames = {
    'rio-das-ostras': 'Rio das Ostras',
    'sapucaia': 'Sapucaia do Sul'
  };

  let activeCity = typeof getActiveCity === 'function'
    ? getActiveCity()
    : 'rio-das-ostras';

  let activeArea = 'all';
  let jobsByCity = {};
  let selectedJob = null;

  const jobsContainer = document.getElementById('jobs-container');
  const jobsCount = document.getElementById('jobs-count');
  const searchInput = document.getElementById('search-input');
  const modalitySelect = document.getElementById('modality-select');
  const btnSearch = document.getElementById('btn-search-jobs');
  const btnApply = document.getElementById('btn-apply');

  const applicationModal = document.getElementById('application-modal');
  const modalJobTitle = document.getElementById('modal-job-title');
  const modalJobCompany = document.getElementById('modal-job-company');
  const modalJobLink = document.getElementById('modal-job-link');

  // Normaliza textos para facilitar as comparações.
  function normalize(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  // Identifica se a oportunidade é estágio.
  function isInternship(job) {
    const title = normalize(job.title);
    const type = normalize(job.employmentType);
    const description = normalize(job.description);

    return (
      title.includes('estagio') ||
      title.includes('trainee') ||
      type.includes('intern') ||
      type.includes('estagio') ||
      description.includes('programa de estagio')
    );
  }

  // Identifica a modalidade de trabalho.
  function getModality(job) {
    const model = normalize(job.workModel);
    const title = normalize(job.title);

    if (isInternship(job)) {
      return 'Estágio';
    }

    if (
      model.includes('remote') ||
      model.includes('remoto') ||
      model.includes('home office') ||
      title.includes('remoto') ||
      title.includes('home office')
    ) {
      return 'Remoto';
    }

    if (
      model.includes('hybrid') ||
      model.includes('hibrido') ||
      title.includes('hibrido')
    ) {
      return 'Híbrido';
    }

    if (
      model.includes('onsite') ||
      model.includes('on site') ||
      model.includes('presencial') ||
      title.includes('presencial')
    ) {
      return 'Presencial';
    }

    return 'Não informado';
  }

  // Traduz o tipo de contrato.
  function getContract(type) {
    const contracts = {
      fulltime: 'Tempo integral',
      parttime: 'Meio período',
      contractor: 'Prestação de serviços',
      temporary: 'Temporário',
      intern: 'Estágio',
      volunteer: 'Voluntariado',
      perdiem: 'Por diária',
      other: 'Outro'
    };

    return contracts[normalize(type).replace(/\s/g, '')]
      || 'Não informado';
  }

  // Classifica a vaga usando título e descrição.
  function getArea(job) {
    const value = normalize(
      `${job.title || ''} ${job.description || ''}`
    );

    const containsAny = keywords =>
      keywords.some(keyword => value.includes(normalize(keyword)));

    // Tecnologia
    if (containsAny([
      'desenvolvedor',
      'desenvolvedora',
      'developer',
      'desenvolvimento de software',
      'programador',
      'programadora',
      'programacao',
      'software',
      'tecnologia',
      'informatica',
      'analista de sistemas',
      'analista de ti',
      'analista de infraestrutura',
      'suporte tecnico',
      'infraestrutura de ti',
      'banco de dados',
      'engenheiro de software',
      'engenheira de software',
      'devops',
      'redes de computadores',
      'help desk',
      'frontend',
      'backend',
      'full stack'
    ])) {
      return 'Tecnologia';
    }

    // Comércio
    if (containsAny([
      'vendedor',
      'vendedora',
      'vendas',
      'comercial',
      'operador de caixa',
      'operadora de caixa',
      'caixa',
      'atendente de loja',
      'atendente de restaurante',
      'gerente de loja',
      'loja',
      'crediario',
      'consultor comercial',
      'consultora comercial',
      'representante comercial',
      'varejo',
      'balconista',
      'repositor',
      'acougue',
      'hortifruti',
      'assistente de vendas',
      'consultor de vendas'
    ])) {
      return 'Comércio';
    }

    // Administrativo
    if (containsAny([
      'administrativo',
      'administrativa',
      'administracao',
      'assistente administrativo',
      'auxiliar administrativo',
      'recursos humanos',
      'departamento pessoal',
      'financeiro',
      'contabilidade',
      'contabil',
      'faturamento',
      'escritorio',
      'secretaria',
      'secretario',
      'logistica',
      'compras',
      'analista financeiro',
      'analista administrativo',
      'planejamento de materiais',
      'gerente administrativo',
      'gerente financeiro',
      'recrutador',
      'recrutadora',
      'talent acquisition'
    ]) || /(^|\s)rh($|\s)/.test(value)) {
      return 'Administrativo';
    }

    // Serviços
    if (containsAny([
      'motorista',
      'cozinheiro',
      'cozinheira',
      'cozinha',
      'garcom',
      'garconete',
      'limpeza',
      'servicos gerais',
      'porteiro',
      'porteira',
      'vigilante',
      'manutencao',
      'eletricista',
      'pedreiro',
      'recepcionista',
      'jardineiro',
      'auxiliar de servicos',
      'operador de maquinas',
      'operadora de maquinas',
      'operador de patio',
      'operador de posicionamento',
      'posicionamento dinamico',
      'trefila',
      'contramestre',
      'eletroeletronico',
      'plataformista',
      'engenheiro de manutencao',
      'tecnico de manutencao',
      'tecnico de servicos',
      'manipulador de alimentos'
    ])) {
      return 'Serviços';
    }

    return 'Outras';
  }

  // Formata a data de publicação.
  function formatDate(date) {
    if (!date) {
      return 'Data de publicação não informada';
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return 'Data de publicação não informada';
    }

    return 'Publicado em ' +
      parsed.toLocaleDateString('pt-BR', {
        timeZone: 'UTC'
      });
  }

  // Adapta os dados recebidos da API.
  function mapJob(job, index, cityKey) {
    return {
      id: job.id ?? job.url ?? `${cityKey}-${index}`,
      title: job.title || 'Título não informado',
      company: job.companyName || 'Empresa não informada',
      location: `${job.city || cityNames[cityKey]} · ${job.region || (cityKey === 'sapucaia' ? 'RS' : 'RJ')}`,
      salary: job.salary || 'Não informado',
      contract: getContract(job.employmentType),
      modality: getModality(job),
      isInternship: isInternship(job),
      area: getArea(job),
      date: formatDate(job.postedAt),
      description: job.description || '',
      url: job.url || '',
      workload: 'Jornada de trabalho não informada'
    };
  }

  // Atualiza a identificação da fonte das oportunidades.
  function updateAttribution(result) {
    let link = document.getElementById('jobs-attribution');

    if (!link) {
      link = document.createElement('a');
      link.id = 'jobs-attribution';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.style.display = 'inline-block';
      link.style.marginTop = '8px';
      link.style.fontSize = '12px';

      jobsCount.insertAdjacentElement('afterend', link);
    }

    link.textContent = result.attributionText || 'Vagas via Joonow';
    link.href = result.attributionUrl || 'https://www.joonow.com/';
  }

  // Carrega as vagas do município selecionado.
  async function loadJobs(cityKey) {
    jobsContainer.innerHTML = `
      <div class="empty-jobs">
        <p>Carregando oportunidades...</p>
      </div>
    `;

    jobsCount.textContent = 'Consultando oportunidades...';

    try {
      const response = await fetch(
        `${API_URL}/${encodeURIComponent(cityKey)}`
      );

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}`);
      }

      const result = await response.json();

      const jobs = Array.isArray(result)
        ? result
        : result.jobs;

      if (!Array.isArray(jobs)) {
        throw new Error('Formato de resposta inválido.');
      }

      jobsByCity[cityKey] = jobs.map((job, index) =>
        mapJob(job, index, cityKey)
      );

      if (!Array.isArray(result)) {
        updateAttribution(result);
      }

      // Evita renderizar dados de um município que já foi trocado.
      if (activeCity === cityKey) {
        renderJobs();
      }

    } catch (error) {
      console.error('Erro ao carregar vagas:', error);

      if (activeCity !== cityKey) return;

      jobsCount.textContent = 'Falha ao carregar vagas';

      jobsContainer.innerHTML = `
        <div class="empty-jobs">
          <h3>Não foi possível carregar as vagas</h3>
          <p>
            Verifique se o servidor está em execução e tente novamente.
          </p>
        </div>
      `;

      clearDetails();
    }
  }

  // Limpa os detalhes quando não há vaga selecionada.
  function clearDetails() {
    selectedJob = null;

    document.getElementById('det-title').textContent =
      'Nenhuma vaga selecionada';

    document.getElementById('det-company').textContent = '';
    document.getElementById('det-location').textContent = '';
    document.getElementById('det-salary').textContent = 'Não informado';
    document.getElementById('det-contract').textContent = 'Não informado';

    document.getElementById('det-workload').textContent =
      'Jornada de trabalho não informada';

    document.getElementById('det-activities').textContent =
      'Descrição não informada pela fonte.';

    document.getElementById('det-requirements').innerHTML =
      '<li>Requisitos não informados.</li>';

    document.getElementById('det-date').textContent = '';

    const sourceLink = document.getElementById('det-source');

    if (sourceLink) {
      sourceLink.remove();
    }

    btnApply.disabled = true;
  }

  // Exibe os detalhes da vaga selecionada.
  function selectJob(job) {
    if (!job) return;

    selectedJob = job;

    document.querySelectorAll('.job-card').forEach(card => {
      card.classList.toggle(
        'selected',
        card.dataset.id === String(job.id)
      );

      const badge = card.querySelector('.selected-badge');

      if (badge) {
        badge.remove();
      }

      if (card.dataset.id === String(job.id)) {
        const top = card.querySelector('.job-card-top');

        if (top) {
          const selectedBadge = document.createElement('span');
          selectedBadge.className = 'selected-badge';
          selectedBadge.textContent = 'Selecionada';
          top.appendChild(selectedBadge);
        }
      }
    });

    document.getElementById('det-title').textContent = job.title;
    document.getElementById('det-company').textContent = job.company;
    document.getElementById('det-location').textContent = job.location;
    document.getElementById('det-salary').textContent = job.salary;

    document.getElementById('det-contract').textContent =
      `${job.contract} · ${job.modality}`;

    document.getElementById('det-workload').textContent = job.workload;

    document.getElementById('det-activities').textContent =
      job.description || 'Descrição não informada pela fonte.';

    document.getElementById('det-date').textContent = job.date;

    const requirements = document.getElementById('det-requirements');
    requirements.replaceChildren();

    const requirement = document.createElement('li');
    requirement.textContent =
      'Consulte os requisitos na página original da oportunidade.';

    requirements.appendChild(requirement);

    let sourceLink = document.getElementById('det-source');

    if (!sourceLink) {
      sourceLink = document.createElement('a');
      sourceLink.id = 'det-source';
      sourceLink.textContent = 'Consultar vaga original';
      sourceLink.target = '_blank';
      sourceLink.rel = 'noopener noreferrer';
      sourceLink.style.display = 'inline-block';
      sourceLink.style.marginTop = '12px';

      document.getElementById('det-date')
        .insertAdjacentElement('afterend', sourceLink);
    }

    if (job.url) {
      sourceLink.href = job.url;
      sourceLink.style.display = 'inline-block';
    } else {
      sourceLink.style.display = 'none';
    }

    btnApply.disabled = !job.url;
  }

  // Aplica todos os filtros juntos.
  function getFilteredJobs() {
    const jobs = jobsByCity[activeCity] || [];

    const search = normalize(searchInput.value);
    const modality = modalitySelect.value;

    return jobs.filter(job => {

      const matchArea =
        activeArea === 'all' ||
        job.area === activeArea;

      let matchModality = true;

      if (modality === 'Estágio') {
        matchModality = job.isInternship;
      } else if (modality !== 'all') {
        matchModality = job.modality === modality;
      }

      const searchableContent = normalize([
        job.title,
        job.company,
        job.location,
        job.description,
        job.contract,
        job.modality,
        job.area
      ].join(' '));

      const matchSearch =
        !search || searchableContent.includes(search);

      return matchArea && matchModality && matchSearch;
    });
  }

  // Desenha os cards de oportunidades.
  function renderJobs() {
    const filtered = getFilteredJobs();

    jobsContainer.replaceChildren();

    jobsCount.textContent =
      `${filtered.length} oportunidade${filtered.length === 1 ? '' : 's'} encontrada${filtered.length === 1 ? '' : 's'}`;

    if (filtered.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-jobs';

      const title = document.createElement('h3');
      title.textContent = 'Nenhuma oportunidade encontrada';

      const description = document.createElement('p');
      description.textContent =
        'Tente alterar os filtros ou buscar por outro termo.';

      empty.append(title, description);
      jobsContainer.appendChild(empty);

      clearDetails();
      return;
    }

    filtered.forEach(job => {
      const card = document.createElement('article');
      card.className = 'job-card';
      card.dataset.id = String(job.id);

      const top = document.createElement('div');
      top.className = 'job-card-top';

      const icon = document.createElement('div');
      icon.className = 'job-card-icon';

      icon.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
      `;

      const header = document.createElement('div');
      header.className = 'job-card-header-info';

      const title = document.createElement('h3');
      title.className = 'job-card-title';
      title.textContent = job.title;

      const company = document.createElement('span');
      company.className = 'job-card-company';
      company.textContent = job.company;

      header.append(title, company);
      top.append(icon, header);

      const bottom = document.createElement('div');
      bottom.className = 'job-card-bottom';

      const meta = document.createElement('span');
      meta.className = 'job-card-meta';

      meta.textContent =
        `${job.modality} · ${job.contract} · ${job.location}`;

      const arrow = document.createElement('span');
      arrow.className = 'job-card-arrow';
      arrow.textContent = '›';

      bottom.append(meta, arrow);
      card.append(top, bottom);

      card.addEventListener('click', () => {
        selectJob(job);
      });

      jobsContainer.appendChild(card);
    });

    // Seleciona a primeira vaga após aplicar os filtros.
    const stillVisible = filtered.some(job =>
      selectedJob && String(job.id) === String(selectedJob.id)
    );

    if (stillVisible) {
      selectJob(
        filtered.find(job => String(job.id) === String(selectedJob.id))
      );
    } else {
      selectJob(filtered[0]);
    }
  }

  // Abre o modal de candidatura.
  function openApplicationModal() {
    if (!selectedJob || !selectedJob.url) return;

    modalJobTitle.textContent = selectedJob.title;
    modalJobCompany.textContent = selectedJob.company;

    modalJobLink.href = selectedJob.url;
    modalJobLink.hidden = false;

    applicationModal.showModal();
  }

  function closeApplicationModal() {
    applicationModal.close();
  }

  btnApply.addEventListener('click', openApplicationModal);

  document.getElementById('close-application-modal')
    .addEventListener('click', closeApplicationModal);

  document.getElementById('cancel-application-modal')
    .addEventListener('click', closeApplicationModal);

  applicationModal.addEventListener('click', event => {
    if (event.target === applicationModal) {
      closeApplicationModal();
    }
  });

  searchInput.addEventListener('input', renderJobs);
  btnSearch.addEventListener('click', renderJobs);

  modalitySelect.addEventListener('change', renderJobs);

  document.querySelectorAll('.area-chip').forEach(chip => {
    chip.addEventListener('click', () => {

      document.querySelectorAll('.area-chip').forEach(item => {
        item.classList.remove('active');
      });

      chip.classList.add('active');

      activeArea = chip.dataset.area;

      renderJobs();
    });
  });

  function updateCitySelector(cityKey) {
    const selectedOption = [...muniOptions].find(option =>
      option.dataset.city === cityKey
    );

    if (!selectedOption) return;

    document.getElementById('muni-active-name').textContent =
      selectedOption.dataset.name;

    document.getElementById('muni-alt-name').textContent =
      `Também disponível: ${selectedOption.dataset.alt}`;

    muniOptions.forEach(option => {
      option.classList.toggle(
        'active',
        option.dataset.city === cityKey
      );
    });
  }

  function updateCityName(cityKey) {
    const municipalityName = document.getElementById('muni-active-name');

    if (municipalityName && cityNames[cityKey]) {
      const state = cityKey === 'sapucaia' ? 'RS' : 'RJ';

      municipalityName.textContent =
        `${cityNames[cityKey]} · ${state}`;
    }
  }

  window.addEventListener('conectaCityChanged', event => {
    const cityKey =
      event.detail?.cityKey ||
      event.detail?.city;

    if (!cityNames[cityKey] || cityKey === activeCity) {
      return;
    }

    activeCity = cityKey;
    selectedJob = null;

    updateCityName(activeCity);

    if (jobsByCity[cityKey]) {
      renderJobs();
    } else {
      loadJobs(cityKey);
    }
  });

  document.getElementById('btn-support').addEventListener('click', () => {
    if (typeof window.openOfficialChannelsModal === 'function') {
      window.openOfficialChannelsModal({
        title: 'Central de Atendimento ao Trabalhador',
        email: 'empregos@conectacidadao.gov.br',
        phone: '156',
        extraLabel: 'WhatsApp',
        extraValue: '(22) 99876-5432',
        hours: 'Segunda a Sexta, das 08h às 17h',
        subject: 'Atendimento Balcão de Empregos'
      });
    }
  });

  if (!cityNames[activeCity]) {
    activeCity = 'rio-das-ostras';
  }

  updateCityName(activeCity);
loadJobs(activeCity);

});