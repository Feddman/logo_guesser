// JavaScript for the Logo Game

const logos = [
    "apple.com", "starbucks.com", "google.com", "x.com",
    "adidas.com", "microsoft.com", "toyota.com", "nike.com",
    "android.com", "ferrari.com", "mastercard.com", "beatsbydre.com",
    "netflix.com", "tiktok.com", "spotify.com", "pepsi.com",
    "xbox.com", "roblox.com", "lacoste.com", "amazon.com"
  ];

  let currentLogoIndex = 0;
  let score = 0;
  const apiKey = "N624qd5tXItkon1E8GE6Rb0aRa3d2tVBYXB9lHuO014=";

  async function fetchLogo(domain) {
    try {
      const response = await fetch(`https://api.brandfetch.io/v2/brands/${domain}`, {
        headers: {
          "Authorization": `Bearer ${apiKey}`
        }
      });
      const data = await response.json();
      console.log(data);
      // Find the logo where the type is 'symbol'
        const symbolLogo = data.logos.find(logo => logo.type === 'symbol' && logo.theme == 'dark');
        if (symbolLogo && symbolLogo.formats.length > 0) {
            // Return the first available format of the symbol logo
            return symbolLogo.formats[0].src;
          } else {
              console.error('Symbol logo not found for this brand');
            return data.logos[2].formats[0].src;
          }
        } catch (error) {
          console.error('Error fetching logo:', error);
        }
    
  }
  
  async function loadLogo() {
    const logoUrl = await fetchLogo(logos[currentLogoIndex]);
    if (logoUrl) {
      document.getElementById("logo-image").src = logoUrl;
    } else {
      document.getElementById("feedback").innerText = "Failed to load logo.";
    }
  }
  
  function checkAnswer() {
    const userInput = document.getElementById("user-input").value.toLowerCase();
    const correctAnswer = logos[currentLogoIndex].split(".")[0];
    const feedback = document.getElementById("feedback");
  
    if (userInput === correctAnswer) {
      score++;
      feedback.innerText = "Correct!";
      feedback.classList.add("text-green-500");
    } else {
      feedback.innerText = `Incorrect! The answer was: ${correctAnswer}`;
      feedback.classList.add("text-red-500");
    }
  
    document.getElementById("score").innerText = `Score: ${score}/20`;
    document.getElementById("next-button").classList.remove("hidden");
  }
  
  function nextLogo() {
    currentLogoIndex++;
    if (currentLogoIndex < logos.length) {
      document.getElementById("user-input").value = "";
      document.getElementById("feedback").innerText = "";
      document.getElementById("next-button").classList.add("hidden");
      loadLogo();
    } else {
      document.getElementById("game").innerHTML = `<p class="text-center text-2xl font-bold">Game Over! Final Score: ${score}/20</p>`;
    }
  }
  
  document.getElementById("submit-button").addEventListener("click", checkAnswer);
  document.getElementById("next-button").addEventListener("click", nextLogo);
  
  loadLogo();
  