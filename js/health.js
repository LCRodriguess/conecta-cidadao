const API_URL = 'http://localhost:8080/api/health';

const SAMU_DATA_BY_CITY = {
    'rio-das-ostras': 'Base Costa Azul · Rio das Ostras.',
    'sapucaia': 'Base Central · Sapucaia do Sul.'
};

const APPOINTMENT_TYPES = {
    ConsultaMedica: 'Consulta médica',
    ConsultaOdontologica: 'Consulta odontológica',
    Exame: 'Exame',
    Vacinacao: 'Vacinação',
    Outro: 'Outro atendimento'
};

let activeHealthCity = 'rio-das-ostras';
let currentRequest = 0;
let activeInstructionsAppointment = null;

const FALLBACK_UNITS_BY_CITY = {
    'rio-das-ostras': [
        { name: 'UPA 24h Âncora', badge: 'Plantão 24h', badgeClass: 'badge-open-24h', type: 'Urgência e Emergência Municipal', address: 'Rodovia Amaral Peixoto, s/n — Âncora · Rio das Ostras', phone: '(22) 2771-3045 · SAMU 192' },
        { name: 'UBS Central · Jardim Mariléa', badge: '07h às 17h', badgeClass: 'badge-open-hours', type: 'Atenção Básica, Vacinação e Clínico Geral', address: 'Av. das Flores, 80 — Jardim Mariléa · Rio das Ostras', phone: '(22) 2771-4120' },
        { name: 'Centro de Saúde Extensão do Bosque', badge: '08h às 17h', badgeClass: 'badge-open-hours', type: 'Especialidades Médicas e Exames SUS', address: 'Rua das Acácias, 210 — Extensão do Bosque · Rio das Ostras', phone: '(22) 2771-5090' }
    ],
    'sapucaia': [
        { name: 'Hospital Municipal Getúlio Vargas (HMGV)', badge: 'Plantão 24h', badgeClass: 'badge-open-24h', type: 'Hospital Geral e Emergência 24h', address: 'Rua Pinheiro Machado, 331 — Díez · Sapucaia do Sul', phone: '(51) 3451-8200 · SAMU 192' },
        { name: 'UBS Centro · Sapucaia do Sul', badge: '07h às 18h', badgeClass: 'badge-open-hours', type: 'Clínica da Família, Vacinação e Preventivo', address: 'Rua Tiradentes, 340 — Centro · Sapucaia do Sul', phone: '(51) 3474-1910' },
        { name: 'Centro de Especialidades Bairro Vargas', badge: '08h às 17h', badgeClass: 'badge-open-hours', type: 'Cardiologia, Pediatria e Exames SUS', address: 'Av. Assis Brasil, 512 — Bairro Vargas · Sapucaia do Sul', phone: '(51) 3474-2840' }
    ]
};

const FALLBACK_CAMPAIGNS_BY_CITY = {
    'rio-das-ostras': [
        { name: 'Imunização Influenza + Atualização COVID-19', targetAudience: 'Idosos 60+, gestantes, crianças e trabalhadores da saúde', note: 'Disponível de segunda a sexta nas UBS Central, Cláudio Ribeiro e Âncora.' },
        { name: 'Multivacinação Infantil e Poliomielite', targetAudience: 'Crianças e adolescentes menores de 15 anos', note: 'Levar Caderneta de Vacinação e Cartão SUS.' }
    ],
    'sapucaia': [
        { name: 'Campanha Estadual contra Gripe (Influenza)', targetAudience: 'População geral acima de 6 meses', note: 'Atendimento em todas as 18 Unidades Básicas de Saúde do município.' },
        { name: 'Prevenção HPV e Meningocócica ACWY', targetAudience: 'Jovens de 9 a 14 anos', note: 'Atendimento sem necessidade de agendamento prévio nas salas de vacina.' }
    ]
};

