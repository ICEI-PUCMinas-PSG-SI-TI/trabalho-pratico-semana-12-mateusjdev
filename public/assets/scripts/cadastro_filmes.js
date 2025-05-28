// @ts-check

(() => {
    /** @type {HTMLButtonElement | null } */
    // @ts-ignore HTMLElement casted as HTMLButtonElement
    let cadastrar = document.getElementById("cadastrar");
    /** @type {HTMLFormElement | null } */
    // @ts-ignore HTMLElement casted as HTMLFormElement
    let form_cadastro_filme = document.getElementById("form_cadastro_filme");

    if (!cadastrar || !form_cadastro_filme) {
        console.log("Não foi possível encontrar o botão de cadastro ou a form!");
        return;
    }

    cadastrar.addEventListener("click", (event) => {
        /** @type {HTMLInputElement | null } */
        // @ts-ignore HTMLElement casted as HTMLInputElement
        let input_nome = document.getElementById("input_nome");
        /** @type {HTMLInputElement | null } */
        // @ts-ignore HTMLElement casted as HTMLInputElement
        let input_data_lancamento = document.getElementById("input_data_lancamento");
        /** @type {HTMLInputElement | null } */
        // @ts-ignore HTMLElement casted as HTMLInputElement
        let input_sinopse_breve = document.getElementById("input_sinopse_breve");
        /** @type {HTMLInputElement | null } */
        // @ts-ignore HTMLElement casted as HTMLInputElement
        let input_sinopse = document.getElementById("input_sinopse");
        /** @type {HTMLInputElement | null } */
        // @ts-ignore HTMLElement casted as HTMLInputElement
        let input_genero = document.getElementById("input_genero");
        /** @type {HTMLInputElement | null } */
        // @ts-ignore HTMLElement casted as HTMLInputElement
        let input_nota = document.getElementById("input_nota");

        if (
            !input_nome ||
            !input_data_lancamento ||
            !input_sinopse_breve ||
            !input_sinopse ||
            !input_genero ||
            !input_nota
        ) {
            console.log("Couldn't find one of the input fields!");
            return;
        }

        let input_nome_value = input_nome.value;
        let input_data_lancamento_value = input_data_lancamento.value;
        let input_sinopse_breve_value = input_sinopse_breve.value;
        let input_sinopse_value = input_sinopse.value;
        let input_genero_value = input_genero.value;
        let input_nota_value = input_nota.value;

        // TODO: Validar se valores são validos (tamanho, número, ...)
        if (
            !input_nome_value ||
            !input_data_lancamento_value ||
            !input_sinopse_breve_value ||
            !input_sinopse_value ||
            !input_genero_value ||
            !input_nota_value
        ) {
            console.log("One of the inputs is empty!");
            return;
        }

        // Monta um Objeto json para enviar ao servidor
        let json_content = {
            nome: input_nome_value,
            nota_geral: input_nota_value,
            genero: input_genero_value,
            data_lancamento: input_data_lancamento_value,
            sinopse: input_sinopse_value,
            sinopse_breve: input_sinopse_breve_value,
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

        // Evita o reload da página após o cadastro dos dados
        event.preventDefault();
    });
})();
