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

    if (result.status === 'rejected') {
        container.innerHTML = `
            <h3 class="units-card-title">
                Unidades de Saúde (UBS / UPA / Hospital)
            </h3>
        `;

        container.appendChild(
            createMessage('Não foi possível carregar as unidades de saúde.')
        );

        console.error('Erro ao carregar unidades:', result.reason);
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

    if (result.status === 'rejected') {
        container.innerHTML = '';

        container.appendChild(
            createMessage(
                'Não foi possível carregar as campanhas de vacinação.'
            )
        );

        console.error('Erro ao carregar campanhas:', result.reason);
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

    if (result.status === 'rejected') {
        container.innerHTML = '';

        container.appendChild(
            createMessage('Não foi possível carregar seus agendamentos.')
        );

        console.error('Erro ao carregar agendamentos:', result.reason);
        return;
    }

    renderAppointments(result.value);
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

        // Exibe somente a data, sem o horário.
        const appointmentDate = formatAppointmentDate(
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

        const actionButton = document.createElement('button');
        actionButton.type = 'button';
        actionButton.className = 'btn-app-action';
        actionButton.textContent =
            appointment.actionLabel || 'Ver orientações';

        actionButton.addEventListener('click', () => {
            openInstructionsDialog(appointment);
        });

        actions.appendChild(actionButton);

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

    if (!dialog || !closeButton) {
        console.error('Elementos do modal de orientações não encontrados.');
        return;
    }

    closeButton.addEventListener('click', () => {
        dialog.close();
    });
}

function openInstructionsDialog(appointment) {
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

    const payload = {
        municipality: activeHealthCity,
        status: 'Solicitado',
        susCard: document.getElementById('appointment-sus-card').value.trim(),
        type: document.getElementById('appointment-title').value,
        professional: 'A definir',
        dateTime: dateTime,
        location: document.getElementById('appointment-location').value.trim(),
        actionLabel: 'Ver orientações',
        instructions: 'Sua solicitação foi registrada. Aguarde o retorno da unidade de saúde.'
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
            const errorMessage = await response.text();

            throw new Error(
                errorMessage || `Erro ao registrar solicitação: ${response.status}`
            );
        }

        dialog.close();
        form.reset();

        alert('Solicitação registrada com sucesso!');

        await loadHealthData(activeHealthCity);

    } catch (error) {
        console.error('Erro ao solicitar agendamento:', error);

        feedback.textContent =
            'Não foi possível registrar a solicitação. Verifique a conexão e tente novamente.';

    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar solicitação';
    }
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