function getSimulatedAppointmentsForCity(cityKey) {
    const citizen = typeof getActiveCitizen === 'function' ? getActiveCitizen() : null;
    const list = [];

    try {
        const raw = localStorage.getItem('conecta_cidadao_local_appointments');
        if (raw) {
            const localApps = JSON.parse(raw).filter(a => a.municipality === cityKey);
            list.push(...localApps);
        }
    } catch (e) {}

    if (citizen && citizen.appointment) {
        list.push({
            id: `cit-app-${citizen.id}`,
            municipality: cityKey,
            status: citizen.appointment.status || 'Confirmado',
            susCard: citizen.susCard,
            type: 'ConsultaMedica',
            professional: citizen.appointment.title,
            dateTime: '2026-11-21T09:30:00',
            displayDate: `${citizen.appointment.day}/${citizen.appointment.month}/2026 · ${citizen.appointment.time}`,
            location: citizen.appointment.place,
            protocol: citizen.appointment.protocol || 'SUS-2026-8841',
            actionLabel: 'Ver orientações',
            instructions: `Compareça à unidade (${citizen.appointment.place}) com 15 minutos de antecedência portando documento oficial com foto, CPF (${citizen.cpf}) e Cartão SUS (${citizen.susCard}).`
        });
    }

    return list;
}

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    activeHealthCity = typeof getActiveCity === 'function'
        ? getActiveCity()
        : 'rio-das-ostras';

    initializeAppointmentForm();
    initializeInstructionsDialog();
    loadHealthData(activeHealthCity);

    window.addEventListener('conectaCityChanged', (event) => {
        const cityKey = event.detail?.cityKey;

        if (cityKey) {
            loadHealthData(cityKey);
        }
    });

    window.addEventListener('conectaCitizenChanged', (event) => {
        const cityKey = event.detail?.citizen?.cityKey || activeHealthCity;
        loadHealthData(cityKey);
    });
});

// API
async function fetchHealthData(endpoint) {
    const response = await fetch(`${API_URL}/${endpoint}`);

    if (!response.ok) {
        throw new Error(`Erro ao consultar ${endpoint}: ${response.status}`);
    }

    return response.json();
}

async function loadHealthData(cityKey) {
    activeHealthCity = cityKey || 'rio-das-ostras';

    const requestId = ++currentRequest;

    renderSamu();

    const results = await Promise.allSettled([
        fetchHealthData(`units/${activeHealthCity}`),
        fetchHealthData(`campaigns/${activeHealthCity}`),
        fetchHealthData(`appointments/${activeHealthCity}`)
    ]);

    if (requestId !== currentRequest) return;

    const [units, campaigns, appointments] = results;

    renderUnitsResult(units);
    renderCampaignsResult(campaigns);
    renderAppointmentsResult(appointments);
}

// SAMU

function renderSamu() {
    const container = document.getElementById('samu-base-desc');

    if (!container) return;

    container.textContent =
        SAMU_DATA_BY_CITY[activeHealthCity] || '';
}

// UNIDADES DE SAÚDE
function renderUnitsResult(result) {
    const container = document.getElementById('units-container');

    if (!container) return;

    if (result.status === 'rejected' || !result.value || result.value.length === 0) {
        renderUnits(FALLBACK_UNITS_BY_CITY[activeHealthCity] || FALLBACK_UNITS_BY_CITY['rio-das-ostras']);
        return;
    }

    renderUnits(result.value);
}

function renderUnits(units) {
    const container = document.getElementById('units-container');

    container.innerHTML = `
        <h3 class="units-card-title">
            Unidades de Saúde (UBS / UPA / Hospital)
        </h3>
    `;

    if (!units || units.length === 0) {
        container.appendChild(
            createMessage(
                'Nenhuma unidade de saúde cadastrada para este município.'
            )
        );
        return;
    }

    units.forEach(unit => {
        const card = document.createElement('div');
        card.className = 'health-unit-card';

        const top = document.createElement('div');
        top.className = 'unit-top';

        const name = document.createElement('strong');
        name.className = 'unit-name';
        name.textContent = unit.name || '';

        const badge = document.createElement('span');

        const allowedBadgeClasses = [
            'badge-open-24h',
            'badge-open-hours'
        ];

        badge.className = allowedBadgeClasses.includes(unit.badgeClass)
            ? unit.badgeClass
            : 'badge-open-hours';

        badge.textContent = unit.badge || '';

        top.append(name, badge);

        const type = document.createElement('p');
        type.className = 'unit-type';
        type.textContent = unit.type || '';

        const address = document.createElement('p');
        address.className = 'unit-address';
        address.textContent = unit.address || '';

        const phone = document.createElement('span');
        phone.className = 'unit-phone';
        phone.textContent = unit.phone || '';

        card.append(top, type, address, phone);
        container.appendChild(card);
    });
}

