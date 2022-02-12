// VARIÁVEIS INNERHTML
let mainHTML = document.querySelector("main"); // VARIÁVEL PARA PREENCHER TELA COM MENSAGENS
const autoScroll = document.querySelector(".auto-scroll"); // VARIÁVEL PARA AUTO-SCROLLAR A TELA
let userSelectedHTML = document.querySelector(".user-selected");
let privacySelectedHTML = document.querySelector(".privacy-selected");
let sendMensageTo = "Todos";
let typeOfMensage = "message";

// Nome do usuário definido e enviado à API no início
let userName = prompt("Qual o seu nome?");
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
setInterval(refreshMensages, 3000); // RECARREGA MENSAGENS

// FUNÇÃO DE RECARREGAR MENSAGENS NA TELA
function refreshMensages() {
        // mainHTML.innerHTML = "";
        promiseGet = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
        promiseGet.then(getMensages);
}

// FUNÇÃO PARA PRINTAR MENSAGENS NA TELA
function getMensages(mensages) {
    const mensagesData = mensages.data;
    // console.log(mensagesData);
    mainHTML.innerHTML = "";
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
    autoScroll.scrollIntoView(false);
}

// MANTER CONEXÃO DO USUÁRIO COM API
let promisePostStatus = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", objectName);
setInterval(userStatusUpload, 5000);

function userStatusUpload() {
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
    // console.log("Usuário tá off!");
}
// ENVIO DE MENSAGENS PARA A API
function sendMensage() {
    let mensage = document.querySelector(".comment").value;
    let mensageObject = {
        from: userName,
        to: sendMensageTo,
        text: mensage,
        type: typeOfMensage // "message" ou "private_message" para o bônus
    }
    let promisePostMensage = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", mensageObject);

    promisePostMensage.then(mensageSended);
    promisePostMensage.catch(mensageNotSended);
    document.querySelector(".comment").value = "";
}

function mensageSended(code) { // SUCESSO
    const statusCode = code.status;
    console.log(statusCode);
    console.log("Mensagem enviada");
}

function mensageNotSended(error) { // FALHA
    const errorCode = error.response.status;
    console.log(errorCode);
    console.log("Mensagem não enviada");
}

// TIRA JANELA DE ESCOLHER CONTATO DA TELA
function removeHiddenWindow() {
    const window = document.querySelector("aside");
    window.classList.add("hidden");
}

// COLOCA JANELA DE ESCOLHER CONTATO DA TELA
function showHiddenWindow() {
    const window = document.querySelector("aside");
    window.classList.remove("hidden");
}

// EXTRAS

// RENDERIZAR LISTA DE PARTICPANTES DO CHAT
let promiseGetParticipant = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
promiseGetParticipant.then(getParticipants); // RENDERIZA NA HORA
setInterval(refreshParticipants, 10000); // ATUALIZA A CADA 10 SEGUNDOS A LISTA

function getParticipants(participant) {
    const participantsList = participant.data;
    // console.log(participantsList);
    const div = document.querySelector(".participants-list");
    div.innerHTML = "";
    for (i = 0; i < participantsList.length; i++) {
        if (participantsList[i].name === sendMensageTo) {
            div.innerHTML += `
            <article onclick="selectUser(this)" data-identifier="participant">
                <div>
                    <ion-icon name="person-circle"></ion-icon>
                    <span class="user">${participantsList[i].name}</span>
                </div>
                <ion-icon class="check-user" data-identifier="visibility" name="checkmark"></ion-icon>
            </article>
            `;
        } else {
            div.innerHTML += `
            <article onclick="selectUser(this)" data-identifier="participant">
            <div>
            <ion-icon name="person-circle"></ion-icon>
            <span class="user">${participantsList[i].name}</span>
            </div>
            <ion-icon class="check-user not-selected" data-identifier="visibility" name="checkmark"></ion-icon>
            </article>
            `;
        }
    }
}

function refreshParticipants() {
    const div = document.querySelector(".participants-list");
    // div.innerHTML = "";
    promiseGetParticipant = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
    promiseGetParticipant.then(getParticipants);
}

// SELECIONADOR DE USUARIO PARA ENVIAR MENSAGEM
function selectUser(user) {
    let userInnertext = user.children[0].children[1].innerText;
    console.log(userInnertext);
    sendMensageTo = userInnertext;
    userSelectedHTML.innerHTML = `${sendMensageTo} `

    let unCheckAll = document.querySelectorAll(".check-user");
    for (i = 0; i < unCheckAll.length; i++) {
        unCheckAll[i].classList.add("not-selected");
    }

    let check = user.children[1];
    check.classList.remove("not-selected");
}

// SELECIONADOR DE PRIVACIDADE
function selectPrivacy(type) {
    let privacyInnertext = type.children[0].children[1].innerText;
    // console.log(privacyInnertext);
    if (privacyInnertext === "Público") {
        typeOfMensage = "message";
    } else {
        typeOfMensage = "private_message";
    }
    privacySelectedHTML.innerHTML = `(${privacyInnertext})`;

    let unCheckAll = document.querySelectorAll(".check-privacy");
    for (i = 0; i < unCheckAll.length; i++) {
        unCheckAll[i].classList.add("not-selected");
    }

    let check = type.children[1];
    check.classList.remove("not-selected");
}

// MANDAR MENSAGEM COM ENTER
let commentEnter = document.querySelector(".comment");
commentEnter.addEventListener("keyup", function(event) { // entendi o princípio e o que ocorre, mas falta entender function(event) melhor
  if (event.keyCode === 13) {
    document.querySelector("footer ion-icon").click()
  }
})