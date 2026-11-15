const ADMIN_API_BASE = 'http://localhost:8080/api';
const SUPPORT_STORAGE_KEY = 'conecta_admin_support_tickets_v1';

const DEFAULT_SUPPORT_TICKETS = [
  {
    id: 'SUP-2026-101',
    cityKey: 'rio-das-ostras',
    citizen: 'Mariana Costa (Perfil Demo)',
    topic: '2ª Via de IPTU',
    question: 'Como faço para emitir a guia atualizada com Pix sem ir até a prefeitura?',
    status: 'Aberta',
    reply: '',
    updatedAt: 'Hoje, 14:10'
  },
  {
    id: 'SUP-2026-102',
    cityKey: 'sapucaia',
    citizen: 'Helena Vargas (Perfil Demo)',
    topic: 'Vacinação SUS',
    question: 'Qual documento preciso levar para atualizar a caderneta na UBS do bairro?',
    status: 'Em Atendimento',
    reply: 'Levar documento com foto, Cartão SUS e caderneta de vacinação.',
    updatedAt: 'Hoje, 15:30'
  },
  {
    id: 'SUP-2026-103',
    cityKey: 'rio-das-ostras',
    citizen: 'Carlos Ribeiro (Perfil Demo)',
    topic: 'Protocolo 156',
    question: 'Abri um chamado de iluminação pública e gostaria de saber como acompanhar.',
    status: 'Respondida',
    reply: 'Acesse a aba Solicitações no menu superior e informe o número do seu protocolo.',
    updatedAt: 'Ontem, 17:45'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const citySelect = document.getElementById('admin-city-select');
  const viewSelector = document.getElementById('admin-view-selector');
  const feedbackEl = document.getElementById('admin-feedback');
  const btnRefresh = document.getElementById('btn-refresh-admin');
  const roleTabs = document.querySelectorAll('.admin-role-tab');
  const rolePanels = {
    ti: document.getElementById('panel-role-ti'),
    zeladoria: document.getElementById('panel-role-zeladoria'),
    suporte: document.getElementById('panel-role-suporte')
  };

  const ADMIN_PROFILE_BY_ROLE = {
    ti: 'adm-ti-01',
    zeladoria: 'adm-zel-01',
    suporte: 'adm-sup-01'
  };

  let currentCity = typeof getActiveCity === 'function' ? getActiveCity() : 'rio-das-ostras';
  let loggedRole = typeof getActiveRole === 'function' ? getActiveRole() : 'citizen';

  // Ao abrir o Painel Admin como cidadão, simula automaticamente login como Admin TI / Infra
  if (loggedRole === 'citizen' && typeof setActiveCitizen === 'function') {
    setActiveCitizen(ADMIN_PROFILE_BY_ROLE.ti, false);
    loggedRole = 'ti';
  }

  let currentRole = (loggedRole === 'ti' || loggedRole === 'zeladoria' || loggedRole === 'suporte')
    ? loggedRole
    : 'ti';
  let cachedAuditLogs = [];
  let cachedOccurrences = [];

  if (citySelect) citySelect.value = currentCity;
  if (viewSelector) viewSelector.value = currentRole;

  function showFeedback(message) {
    if (!feedbackEl) return;
    feedbackEl.textContent = message;
    feedbackEl.hidden = false;
  }

  function updateSessionBanner() {
    const activeCit = typeof getActiveCitizen === 'function' ? getActiveCitizen() : null;
    if (activeCit) {
      showFeedback(`Sessão Admin ativa: ${activeCit.name} (${activeCit.roleLabel || currentRole}).`);
    }
  }

  updateSessionBanner();

  async function sendAuditLog(actorRole, module, action, level = 'INFO') {
    try {
      await fetch(`${ADMIN_API_BASE}/admin/audit-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actorRole, module, action, level })
      });
    } catch (_) {
      // Silencioso se backend estiver offline
    }
  }

  function switchRole(role, syncLoginProfile = false) {
    currentRole = role;
    if (syncLoginProfile && ADMIN_PROFILE_BY_ROLE[role] && typeof setActiveCitizen === 'function') {
      setActiveCitizen(ADMIN_PROFILE_BY_ROLE[role], false);
    }
    updateSessionBanner();
    if (viewSelector) viewSelector.value = role;
    roleTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.role === role);
    });
    Object.entries(rolePanels).forEach(([key, panel]) => {
      if (panel) panel.hidden = key !== role;
    });
    loadActiveRole();
  }

  async function loadActiveRole() {
    if (currentRole === 'ti') {
      await Promise.all([loadSystemStatus(), runSpeedTest(), loadAuditLogs()]);
    } else if (currentRole === 'zeladoria') {
      await loadZeladoria();
    } else if (currentRole === 'suporte') {
      loadSuporte();
    }
  }

  // Admin TI / Infra
  async function loadSystemStatus() {
    const srvEl = document.getElementById('ti-server-status');
    const upEl = document.getElementById('ti-uptime');
    const dbEl = document.getElementById('ti-db-status');
    const latEl = document.getElementById('ti-db-latency');
    const memEl = document.getElementById('ti-jvm-memory');

    try {
      const resp = await fetch(`${ADMIN_API_BASE}/admin/system-status`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();

      if (srvEl) srvEl.textContent = data.serverStatus || 'UP';
      if (upEl) upEl.textContent = `Uptime: ${data.uptimeSeconds}s`;
      if (dbEl) dbEl.textContent = data.databaseStatus || 'UP';
      if (latEl) latEl.textContent = data.databaseLatencyMs >= 0
        ? `Latência: ${data.databaseLatencyMs} ms`
        : `Erro: ${data.databaseError || 'indisponível'}`;
      if (memEl) memEl.textContent = `${data.jvmUsedMemoryMb} / ${data.jvmMaxMemoryMb} MB`;
    } catch (_) {
      if (srvEl) srvEl.textContent = 'OFFLINE';
      if (upEl) upEl.textContent = 'Backend porta 8080 parado';
      if (dbEl) dbEl.textContent = '—';
      if (latEl) latEl.textContent = 'Sem conexão com API';
      if (memEl) memEl.textContent = '—';
    }
  }

  async function runSpeedTest() {
    const speedList = document.getElementById('ti-speed-list');
    const avgEl = document.getElementById('ti-avg-speed');
    if (!speedList) return;

    const endpoints = [
      { label: 'Status Servidor & Banco', url: `${ADMIN_API_BASE}/admin/system-status` },
      { label: 'Agenda de Eventos', url: `${ADMIN_API_BASE}/events/${encodeURIComponent(currentCity)}` },
      { label: 'Ocorrências Zeladoria', url: `${ADMIN_API_BASE}/occurrences` },
      { label: 'Unidades de Saúde', url: `${ADMIN_API_BASE}/health-units?municipality=${encodeURIComponent(currentCity)}` }
    ];

    speedList.replaceChildren();
    const times = [];

    for (const ep of endpoints) {
      const t0 = performance.now();
      let statusLabel = 'OK';
      let badgeClass = 'ok';
      let ms = 0;

      try {
        const resp = await fetch(ep.url);
        ms = Math.round(performance.now() - t0);
        if (!resp.ok) {
          statusLabel = `HTTP ${resp.status}`;
          badgeClass = 'warn';
        } else {
          times.push(ms);
        }
      } catch (_) {
        ms = Math.round(performance.now() - t0);
        statusLabel = 'OFFLINE';
        badgeClass = 'err';
      }

      const row = document.createElement('div');
      row.className = 'admin-item-row';
      row.innerHTML = `
        <div class="admin-item-top">
          <div class="admin-item-info">
            <span class="admin-badge ${badgeClass}">${statusLabel} · ${ms} ms</span>
            <strong>${ep.label}</strong>
            <span>${ep.url}</span>
          </div>
        </div>
      `;
      speedList.appendChild(row);
    }

    if (avgEl) {
      avgEl.textContent = times.length > 0
        ? `${Math.round(times.reduce((a, b) => a + b, 0) / times.length)} ms`
        : 'OFFLINE';
    }
  }

  async function loadAuditLogs() {
    const logsList = document.getElementById('ti-audit-logs-list');
    if (!logsList) return;

    try {
      const resp = await fetch(`${ADMIN_API_BASE}/admin/audit-logs`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      cachedAuditLogs = await resp.json();
      renderAuditLogs();
    } catch (_) {
      cachedAuditLogs = [];
      logsList.innerHTML = '<div class="admin-empty">Backend offline (porta 8080). Inicie o servidor para visualizar os logs em tempo real.</div>';
    }
  }

  function renderAuditLogs() {
    const logsList = document.getElementById('ti-audit-logs-list');
    const searchEl = document.getElementById('ti-log-search');
    if (!logsList) return;

    const term = (searchEl ? searchEl.value : '').trim().toLowerCase();
    const filtered = term
      ? cachedAuditLogs.filter(l =>
          `${l.actorRole} ${l.module} ${l.action} ${l.level}`.toLowerCase().includes(term))
      : cachedAuditLogs;

    logsList.replaceChildren();
    if (filtered.length === 0) {
      logsList.innerHTML = '<div class="admin-empty">Nenhum log encontrado.</div>';
      return;
    }

    filtered.forEach(entry => {
      const row = document.createElement('div');
      row.className = 'admin-item-row';
      const when = entry.timestamp ? new Date(entry.timestamp).toLocaleString('pt-BR') : '';
      const badge = document.createElement('span');
      badge.className = `admin-badge ${entry.level === 'WARN' ? 'warn' : entry.level === 'ERROR' ? 'err' : 'ok'}`;
      badge.textContent = `${entry.actorRole} · ${entry.module} · ${when}`;

      const info = document.createElement('div');
      info.className = 'admin-item-info';
      const title = document.createElement('strong');
      title.textContent = entry.action;

      info.appendChild(badge);
      info.appendChild(title);
      row.appendChild(info);
      logsList.appendChild(row);
    });
  }

  // Equipe de Zeladoria
  const OCC_STATUS_LABELS = {
    Recebido: 'Recebido',
    EmAnalise: 'Em Análise',
    EquipeEnviada: 'Equipe Enviada',
    Concluida: 'Concluída'
  };

  const OCC_CATEGORY_LABELS = {
    IluminacaoPublica: 'Iluminação Pública',
    AsfaltoBuracos: 'Asfalto e Buracos',
    ColetaLixo: 'Coleta de Lixo',
    EsgotoBueiro: 'Esgoto e Bueiro',
    PodaArvore: 'Poda de Árvore',
    SinalizacaoTransito: 'Sinalização e Trânsito',
    Outros: 'Outros'
  };

  function formatOccurrenceStatus(status) {
    return OCC_STATUS_LABELS[status] || status || 'Recebido';
  }

  function formatOccurrenceCategory(category) {
    return OCC_CATEGORY_LABELS[category] || category || 'Zeladoria';
  }

  function computeOccurrencePriority(occ) {
    const text = `${occ.title || ''} ${occ.description || ''}`.toLowerCase();
    const cat = occ.category || '';
    const highKeywords = ['urgente', 'risco', 'alagamento', 'esgoto', 'cratera', 'fio', 'caido', 'caído', 'acidente', 'hospital', 'escola'];
    if (cat === 'EsgotoBueiro' || cat === 'SinalizacaoTransito' || highKeywords.some(k => text.includes(k))) {
      return { rank: 1, label: 'Alta', cls: 'alta' };
    }
    if (cat === 'IluminacaoPublica' || cat === 'AsfaltoBuracos' || cat === 'PodaArvore') {
      return { rank: 2, label: 'Média', cls: 'media' };
    }
    return { rank: 3, label: 'Normal', cls: 'normal' };
  }

  function formatTicketDate(iso) {
    if (!iso) return 'Hoje';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso);
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  async function openOccurrenceModal(occ) {
    const modal = document.getElementById('ticket-detail-modal');
    if (!modal) return;

    const prio = computeOccurrencePriority(occ);
    document.getElementById('td-protocol').textContent = `${occ.protocol || '156'} · ${formatOccurrenceCategory(occ.category)}`;
    const prioEl = document.getElementById('td-priority');
    prioEl.className = `prio-badge ${prio.cls}`;
    prioEl.textContent = `Prioridade ${prio.label}`;

    document.getElementById('td-title').textContent = occ.title || 'Ocorrência Urbana';
    document.getElementById('td-meta').textContent = `${formatTicketDate(occ.createdAt)} · ${occ.street || ''} ${occ.streetNumber || ''} · ${occ.neighborhood || ''}`;
    document.getElementById('td-desc').textContent = occ.description || 'Sem descrição detalhada.';

    const photoWrap = document.getElementById('td-photo-wrap');
    const photoImg = document.getElementById('td-photo');
    if (occ.photoUrl) {
      photoImg.src = occ.photoUrl;
      photoWrap.hidden = false;
    } else {
      photoImg.removeAttribute('src');
      photoWrap.hidden = true;
    }

    const histList = document.getElementById('td-history-list');
    histList.innerHTML = '<li>Carregando histórico...</li>';
    modal.hidden = false;

    try {
      const resp = await fetch(`${ADMIN_API_BASE}/occurrences/${encodeURIComponent(occ.id)}/complements`);
      const comps = resp.ok ? await resp.json() : [];
      histList.replaceChildren();
      if (comps.length === 0) {
        histList.innerHTML = '<li>Nenhum despacho registrado ainda.</li>';
      } else {
        comps.forEach(c => {
          const li = document.createElement('li');
          li.textContent = `${formatTicketDate(c.createdAt)} — ${c.description}`;
          histList.appendChild(li);
        });
      }
    } catch (_) {
      histList.innerHTML = '<li>Histórico indisponível no momento.</li>';
    }
  }

  async function updateOccurrenceStatus(occ, nextStatus, note = '') {
    try {
      const updatedPayload = { ...occ, status: nextStatus };
      const updResp = await fetch(`${ADMIN_API_BASE}/occurrences/${encodeURIComponent(occ.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPayload)
      });
      if (!updResp.ok) throw new Error('Erro ao atualizar status');

      if (note) {
        await fetch(`${ADMIN_API_BASE}/occurrences/${encodeURIComponent(occ.id)}/complements`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ description: note })
        });
      }

      const statusLabel = formatOccurrenceStatus(nextStatus);
      await sendAuditLog('ZELADORIA', 'OCORRENCIAS_156',
        `Protocolo ${occ.protocol || occ.id} movido para ${statusLabel}`, 'INFO');
      showFeedback(`Protocolo ${occ.protocol || ''} movido para ${statusLabel}.`);
      await loadZeladoria();
    } catch (_) {
      showFeedback('Não foi possível atualizar a ocorrência no backend.');
    }
  }

  async function loadZeladoria() {
    const boardEl = document.getElementById('zeladoria-kanban');
    const cityLabel = currentCity === 'sapucaia' ? 'Sapucaia do Sul' : 'Rio das Ostras';

    try {
      const resp = await fetch(`${ADMIN_API_BASE}/occurrences`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const all = await resp.json();

      cachedOccurrences = all.filter(o =>
        !o.municipality || o.municipality.toLowerCase().includes(cityLabel.toLowerCase().split(' ')[0])
      );

      document.getElementById('zel-total').textContent = String(cachedOccurrences.length);
      document.getElementById('zel-pending').textContent = String(
        cachedOccurrences.filter(o => o.status === 'Recebido' || o.status === 'EmAnalise').length
      );
      document.getElementById('zel-dispatched').textContent = String(
        cachedOccurrences.filter(o => o.status === 'EquipeEnviada').length
      );
      document.getElementById('zel-done').textContent = String(
        cachedOccurrences.filter(o => o.status === 'Concluida').length
      );

      renderZeladoria();
    } catch (_) {
      if (boardEl) {
        boardEl.querySelectorAll('.kanban-col-body').forEach(col => {
          col.innerHTML = '<div class="admin-empty">Backend offline (porta 8080).</div>';
        });
      }
    }
  }

  function renderZeladoria() {
    const boardEl = document.getElementById('zeladoria-kanban');
    const searchEl = document.getElementById('zel-search');
    if (!boardEl) return;

    const term = (searchEl ? searchEl.value : '').trim().toLowerCase();
    const filtered = term
      ? cachedOccurrences.filter(o =>
          `${o.protocol || ''} ${o.title || ''} ${o.street || ''} ${o.neighborhood || ''}`.toLowerCase().includes(term))
      : cachedOccurrences;

    let activeDraggedOccId = null;
    const statuses = ['Recebido', 'EmAnalise', 'EquipeEnviada', 'Concluida'];
    statuses.forEach(status => {
      const colEl = boardEl.querySelector(`.kanban-column[data-status="${status}"]`);
      const colBody = boardEl.querySelector(`.kanban-col-body[data-status="${status}"]`);
      const countEl = document.getElementById(`zel-count-${status}`);
      if (!colBody || !colEl) return;

      colBody.replaceChildren();
      const colItems = filtered
        .filter(o => (o.status || 'Recebido') === status)
        .sort((a, b) => computeOccurrencePriority(a).rank - computeOccurrencePriority(b).rank);
      if (countEl) countEl.textContent = String(colItems.length);

      colEl.ondragover = (e) => {
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
        colBody.classList.add('drag-over');
      };
      colEl.ondragleave = (e) => {
        if (!colEl.contains(e.relatedTarget)) {
          colBody.classList.remove('drag-over');
        }
      };
      colEl.ondrop = async (e) => {
        e.preventDefault();
        colBody.classList.remove('drag-over');
        const occId = (e.dataTransfer && e.dataTransfer.getData('text/plain')) || activeDraggedOccId;
        activeDraggedOccId = null;
        const dragged = cachedOccurrences.find(item => String(item.id) === String(occId));
        if (dragged && (dragged.status || 'Recebido') !== status) {
          dragged.status = status;
          renderZeladoria();
          await updateOccurrenceStatus(dragged, status);
        }
      };

      if (colItems.length === 0) {
        colBody.innerHTML = '<div class="admin-empty">Sem chamados</div>';
        return;
      }

      colItems.forEach(occ => {
        const card = document.createElement('article');
        card.className = 'kanban-card';
        card.draggable = true;
        card.addEventListener('dragstart', (e) => {
          activeDraggedOccId = String(occ.id);
          if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', String(occ.id));
          }
          card.classList.add('dragging');
        });
        card.addEventListener('dragend', () => {
          activeDraggedOccId = null;
          card.classList.remove('dragging');
        });

        const prio = computeOccurrencePriority(occ);

        const topRow = document.createElement('div');
        topRow.className = 'kanban-card-meta-row';

        const badge = document.createElement('span');
        badge.className = `admin-badge ${status === 'Concluida' ? 'ok' : status === 'EquipeEnviada' ? 'warn' : ''}`;
        badge.textContent = occ.protocol || '156';

        const prioBadge = document.createElement('span');
        prioBadge.className = `prio-badge ${prio.cls}`;
        prioBadge.textContent = prio.label;

        topRow.appendChild(badge);
        topRow.appendChild(prioBadge);

        const title = document.createElement('h4');
        title.className = 'kanban-card-title';
        title.textContent = occ.title || 'Ocorrência Urbana';

        const desc = document.createElement('p');
        desc.className = 'kanban-card-desc';
        desc.textContent = `${occ.street || ''} ${occ.streetNumber || ''} · ${occ.neighborhood || ''}`;

        const dateLine = document.createElement('span');
        dateLine.className = 'kanban-card-date';
        dateLine.textContent = `${formatTicketDate(occ.createdAt)}${occ.photoUrl ? ' · Foto anexa' : ''}`;

        card.appendChild(topRow);
        card.appendChild(title);
        card.appendChild(desc);
        card.appendChild(dateLine);

        const actions = document.createElement('div');
        actions.className = 'kanban-card-actions';

        const statusSel = document.createElement('select');
        statuses.forEach(st => {
          const opt = document.createElement('option');
          opt.value = st;
          opt.textContent = formatOccurrenceStatus(st);
          if (status === st) opt.selected = true;
          statusSel.appendChild(opt);
        });

        const noteInput = document.createElement('input');
        noteInput.type = 'text';
        noteInput.placeholder = 'Despacho técnico...';

        const btnRow = document.createElement('div');
        btnRow.className = 'kanban-btn-row';

        const openBtn = document.createElement('button');
        openBtn.type = 'button';
        openBtn.className = 'btn-kanban-open';
        openBtn.textContent = 'Abrir';
        openBtn.addEventListener('click', () => openOccurrenceModal(occ));

        const saveBtn = document.createElement('button');
        saveBtn.type = 'button';
        saveBtn.textContent = 'Salvar';
        saveBtn.addEventListener('click', () => updateOccurrenceStatus(occ, statusSel.value, noteInput.value.trim()));

        btnRow.appendChild(openBtn);
        btnRow.appendChild(saveBtn);

        actions.appendChild(statusSel);
        actions.appendChild(noteInput);
        actions.appendChild(btnRow);
        card.appendChild(actions);

        colBody.appendChild(card);
      });
    });
  }

  // Equipe de Suporte
  function getSupportTickets() {
    try {
      const raw = localStorage.getItem(SUPPORT_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    localStorage.setItem(SUPPORT_STORAGE_KEY, JSON.stringify(DEFAULT_SUPPORT_TICKETS));
    return [...DEFAULT_SUPPORT_TICKETS];
  }

  function saveSupportTickets(tickets) {
    localStorage.setItem(SUPPORT_STORAGE_KEY, JSON.stringify(tickets));
  }

  async function updateSupportTicket(ticketId, nextStatus, replyText) {
    const all = getSupportTickets();
    const idx = all.findIndex(item => item.id === ticketId);
    if (idx >= 0) {
      if (replyText !== undefined) all[idx].reply = replyText;
      all[idx].status = nextStatus;
      all[idx].updatedAt = 'Agora';
      saveSupportTickets(all);
    }
    await sendAuditLog('SUPORTE', 'ATENDIMENTO_DUVIDAS',
      `Chamado ${ticketId} movido para ${nextStatus}`, 'INFO');
    showFeedback(`Chamado ${ticketId} atualizado para ${nextStatus}.`);
    loadSuporte();
  }

  function loadSuporte() {
    const all = getSupportTickets();
    const cityTickets = all.filter(t => t.cityKey === currentCity);

    document.getElementById('sup-open').textContent = String(
      cityTickets.filter(t => t.status === 'Aberta').length
    );
    document.getElementById('sup-progress').textContent = String(
      cityTickets.filter(t => t.status === 'Em Atendimento').length
    );
    document.getElementById('sup-answered').textContent = String(
      cityTickets.filter(t => t.status === 'Respondida').length
    );

    renderSuporte(cityTickets);
  }

  function renderSuporte(cityTickets) {
    const boardEl = document.getElementById('suporte-kanban');
    const searchEl = document.getElementById('sup-search');
    if (!boardEl) return;

    const term = (searchEl ? searchEl.value : '').trim().toLowerCase();
    const filtered = term
      ? cityTickets.filter(t =>
          `${t.id} ${t.topic} ${t.question} ${t.citizen}`.toLowerCase().includes(term))
      : cityTickets;

    const statuses = [
      { key: 'Aberta', countId: 'sup-count-Aberta' },
      { key: 'Em Atendimento', countId: 'sup-count-EmAtendimento' },
      { key: 'Respondida', countId: 'sup-count-Respondida' }
    ];

    let activeDraggedTicketId = null;
    statuses.forEach(({ key, countId }) => {
      const colEl = boardEl.querySelector(`.kanban-column[data-status="${key}"]`);
      const colBody = boardEl.querySelector(`.kanban-col-body[data-status="${key}"]`);
      const countEl = document.getElementById(countId);
      if (!colBody || !colEl) return;

      colBody.replaceChildren();
      const colItems = filtered.filter(t => t.status === key);
      if (countEl) countEl.textContent = String(colItems.length);

      colEl.ondragover = (e) => {
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
        colBody.classList.add('drag-over');
      };
      colEl.ondragleave = (e) => {
        if (!colEl.contains(e.relatedTarget)) {
          colBody.classList.remove('drag-over');
        }
      };
      colEl.ondrop = async (e) => {
        e.preventDefault();
        colBody.classList.remove('drag-over');
        const ticketId = (e.dataTransfer && e.dataTransfer.getData('text/plain')) || activeDraggedTicketId;
        activeDraggedTicketId = null;
        const dragged = cityTickets.find(t => t.id === ticketId);
        if (dragged && dragged.status !== key) {
          await updateSupportTicket(ticketId, key);
        }
      };

      if (colItems.length === 0) {
        colBody.innerHTML = '<div class="admin-empty">Sem chamados</div>';
        return;
      }

      colItems.forEach(ticket => {
        const card = document.createElement('article');
        card.className = 'kanban-card';
        card.draggable = true;
        card.addEventListener('dragstart', (e) => {
          activeDraggedTicketId = ticket.id;
          if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', ticket.id);
          }
          card.classList.add('dragging');
        });
        card.addEventListener('dragend', () => {
          activeDraggedTicketId = null;
          card.classList.remove('dragging');
        });

        const badge = document.createElement('span');
        badge.className = `admin-badge ${key === 'Respondida' ? 'ok' : key === 'Em Atendimento' ? 'warn' : ''}`;
        badge.textContent = `${ticket.id} · ${ticket.topic}`;

        const title = document.createElement('h4');
        title.className = 'kanban-card-title';
        title.textContent = ticket.question;

        const desc = document.createElement('p');
        desc.className = 'kanban-card-desc';
        desc.textContent = `${ticket.citizen} · ${ticket.updatedAt}`;

        card.appendChild(badge);
        card.appendChild(title);
        card.appendChild(desc);

        const actions = document.createElement('div');
        actions.className = 'kanban-card-actions';

        const replyInput = document.createElement('input');
        replyInput.type = 'text';
        replyInput.value = ticket.reply || '';
        replyInput.placeholder = 'Resposta ao cidadão...';

        const sendBtn = document.createElement('button');
        sendBtn.type = 'button';
        sendBtn.textContent = 'Salvar Resposta';
        sendBtn.addEventListener('click', () => {
          const text = replyInput.value.trim();
          const next = text ? 'Respondida' : key;
          updateSupportTicket(ticket.id, next, text);
        });

        actions.appendChild(replyInput);
        actions.appendChild(sendBtn);
        card.appendChild(actions);

        colBody.appendChild(card);
      });
    });
  }

  // Eventos de UI
  roleTabs.forEach(tab => {
    tab.addEventListener('click', () => switchRole(tab.dataset.role, true));
  });

  if (viewSelector) {
    viewSelector.addEventListener('change', () => switchRole(viewSelector.value, true));
  }

  window.addEventListener('conectaCitizenChanged', () => {
    const newRole = typeof getActiveRole === 'function' ? getActiveRole() : 'citizen';
    if ((newRole === 'ti' || newRole === 'zeladoria' || newRole === 'suporte') && newRole !== currentRole) {
      switchRole(newRole, false);
    }
  });

  if (citySelect) {
    citySelect.addEventListener('change', () => {
      currentCity = citySelect.value;
      if (typeof setActiveCity === 'function') setActiveCity(currentCity);
      loadActiveRole();
    });
  }

  if (btnRefresh) btnRefresh.addEventListener('click', loadActiveRole);
  const btnSpeed = document.getElementById('btn-run-speedtest');
  if (btnSpeed) btnSpeed.addEventListener('click', runSpeedTest);
  const logSearch = document.getElementById('ti-log-search');
  if (logSearch) logSearch.addEventListener('input', renderAuditLogs);
  const zelSearch = document.getElementById('zel-search');
  if (zelSearch) zelSearch.addEventListener('input', renderZeladoria);
  const supSearch = document.getElementById('sup-search');
  if (supSearch) supSearch.addEventListener('input', loadSuporte);
  const supFilter = document.getElementById('sup-status-filter');
  if (supFilter) supFilter.addEventListener('change', loadSuporte);

  const ticketModal = document.getElementById('ticket-detail-modal');
  const btnCloseTicketModal = document.getElementById('btn-close-ticket-modal');
  if (btnCloseTicketModal && ticketModal) {
    btnCloseTicketModal.addEventListener('click', () => {
      ticketModal.hidden = true;
    });
    ticketModal.addEventListener('click', (e) => {
      if (e.target === ticketModal) ticketModal.hidden = true;
    });
  }

  const photoLightbox = document.getElementById('admin-photo-lightbox');
  const photoLightboxImg = document.getElementById('admin-lightbox-img');
  const btnCloseLightbox = document.getElementById('btn-close-admin-lightbox');
  const tdPhoto = document.getElementById('td-photo');

  function openAdminPhotoLightbox() {
    if (!photoLightbox || !photoLightboxImg || !tdPhoto?.src) return;
    photoLightboxImg.src = tdPhoto.src;
    photoLightbox.hidden = false;
  }

  if (tdPhoto) tdPhoto.addEventListener('click', openAdminPhotoLightbox);
  if (btnCloseLightbox && photoLightbox) {
    btnCloseLightbox.addEventListener('click', () => { photoLightbox.hidden = true; });
    photoLightbox.addEventListener('click', (e) => {
      if (e.target === photoLightbox) photoLightbox.hidden = true;
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && photoLightbox && !photoLightbox.hidden) {
      photoLightbox.hidden = true;
    }
  });

  switchRole(currentRole);
});
