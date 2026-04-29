function carregarTarefas() {
    const tarefa = document.getElementById("task-input");

    if (tarefa.value.trim() === "") {
        alert("Por favor, insira uma tarefa.");
        return;
    }

    const novaTarefa = {
        descricao: tarefa.value,
        concluido: false,
        prioridade: "Alta"
    };

    fetch('http://127.0.0.1:5000/tarefas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novaTarefa)
    })
    .then(response => response.json())
    .then(dadosretornados => { // TUDO QUE DEPENDE DO BANCO FICA AQUI DENTRO!
        console.log("Id vindo do banco: " + dadosretornados.id);

        const lista = document.getElementById("task-list");
        const item = document.createElement("li");
        
        item.setAttribute("data-id", dadosretornados.id);  //Guardando o id do banco como atributo do item para futuras operações (ex: delete)

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        const textoTarefa = document.createElement("span");
        textoTarefa.textContent = novaTarefa.descricao; // Usando a descrição do objeto

        const botaoDeletar = document.createElement("button");
        botaoDeletar.textContent = "🗑️";
        botaoDeletar.className = "botao-deletar";

        botaoDeletar.onclick = function() {
            // No futuro, aqui chamaremos o fetch de DELETE usando o data-id
            lista.removeChild(item); 
        };

        item.appendChild(checkbox);
        item.appendChild(textoTarefa);
        item.appendChild(botaoDeletar);
        lista.appendChild(item);

        tarefa.value = "";
    })
    .catch(erro => {
        console.error("Erro na comunicação com o servidor:", erro);
        alert("Erro ao salvar no banco de dados.");
    });
}