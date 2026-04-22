function carregarTarefas() {
    const tarefa = document.getElementById("task-input");

    if(tarefa.value.trim() === "") {
        alert("Por favor, insira uma tarefa.");
        return;
    }
    else{
        const lista = document.getElementById("task-list");
        const item = document.createElement("li");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        const textoTarefa = document.createElement("span");
        textoTarefa.textContent = tarefa.value;

        item.appendChild(checkbox);
        item.appendChild(textoTarefa);
        lista.appendChild(item);
        tarefa.value = "";
    }
}

const formulario = document.getElementById("input-section");

window.addEventListener("load", function() { // Garantir que o DOM esteja completamente carregado antes de adicionar o event listener
    const formulario = document.getElementById("input-section");
    
    if (formulario) {
        formulario.addEventListener("submit", function(event) {
            event.preventDefault(); 
            carregarTarefas();
        });
    }
});