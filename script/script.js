// VARIÁVEIS INNERHTML
let mainHTML = document.querySelector("main"); // VARIÁVEL PARA PREENCHER TELA COM MENSAGENS
let mainHTMLcomparator = document.querySelector("main").innerHTML;
const autoScroll = document.querySelector(".auto-scroll"); // VARIÁVEL PARA AUTO-SCROLLAR A TELA

// Nome do usuário definido e enviado à API no início
// const userName = prompt("Qual o seu nome?");
let userName = "Masih";
let objectName = {name: userName}; // OBJETO COM NOME FORNECIDO PELO USUÁRIO
let promisePost = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", objectName);
uploadUser();

// FUNÇÃO QUE PEGA NOME FORNECIDO E ENVIA À API
function uploadUser() {
    objectName = {name: userName};
    promisePost = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", objectName);
    promisePost.then(addUser);
    promisePost.catch(addUserFailed);
}

// COMUNICAÇÃO COM O SERVER (ADIÇÃO DO USUÁRIO À API):
function addUser(code) { // SUCESSO
    const statusCode = code.status;
    // console.log(statusCode);
    // uploadUser();
}

function addUserFailed(error) { // FALHA
    const errorCode = error.response.status;
    // console.log(errorCode);
    userName = prompt("Nome já em uso, escolha outro: ");
    uploadUser();
}

// COMUNICAÇÃO COM O SERVER (CARREGANDO MENSAGENS DA API):
let promiseGet = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
promiseGet.then(getMensages); // PRINTA MENSAGENS NA HORA
setInterval(refreshMensages, 3000) // RECARREGA MENSAGENS

// FUNÇÃO DE RECARREGAR MENSAGENS NA TELA
function refreshMensages() {
    // if (mainHTML !== mainHTMLcomparator) {
        mainHTML.innerHTML = "";
        promiseGet = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
        promiseGet.then(getMensages);
        // mainHTMLcomparator = mainHTML;
    // }
}

// FUNÇÃO PARA PRINTAR MENSAGENS NA TELA
function getMensages(mensages) {
    const mensagesData = mensages.data;
    // console.log(mensagesData);
    for (i = 0; i < mensagesData.length; i++) {
        if (mensagesData[i].type === "status") {
            mainHTML.innerHTML += `
            <div class="notification" data-identifier="message">
            <p><time>${mensagesData[i].time} </time><span class="user">${mensagesData[i].from} </span>${mensagesData[i].text}</p>
            </div>
            `;
        }
        else if (mensagesData[i].type === "private_message" && mensagesData[i].to === userName) {
            mainHTML.innerHTML += `
            <div class="to-someone" data-identifier="message">
            <p><time>${mensagesData[i].time} </time><span class="user">${mensagesData[i].from} </span>reservadamente para <span class="user">${mensagesData[i].to} </span>${mensagesData[i].text}</p>
            </div>
            `;
        }
        else if (mensagesData[i].type === "message") {
            mainHTML.innerHTML += `
            <div class="to-everyone" data-identifier="message">
            <p><time>${mensagesData[i].time} </time><span class="user">${mensagesData[i].from} </span>para <span class="user">${mensagesData[i].to} </span>${mensagesData[i].text}</p>
            </div>
            `;
        }
    }
    // console.log(mainHTML.innerHTML);
    // console.log(mainHTMLcomparator);
    autoScroll.scrollIntoView(false);
}

// MANTER CONEXÃO DO USUÁRIO COM API
let promisePostStatus = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", objectName);
setInterval(userStatusUpload, 5000);

function userStatusUpload() {
    // objectName = {name: userName};
    promisePostStatus = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", objectName);
    promisePost.then(userStatusOn);
    promisePost.catch(userStatusOff);
}

function userStatusOn(code) { // SUCESSO
    const statusCode = code.status;
    console.log(statusCode);
    // console.log("Usuário tá on!");
}

function userStatusOff(error) { // FALHA
    const errorCode = error.response.status;
    console.log(errorCode);
    console.log("Usuário tá off!");
    // userName = prompt("Nome já em uso, escolha outro: ");
    // userStatusOn();
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