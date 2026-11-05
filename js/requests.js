document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:8080/api/occurrences';
    const protocolsList = document.getElementById('protocols-list');
    const timelineList = document.getElementById('det-proto-timeline');

    const complementForm = document.getElementById('complement-form');
    const complementDescription = document.getElementById('complement-description');
    const btnSendComplement = document.getElementById('btn-send-complement');
    const btnCancelComplement = document.getElementById('btn-cancel-complement');
    const btnSubmitComplement = document.getElementById('btn-submit-complement');

    let occurrences = [];
    let selectedOccurrence = null;
    let currentFilter = 'all';

    let activeCity = typeof getActiveCity === 'function'
        ? getActiveCity()
        : 'rio-das-ostras';

    const cityNames = {
        'rio-das-ostras': 'Rio das Ostras',
        'sapucaia': 'Sapucaia do Sul'
    };

    const statusConfig = {
        Recebido: {
            text: 'Recebido',
            className: 'in-progress',
            step: 1,
            filter: 'progress'
        },
        EmAnalise: {
            text: 'Em Análise',
            className: 'in-progress',
            step: 2,
            filter: 'progress'
        },
        EquipeEnviada: {
            text: 'Equipe Enviada',
            className: 'dispatched',
            step: 3,
            filter: 'progress'
        },
        Concluida: {
            text: 'Concluído',
            className: 'completed',
            step: 4,
            filter: 'completed'
        }
    };

    function formatDate(dateValue) {
        if (!dateValue) {
            return 'Data não disponível';
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return 'Data não disponível';
        }

        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function getAddress(occurrence) {
        const parts = [
            occurrence.street,
            occurrence.number,
            occurrence.neighborhood,
            occurrence.municipality
        ].filter(part => part && String(part).trim());

        return parts.length > 0
            ? parts.join(' · ')
            : 'Endereço não informado';
    }

    function createElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text !== undefined) {
            element.textContent = text;
        }

        return element;
    }

    function getStatus(status) {
        return statusConfig[status] || {
            text: status || 'Status desconhecido',
            className: 'in-progress',
            step: 1,
            filter: 'progress'
        };
    }

    function updateStepper(step) {
        for (let i = 1; i <= 4; i++) {
            const node = document.getElementById(`step-node-${i}`);
            const line = document.getElementById(`step-line-${i}`);

            if (!node) continue;

            const circle = node.querySelector('.step-circle');

            node.className = 'step-item';

            if (i < step) {
                node.classList.add('step-completed');
                circle.textContent = '✓';
            } else if (i === step) {
                node.classList.add(
                    step === 4 ? 'step-completed' : 'step-current'
                );

                circle.textContent = step === 4 ? '✓' : i;
            } else {
                circle.textContent = i;
            }

            if (line) {
                line.className = 'step-line';

                if (i < step) {
                    line.classList.add('active');
                }
            }
        }
    }

    // Fecha e limpa o formulário de complemento.
    function closeComplementForm() {
        complementForm.hidden = true;
        complementDescription.value = '';
    }

    // Carrega os complementos da ocorrência selecionada.
    async function loadComplements(occurrenceId) {

        const response = await fetch(
            `${API_URL}/${occurrenceId}/complements`
        );

        if (!response.ok) {
            throw new Error('Não foi possível carregar os complementos.');
        }

        return await response.json();
    }

    // Atualiza os detalhes da ocorrência e seu histórico.
    async function selectOccurrence(occurrence) {
        if (!occurrence) return;

        selectedOccurrence = occurrence;

        closeComplementForm();

        document.querySelectorAll('.protocol-card').forEach(card => {
            card.classList.toggle(
                'selected',
                card.dataset.id === String(occurrence.id)
            );
        });

        const status = getStatus(occurrence.status);

        document.getElementById('det-proto-id').textContent =
            occurrence.protocol || 'Protocolo pendente';

        const badge = document.getElementById('det-proto-badge');

        badge.className = `details-status-badge ${status.className}`;
        badge.textContent = status.text;

        document.getElementById('det-proto-title').textContent =
            occurrence.title || 'Sem título';

        document.getElementById('det-proto-address').textContent =
            getAddress(occurrence);

        updateStepper(status.step);

        timelineList.replaceChildren();

        // Registro inicial da ocorrência.
        const timelineItem = createElement('li', 'timeline-item');
        const bullet = createElement('div', 'timeline-bullet');
        const content = createElement('div', 'timeline-content');

        const date = createElement(
            'span',
            'timeline-date',
            formatDate(occurrence.createdAt)
        );

        const action = createElement(
            'strong',
            'timeline-action',
            'Solicitação registrada'
        );

        const description = createElement(
            'p',
            'timeline-desc',
            'A ocorrência foi cadastrada no Conecta Cidadão.'
        );

        content.append(date, action, description);
        timelineItem.append(bullet, content);
        timelineList.appendChild(timelineItem);

        // Busca os complementos vinculados à ocorrência.
        try {
            const complements = await loadComplements(occurrence.id);

            // Evita exibir complementos de uma ocorrência anterior
            // caso o cidadão tenha selecionado outra durante a consulta.
            if (selectedOccurrence?.id !== occurrence.id) return;

            complements.forEach(complement => {

                const item = createElement('li', 'timeline-item');
                const itemBullet = createElement('div', 'timeline-bullet');
                const itemContent = createElement('div', 'timeline-content');

                const itemDate = createElement(
                    'span',
                    'timeline-date',
                    formatDate(complement.createdAt)
                );

                const itemAction = createElement(
                    'strong',
                    'timeline-action',
                    'Complemento enviado'
                );

                const itemDescription = createElement(
                    'p',
                    'timeline-desc',
                    complement.description
                );

                itemContent.append(
                    itemDate,
                    itemAction,
                    itemDescription
                );

                item.append(itemBullet, itemContent);
                timelineList.appendChild(item);
            });

        } catch (error) {
            console.error('Erro ao carregar complementos:', error);
        }
    }

    function showEmptyMessage(message) {
        protocolsList.replaceChildren();

        const container = createElement('div', null);

        container.style.cssText =
            'background:white;border:1.5px dashed #cbd5e1;' +
            'border-radius:12px;padding:2rem;text-align:center;color:#64748b;';

        const title = createElement('p', null, message);
        title.style.fontWeight = '700';

        container.appendChild(title);
        protocolsList.appendChild(container);

        selectedOccurrence = null;

        closeComplementForm();

        document.getElementById('det-proto-id').textContent =
            'Nenhuma solicitação';

        document.getElementById('det-proto-badge').textContent = '-';

        document.getElementById('det-proto-title').textContent =
            'Nenhuma solicitação encontrada';

        document.getElementById('det-proto-address').textContent =
            'Quando houver uma solicitação, os detalhes aparecerão aqui.';

        timelineList.replaceChildren();

        updateStepper(0);
    }

    function renderOccurrences() {

        const municipality = cityNames[activeCity];

        const cityOccurrences = occurrences.filter(occurrence =>
            occurrence.municipality === municipality
        );

        const filteredOccurrences = cityOccurrences.filter(occurrence => {
            if (currentFilter === 'all') {
                return true;
            }

            return getStatus(occurrence.status).filter === currentFilter;
        });

        protocolsList.replaceChildren();

        if (filteredOccurrences.length === 0) {
            showEmptyMessage(
                'Nenhuma solicitação encontrada para este município e filtro.'
            );
            return;
        }

        filteredOccurrences.forEach(occurrence => {

            const status = getStatus(occurrence.status);

            const card = createElement('article', 'protocol-card');

            card.dataset.id = occurrence.id;
            card.dataset.status = status.filter;

            const header = createElement('div', 'protocol-card-head');

            const protocolId = createElement(
                'span',
                'protocol-id',
                occurrence.protocol || 'Protocolo pendente'
            );

            const badge = createElement(
                'span',
                `badge-status ${status.className}`,
                status.text
            );

            header.append(protocolId, badge);

            const title = createElement(
                'h3',
                'protocol-title',
                occurrence.title || 'Sem título'
            );

            const address = createElement(
                'p',
                'protocol-meta',
                getAddress(occurrence)
            );

            const footer = createElement('div', 'protocol-footer');

            const date = createElement(
                'span',
                'protocol-date',
                `Aberto em ${formatDate(occurrence.createdAt)}`
            );

            const arrow = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'svg'
            );

            arrow.setAttribute('class', 'protocol-arrow');
            arrow.setAttribute('width', '16');
            arrow.setAttribute('height', '16');
            arrow.setAttribute('viewBox', '0 0 24 24');
            arrow.setAttribute('fill', 'none');
            arrow.setAttribute('stroke', 'currentColor');
            arrow.setAttribute('stroke-width', '2.5');
            arrow.setAttribute('stroke-linecap', 'round');
            arrow.setAttribute('stroke-linejoin', 'round');

            const polyline = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'polyline'
            );

            polyline.setAttribute('points', '9 18 15 12 9 6');

            arrow.appendChild(polyline);

            footer.append(date, arrow);
            card.append(header, title, address, footer);

            card.addEventListener('click', () => {
                selectOccurrence(occurrence);
            });

            protocolsList.appendChild(card);
        });

        const occurrenceToSelect = filteredOccurrences.find(
            occurrence => occurrence.id === selectedOccurrence?.id
        ) || filteredOccurrences[0];

        selectOccurrence(occurrenceToSelect);
    }

    // Abre o formulário de complemento.
    btnSendComplement.addEventListener('click', () => {

        if (!selectedOccurrence) {
            alert('Selecione uma solicitação primeiro.');
            return;
        }

        complementForm.hidden = false;
        complementDescription.focus();
    });

    // Cancela o envio.
    btnCancelComplement.addEventListener('click', () => {
        closeComplementForm();
    });

    // Envia o complemento para a API.
    btnSubmitComplement.addEventListener('click', async () => {

        if (!selectedOccurrence) {
            alert('Selecione uma solicitação primeiro.');
            return;
        }

        const description = complementDescription.value.trim();

        if (!description) {
            alert('Digite uma informação adicional.');
            complementDescription.focus();
            return;
        }

        btnSubmitComplement.disabled = true;
        btnSubmitComplement.textContent = 'Enviando...';

        try {

            const response = await fetch(
                `${API_URL}/${selectedOccurrence.id}/complements`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        description: description
                    })
                }
            );

            if (!response.ok) {
                throw new Error('Não foi possível enviar o complemento.');
            }

            const savedComplement = await response.json();

            alert('Complemento enviado com sucesso!');

            closeComplementForm();

            // Atualiza o histórico da ocorrência selecionada.
            await selectOccurrence(selectedOccurrence);

        } catch (error) {

            console.error('Erro ao enviar complemento:', error);

            alert(
                'Erro ao enviar complemento. Verifique se o backend está funcionando.'
            );

        } finally {

            btnSubmitComplement.disabled = false;
            btnSubmitComplement.textContent = 'Enviar complemento';
        }
    });

    // Configura os filtros.
    document.querySelectorAll('.tab-chip').forEach(chip => {

        chip.addEventListener('click', () => {

            document.querySelectorAll('.tab-chip').forEach(tab => {
                tab.classList.remove('active');
            });

            chip.classList.add('active');

            currentFilter = chip.dataset.filter;

            renderOccurrences();
        });
    });

    // Escuta a troca de município.
    window.addEventListener('conectaCityChanged', event => {

        if (event.detail && event.detail.cityKey) {

            activeCity = event.detail.cityKey;

            renderOccurrences();
        }
    });

    // Busca as ocorrências na API.
    async function loadOccurrences() {

        try {

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error('Não foi possível carregar as solicitações.');
            }

            occurrences = await response.json();

            console.log('Solicitações recebidas da API:', occurrences);

            renderOccurrences();

        } catch (error) {

            console.error('Erro ao carregar solicitações:', error);

            showEmptyMessage(
                'Não foi possível carregar as solicitações. Verifique se o servidor está funcionando.'
            );
        }
    }

    loadOccurrences();

});