function renderizarTarefaNaTela(tarefaObj) {
    const lista = document.getElementById("task-list");
    const item = document.createElement("li");
    item.setAttribute("data-id", tarefaObj.id);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = tarefaObj.concluido; // Usa o status que veio do banco

    const textoTarefa = document.createElement("span");
    textoTarefa.textContent = tarefaObj.descricao;

    const botaoDeletar = document.createElement("button");
    botaoDeletar.textContent = "🗑️";
    botaoDeletar.className = "botao-deletar";
    
    botaoDeletar.onclick = function() {
        // Aqui depois faremos o fetch(DELETE)
        lista.removeChild(item);
    };

    item.appendChild(checkbox);
    item.appendChild(textoTarefa);
    item.appendChild(botaoDeletar);
    lista.appendChild(item);
}

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
        method: 'POST', // Definindo o método HTTP como POST para criar uma nova tarefa -> REST ful API
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novaTarefa)
    })
    .then(response => response.json())
    .then(dadosretornados => {
        console.log("Id vindo do banco: " + dadosretornados.id);

        renderizarTarefaNaTela(dadosretornados);
        tarefa.value = ""; 
    })
    .catch(erro => {
        console.error("Erro na comunicação com o servidor:", erro);
        alert("Erro ao salvar no banco de dados.");
    });
}

window.onload = function() { //Recarrega as tarefas do banco toda vez que a página for carregada
    fetch('http://127.0.0.1:5000/tarefas')
        .then(response => response.json())
        .then(tarefas => {
            tarefas.forEach(t => {
                renderizarTarefaNaTela(t); 
            });
        });
};