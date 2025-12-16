/* =========================
   LAB 11 — REAL-TIME VALIDATION (FIXED)
========================= */

function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function onlyLetters(str) {
  return /^[A-Za-zÀ-ž\s]+$/.test(str);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("extendedForm");
  if (!form) return;

  const name = document.getElementById("userName");
  const surname = document.getElementById("userSurname");
  const email = document.getElementById("userEmail");
  const phone = document.getElementById("userPhone");
  const address = document.getElementById("userAddress");

  const errName = document.getElementById("err-userName");
  const errSurname = document.getElementById("err-userSurname");
  const errEmail = document.getElementById("err-userEmail");
  const errPhone = document.getElementById("err-userPhone");
  const errAddress = document.getElementById("err-userAddress");

  const submitBtn = document.getElementById("submitBtn");

  function setError(input, errEl, msg) {
    input.classList.add("invalid");
    input.classList.remove("valid");
    errEl.textContent = msg;
  }

  function setValid(input, errEl) {
    input.classList.remove("invalid");
    input.classList.add("valid");
    errEl.textContent = "";
  }

  function validate() {
    let ok = true;

    if (!onlyLetters(name.value)) {
      setError(name, errName, "Only letters allowed");
      ok = false;
    } else setValid(name, errName);

    if (!onlyLetters(surname.value)) {
      setError(surname, errSurname, "Only letters allowed");
      ok = false;
    } else setValid(surname, errSurname);

    if (!isEmailValid(email.value)) {
      setError(email, errEmail, "Invalid email format");
      ok = false;
    } else setValid(email, errEmail);

    if (phone.value.length < 5) {
      setError(phone, errPhone, "Invalid phone");
      ok = false;
    } else setValid(phone, errPhone);

    if (address.value.length < 5) {
      setError(address, errAddress, "Address too short");
      ok = false;
    } else setValid(address, errAddress);

    submitBtn.disabled = !ok;
    return ok;
  }

  // 🔹 REAL-TIME VALIDATION
  [name, surname, email, phone, address].forEach(input => {
    input.addEventListener("input", validate);
  });

  // 🔹 SUBMIT HANDLER
  form.addEventListener("submit", e => {
    e.preventDefault();
    if (validate()) {
      alert("Form submitted successfully!");
    }
  });
});

/* ===== Lab 12: Memory Game ===== */

const symbols = ["🍎","🍌","🍇","🍓","🍒","🥝","🍍","🥥","🍑","🍋","🍉","🍊"];

const board = document.getElementById("gameBoard");
const movesEl = document.getElementById("moves");
const matchesEl = document.getElementById("matches");
const winMessage = document.getElementById("winMessage");
const difficultySelect = document.getElementById("difficulty");

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matches = 0;
let totalPairs = 0;
let timer = 0;
let timerInterval = null;


function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function setupBoard() { 
  board.innerHTML = "";
  winMessage.textContent = "";
  moves = 0;
  matches = 0;
  movesEl.textContent = 0;
  matchesEl.textContent = 0;
  firstCard = null;
  secondCard = null;
  lockBoard = false;

  let pairCount = difficultySelect.value === "easy" ? 6 : 12;
  totalPairs = pairCount;


  let cards = shuffle([
    ...symbols.slice(0, pairCount),
    ...symbols.slice(0, pairCount)
  ]);

  board.style.gridTemplateColumns =
    difficultySelect.value === "easy"
      ? "repeat(4, 1fr)"
      : "repeat(6, 1fr)";

  cards.forEach(symbol => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.symbol = symbol;
    card.textContent = "?";

    card.addEventListener("click", () => flipCard(card));
    board.appendChild(card);
  });
  startTimer(); // 👈 THIS IS STEP 2C

}

function flipCard(card) {
  if (lockBoard || card === firstCard || card.classList.contains("matched")) return;

  card.textContent = card.dataset.symbol;
  card.classList.add("open");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  moves++;
  movesEl.textContent = moves;

  checkMatch();
}

function checkMatch() {
  if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matches++;
    matchesEl.textContent = matches;
    resetTurn();

    if (matches === totalPairs) {
      winMessage.textContent = "You win!";
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.textContent = "?";
      secondCard.textContent = "?";
      firstCard.classList.remove("open");
      secondCard.classList.remove("open");
      resetTurn();
    }, 1000);
  }
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

document.getElementById("startGame").addEventListener("click", setupBoard);
document.getElementById("restartGame").addEventListener("click", setupBoard);
difficultySelect.addEventListener("change", setupBoard);



function startTimer() {
  clearInterval(timerInterval);
  timer = 0;
  document.getElementById("timer").textContent = timer;

  timerInterval = setInterval(() => {
    timer++;
    document.getElementById("timer").textContent = timer;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}
