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
    let allLoadedEvents = [];
    let selectedCalendarDay = null;
    let calendarCursor = new Date(today.getFullYear(), today.getMonth(), 1);

    const calendarGrid = document.getElementById('calendar-grid');
    const calendarMonthTitle = document.getElementById('calendar-month-title');
    const activeDayPill = document.getElementById('calendar-active-day-pill');
    const activeDayLabel = document.getElementById('calendar-active-day-label');
    const btnClearDay = document.getElementById('btn-clear-calendar-day');
    const btnSyncEvents = document.getElementById('btn-sync-events');
    const syncFeedbackBanner = document.getElementById('sync-feedback-banner');
    const detSourceLink = document.getElementById('det-event-source-link');

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

        if (detSourceLink) {
            if (event.sourceUrl) {
                detSourceLink.href = event.sourceUrl;
                detSourceLink.hidden = false;
            } else {
                detSourceLink.hidden = true;
            }
        }
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

        if (event.sourceType === 'AUTO_PORTAL') {
            meta.appendChild(
                createElement('span', 'event-source-badge', 'Portal Oficial')
            );
        }

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
        if (detSourceLink) {
            detSourceLink.hidden = true;
        }
    }

    // CALENDÁRIO MENSAL
    function toIsoDate(year, monthIndex, day) {
        return [
            year,
            String(monthIndex + 1).padStart(2, '0'),
            String(day).padStart(2, '0')
        ].join('-');
    }

    function renderCalendar() {
        if (!calendarGrid || !calendarMonthTitle) return;

        const year = calendarCursor.getFullYear();
        const month = calendarCursor.getMonth();

        const monthLabel = calendarCursor.toLocaleDateString('pt-BR', {
            month: 'long',
            year: 'numeric'
        });
        calendarMonthTitle.textContent =
            monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

        const eventsByDate = {};
        allLoadedEvents.forEach(ev => {
            if (!ev.date) return;
            if (!eventsByDate[ev.date]) eventsByDate[ev.date] = [];
            eventsByDate[ev.date].push(ev);
        });

        const firstWeekday = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        calendarGrid.replaceChildren();

        for (let i = 0; i < firstWeekday; i++) {
            const emptyCell = createElement('div', 'calendar-day empty');
            calendarGrid.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const iso = toIsoDate(year, month, day);
            const dayEvents = eventsByDate[iso] || [];
            const isToday = iso === todayFormatted;
            const isSelected = iso === selectedCalendarDay;

            const cell = createElement('button', 'calendar-day');
            cell.type = 'button';
            if (isToday) cell.classList.add('today');
            if (isSelected) cell.classList.add('selected');
            if (dayEvents.length > 0) cell.classList.add('has-events');

            const numSpan = createElement('span', 'calendar-day-num', String(day));
            cell.appendChild(numSpan);

            if (dayEvents.length > 0) {
                const countPill = createElement(
                    'span',
                    'calendar-day-count',
                    `${dayEvents.length}`
                );
                cell.appendChild(countPill);

                const firstTitle = createElement(
                    'span',
                    'calendar-day-preview',
                    dayEvents[0].title
                );
                cell.appendChild(firstTitle);
            }

            cell.addEventListener('click', () => {
                selectedCalendarDay = selectedCalendarDay === iso ? null : iso;
                updateActiveDayPill();
                renderCalendar();
                renderFilteredList();
            });

            calendarGrid.appendChild(cell);
        }
    }

    function updateActiveDayPill() {
        if (!activeDayPill || !activeDayLabel) return;
        if (selectedCalendarDay) {
            activeDayLabel.textContent = `Dia ${formatDate(selectedCalendarDay)}`;
            activeDayPill.hidden = false;
        } else {
            activeDayPill.hidden = true;
        }
    }

    function renderFilteredList() {
        const list = selectedCalendarDay
            ? allLoadedEvents.filter(ev => ev.date === selectedCalendarDay)
            : allLoadedEvents;

        eventsContainer.replaceChildren();
        eventsCount.textContent =
            `${list.length} atividade${list.length === 1 ? '' : 's'}`;

        if (list.length === 0) {
            showMessage(
                'Nenhuma atividade encontrada',
                selectedCalendarDay
                    ? 'Não há eventos cadastrados para este dia. Clique em × para ver toda a agenda.'
                    : 'Tente alterar os termos da busca ou selecionar outro período ou categoria.'
            );
            clearDetails();
            return;
        }

        list.forEach((event, index) => {
            const card = createEventCard(event);
            eventsContainer.appendChild(card);
            if (index === 0) {
                selectEvent(event);
            }
        });
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

            allLoadedEvents = Array.isArray(events) ? events : [];
            renderCalendar();
            renderFilteredList();

        } catch (error) {
            if (currentRequest !== requestNumber) {
                return;
            }

            console.error('Erro ao carregar eventos:', error);
            allLoadedEvents = [];
            renderCalendar();

            showMessage(
                'Não foi possível carregar os eventos',
                'Verifique se o backend está em execução (porta 8080) e tente novamente.'
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

    // NAVEGAÇÃO DO CALENDÁRIO
    const btnCalPrev = document.getElementById('btn-cal-prev');
    const btnCalNext = document.getElementById('btn-cal-next');
    const btnCalToday = document.getElementById('btn-cal-today');

    if (btnCalPrev) {
        btnCalPrev.addEventListener('click', () => {
            calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() - 1, 1);
            renderCalendar();
        });
    }
    if (btnCalNext) {
        btnCalNext.addEventListener('click', () => {
            calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() + 1, 1);
            renderCalendar();
        });
    }
    if (btnCalToday) {
        btnCalToday.addEventListener('click', () => {
            calendarCursor = new Date(today.getFullYear(), today.getMonth(), 1);
            selectedCalendarDay = null;
            updateActiveDayPill();
            renderCalendar();
            renderFilteredList();
        });
    }
    if (btnClearDay) {
        btnClearDay.addEventListener('click', () => {
            selectedCalendarDay = null;
            updateActiveDayPill();
            renderCalendar();
            renderFilteredList();
        });
    }

    // SINCRONIZAÇÃO AUTOMÁTICA COM PORTAL DA PREFEITURA
    if (btnSyncEvents) {
        btnSyncEvents.addEventListener('click', async () => {
            btnSyncEvents.disabled = true;
            btnSyncEvents.textContent = 'Sincronizando...';

            try {
                const resp = await fetch(`${API_URL}/sync/${encodeURIComponent(currentCity)}`, {
                    method: 'POST'
                });
                const data = await resp.json();
                if (syncFeedbackBanner) {
                    syncFeedbackBanner.textContent = `${data.source}: ${data.message}`;
                    syncFeedbackBanner.hidden = false;
                }
                await renderEvents();
            } catch (err) {
                if (syncFeedbackBanner) {
                    syncFeedbackBanner.textContent = 'Não foi possível sincronizar agora. Verifique o servidor backend.';
                    syncFeedbackBanner.hidden = false;
                }
            } finally {
                btnSyncEvents.disabled = false;
                btnSyncEvents.textContent = 'Atualizar Agenda';
            }
        });
    }

    // MODAL PUBLICAR EVENTO MANUAL
    const modal = document.getElementById('new-event-modal');
    const btnOpenModal = document.getElementById('btn-open-new-event');
    const btnCloseModal = document.getElementById('btn-close-new-event');
    const btnCancelModal = document.getElementById('btn-cancel-new-event');
    const newEventForm = document.getElementById('new-event-form');
    const newEvDateInput = document.getElementById('new-ev-date');

    function closeEventModal() {
        if (modal) modal.hidden = true;
    }

    if (btnOpenModal && modal) {
        btnOpenModal.addEventListener('click', () => {
            if (newEvDateInput && !newEvDateInput.value) {
                newEvDateInput.value = selectedCalendarDay || todayFormatted;
            }
            modal.hidden = false;
        });
    }
    if (btnCloseModal) btnCloseModal.addEventListener('click', closeEventModal);
    if (btnCancelModal) btnCancelModal.addEventListener('click', closeEventModal);

    if (newEventForm) {
        newEventForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                municipality: currentCity,
                category: document.getElementById('new-ev-category').value,
                title: document.getElementById('new-ev-title').value.trim(),
                descShort: document.getElementById('new-ev-desc').value.trim().slice(0, 120),
                descFull: document.getElementById('new-ev-desc').value.trim(),
                date: document.getElementById('new-ev-date').value,
                startTime: document.getElementById('new-ev-start').value,
                endTime: document.getElementById('new-ev-end').value,
                locationShort: document.getElementById('new-ev-location').value.trim(),
                locationFull: document.getElementById('new-ev-location').value.trim(),
                audience: document.getElementById('new-ev-audience').value.trim(),
                before: 'Evento publicado manualmente no mural municipal.',
                sourceType: 'MANUAL'
            };

            try {
                const resp = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (!resp.ok) {
                    const msg = await resp.text();
                    alert(msg || 'Erro ao salvar evento.');
                    return;
                }
                newEventForm.reset();
                closeEventModal();
                await renderEvents();
            } catch (err) {
                alert('Não foi possível conectar ao backend para salvar o evento.');
            }
        });
    }

    // INICIALIZAÇÃO
    renderCalendar();
    renderEvents();
});