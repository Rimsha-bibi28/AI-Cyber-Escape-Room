// ---------------- GAME STATE ----------------
if (!sessionStorage.getItem("score")) {
  sessionStorage.setItem("score", 0);
}

if (!sessionStorage.getItem("time")) {
  sessionStorage.setItem("time", 300); // 5 minutes
}

// ---------------- TIMER ----------------
function startTimer() {
  let timerDisplay = document.getElementById("timer");
  let time = parseInt(sessionStorage.getItem("time"));

  setInterval(() => {
    if (time <= 0) {
      alert("⏰ Time's up! Game Over.");
      sessionStorage.clear();
      window.location.href = "/";
    } else {
      time--;
      sessionStorage.setItem("time", time);
      let minutes = Math.floor(time / 60);
      let seconds = time % 60;
      timerDisplay.innerText = `⏳ Time: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }
  }, 1000);
}

// ---------------- SCORE UPDATE ----------------
function updateScore() {
  let score = parseInt(sessionStorage.getItem("score"));
  score += 10;
  sessionStorage.setItem("score", score);
  document.getElementById("score").innerText = `⭐ Score: ${score}`;
}

// ---------------- LEVEL 1 ----------------
function checkURL() {
  let url = document.getElementById("url").value;

  fetch("/check_url", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({url: url})
  })
  .then(res => res.json())
  .then(data => {
    if (data.result === 1) {
      document.getElementById("result").innerText = "❌ Phishing URL detected!";
    } else {
      document.getElementById("result").innerText = "✅ Safe URL!";
      updateScore();
      document.getElementById("next").classList.remove("hidden");
    }
  });
}

// ---------------- LEVEL 2 ----------------
function checkWebsite() {
  let features = new Array(31).fill(1);
  document.querySelectorAll('input[type=checkbox]:checked')
    .forEach((cb, i) => features[i] = -1);

  fetch("/check_website", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({features: features})
  })
  .then(res => res.json())
  .then(data => {
    if (data.result === -1) {
      document.getElementById("result").innerText = "❌ Phishing website detected!";
    } else {
      document.getElementById("result").innerText = "✅ Website appears safe!";
      updateScore();
      document.getElementById("next").classList.remove("hidden");
    }
  });
}

// ---------------- LEVEL 3 ----------------
function checkPassword() {
  let pwd = document.getElementById("password").value;

  fetch("/check_password", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({password: pwd})
  })
  .then(res => res.json())
  .then(data => {
    if (data.strength === 2) {
      document.getElementById("result").innerText = "✅ Strong password!";
      updateScore();
      document.getElementById("next").classList.remove("hidden");
    } else {
      document.getElementById("result").innerText = "❌ Weak or medium password!";
    }
  });
}
