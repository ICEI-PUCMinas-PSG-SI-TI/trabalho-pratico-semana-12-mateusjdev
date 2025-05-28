let params = new URLSearchParams(location.search);
let id = params.get("id");

function adicionarDetalhes(filme) {
    // TODO: Informar que não foi possível identificar o filme
    filme = filme[0];
    if (!filme) return;

    if (filme) {
        document.getElementById("thumb").src = `assets/img/banner/${filme.banner}`;
        document.getElementById("thumbBackground").style.backgroundImage =
            `url(assets/img/banner/${filme.banner_wide})`;
        document.getElementById("titulo").innerText = filme.nome;

        let nota = document.getElementById("nota");
        let nota_text = " ⭐".repeat(filme.nota_geral);
        nota.innerText = nota_text.trim();

        // Se possui algum conteúdo, habilitar os extras
        let extraContent = filme.extra_content;

        if (typeof extraContent !== "undefined" && extraContent) {
            // Função generica que cria a div onde o conteúdo vai ser inserido
            function appendInnerLayout(innerLayout) {
                return (
                    `<div class="col-12 col-sm-6 col-lg-4"><div class="card p-1">` +
                    innerLayout +
                    `</div></div>`
                );
            }

            let extraContentLenght = extraContent.length;

            document.getElementById("extraContentHeader").classList.remove("d-none");
            document.getElementById("extraContent").classList.remove("d-none");

            for (let i = 0; i < extraContentLenght; i++) {
                let extraContentI = extraContent[i];
                switch (extraContentI.type) {
                    case "youtube":
                        document.getElementById("extraContent").innerHTML += appendInnerLayout(
                            `<div class="card-body m-0 p-0 g-0 w-100 d-flex justify-content-center flex-row">
                                    <iframe class="w-100 extra-youtube"
                                        src="https://www.youtube-nocookie.com/embed/${extraContentI.data}?controls=0"
                                        title="YouTube video player" frameborder="0"
                                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                                </div>`,
                        );
                        break;
                    case "img":
                        document.getElementById("extraContent").innerHTML += appendInnerLayout(
                            `<div class="card-body m-0 p-0 g-0 w-100 d-flex justify-content-center flex-row extra-img">
                                    <img class="img-fluid object-fit-contain" src="assets/img/${extraContentI.data}">
                                    <a class="btn btn-primary download-button" target="_blank"
                                        download="" href="assets/img/${extraContentI.data}"
                                        role="button">
                                        <img class="download-icon" src="assets/img/icons/download.svg">
                                    </a>
                                </div>`,
                        );
                        break;
                }
            }
        }

        document.getElementById("genero").innerText = filme.genero;
        document.getElementById("data_lancamento").innerText = filme.data_lancamento;
        document.getElementById("sinopse").innerText = filme.sinopse;
    } else {
        document.getElementById("info").innerHTML = `<div class="card mb-3">
                <div class="card-body">
                    
                    <div class="row">
                        <div class="col d-flex justify-content-center align-items-start">
                            <img id="thumb" class="warning-icon" src="assets/img/icons/warning.svg" class="img-fluid">
                        </div>
                    </div>
                    <div class="row mt-4">
                        <div class="col d-flex flex-column justify-content-center align-items-center">
                            <h5>
                                NÂO FOI POSSÍVEL IDENTIFICAR O FILME!
                            </h5>
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
}

// TODO: Validar id anteriormente

// JSON com os dados dos filmes
// Pode ser acessado pelo objeto
fetch(`http://localhost:3000/filmes?id=${id}`)
    .then((res) => res.json())
    .then((data) => adicionarDetalhes(data))
    .catch((err) => console.error("Erro:", err));
