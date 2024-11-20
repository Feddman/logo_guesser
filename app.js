const logos = [
  { name: "apple", image: "apple.png" },
  { name: "starbucks", image: "starbucks.svg" },
  { name: "google", image: "google.svg" },
  { name: "x", image: "x.jpeg" },
  { name: "adidas", image: "adidas.png" },
  { name: "microsoft", image: "microsoft.svg" },
  { name: "toyota", image: "toyota.svg" },
  { name: "nike", image: "nike.jpeg" },
  { name: "android", image: "android.svg" },
  { name: "ferrari", image: "ferrari.jpeg" },
  { name: "mastercard", image: "mastercard.svg" },
  { name: "rabobank", image: "rabobank.svg" },
  { name: "netflix", image: "netflix.png" },
  { name: "tiktok", image: "tiktok.png" },
  { name: "spotify", image: "spotify.png" },
  { name: "pepsi", image: "pepsi.png" },
  { name: "xbox", image: "xbox.png" },
  { name: "chanel", image: "chanel.jpg" },
  { name: "lacoste", image: "lacoste.png" },
  { name: "amazon", image: "amazon.png" }
];

let currentLogoIndex = 0;
let score = 0;
let totalTime = 0; // Keeps track of total elapsed time
let timerStartTime = 0; // Tracks the time when the timer started
let timerRunning = false;
let answerChecked = false;
let timerInterval;

function startTimer() {
  if (timerRunning) return; // Prevent multiple intervals
  timerRunning = true;
  timerStartTime = Date.now() - totalTime * 1000; // Adjust start time based on total elapsed time
  timerInterval = setInterval(() => {
    totalTime = (Date.now() - timerStartTime) / 1000;
    document.getElementById("timer").innerText = `Totale tijd: ${totalTime.toFixed(1)}s`;
  }, 100);
}

function pauseTimer() {
  if (!timerRunning) return;
  clearInterval(timerInterval);
  timerRunning = false;
}

function loadLogo() {
  const logo = logos[currentLogoIndex];
  document.getElementById("logo-image").src = `images/${logo.image}`;
  document.getElementById("user-input").value = "";
  document.getElementById("feedback").innerText = "";
  document.getElementById("feedback").classList.remove("text-green-500", "text-red-500");
  document.getElementById("user-input").focus();
  answerChecked = false; // Reset the state for the new logo
}

function similarity(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;
  const maxLen = Math.max(len1, len2);

  if (maxLen === 0) return 1;

  let matches = 0;
  for (let i = 0; i < Math.min(len1, len2); i++) {
    if (str1[i] === str2[i]) matches++;
  }

  return matches / maxLen;
}

function checkAnswer() {
  const userInput = document.getElementById("user-input").value.toLowerCase().trim();
  const correctAnswer = logos[currentLogoIndex].name.toLowerCase();
  const feedback = document.getElementById("feedback");

  const isCorrect = similarity(userInput, correctAnswer) >= 0.5;

  if (isCorrect) {
    score++;
    feedback.innerText = "Correct!";
    feedback.classList.add("text-green-500");
    confetti();
  } else {
    feedback.innerText = `Incorrect! Het antwoord was: ${correctAnswer}`;
    feedback.classList.add("text-red-500");
  }

  document.getElementById("score").innerText = `Score: ${score}/20`;
  answerChecked = true; // Mark answer as checked
  pauseTimer(); // Pause the timer until the next question
  document.getElementById("user-input").focus();
}

function nextLogo() {
  if (!answerChecked) return; // Prevent skipping to the next logo without checking the answer
  currentLogoIndex++;
  if (currentLogoIndex < logos.length) {
    loadLogo();
    startTimer(); // Restart the timer when loading the next logo
    document.getElementById("user-input").focus();
  } else {
    endGame();
  }
}

function endGame() {
  pauseTimer(); // Stop the timer when the game ends

  let playerName;
  if (score === 20) {
    playerName = prompt("Perfect score! Voer je naam in voor de Hall of Fame:");
  } else {
    playerName = prompt("Spel voorbij! Voer je naam in voor de Hall of Fame:");
  }

  if (playerName) {
    saveToHallOfFame(playerName, score, totalTime);

    let hallOfFame = JSON.parse(localStorage.getItem("hallOfFame")) || [];
    hallOfFame.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return parseFloat(a.time) - parseFloat(b.time);
    });

    const playerIndex = hallOfFame.findIndex(entry => entry.name === playerName) + 1;

    displayHallOfFame();

    document.getElementById("game").innerHTML = `
      <div style="display: flex; flex-direction: column">
        <p id="final-rank" style="margin-bottom: 20px" class="text-center text-2xl font-bold">
          Game Over! Totale tijd: ${totalTime.toFixed(1)}s. Eindscore: ${score}/20<br>
        </p>
        <p>
          <a href="" class="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Terug naar begin</a>
        </p>
      </div>`;
  } else {
    displayHallOfFame();
  }
}

function saveToHallOfFame(name, score, time) {
  let hallOfFame = JSON.parse(localStorage.getItem("hallOfFame")) || [];
  hallOfFame.push({ name, score, time: time.toFixed(2), date: new Date().toLocaleDateString() });
  localStorage.setItem("hallOfFame", JSON.stringify(hallOfFame));
}

function displayHallOfFame() {
  const hallOfFame = JSON.parse(localStorage.getItem("hallOfFame")) || [];
  hallOfFame.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return parseFloat(a.time) - parseFloat(b.time);
  });

  const hallOfFameList = hallOfFame
    .map(entry => `<li>🏆 <b>${entry.name}</b> ${entry.score} - ${entry.time} seconds 🏆</li>`)
    .join("");

  document.getElementById("hall-of-fame").innerHTML = hallOfFameList
    ? `<h2 class="text-xl font-bold text-center mt-6">Hall of Fame</h2><ul class="text-center">${hallOfFameList}</ul>`
    : "<p class='text-center'>Nog geen entries in de Hall of Fame!</p>";
}

document.getElementById("user-input").addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    answerChecked ? nextLogo() : checkAnswer();
  }
});

document.getElementById("start-button").addEventListener("click", () => {
  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("logo-container").classList.remove("hidden");
  document.getElementById("user-input").classList.remove("hidden");
  document.getElementById("score").classList.remove("hidden");
  startTimer(); // Start the timer at the beginning of the game
  loadLogo();
  document.getElementById("user-input").focus();
});

displayHallOfFame();
