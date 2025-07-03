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

document.addEventListener('DOMContentLoaded', getProjetcs);