
document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('occurrence-form');

    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const selectedCategory = document.querySelector(
            'input[name="occurrence-category"]:checked'
        );

        const categoryMap = {
            'Iluminação pública': 'IluminacaoPublica',
            'Asfalto e buracos': 'AsfaltoBuracos',
            'Limpeza e entulho': 'LimpezaEntulho',
            'Esgoto e bueiros': 'EsgotoBueiro',
            'Poda e árvores': 'PodaArvore',
            'Sinalização de trânsito': 'SinalizacaoTransito'
        };

        const occurrence = {
            title: document.getElementById('occ-title').value,
            description: document.getElementById('occ-description').value,
            category: categoryMap[selectedCategory.value],
            municipality: document.getElementById('muni-active-name')
                .textContent.split('·')[0].trim(),
            street: document.getElementById('occ-street').value,
            number: document.getElementById('occ-number').value,
            neighborhood: document.getElementById('occ-neighborhood').value,
            referencePoint: document.getElementById('occ-reference').value,
            // TODO:Ver melhor forma de armazenar a foto, talvez seja necessário criar um endpoint para upload de fotos
            photoUrl: ''
        };

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

            if (!response.ok) {
                throw new Error('Não foi possível cadastrar a ocorrência.');
            }

            const savedOccurrence = await response.json();

            alert(
                `Ocorrência cadastrada com sucesso!\nProtocolo: ${savedOccurrence.protocol || 'Ainda não gerado'}`
            );

            window.location.href = 'requestsPage.html';

        } catch (error) {
            console.error('Erro ao cadastrar ocorrência:', error);
            alert('Erro ao cadastrar ocorrência. Verifique se o backend está funcionando.');
        }
    });

});