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

    // Pré-seleciona a categoria se vier pela URL (?cat=AsfaltoBuracos)
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

    // Preenche o endereço com os dados do cidadão logado, caso os campos estejam vazios
    function fillCitizenAddress() {
        const citizen = (typeof getActiveCitizen === 'function') ? getActiveCitizen() : null;
        if (!citizen) return;
        if (streetInput && !streetInput.value) streetInput.value = citizen.street || '';
        if (numberInput && !numberInput.value) numberInput.value = citizen.number || '';
        if (neighborhoodInput && !neighborhoodInput.value) neighborhoodInput.value = citizen.neighborhood || '';
    }

    fillCitizenAddress();

    if (btnGeo) {
        const defaultGeoHtml = btnGeo.innerHTML;

        btnGeo.addEventListener('click', () => {
            if (!navigator.geolocation) {
                alert('Seu navegador não suporta geolocalização. Preencha o endereço manualmente.');
                return;
            }

            btnGeo.disabled = true;
            btnGeo.style.color = '';
            btnGeo.textContent = 'Obtendo localização...';

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    let cityLabel = '';

                    try {
                        const res = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}&addressdetails=1&accept-language=pt-BR`
                        );
                        if (res.ok) {
                            const data = await res.json();
                            const addr = data.address || {};
                            const road = addr.road || addr.street || addr.pedestrian || addr.footway || addr.path || '';
                            const houseNumber = addr.house_number || '';
                            const bairro = addr.suburb || addr.neighbourhood || addr.city_district || addr.quarter || addr.village || '';
                            cityLabel = addr.city || addr.town || addr.municipality || '';

                            if (streetInput) streetInput.value = road || (data.display_name ? data.display_name.split(',')[0].trim() : '');
                            if (numberInput) numberInput.value = houseNumber;
                            if (neighborhoodInput) neighborhoodInput.value = bairro || cityLabel;
                        }
                    } catch (err) {
                        console.warn('Falha ao consultar endereço pelas coordenadas:', err);
                    }

                    if (referenceInput) {
                        referenceInput.value = `GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
                    }

                    btnGeo.disabled = false;
                    btnGeo.innerHTML = `
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Localização obtida${cityLabel ? ` (${cityLabel})` : ''}</span>
                    `;
                    btnGeo.style.color = '#16a34a';
                },
                (err) => {
                    btnGeo.disabled = false;
                    btnGeo.innerHTML = defaultGeoHtml;
                    btnGeo.style.color = '';

                    if (err.code === err.PERMISSION_DENIED) {
                        alert('Permissão de localização negada. Libere o acesso à localização no navegador ou preencha o endereço manualmente.');
                    } else if (err.code === err.TIMEOUT) {
                        alert('Tempo esgotado ao buscar sua localização. Tente novamente ou preencha o endereço manualmente.');
                    } else {
                        alert('Não foi possível obter sua localização atual. Verifique o GPS/rede ou preencha manualmente.');
                    }
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
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

    function compressImageFile(file, maxDimension = 960, quality = 0.72) {
        return new Promise((resolve) => {
            if (!file || !file.type.startsWith('image/')) {
                resolve('');
                return;
            }
            const reader = new FileReader();
            reader.onerror = () => resolve('');
            reader.onload = () => {
                const img = new Image();
                img.onerror = () => resolve('');
                img.onload = () => {
                    let width = img.width;
                    let height = img.height;
                    if (width > maxDimension || height > maxDimension) {
                        if (width >= height) {
                            height = Math.round((height * maxDimension) / width);
                            width = maxDimension;
                        } else {
                            width = Math.round((width * maxDimension) / height);
                            height = maxDimension;
                        }
                    }
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        });
    }

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

        const fileInput = document.getElementById('occ-file');
        const selectedFile = fileInput && fileInput.files && fileInput.files[0];
        const compressedPhotoUrl = selectedFile ? await compressImageFile(selectedFile) : '';

        const occurrence = {
            title: document.getElementById('occ-title').value,
            description: document.getElementById('occ-description').value,
            category: catEnum,
            municipality: activeCityName,
            street: streetInput.value,
            number: numberInput.value,
            neighborhood: neighborhoodInput.value,
            referencePoint: referenceInput.value,
            photoUrl: compressedPhotoUrl
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
            // Se o backend estiver offline, salva localmente para manter o fluxo funcionando
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
                    photoUrl: occurrence.photoUrl,
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
