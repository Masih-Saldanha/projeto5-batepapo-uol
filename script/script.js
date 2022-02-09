// Nome do usuário definido
// const userName = prompt("Qual o seu nome?");
const userName = "Masih";
const name = {name: userName}; // OBJETOS
const names = [name];          // ARRAY DE OBJETOS

// COMUNICAÇÃO COM O SERVER:
const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
promise.then(processResponse);

function processResponse(response) {
    console.log(response.data);
}

function addUser() {
    console.log(processResponse);
}

// TIRA JANELA DE ESCOLHER CONTATO DA TELA
function removeHiddenWindow(window) {
    window.classList.add("hidden");
}
// COLOCA JANELA DE ESCOLHER CONTATO DA TELA
function showHiddenWindow() {
    const window = document.querySelector("aside");
    window.classList.remove("hidden");
}