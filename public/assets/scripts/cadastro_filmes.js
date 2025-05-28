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

(() => {
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

    cadastrar.addEventListener("click", async () => {
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
            console.log("One of the inputs is empty!");
            return;
        }

        const banner = await fileToBase64(input_banner_file);
        const banner_wide = await fileToBase64(input_banner_wide_file);

        if (
            !banner ||
            (typeof banner === "string" && !banner.startsWith("data:image/")) ||
            Array.isArray(banner)
        ) {
            alert("O poster não é um arquivo de imagem!");
            return null;
        }

        if (
            !banner_wide ||
            (typeof banner_wide === "string" && !banner_wide.startsWith("data:image/")) ||
            Array.isArray(banner_wide)
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
            })
            .catch((error) => {
                alert("Ocorreu um erro ao cadastro o filme/série!");
                console.log(error);
            });
    });
})();
