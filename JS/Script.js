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

    function trocarImagem() {
        currentIndex++;
        if (currentIndex >= imagens.length) {
            currentIndex = 0;
        }
        const viewerWidth = carrosselWrapper.parentNode.offsetWidth;
        carrosselWrapper.style.transform = `translateX(${-currentIndex * viewerWidth}px)`;
    }

    if (imagens.length > 1) {
        carrosselWrapper.style.transform = 'translateX(0)';
        setInterval(trocarImagem, intervalo);
        window.addEventListener('resize', () => {
            carrosselWrapper.style.transform = `translateX(${-currentIndex * carrosselWrapper.parentNode.offsetWidth}px)`;
        });

    } else {
        console.log(`Carrossel '${wrapperId}' não iniciado: menos de 2 imagens para deslizar.`);
    }
}

function initAcademicCarousel() {
    const academicCarouselContainer = document.getElementById('academic-main-carousel');

    if (academicCarouselContainer) {
        const academicSlides = academicCarouselContainer.children;
        const indicatorsContainerFour = document.querySelector('.four-section-indicators');
        let currentIndexFour = 0;
        let autoSlideIntervalFour;
        const autoSlideDelayFour = 25000;

        function updateAcademicCarousel() {
            academicCarouselContainer.style.transform = `translateX(-${currentIndexFour * 100}%)`;
            updateAcademicIndicators();
        }

        function createAcademicIndicators() {
            if (indicatorsContainerFour) {
                indicatorsContainerFour.innerHTML = '';
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
                updateAcademicIndicators();
            }
        }

        function updateAcademicIndicators() {
            if (indicatorsContainerFour) {
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

        if (academicSlides.length > 0 && indicatorsContainerFour) {
            createAcademicIndicators();
            updateAcademicCarousel();
            startAutoSlideFour();
            window.addEventListener('resize', updateAcademicCarousel);
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    getProjetcs();
    initCarrossel({
        wrapperId: 'carrossel-wrapper',
        intervalo: 6000
    });

    initCarrossel({
        wrapperId: 'etec-inner-wrapper',
        intervalo: 8000
    });

    initCarrossel({
        wrapperId: 'unicep-inner-wrapper',
        intervalo: 8000
    });

    initCarrossel({
        wrapperId: 'senai-inner-wrapper',
        intervalo: 8000
    });

    initAcademicCarousel();
});