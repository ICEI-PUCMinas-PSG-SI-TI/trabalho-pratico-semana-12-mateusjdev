// @ts-check

/**
  * JavasScript da página index.html
  */

/**
 * Seleciona uma quantidade solicitada de ids do array de filmes aleatoriamente
 * @param {Array} filmes
 * @param {number} quantidade
 * @returns {Array}
 */
function getRandomMoviesId(filmes, quantidade) {
    if (!filmes || filmes.length === 0 || quantidade <= 0) {
        return [];
    }

    let idFilmes = [];
    const quantidadeMax = Math.min(quantidade, filmes.length);

    while (idFilmes.length < quantidadeMax) {
        const num = Math.floor(Math.random() * filmes.length);
        if (!idFilmes.includes(num)) idFilmes.push(num);
    }

    return idFilmes;
}

/**
 * @param {string} src
 * @returns {string}
 */
function assertRelativeURI(src) {
    return `assets/img/banner/${src}`;
}

/**
 * @param {Array} filmes
 */
function adicionarConteudo(filmes) {
    const carousel = document.getElementById("carousel");

    if (carousel) {
        const arrIdFilmesAleatorios = getRandomMoviesId(filmes, 5);

        // Adiciona cards ao menu de "Itens em destaque"
        for (let i = 0; i < arrIdFilmesAleatorios.length; i++) {
            const id = arrIdFilmesAleatorios[i];
            const infoFilme = filmes[id];
            let carouselClass = "carousel-item";
            if (i === 0) {
                // Configura o 1º card (index: 0) como ativo
                carouselClass += " active";
            }

            let banner_wide = infoFilme.banner_wide || "banner_wide_default.png";
            // Se não é base64, insere o caminho relativo "assets/img/banner/"
            if (!banner_wide.startsWith("data:image/")) {
                banner_wide = assertRelativeURI(banner_wide);
            }

            carousel.innerHTML += `<div class="${carouselClass}">
                <a class="text-decoration-none" href="/detalhes.html?id=${infoFilme.id}">
                    <img src="${banner_wide}" class="d-block w-100">
                    <div class="carousel-caption black-text-white-background p-1 p-md-3">
                        <h5 class="m-0 p-0">${infoFilme.nome}</h5>
                        <p class="d-none d-md-block mt-1 m-0 p-0">${infoFilme.sinopse_breve || "..."}</p>
                    </div>
                </a>
            </div>`;
        }
    }

    const card_filmes = document.getElementById("cards-filmes");
    if (card_filmes) {
        // Adiciona cards ao menu de "Todos os itens"
        for (let i = 0; i < filmes.length; i++) {
            const infoFilme = filmes[i];
            /** @type {string} */
            let banner_wide = infoFilme.banner_wide || "banner_wide_default.png";
            // Se não é base64, insere o caminho relativo "assets/img/banner/"
            if (!banner_wide.startsWith("data:image/")) {
                banner_wide = assertRelativeURI(banner_wide);
            }
            card_filmes.innerHTML += `<div class="col">
                    <a class="card h-100 text-decoration-none" href="/detalhes.html?id=${infoFilme.id}">
                        <img src="${banner_wide}" class="card-img-top movie-cover">
                        <div class="card-body">
                            <h5 class="card-title">${infoFilme.nome}</h5>
                            <p class="card-text">${infoFilme.sinopse_breve || "..."}</p>
                        </div>
                    </a>
                </div>`;
        }
    }
}

// JSON com os dados dos filmes
fetch("http://localhost:3000/filmes")
    .then((res) => res.json())
    .then((data) => adicionarConteudo(data))
    .catch((err) => console.error("Erro:", err));
