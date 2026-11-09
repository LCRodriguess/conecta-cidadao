document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('occurrence-form');
    const streetInput = document.getElementById('occ-street');
    const numberInput = document.getElementById('occ-number');
    const neighborhoodInput = document.getElementById('occ-neighborhood');
    const referenceInput = document.getElementById('occ-reference');
    const btnGeo = document.getElementById('btn-geo');

    const categoryMap = {
        'Iluminação pública': 'IluminacaoPublica',
        'Asfalto e buracos': 'AsfaltoBuracos',
        'Limpeza e entulho': 'LimpezaEntulho',
        'Esgoto e bueiros': 'EsgotoBueiro',
        'Poda e árvores': 'PodaArvore',
        'Sinalização de trânsito': 'SinalizacaoTransito'
    };

    const reverseCategoryMap = {
        IluminacaoPublica: 'Iluminação pública',
        AsfaltoBuracos: 'Asfalto e buracos',
        LimpezaEntulho: 'Limpeza e entulho',
        EsgotoBueiro: 'Esgoto e bueiros',
        PodaArvore: 'Poda e árvores',
        SinalizacaoTransito: 'Sinalização de trânsito'
    };

    // 1. Pré-seleciona categoria se vier pela URL (?cat=AsfaltoBuracos)
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('cat');
    if (catParam && reverseCategoryMap[catParam]) {
        const targetLabel = reverseCategoryMap[catParam];
        document.querySelectorAll('input[name="occurrence-category"]').forEach(radio => {
            const card = radio.closest('.category-radio-card');
            if (radio.value === targetLabel) {
                radio.checked = true;
                if (card) card.classList.add('selected');
            } else {
                if (card) card.classList.remove('selected');
            }
        });
    }

    // 2. Preenche endereço automaticamente com os dados reais da pessoa logada
    function fillCitizenAddress() {
        const citizen = (typeof getActiveCitizen === 'function') ? getActiveCitizen() : null;
        if (!citizen) return;
        if (streetInput && !streetInput.value) streetInput.value = citizen.street || '';
        if (numberInput && !numberInput.value) numberInput.value = citizen.number || '';
        if (neighborhoodInput && !neighborhoodInput.value) neighborhoodInput.value = citizen.neighborhood || '';
    }

    fillCitizenAddress();

    if (btnGeo) {
        btnGeo.addEventListener('click', () => {
            const citizen = (typeof getActiveCitizen === 'function') ? getActiveCitizen() : null;
            if (citizen) {
                if (streetInput) streetInput.value = citizen.street || '';
                if (numberInput) numberInput.value = citizen.number || '';
                if (neighborhoodInput) neighborhoodInput.value = citizen.neighborhood || '';
                if (referenceInput) referenceInput.value = `Endereço cadastrado de ${citizen.name} (CPF ${citizen.cpf})`;
            }
        });
    }

    window.addEventListener('conectaCitizenChanged', (e) => {
        const cit = e.detail?.citizen;
        if (cit) {
            if (streetInput) streetInput.value = cit.street || '';
            if (numberInput) numberInput.value = cit.number || '';
            if (neighborhoodInput) neighborhoodInput.value = cit.neighborhood || '';
        }
    });

    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const selectedCategory = document.querySelector(
            'input[name="occurrence-category"]:checked'
        );

        const activeCityName = document.getElementById('muni-active-name')
            ? document.getElementById('muni-active-name').textContent.split('·')[0].trim()
            : ((typeof getActiveCity === 'function' && getActiveCity() === 'sapucaia') ? 'Sapucaia do Sul' : 'Rio das Ostras');

        const citizen = (typeof getActiveCitizen === 'function') ? getActiveCitizen() : null;
        const catEnum = categoryMap[selectedCategory?.value] || 'IluminacaoPublica';
        const protocolNum = `SIM-2026-${Math.floor(1000 + Math.random() * 8999)}`;

        const occurrence = {
            title: document.getElementById('occ-title').value,
            description: document.getElementById('occ-description').value,
            category: catEnum,
            municipality: activeCityName,
            street: streetInput.value,
            number: numberInput.value,
            neighborhood: neighborhoodInput.value,
            referencePoint: referenceInput.value,
            photoUrl: ''
        };

        let savedProtocol = protocolNum;

        try {
            const response = await fetch(
                'http://localhost:8080/api/occurrences',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(occurrence)
                }
            );

            if (response.ok) {
                const savedOccurrence = await response.json();
                savedProtocol = savedOccurrence.protocol || protocolNum;
            } else {
                throw new Error('Fallback local');
            }
        } catch (error) {
            // Salva no simulador local vinculado ao cidadão ativo caso o backend Java esteja offline
            try {
                const raw = localStorage.getItem('conecta_cidadao_local_occurrences');
                const list = raw ? JSON.parse(raw) : [];
                list.unshift({
                    id: `local-${Date.now()}`,
                    protocol: savedProtocol,
                    title: occurrence.title,
                    description: occurrence.description,
                    category: occurrence.category,
                    status: 'Recebido',
                    municipality: occurrence.municipality,
                    street: occurrence.street,
                    number: occurrence.number,
                    neighborhood: occurrence.neighborhood,
                    referencePoint: occurrence.referencePoint,
                    citizenName: citizen?.name || 'Cidadão Verificado',
                    citizenCpf: citizen?.cpf || '',
                    createdAt: new Date().toISOString(),
                    complements: [
                        {
                            id: `comp-${Date.now()}`,
                            description: `Chamado registrado por ${citizen?.name || 'Cidadão'} (CPF ${citizen?.cpf || 'verificado'}) e encaminhado para triagem técnica.`,
                            createdAt: new Date().toISOString()
                        }
                    ]
                });
                localStorage.setItem('conecta_cidadao_local_occurrences', JSON.stringify(list));
            } catch (e) {
                console.warn('Erro ao salvar ocorrência local:', e);
            }
        }

        // Atualiza o protocolo ativo do cidadão logado para refletir na Home
        if (typeof updateActiveCitizenProfile === 'function' && citizen) {
            updateActiveCitizenProfile({
                activeRequest: {
                    protocol: savedProtocol,
                    title: occurrence.title,
                    category: occurrence.category,
                    categoryLabel: selectedCategory?.value || 'Zeladoria Municipal',
                    status: 'Recebido',
                    badge: 'Recebido',
                    step: 1,
                    openedAt: 'Agora mesmo',
                    address: `${occurrence.street}, ${occurrence.number} · ${occurrence.neighborhood}`,
                    updateDate: `Protocolo gerado · ${savedProtocol}`,
                    updateText: `Solicitação registrada por ${citizen.name} e enviada para a equipe técnica de ${occurrence.municipality}.`
                }
            });
        }

        window.location.href = `requestsPage.html?printProtocol=${encodeURIComponent(savedProtocol)}`;
    });
});
