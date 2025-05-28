// @ts-check

/**
 * @param {Blob} file
 *
 * @returns {Promise<string | ArrayBuffer | null>}
 */
async function fileToBase64(file) {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function clearURI() {
    // TODO: Clear URI
}

/**
 * @param {number} id
 */
async function getFilme(id) {
    if (typeof id !== "number") {
        return;
    }

    // JSON com os dados do filme
    return await fetch(`http://localhost:3000/filmes/${id}`)
        .then((res) => res.json())
        .catch((err) => console.error("Erro:", err));
}

/**
 * @param {number} [edit]
 */
function setupCadastro(edit) {
    /** @type {HTMLInputElement | null } */
    // @ts-ignore HTMLElement casted as HTMLInputElement
    const input_nome = document.getElementById("input_nome");
    /** @type {HTMLInputElement | null } */
    // @ts-ignore HTMLElement casted as HTMLInputElement
    const input_data_lancamento = document.getElementById("input_data_lancamento");
    /** @type {HTMLInputElement | null } */
    // @ts-ignore HTMLElement casted as HTMLInputElement
    const input_sinopse_breve = document.getElementById("input_sinopse_breve");
    /** @type {HTMLInputElement | null } */
    // @ts-ignore HTMLElement casted as HTMLInputElement
    const input_sinopse = document.getElementById("input_sinopse");
    /** @type {HTMLInputElement | null } */
    // @ts-ignore HTMLElement casted as HTMLInputElement
    const input_genero = document.getElementById("input_genero");
    /** @type {HTMLInputElement | null } */
    // @ts-ignore HTMLElement casted as HTMLInputElement
    const input_nota = document.getElementById("input_nota");
    /** @type {HTMLInputElement | null } */
    // @ts-ignore HTMLElement casted as HTMLInputElement
    const input_banner = document.getElementById("input_banner");
    /** @type {HTMLInputElement | null } */
    // @ts-ignore HTMLElement casted as HTMLInputElement
    const input_banner_wide = document.getElementById("input_banner_wide");
    /** @type {SVGElement | null } */
    // @ts-ignore HTMLElement casted as HTMLInputElement
    const banner_svg = document.getElementById("thumb_svg");
    /** @type {HTMLImageElement | null } */
    // @ts-ignore HTMLElement casted as HTMLInputElement
    const banner_src = document.getElementById("thumb");
    /** @type {HTMLDivElement | null } */
    // @ts-ignore HTMLElement casted as HTMLInputElement
    const banner_wide_src = document.getElementById("thumbBackground");

    if (
        !input_nome ||
        !input_data_lancamento ||
        !input_sinopse_breve ||
        !input_sinopse ||
        !input_genero ||
        !input_nota ||
        !input_banner ||
        !input_banner_wide
    ) {
        console.log("Couldn't find one of the input fields!");
        return;
    }

    input_banner?.addEventListener("change", async (event) => {
        event.preventDefault();

        if (!input_banner.files || !input_banner.files[0]) {
            alert("Seleciona um arquivo de imagem para o poster!");
            return;
        }
        const input_banner_file = input_banner.files[0];

        if (!input_banner_file) {
            alert("Uma das entradas não é valida!");
            return;
        }

        const banner = await fileToBase64(input_banner_file);

        if (
            !banner ||
            (typeof banner === "string" && !banner.startsWith("data:image/")) ||
            banner instanceof ArrayBuffer
        ) {
            alert("O poster não é um arquivo de imagem!");
            return null;
        }

        if (banner_src) banner_src.src = banner;
        banner_svg?.classList.add("d-none");
    });

    input_banner_wide?.addEventListener("change", async (event) => {
        event.preventDefault();

        if (!input_banner_wide.files || !input_banner_wide.files[0]) {
            alert("Seleciona um arquivo de imagem para o poster de fundo.");
            return;
        }
        const input_banner_wide_file = input_banner_wide.files[0];

        if (!input_banner_wide_file) {
            alert("Uma das entradas não é valida!");
            return;
        }

        const banner_wide = await fileToBase64(input_banner_wide_file);

        if (
            !banner_wide ||
            (typeof banner_wide === "string" && !banner_wide.startsWith("data:image/")) ||
            banner_wide instanceof ArrayBuffer
        ) {
            alert("O poster não é um arquivo de imagem!");
            return null;
        }

        if (banner_wide_src) banner_wide_src.style.backgroundImage = `url(${banner_wide})`;
    });

    // prefillFields()
    if (typeof edit === "number") {
        getFilme(edit).then((filme) => {
            if (!filme) return;

            input_nome.value = filme.nome;
            input_data_lancamento.value = filme.data_lancamento;
            input_sinopse_breve.value = filme.sinopse_breve;
            input_sinopse.value = filme.sinopse;
            input_genero.value = filme.genero;
            input_nota.value = filme.nota_geral;

            let img_banner = filme.banner;
            let img_banner_wide = filme.banner_wide;

            if (!img_banner.startsWith("data:image/")) {
                img_banner = `assets/img/banner/${img_banner}`;
            }

            if (!img_banner_wide.startsWith("data:image/")) {
                img_banner_wide = `assets/img/banner/${img_banner_wide}`;
            }

            if (banner_src) banner_src.src = img_banner;
            if (banner_wide_src) banner_wide_src.style.backgroundImage = `url(${img_banner_wide})`;

            banner_svg?.classList.add("d-none");
        });
    }

    /** @type {HTMLButtonElement | null } */
    // @ts-ignore HTMLElement casted as HTMLButtonElement
    const cadastrar = document.getElementById("cadastrar");
    /** @type {HTMLFormElement | null } */
    // @ts-ignore HTMLElement casted as HTMLFormElement
    const form_cadastro_filme = document.getElementById("form_cadastro_filme");

    if (!cadastrar || !form_cadastro_filme) {
        console.log("Não foi possível encontrar o botão de cadastro ou a form!");
        return;
    }

    // Reseta a form no carregamento da página/reload
    form_cadastro_filme.reset()

    // Limpa imagens ao resetar form
    form_cadastro_filme.addEventListener("reset", () => {
        if (banner_src) banner_src.src = "";
        if (banner_wide_src) banner_wide_src.style.backgroundImage = "";

        banner_svg?.classList.remove("d-none");
    });

    cadastrar.addEventListener("click", async (event) => {
        // Evita o reload da página após o cadastro dos dados
        event.preventDefault();

        const input_nome_value = input_nome.value;
        const input_data_lancamento_value = input_data_lancamento.value;
        const input_sinopse_breve_value = input_sinopse_breve.value;
        const input_sinopse_value = input_sinopse.value;
        const input_genero_value = input_genero.value;
        const input_nota_value = input_nota.value;

        if (!input_banner.files || !input_banner.files[0]) {
            alert("Seleciona um arquivo de imagem para o poster!");
            return;
        }
        const input_banner_file = input_banner.files[0];

        if (!input_banner_wide.files || !input_banner_wide.files[0]) {
            alert("Seleciona um arquivo de imagem para o poster de fundo!");
            return;
        }
        const input_banner_wide_file = input_banner_wide.files[0];

        // TODO: Validar se valores são validos (tamanho, número, ...)
        if (
            !input_nome_value ||
            !input_data_lancamento_value ||
            !input_sinopse_breve_value ||
            !input_sinopse_value ||
            !input_genero_value ||
            !input_nota_value ||
            !input_banner_file ||
            !input_banner_wide_file
        ) {
            alert("Uma das entradas não é valida!");
            return;
        }

        const banner = await fileToBase64(input_banner_file);
        const banner_wide = await fileToBase64(input_banner_wide_file);

        if (
            !banner ||
            (typeof banner === "string" && !banner.startsWith("data:image/")) ||
            banner instanceof ArrayBuffer
        ) {
            alert("O poster não é um arquivo de imagem!");
            return null;
        }

        if (
            !banner_wide ||
            (typeof banner_wide === "string" && !banner_wide.startsWith("data:image/")) ||
            banner_wide instanceof ArrayBuffer
        ) {
            alert("O poster de fundo não é um arquivo de imagem!");
            return null;
        }

        // Monta um Objeto json para enviar ao servidor
        const json_content = {
            nome: input_nome_value,
            nota_geral: input_nota_value,
            genero: input_genero_value,
            data_lancamento: input_data_lancamento_value,
            sinopse: input_sinopse_value,
            sinopse_breve: input_sinopse_breve_value,
            banner: banner,
            banner_wide: banner_wide,
        };

        if (typeof edit === "number") {
            fetch(`http://localhost:3000/filmes/${edit}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(json_content),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (!data.id) {
                        alert("O filme/série foi atualizado com sucesso!");
                    } else {
                        alert(`O filme/série foi atualizado com sucesso!\nid: ${data.id}`);
                    }
                    form_cadastro_filme.reset();
                })
                .catch((error) => {
                    alert("Ocorreu um erro ao atualizar o filme/série!");
                    console.log(error);
                });
        } else {
            fetch("http://localhost:3000/filmes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(json_content),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (!data.id) {
                        alert("O filme/série foi cadastrado com sucesso!");
                    } else {
                        alert(`O filme/série foi cadastrado com sucesso!\nid: ${data.id}`);
                    }
                    form_cadastro_filme.reset();
                    clearURI();
                })
                .catch((error) => {
                    alert("Ocorreu um erro ao cadastro o filme/série!");
                    console.log(error);
                });
        }
    });

    if (edit) {
        /** @type {HTMLButtonElement | null } */
        // @ts-ignore HTMLElement casted as HTMLButtonElement
        const excluir = document.getElementById("excluir");

        if (!excluir) {
            console.log("Não foi possível encontrar o botão de excluir!");
            return;
        }

        // Habilita o botão de excluir
        excluir.classList.remove("d-none");

        excluir.addEventListener("click", async (event) => {
            // Evita o reload da página após o cadastro dos dados
            event.preventDefault();

            fetch(`http://localhost:3000/filmes/${edit}`, { method: "DELETE" })
                .then((response) => response.json())
                .then((data) => {
                    if (!data.id) {
                        alert("O filme/série foi excluido com sucesso!");
                    } else {
                        alert(`O filme/série foi excluido com sucesso!\nid: ${edit}`);
                    }
                    form_cadastro_filme.reset();
                    clearURI();
                })
                .catch((error) => {
                    alert("Ocorreu um erro ao excluir o filme/série!");
                    console.log(error);
                });
        });
    }
}

(() => {
    const params = new URLSearchParams(location.search);
    const edit = params.get("edit");
    if (edit) {
        const edit_int = parseInt(edit);
        if (typeof edit_int === "number") {
            setupCadastro(edit_int);
            return;
        }
    }

    clearURI();
    setupCadastro();
})();