// CAMPANHAS DE VACINAÇÃO
function renderCampaignsResult(result) {
    const container = document.getElementById('campaigns-container');

    if (!container) return;

    if (result.status === 'rejected' || !result.value || result.value.length === 0) {
        renderCampaigns(FALLBACK_CAMPAIGNS_BY_CITY[activeHealthCity] || FALLBACK_CAMPAIGNS_BY_CITY['rio-das-ostras']);
        return;
    }

    renderCampaigns(result.value);
}

function renderCampaigns(campaigns) {
    const container = document.getElementById('campaigns-container');

    container.innerHTML = '';

    if (!campaigns || campaigns.length === 0) {
        container.appendChild(
            createMessage(
                'Nenhuma campanha de vacinação cadastrada para este município.'
            )
        );
        return;
    }

    campaigns.forEach(campaign => {
        const card = document.createElement('div');
        card.className = 'vaccine-item';

        const badge = document.createElement('span');
        badge.className = 'vac-badge active';
        badge.textContent = 'Campanha cadastrada';

        const name = document.createElement('h4');
        name.className = 'vac-name';
        name.textContent = campaign.name || '';

        const target = document.createElement('p');
        target.className = 'vac-target';
        target.textContent =
            `Público-alvo: ${campaign.targetAudience || 'Não informado'}`;

        const note = document.createElement('span');
        note.className = 'vac-where';
        note.textContent = campaign.note || '';

        card.append(badge, name, target, note);
        container.appendChild(card);
    });
}

// AGENDAMENTOS
function renderAppointmentsResult(result) {
    const container = document.getElementById('appointments-container');

    if (!container) return;

    const simulated = getSimulatedAppointmentsForCity(activeHealthCity);

    if (result.status === 'rejected' || !result.value || result.value.length === 0) {
        renderAppointments(simulated);
        return;
    }

    renderAppointments([...simulated, ...result.value]);
}

// Formata a data sem alterar o dia por causa do fuso horário.
function formatAppointmentDate(dateTime) {
    if (!dateTime) return 'Data não informada';

    const date = String(dateTime).split('T')[0];
    const [year, month, day] = date.split('-');

    if (!year || !month || !day) {
        return 'Data não informada';
    }

    return `${day}/${month}/${year}`;
}

function openSusReceiptForAppointment(appointment) {
    if (typeof openOfficialReceiptModal !== 'function') return;

    const specialtyLabel = APPOINTMENT_TYPES[appointment.type] || appointment.type || 'Consulta Médica SUS';
    const profLabel = appointment.professional ? `${specialtyLabel} · ${appointment.professional}` : specialtyLabel;
    const dateLabel = appointment.displayDate || formatAppointmentDate(appointment.dateTime);

    openOfficialReceiptModal({
        type: 'sus',
        title: `Comprovante de Agendamento SUS — ${specialtyLabel}`,
        specialty: profLabel,
        dateTime: dateLabel,
        location: appointment.location,
        susCard: appointment.susCard,
        protocol: appointment.protocol || `SUS-2026-${Math.floor(1000 + Math.random() * 8999)}`,
        status: (appointment.status || 'Confirmado').toUpperCase(),
        instructions: appointment.instructions
    });
}

