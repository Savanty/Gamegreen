// script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBPCb84OTJTcW1WDrZ41RNmXddlGhDgeI0",
  authDomain: "gamewin-aa8b2.firebaseapp.com",
  databaseURL: "https://gamewin-aa8b2-default-rtdb.firebaseio.com",
  projectId: "gamewin-aa8b2",
  storageBucket: "gamewin-aa8b2.firebasestorage.app",
  messagingSenderId: "378162274661",
  appId: "1:378162274661:web:f5188bee8090f0d4a0818c"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const pagamentoRef = ref(db, 'pagamentos/12345'); // Nó do pagamento

// Elementos do DOM
const numerosContainer = document.getElementById("numeros");
const verificarBtn = document.getElementById("verificar");
const enviarBtn = document.getElementById("enviar");
const refreshBtn = document.getElementById("refreshBtn");
const contadorNumeros = document.getElementById("contadorNumeros");
const mensagem = document.getElementById("mensagem");

let selecionados = [];
const MAX_SELECIONADOS = 15;

// Cria 50 botões de números
for (let i = 1; i <= 50; i++) {
  const btn = document.createElement("button");
  btn.id = `num${i}`;
  btn.innerText = i;
  btn.classList.add("btn");
  btn.disabled = true; // inicialmente bloqueado
  btn.addEventListener("click", () => selecionarNumero(btn, i));
  numerosContainer.appendChild(btn);
}

// Função de seleção de número
function selecionarNumero(btn, numero) {
  if (selecionados.includes(numero)) {
    selecionados = selecionados.filter(n => n !== numero);
    btn.classList.remove("selected");
  } else {
    if (selecionados.length < MAX_SELECIONADOS) {
      selecionados.push(numero);
      btn.classList.add("selected");
    } else {
      mensagem.innerText = "Você já selecionou 15 números!";
    }
  }
  contadorNumeros.innerText = `Números selecionados: ${selecionados.length}/${MAX_SELECIONADOS}`;
}

// Verificação fictícia de resultado
function verificar() {
  const ganhadores = [3, 7, 12, 20, 25, 30, 33, 38, 44, 49]; // exemplo
  const acertados = selecionados.filter(n => ganhadores.includes(n));
  mensagem.innerText = `Você acertou ${acertados.length} números!`;
  if (acertados.length >= 5) {
    enviarBtn.style.display = "block";
  }
}

// Envio via WhatsApp
function enviarViaWhatsApp() {
  const numerosStr = selecionados.join(", ");
  const msg = `Meus números: ${numerosStr}\nQuero receber o prêmio!`;
  window.open(`https://wa.me/5571992290058?text=${encodeURIComponent(msg)}`, "_blank");
}

// Monitoramento do Firebase
onValue(pagamentoRef, (snapshot) => {
  const data = snapshot.val();
  const status = data?.status; // acessa status se for objeto
  if (status === "confirmado") {
    // Libera todos os botões
    for (let i = 1; i <= 50; i++) {
      document.getElementById(`num${i}`).disabled = false;
    }
    verificarBtn.disabled = false;
    refreshBtn.disabled = false;
    mensagem.innerText = "Pagamento confirmado! Você pode jogar agora.";
  } else {
    mensagem.innerText = "Aguardando confirmação do pagamento...";
  }
});

// Modal Pix
const modal = document.getElementById("alertModal");
const closeBtn = document.querySelector(".closeBtn");
refreshBtn.addEventListener("click", () => modal.style.display = "block");
closeBtn.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", (e) => { if (e.target == modal) modal.style.display = "none"; });

// Exponha funções globais se chamadas pelo HTML
window.verificar = verificar;
window.enviarViaWhatsApp = enviarViaWhatsApp;
