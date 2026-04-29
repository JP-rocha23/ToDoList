function carregarTarefas() {
    const tarefa = document.getElementById("task-input");

    if(tarefa.value.trim() === "") {
        alert("Por favor, insira uma tarefa.");
        return;
    }
    else{

        const novaTarefa = {
            descricao: tarefa.value,
            concluido: false,
            prioridade: "Alta"
        };

        const tarefaJSON = JSON.stringify(novaTarefa); //Transformando o objeto em JSON

        const lista = document.getElementById("task-list");
        const item = document.createElement("li");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        const textoTarefa = document.createElement("span");
        
        const botaoDeletar = document.createElement("button");
        botaoDeletar.textContent = "🗑️";
        botaoDeletar.className = "botao-deletar";

        botaoDeletar.onclick = function() {
            lista.removeChild(item); 
        };

        textoTarefa.textContent = tarefa.value;

        item.appendChild(checkbox);
        item.appendChild(textoTarefa);
        item.appendChild(botaoDeletar);
        lista.appendChild(item);
        tarefa.value = "";
    }
}