function renderAppointments(appointments) {
    const container = document.getElementById('appointments-container');

    container.innerHTML = '';

    if (!appointments || appointments.length === 0) {
        container.appendChild(
            createMessage(
                'Nenhum agendamento cadastrado para este município.'
            )
        );
        return;
    }

    appointments.forEach(appointment => {
        const status = (appointment.status || '').toLowerCase();

        const isConfirmed = [
            'confirmado',
            'confirmed'
        ].includes(status);

        const isRequested = [
            'solicitado',
            'solicited',
            'pendente'
        ].includes(status);

        const badgeClass = isConfirmed
            ? 'confirmed'
            : 'scheduled';

        const badgeText = isRequested
            ? 'Solicitado'
            : isConfirmed
                ? 'Confirmado'
                : 'Agendado';

        const card = document.createElement('article');
        card.className = `appointment-card ${badgeClass}`;

        const top = document.createElement('div');
        top.className = 'app-card-top';

        const badge = document.createElement('div');
        badge.className = `app-type-badge ${badgeClass}`;
        badge.textContent = badgeText;

        const susCard = document.createElement('span');
        susCard.className = 'app-cartao-sus';

        const susValue = appointment.susCard || '';

        susCard.textContent = susValue.startsWith('Cartão SUS:')
            ? susValue
            : `Cartão SUS: ${susValue}`;

        top.append(badge, susCard);

        const title = document.createElement('h3');
        title.className = 'app-specialty';
        title.textContent =
            APPOINTMENT_TYPES[appointment.type] || appointment.type || '';

        const professional = document.createElement('p');
        professional.className = 'app-doctor';
        professional.textContent = appointment.professional || '';

        const metaGrid = document.createElement('div');
        metaGrid.className = 'app-meta-grid';

        const appointmentDate = appointment.displayDate || formatAppointmentDate(
            appointment.dateTime
        );

        const dateItem = createMetaItem(
            `<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
             <line x1="16" y1="2" x2="16" y2="6"/>
             <line x1="8" y1="2" x2="8" y2="6"/>
             <line x1="3" y1="10" x2="21" y2="10"/>`,
            appointmentDate
        );

        const locationItem = createMetaItem(
            `<path d="M12 21s-7-4.5-7-10a7 7 0 1 1 14 0c0 5.5-7 10-7 10z"/>
             <circle cx="12" cy="11" r="2.5"/>`,
            appointment.location
        );

        metaGrid.append(dateItem, locationItem);

        const actions = document.createElement('div');
        actions.className = 'app-card-actions';
        actions.style.display = 'flex';
        actions.style.gap = '10px';
        actions.style.flexWrap = 'wrap';

        const actionButton = document.createElement('button');
        actionButton.type = 'button';
        actionButton.className = 'btn-app-action';
        actionButton.textContent =
            appointment.actionLabel || 'Ver orientações';

        actionButton.addEventListener('click', () => {
            openInstructionsDialog(appointment);
        });

        const printButton = document.createElement('button');
        printButton.type = 'button';
        printButton.className = 'btn-app-action';
        printButton.style.background = '#EEF3FF';
        printButton.style.color = '#103FEF';
        printButton.style.borderColor = '#103FEF';
        printButton.textContent = '🖨️ Imprimir Comprovante';

        printButton.addEventListener('click', () => {
            openSusReceiptForAppointment(appointment);
        });

        actions.append(actionButton, printButton);

        card.append(
            top,
            title,
            professional,
            metaGrid,
            actions
        );

        container.appendChild(card);
    });
}

// MODAL DE ORIENTAÇÕES
function initializeInstructionsDialog() {
    const dialog = document.getElementById('instructions-dialog');
    const closeButton = document.getElementById('btn-close-instructions');
    const printButton = document.getElementById('btn-print-instructions-receipt');

    if (!dialog || !closeButton) {
        console.error('Elementos do modal de orientações não encontrados.');
        return;
    }

    closeButton.addEventListener('click', () => {
        dialog.close();
    });

    if (printButton) {
        printButton.addEventListener('click', () => {
            dialog.close();
            if (activeInstructionsAppointment) {
                openSusReceiptForAppointment(activeInstructionsAppointment);
            }
        });
    }
}

