const API_URL = 'http://localhost:8080/api/events';

document.addEventListener('DOMContentLoaded', () => {

    const eventsContainer = document.getElementById('events-container');
    const eventsCount = document.getElementById('events-count');
    const searchInput = document.getElementById('event-search');
    const startDateInput = document.getElementById('event-start-date');
    const endDateInput = document.getElementById('event-end-date');
    const btnFilter = document.getElementById('btn-filter-agenda');


    // DATA INICIAL PADRÃO
    const today = new Date();

    const todayFormatted = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, '0'),
        String(today.getDate()).padStart(2, '0')
    ].join('-');

    startDateInput.value = todayFormatted;
    startDateInput.min = todayFormatted;
    endDateInput.min = todayFormatted;

    let currentCity = typeof getActiveCity === 'function'
        ? getActiveCity()
        : 'rio-das-ostras';

    let currentCategory = 'all';
    let requestNumber = 0;

    const categoryMap = {
        'Cultura': 'Cultura',
        'EsporteELazer': 'Esporte e lazer',
        'Oficinas': 'Oficinas',
        'ParaFamilias': 'Para famílias'
    };

    const categoryFilterMap = {
        'Cultura': 'Cultura',
        'Esporte e lazer': 'EsporteELazer',
        'Oficinas': 'Oficinas',
        'Para famílias': 'ParaFamilias'
    };


    // FORMATAÇÃO
    function formatDate(date) {
        if (!date) return '';

        const [year, month, day] = date.split('-').map(Number);

        return new Date(year, month - 1, day)
            .toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
    }

    function formatDay(date) {
        return date ? date.split('-')[2] : '';
    }

    function formatMonth(date) {
        if (!date) return '';

        const [, month] = date.split('-').map(Number);

        return new Date(2000, month - 1, 1)
            .toLocaleDateString('pt-BR', { month: 'short' })
            .replace('.', '')
            .toUpperCase();
    }

    function formatYear(date) {
        return date ? date.split('-')[0] : '';
    }

    function formatTime(time) {
        if (!time) return '';

        return time.substring(0, 5).replace(':', 'h');
    }

    function formatSchedule(event) {
        const start = formatTime(event.startTime);
        const end = formatTime(event.endTime);

        if (start && end) {
            return `${start} às ${end}`;
        }

        return start || end || 'Horário não informado';
    }

    function formatWeekday(date) {
        if (!date) return '';

        const [year, month, day] = date.split('-').map(Number);

        return new Date(year, month - 1, day)
            .toLocaleDateString('pt-BR', { weekday: 'long' });
    }

    function getCategoryLabel(category) {
        return categoryMap[category] || category || 'Evento';
    }


    // DETALHES DO EVENTO
    function selectEvent(event) {
        document.querySelectorAll('.event-card').forEach(card => {
            card.classList.toggle(
                'selected',
                card.dataset.id === event.id
            );
        });

        document.getElementById('det-event-badge').textContent =
            getCategoryLabel(event.category);

        document.getElementById('det-event-title').textContent =
            event.title || 'Evento';

        document.getElementById('det-event-desc').textContent =
            event.descFull || event.descShort || '';

        document.getElementById('det-event-time').textContent =
            `${formatDate(event.date)} · ${formatSchedule(event)}`;

        document.getElementById('det-event-loc').textContent =
            event.locationFull || event.locationShort || 'Local não informado';

        document.getElementById('det-event-loc-sub').textContent =
            event.locationShort || '';

        document.getElementById('det-event-audience').textContent =
            event.audience || 'Não informado';

        document.getElementById('det-event-before').textContent =
            event.before || 'Não há orientações adicionais.';
    }

    // CRIAÇÃO DOS CARDS
    function createElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text !== undefined && text !== null) {
            element.textContent = text;
        }

        return element;
    }

    function createEventCard(event) {
        const card = createElement('article', 'event-card');

        card.dataset.id = event.id;

        const dateBox = createElement('div', 'event-date-box');

        dateBox.appendChild(
            createElement('span', 'date-day', formatDay(event.date))
        );

        dateBox.appendChild(
            createElement('span', 'date-month', formatMonth(event.date))
        );

        const infoBox = createElement('div', 'event-info-box');

        const meta = createElement('div', 'event-meta-top');

        meta.appendChild(
            createElement('span', 'event-badge', getCategoryLabel(event.category))
        );

        meta.appendChild(
            createElement('span', 'event-year', formatYear(event.date))
        );

        infoBox.appendChild(meta);

        infoBox.appendChild(
            createElement('h3', 'event-title', event.title)
        );

        infoBox.appendChild(
            createElement(
                'p',
                'event-datetime',
                `${formatWeekday(event.date)} · ${formatSchedule(event)}`
            )
        );

        infoBox.appendChild(
            createElement(
                'p',
                'event-location',
                event.locationShort || event.locationFull
            )
        );

        infoBox.appendChild(
            createElement('p', 'event-desc', event.descShort)
        );

        card.appendChild(dateBox);
        card.appendChild(infoBox);

        card.addEventListener('click', () => selectEvent(event));

        return card;
    }

    // MENSAGENS
    function showMessage(title, description) {
        eventsContainer.replaceChildren();

        const message = createElement('div');

        message.style.cssText =
            'background:white;border:1.5px dashed #cbd5e1;border-radius:12px;padding:2rem;text-align:center;color:#64748b;';

        const heading = createElement('p', '', title);

        heading.style.cssText =
            'font-weight:600;margin-bottom:0.5rem;color:#0f172a;';

        const paragraph = createElement('p', '', description);

        paragraph.style.cssText =
            'font-size:0.88rem;margin:0;';

        message.appendChild(heading);
        message.appendChild(paragraph);

        eventsContainer.appendChild(message);
        eventsCount.textContent = '0 atividades';
    }

    function clearDetails() {
        document.getElementById('det-event-badge').textContent = 'Evento';

        document.getElementById('det-event-title').textContent =
            'Nenhum evento selecionado';

        document.getElementById('det-event-desc').textContent =
            'Selecione uma atividade para visualizar os detalhes.';

        document.getElementById('det-event-time').textContent = '—';
        document.getElementById('det-event-loc').textContent = '—';
        document.getElementById('det-event-loc-sub').textContent = '';
        document.getElementById('det-event-audience').textContent = '—';
        document.getElementById('det-event-before').textContent = '—';
    }

    // FILTRO DE DATA
    function validateDateRange() {
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;

        startDateInput.setCustomValidity('');
        endDateInput.setCustomValidity('');

        if (startDate && endDate && endDate < startDate) {
            endDateInput.setCustomValidity(
                'A data final não pode ser anterior à data inicial.'
            );

            endDateInput.reportValidity();

            return false;
        }

        return true;
    }

    // LISTAGEM E FILTROS
    async function renderEvents() {
        if (!validateDateRange()) {
            return;
        }

        const currentRequest = ++requestNumber;

        eventsContainer.replaceChildren();
        eventsCount.textContent = 'Carregando atividades...';

        const params = new URLSearchParams();

        if (currentCategory !== 'all') {
            params.set('category', currentCategory);
        }

        const search = searchInput.value.trim();

        if (search) {
            params.set('search', search);
        }

        // Data inicial e final são enviadas independentemente.
        // A data final é opcional.

        if (startDateInput.value) {
            params.set('startDate', startDateInput.value);
        }

        if (endDateInput.value) {
            params.set('endDate', endDateInput.value);
        }

        try {
            const response = await fetch(
                `${API_URL}/${encodeURIComponent(currentCity)}?${params.toString()}`
            );

            if (!response.ok) {
                throw new Error(`Erro HTTP ${response.status}`);
            }

            const events = await response.json();

            if (currentRequest !== requestNumber) {
                return;
            }

            eventsContainer.replaceChildren();

            eventsCount.textContent =
                `${events.length} atividade${events.length === 1 ? '' : 's'}`;

            if (events.length === 0) {
                showMessage(
                    'Nenhuma atividade encontrada',
                    'Tente alterar os termos da busca ou selecionar outro período ou categoria.'
                );

                clearDetails();
                return;
            }

            events.forEach((event, index) => {
                const card = createEventCard(event);

                eventsContainer.appendChild(card);

                if (index === 0) {
                    selectEvent(event);
                }
            });

        } catch (error) {
            if (currentRequest !== requestNumber) {
                return;
            }

            console.error('Erro ao carregar eventos:', error);

            showMessage(
                'Não foi possível carregar os eventos',
                'Verifique se o backend está em execução e tente novamente.'
            );

            clearDetails();
        }
    }


    // SELETOR DE MUNICÍPIO
    const muniToggle = document.getElementById('muni-toggle');
    const muniDropdown = document.getElementById('muni-dropdown');

    if (muniToggle && muniDropdown) {
        muniToggle.addEventListener('click', event => {
            event.stopPropagation();
            muniDropdown.classList.toggle('show');
        });

        document.querySelectorAll('.muni-opt').forEach(option => {
            option.addEventListener('click', event => {
                event.stopPropagation();

                currentCity = option.dataset.city;

                document.getElementById('muni-active-name').textContent =
                    option.dataset.name;

                document.getElementById('muni-alt-name').textContent =
                    'Também disponível: ' + option.dataset.alt;

                document.querySelectorAll('.muni-opt').forEach(item => {
                    item.classList.remove('active');
                });

                option.classList.add('active');
                muniDropdown.classList.remove('show');

                renderEvents();
            });
        });

        document.addEventListener('click', () => {
            muniDropdown.classList.remove('show');
        });
    }

    // TROCA DE MUNICÍPIO GLOBAL
    window.addEventListener('conectaCityChanged', event => {
        if (event.detail && event.detail.cityKey) {
            currentCity = event.detail.cityKey;

            document.querySelectorAll('.muni-opt').forEach(option => {
                const isActive = option.dataset.city === currentCity;

                option.classList.toggle('active', isActive);

                if (isActive) {
                    document.getElementById('muni-active-name').textContent =
                        option.dataset.name;

                    document.getElementById('muni-alt-name').textContent =
                        'Também disponível: ' + option.dataset.alt;
                }
            });

            renderEvents();
        }
    });

    // FILTRO DE CATEGORIA
    document.querySelectorAll('.category-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.category-chip').forEach(item => {
                item.classList.remove('active');
            });

            chip.classList.add('active');

            currentCategory = categoryFilterMap[chip.dataset.category]
                || 'all';

            renderEvents();
        });
    });

    // BUSCA E DATAS
    searchInput.addEventListener('input', renderEvents);

    btnFilter.addEventListener('click', renderEvents);

    startDateInput.addEventListener('change', () => {
        endDateInput.min = startDateInput.value;

        startDateInput.setCustomValidity('');
        endDateInput.setCustomValidity('');

        renderEvents();
    });

    endDateInput.addEventListener('change', () => {
        endDateInput.setCustomValidity('');
        renderEvents();
    });


    // VOLTAR À LISTA
    document.getElementById('btn-subscribe').addEventListener('click', () => {
        eventsContainer.scrollIntoView({ behavior: 'smooth' });
    });

    // INICIALIZAÇÃO
    renderEvents();
});