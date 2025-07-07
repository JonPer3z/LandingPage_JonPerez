function getProjetcs() {
    const urlGitHub = 'https://api.github.com/users/JonPer3z/repos';
    const loadingElement = document.getElementById('loading');
    const projectListElement = document.getElementById('my-projects-list');

    loadingElement.style.display = 'block';
    projectListElement.innerHTML = '';

    fetch(urlGitHub)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            loadingElement.style.display = 'none';

            if (data.length === 0) {
                projectListElement.innerHTML = '<p style="color: white;">Nenhum projeto público encontrado.</p>';
                return;
            }

            data.forEach(repo => {
                const link = document.createElement("a");
                link.href = repo.html_url;
                link.target = '_blank';
                link.title = repo.description || 'Sem descrição';
                link.textContent = repo.name;
                projectListElement.appendChild(link);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar os projetos:", error);
            loadingElement.style.display = 'block';
            loadingElement.textContent = "Erro ao carregar projetos. Tente novamente mais tarde.";
            loadingElement.style.color = 'red';
        });
}

function initCarrossel({ wrapperId, intervalo }) {
    const carrosselWrapper = document.getElementById(wrapperId);
    const imagens = carrosselWrapper.querySelectorAll('img');
    let currentIndex = 0;

    function trocarImagem() {
        currentIndex++;
        if (currentIndex >= imagens.length) {
            currentIndex = 0;
        }
        carrosselWrapper.style.transform = `translateX(${-currentIndex * 100}%)`;
    }

    if (imagens.length > 1) {
        carrosselWrapper.style.transform = 'translateX(0)';
        setInterval(trocarImagem, intervalo);
    } else {
        console.log(`Carrossel '${wrapperId}' não iniciado: menos de 2 imagens.`);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    getProjetcs();

    initCarrossel({
        wrapperId: 'carrossel-wrapper',
        intervalo: 10000
    });

    initCarrossel({
        wrapperId: 'carrossel-wrapper2',
        intervalo: 8000
    });

        initCarrossel({
        wrapperId: 'carrossel-wrapper3',
        intervalo: 8000
    });
        initCarrossel({
        wrapperId: 'carrossel-wrapper4',
        intervalo: 8000
    });
});