function openInstructionsDialog(appointment) {
    activeInstructionsAppointment = appointment;
    const dialog = document.getElementById('instructions-dialog');
    const title = document.getElementById('instructions-title');
    const text = document.getElementById('instructions-text');

    if (!dialog || !title || !text) return;

    const appointmentType =
        APPOINTMENT_TYPES[appointment.type] || appointment.type || '';

    title.textContent = appointmentType
        ? `Orientações — ${appointmentType}`
        : 'Orientações do atendimento';

    text.textContent =
        appointment.instructions || 'Nenhuma orientação cadastrada.';

    dialog.showModal();
}

// FORMULÁRIO DE AGENDAMENTO
function initializeAppointmentForm() {
    const dialog = document.getElementById('appointment-dialog');
    const form = document.getElementById('appointment-form');
    const openButton = document.getElementById('btn-open-appointment');
    const cancelButton = document.getElementById('btn-cancel-appointment');
    const dateInput = document.getElementById('appointment-date');
    const susInput = document.getElementById('appointment-sus-card');

    if (!dialog || !form || !openButton || !cancelButton || !dateInput) {
        console.error('Elementos do formulário de agendamento não encontrados.');
        return;
    }

    // Impede a escolha de datas anteriores ao momento atual.
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

    dateInput.min = now.toISOString().slice(0, 16);

    openButton.addEventListener('click', () => {
        form.reset();
        clearAppointmentFeedback();

        const citizen = typeof getActiveCitizen === 'function' ? getActiveCitizen() : null;
        if (susInput && citizen && citizen.susCard) {
            susInput.value = citizen.susCard;
        }

        const currentDate = new Date();
        currentDate.setMinutes(
            currentDate.getMinutes() - currentDate.getTimezoneOffset()
        );

        dateInput.min = currentDate.toISOString().slice(0, 16);

        dialog.showModal();
    });

    cancelButton.addEventListener('click', () => {
        dialog.close();
        form.reset();
        clearAppointmentFeedback();
    });

    form.addEventListener('submit', submitAppointment);
}

async function submitAppointment(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const submitButton = document.getElementById('btn-submit-appointment');
    const feedback = document.getElementById('appointment-feedback');
    const dialog = document.getElementById('appointment-dialog');

    if (!form.reportValidity()) return;

    const dateTime = document.getElementById('appointment-date').value;

    if (new Date(dateTime) <= new Date()) {
        feedback.textContent = 'Escolha uma data e horário futuros.';
        return;
    }

    const protocolCode = `SUS-2026-${Math.floor(1000 + Math.random() * 8999)}`;
    const payload = {
        id: `local-app-${Date.now()}`,
        protocol: protocolCode,
        municipality: activeHealthCity,
        status: 'Solicitado',
        susCard: document.getElementById('appointment-sus-card').value.trim(),
        type: document.getElementById('appointment-title').value,
        professional: 'Regulação Municipal SUS',
        dateTime: dateTime,
        location: document.getElementById('appointment-location').value.trim(),
        actionLabel: 'Ver orientações',
        instructions: 'Sua solicitação foi registrada. Compareça com documento com foto, CPF e Cartão SUS.'
    };

    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
    feedback.textContent = '';

    try {
        const response = await fetch(`${API_URL}/appointments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Fallback local');
        }
    } catch (error) {
        try {
            const raw = localStorage.getItem('conecta_cidadao_local_appointments');
            const list = raw ? JSON.parse(raw) : [];
            list.unshift(payload);
            localStorage.setItem('conecta_cidadao_local_appointments', JSON.stringify(list));
        } catch (e) {}
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar solicitação';
    }

    dialog.close();
    form.reset();
    await loadHealthData(activeHealthCity);
    openSusReceiptForAppointment(payload);
}

function clearAppointmentFeedback() {
    const feedback = document.getElementById('appointment-feedback');

    if (feedback) {
        feedback.textContent = '';
    }
}

// ELEMENTOS AUXILIARES
function createMessage(message) {
    const paragraph = document.createElement('p');
    paragraph.textContent = message;

    return paragraph;
}

function createMetaItem(svgContent, value) {
    const item = document.createElement('div');
    item.className = 'meta-item';

    const svg = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg'
    );

    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');

    svg.innerHTML = svgContent;

    const span = document.createElement('span');
    span.textContent = value || '';

    item.append(svg, span);

    return item;
}