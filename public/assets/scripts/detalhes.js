// @ts-check

const params = new URLSearchParams(location.search);
const id = params.get("id");

function setup404Page() {
    const div_info = document.getElementById("info");
    if (!div_info) return;

    div_info.innerHTML = `<div class="card mb-3">
        <div class="card-body">
            <div class="row">
                <div class="col d-flex justify-content-center align-items-start">
                    <img id="thumb" class="warning-icon" src="assets/img/icons/warning.svg" class="img-fluid">
                </div>
            </div>
            <div class="row mt-4">
                <div class="col d-flex flex-column justify-content-center align-items-center">
                    <h5>NÂO FOI POSSÍVEL IDENTIFICAR O FILME!</h5>
                    <p>
                        Possívelmente os dados para esta id não foram encontrados! Verifique se a id informada esta correta!
                    </p>
                </div>
            </div>
        </div>
    </div>
    <div>
        <div class="col d-flex justify-content-center align-items-center">
            <a class="btn btn-primary" href="/" role="button">Voltar à página inicial</a>
        </div>
    </div>`;
}

/**
 * @param {Object} filme
 */
function adicionarDetalhes(filme) {
    // TODO: Informar que não foi possível identificar o filme
    filme = filme[0];
    if (!filme) {
        setup404Page();
        return;
    }

    /** @type {HTMLImageElement | null} */
    // @ts-ignore
    const html_thumb = document.getElementById("thumb");
    /** @type {HTMLDivElement | null} */
    // @ts-ignore
    const html_thumb_background = document.getElementById("thumbBackground");

    const html_titulo = document.getElementById("titulo");
    const html_nota = document.getElementById("nota");
    const html_genero = document.getElementById("genero");
    const html_data_lancamento = document.getElementById("data_lancamento");
    const html_sinopse = document.getElementById("sinopse");

    const html_edit = document.getElementById("edit");

    if (
        !html_thumb ||
        !html_thumb_background ||
        !html_titulo ||
        !html_nota ||
        !html_genero ||
        !html_data_lancamento ||
        !html_sinopse ||
        !html_edit
    )
        return;

    html_edit.addEventListener("click", () => {
        if (!filme.id) return;
        
        // URL atual
        const url = new URL(window.location.href);
        // Parametros
        const params = new URLSearchParams(`edit=${filme.id}`);
        // Nova URL
        const newUrl = `${url.origin}/cadastro_filmes.html?${params.toString()}`;

        window.location.href = newUrl;
    });

    let banner = filme.banner || "banner_default.png";
    let banner_wide = filme.banner_wide || "banner_wide_default.png";

    if (!banner.startsWith("data:image/")) {
        banner = `assets/img/banner/${banner}`;
    }

    if (!banner_wide.startsWith("data:image/")) {
        banner_wide = `assets/img/banner/${banner_wide}`;
    }

    html_thumb.src = banner;
    html_thumb_background.style.backgroundImage = `url(${banner_wide})`;
    html_titulo.innerText = filme.nome;
    // * Pode gerar NaN
    html_nota.innerText = " ⭐".repeat(parseInt(filme.nota_geral)).trim();
    html_genero.innerText = filme.genero;
    html_data_lancamento.innerText = filme.data_lancamento;
    html_sinopse.innerText = filme.sinopse;

    // Se possui algum conteúdo, habilitar os extras
    const extraContent = filme.extra_content;

    if (Array.isArray(extraContent) && extraContent.length) {
        const extraContentLenght = extraContent.length;

        const html_extraContentHeader = document.getElementById("extraContentHeader");
        const html_extraContent = document.getElementById("extraContent");

        if (!html_extraContent || !html_extraContentHeader) return;

        html_extraContentHeader.classList.remove("d-none");
        html_extraContent.classList.remove("d-none");

        for (let i = 0; i < extraContentLenght; i++) {
            const extraContentI = extraContent[i];
            switch (extraContentI.type) {
                case "youtube":
                    html_extraContent.innerHTML += `<div class="col-12 col-sm-6 col-lg-4"><div class="card p-1">
                        <div class="card-body m-0 p-0 g-0 w-100 d-flex justify-content-center flex-row">
                            <iframe class="w-100 extra-youtube"
                                src="https://www.youtube-nocookie.com/embed/${extraContentI.data}?controls=0"
                                title="YouTube video player" frameborder="0"
                                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                        </div>
                    </div></div>`;
                    break;
                case "img":
                    html_extraContent.innerHTML += `<div class="col-12 col-sm-6 col-lg-4"><div class="card p-1">
                        <div class="card-body m-0 p-0 g-0 w-100 d-flex justify-content-center flex-row extra-img">
                            <img class="img-fluid object-fit-contain" src="assets/img/${extraContentI.data}">
                            <a class="btn btn-primary download-button" target="_blank"
                                download="" href="assets/img/${extraContentI.data}"
                                role="button">
                                <img class="download-icon" src="assets/img/icons/download.svg">
                            </a>
                        </div>
                    </div></div>`;
                    break;
            }
        }
    }
}

// TODO: Validar id anteriormente
// JSON com os dados dos filmes
fetch(`http://localhost:3000/filmes?id=${id}`)
    .then((res) => res.json())
    .then((data) => adicionarDetalhes(data))
    .catch((err) => console.error("Erro:", err));
