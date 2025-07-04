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

let currentProfileIndex = 0;

function carrosel() {
    const profileCarrosselWrapper = document.getElementById('carrossel-wrapper');
    const profileImages = document.querySelectorAll('#carrossel-wrapper img');

    const totalProfileImages = profileImages.length

    currentProfileIndex++; 
    if (currentProfileIndex >= totalProfileImages) {
        currentProfileIndex = 0;
    }

    profileCarrosselWrapper.style.transform = `translateX(${-currentProfileIndex * 100}%)`;
}

function setupCarrossel() {
    const profileImages = document.querySelectorAll('#carrossel-wrapper img');
    const profileCarrosselWrapper = document.getElementById('carrossel-wrapper');

    if (profileCarrosselWrapper) { 
        profileCarrosselWrapper.style.transform = 'translateX(0)';

        profileCarrosselWrapper.style.display = 'flex'; 
    }

    if (profileImages.length > 1) {
        
        setInterval(carrosel, 3000); 
    } else {
        console.log("Carrossel não iniciado: menos de 2 imagens de perfil.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    getProjetcs(); 
    setupCarrossel();
});