function getProjetcs() {
    const urlGitHub = 'https://api.github.com/users/JonPer3z/repos';
    const loadingElement = document.getElementById('loading');
    const projectListElement = document.getElementById('my-projects-list');

    if (loadingElement) loadingElement.style.display = 'block';
    if (projectListElement) projectListElement.innerHTML = '';

    fetch(urlGitHub)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (loadingElement) loadingElement.style.display = 'none';

            if (data.length === 0) {
                if (projectListElement) projectListElement.innerHTML = '<p style="color: white;">Nenhum projeto público encontrado.</p>';
                return;
            }

            if (projectListElement) {
                data.forEach(repo => {
                    const link = document.createElement("a");
                    link.href = repo.html_url;
                    link.target = '_blank';
                    link.title = repo.description || 'Sem descrição';
                    link.textContent = repo.name;
                    projectListElement.appendChild(link);
                });
            }
        })
        .catch(error => {
            console.error("Erro ao carregar os projetos:", error);
            if (loadingElement) {
                loadingElement.style.display = 'block';
                loadingElement.textContent = "Erro ao carregar projetos. Tente novamente mais tarde.";
                loadingElement.style.color = 'red';
            }
        });
}

function initCarrossel({ wrapperId, intervalo }) {
    const carrosselWrapper = document.getElementById(wrapperId);

    if (!carrosselWrapper) {
        console.warn(`Carrossel '${wrapperId}' não encontrado.`);
        return;
    }

    const imagens = carrosselWrapper.querySelectorAll('img');
    let currentIndex = 0;

    // REMOVIDO: A função setupCarouselWidth() foi removida,
    // pois o CSS agora define a largura das imagens e do wrapper.

    function trocarImagem() {
        currentIndex++;
        if (currentIndex >= imagens.length) {
            currentIndex = 0;
        }
        // O transform ainda se baseia na largura do pai (viewer)
        // para garantir que cada slide ocupe a largura total da janela do carrossel.
        const viewerWidth = carrosselWrapper.parentNode.offsetWidth;
        carrosselWrapper.style.transform = `translateX(${-currentIndex * viewerWidth}px)`;
    }

    if (imagens.length > 1) {
        // NÃO CHAMAMOS MAIS setupCarouselWidth() aqui.
        carrosselWrapper.style.transform = 'translateX(0)';
        setInterval(trocarImagem, intervalo);
        // NOVO: Adiciona um listener de redimensionamento para RECALCULAR O TRANSFORM se a largura da janela mudar
        // (importante para que o transform em px continue correto)
        window.addEventListener('resize', () => {
            // Reinicia a posição e aplica novamente o transform com a nova largura
            carrosselWrapper.style.transform = `translateX(${-currentIndex * carrosselWrapper.parentNode.offsetWidth}px)`;
        });

    } else {
        console.log(`Carrossel '${wrapperId}' não iniciado: menos de 2 imagens para deslizar.`);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    // Inicializa a função de projetos do GitHub
    getProjetcs();

    // Inicializa carrosséis automáticos de imagem (perfil e internos das formações)
    initCarrossel({
        wrapperId: 'carrossel-wrapper', // Carrossel da primeira seção (perfil)
        intervalo: 10000 // 10 segundos
    });

    initCarrossel({
        wrapperId: 'etec-inner-wrapper', // Carrossel interno da Etec (anteriormente carrossel-wrapper2)
        intervalo: 8000
    });

    initCarrossel({
        wrapperId: 'unicep-inner-wrapper', // Carrossel interno da UNICEP (anteriormente carrossel-wrapper3)
        intervalo: 8000
    });

    initCarrossel({
        wrapperId: 'senai-inner-wrapper', // Carrossel interno do SENAI (anteriormente carrossel-wrapper4)
        intervalo: 8000
    });


    // *** CÓDIGO ESPECÍFICO PARA O CARROSSEL PRINCIPAL DA FOUR-SECTION (Formação Acadêmica) ***
    // Este carrossel tem botões e indicadores manuais, então não usa a função initCarrossel genérica.
    const academicCarouselContainer = document.getElementById('academic-main-carousel');

    // Verifica se o contêiner do carrossel principal existe antes de tentar manipulá-lo
    if (academicCarouselContainer) {
        const academicSlides = academicCarouselContainer.children;
        const prevButtonFour = document.getElementById('prev-four');
        const nextButtonFour = document.getElementById('next-four');
        const indicatorsContainerFour = document.querySelector('.four-section-indicators');
        let currentIndexFour = 0;
        let autoSlideIntervalFour;
        const autoSlideDelayFour = 5000; // Intervalo em milissegundos (5 segundos, ajuste conforme preferir)

        // Função para atualizar a exibição do carrossel acadêmico
        function updateAcademicCarousel() {
            academicCarouselContainer.style.transform = `translateX(-${currentIndexFour * 100}%)`;
            updateAcademicIndicators();
        }

        // Função para criar os indicadores do carrossel acadêmico
        function createAcademicIndicators() {
            if (indicatorsContainerFour) { // Verificação adicional para o contêiner de indicadores
                indicatorsContainerFour.innerHTML = ''; // Limpa indicadores existentes antes de criar novos
                for (let i = 0; i < academicSlides.length; i++) {
                    const indicator = document.createElement('div');
                    indicator.classList.add('four-section-indicator');
                    indicator.addEventListener('click', () => {
                        stopAutoSlideFour();
                        currentIndexFour = i;
                        updateAcademicCarousel();
                        startAutoSlideFour();
                    });
                    indicatorsContainerFour.appendChild(indicator);
                }
                updateAcademicIndicators(); // Define o indicador ativo inicial
            }
        }

        // Função para atualizar o indicador ativo do carrossel acadêmico
        function updateAcademicIndicators() {
            if (indicatorsContainerFour) { // Verificação adicional
                const indicators = indicatorsContainerFour.querySelectorAll('.four-section-indicator');
                indicators.forEach((indicator, index) => {
                    indicator.classList.toggle('active', index === currentIndexFour);
                });
            }
        }

        function nextSlideFour() {
            currentIndexFour = (currentIndexFour + 1) % academicSlides.length;
            updateAcademicCarousel();
        }

        function startAutoSlideFour() {
            autoSlideIntervalFour = setInterval(nextSlideFour, autoSlideDelayFour);
        }

        function stopAutoSlideFour() {
            clearInterval(autoSlideIntervalFour);
        }

        // Ouvintes de eventos para os botões de navegação
        if (prevButtonFour) {
            prevButtonFour.addEventListener('click', () => {
                stopAutoSlideFour();
                currentIndexFour = (currentIndexFour - 1 + academicSlides.length) % academicSlides.length;
                updateAcademicCarousel();
                startAutoSlideFour();
            });
        }

        if (nextButtonFour) {
            nextButtonFour.addEventListener('click', () => {
                stopAutoSlideFour();
                currentIndexFour = (currentIndexFour + 1) % academicSlides.length;
                updateAcademicCarousel();
                startAutoSlideFour();
            });
        }

        // Inicializa o carrossel acadêmico se houver slides e controles
        if (academicSlides.length > 0 && indicatorsContainerFour && prevButtonFour && nextButtonFour) {
            createAcademicIndicators();
            updateAcademicCarousel();
            startAutoSlideFour();

            // Adiciona um evento de redimensionamento para recalcular a largura se necessário
            window.addEventListener('resize', updateAcademicCarousel);
        }
    } // Fim da verificação de academicCarouselContainer
});