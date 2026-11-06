const API_URL = 'http://localhost:8080/api/events';

document.addEventListener('DOMContentLoaded', () => {

    const eventsContainer = document.getElementById('events-container');
    const eventsCount = document.getElementById('events-count');
    const searchInput = document.getElementById('event-search');
    const dateInput = document.getElementById('event-date');
    const btnFilter = document.getElementById('btn-filter-agenda');

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

    const months = {
        jan: 1,
        fev: 2,
        mar: 3,
        abr: 4,
        mai: 5,
        jun: 6,
        jul: 7,
        ago: 8,
        set: 9,
        out: 10,
        nov: 11,
        dez: 12
    };

    // =====================================
    // FORMATAÇÃO
    // =====================================

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
        if (!date) return '';

        return date.split('-')[2];
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

    // =====================================
    // FILTRO DE DATA
    // =====================================

    function parseDateRange(value) {
        if (!value || !value.trim()) {
            return null;
        }

        const normalized = value
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();

        const regex = /^(\d{1,2})\s+([a-z]{3})\s+a\s+(\d{1,2})\s+([a-z]{3})\s+(\d{4})$/;

        const match = normalized.match(regex);

        if (!match) {
            return null;
        }

        const startDay = Number(match[1]);
        const startMonth = months[match[2]];
        const endDay = Number(match[3]);
        const endMonth = months[match[4]];
        const year = Number(match[5]);

        if (!startMonth || !endMonth) {
            return null;
        }

        const startDate =
            `${year}-${String(startMonth).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`;

        const endYear = endMonth < startMonth ? year + 1 : year;

        const endDate =
            `${endYear}-${String(endMonth).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`;

        const start = new Date(`${startDate}T00:00:00`);
        const end = new Date(`${endDate}T00:00:00`);

        if (
            start.getFullYear() !== year ||
            start.getMonth() + 1 !== startMonth ||
            start.getDate() !== startDay ||
            end.getFullYear() !== endYear ||
            end.getMonth() + 1 !== endMonth ||
            end.getDate() !== endDay ||
            start > end
        ) {
            return null;
        }

        return { startDate, endDate };
    }

    // =====================================
    // DETALHES DO EVENTO
    // =====================================

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

    // =====================================
    // CRIAÇÃO DOS CARDS
    // =====================================

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

    // =====================================
    // LISTAGEM E FILTROS
    // =====================================

    async function renderEvents() {
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

        const dateRange = parseDateRange(dateInput.value);

        if (dateInput.value.trim() && !dateRange) {
            showMessage(
                'Período inválido',
                'Use o formato: 24 out a 7 nov 2026.'
            );
            return;
        }

        if (dateRange) {
            params.set('startDate', dateRange.startDate);
            params.set('endDate', dateRange.endDate);
        }

        try {
            const response = await fetch(
                `${API_URL}/${encodeURIComponent(currentCity)}?${params.toString()}`
            );

            if (!response.ok) {
                throw new Error(`Erro HTTP ${response.status}`);
            }

            const events = await response.json();

            // Ignora respostas antigas caso outro filtro tenha sido aplicado.
            if (currentRequest !== requestNumber) {
                return;
            }

            eventsContainer.replaceChildren();

            eventsCount.textContent =
                `${events.length} atividade${events.length === 1 ? '' : 's'}`;

            if (events.length === 0) {
                showMessage(
                    'Nenhuma atividade encontrada',
                    'Tente alterar os termos da busca ou selecionar outra categoria.'
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

    function showMessage(title, description) {
        eventsContainer.replaceChildren();

        const message = createElement('div');
        message.style.cssText =
            'background:white;border:1.5px dashed #cbd5e1;border-radius:12px;padding:2rem;text-align:center;color:#64748b;';

        const heading = createElement(
            'p',
            '',
            title
        );

        heading.style.cssText =
            'font-weight:600;margin-bottom:0.5rem;color:#0f172a;';

        const paragraph = createElement(
            'p',
            '',
            description
        );

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

    // =====================================
    // SELETOR DE MUNICÍPIO
    // =====================================

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

    // =====================================
    // TROCA DE MUNICÍPIO GLOBAL
    // =====================================

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

    // =====================================
    // FILTRO DE CATEGORIA
    // =====================================

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

    // =====================================
    // BUSCA E DATA
    // =====================================

    searchInput.addEventListener('input', renderEvents);

    btnFilter.addEventListener('click', renderEvents);

    // =====================================
    // VOLTAR À LISTA
    // =====================================

    document.getElementById('btn-subscribe').addEventListener('click', () => {
        eventsContainer.scrollIntoView({ behavior: 'smooth' });
    });

    // =====================================
    // INICIALIZAÇÃO
    // =====================================

    renderEvents();
});