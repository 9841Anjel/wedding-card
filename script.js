const nameScreen       = document.getElementById("nameScreen");
const guestInput       = document.getElementById("guestInput");
const guestSubmitBtn   = document.getElementById("guestSubmitBtn");
const guestNameDisplay = document.getElementById("guestNameDisplay");
const sideBadgeDisplay = document.getElementById("sideBadgeDisplay");
const mainScene        = document.getElementById("mainScene");
const invitationBook   = document.getElementById("invitationBook");
const openCardBtn      = document.getElementById("openCardBtn");
const closeCardBtn     = document.getElementById("closeCardBtn");
const playMusicBtn     = document.getElementById("playMusicBtn");
const bgMusic          = document.getElementById("bgMusic");
const groomSideBtn     = document.getElementById("groomSideBtn");
const brideSideBtn     = document.getElementById("brideSideBtn");
const sprinkleCanvas   = document.getElementById("sprinkleCanvas");

let musicPlaying = false;
let selectedSide = null;

groomSideBtn.addEventListener("click", () => {
  selectedSide = "groom";
  groomSideBtn.classList.add("selected");
  brideSideBtn.classList.remove("selected");
});

brideSideBtn.addEventListener("click", () => {
  selectedSide = "bride";
  brideSideBtn.classList.add("selected");
  groomSideBtn.classList.remove("selected");
});

function launchSprinkles() {
  const emojis = ["🌸", "🌺", "✦", "🌼", "💕", "🎊", "✨", "🌹", "💐", "🎉", "🪔", "🌷"];
  for (let i = 0; i < 90; i++) {
    const el = document.createElement("span");
    el.className = "sprinkle";
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = (Math.random() * 100) + "vw";
    el.style.top = "-50px";
    el.style.fontSize = (1 + Math.random() * 1.4) + "rem";
    el.style.animationDelay = (Math.random() * 1.8) + "s";
    el.style.animationDuration = (2 + Math.random() * 1.6) + "s";
    sprinkleCanvas.appendChild(el);
    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 5000);
  }
}

function tryPlayMusic() {
  bgMusic.volume = 0.55;
  bgMusic.play()
    .then(() => {
      musicPlaying = true;
      playMusicBtn.textContent = "⏸  Pause Music";
    })
    .catch(() => {
      musicPlaying = false;
      playMusicBtn.textContent = "▶  Play Music";
    });
}

function openInvitation() {
  const raw = guestInput.value.trim();
  if (!raw) {
    guestInput.classList.add("error");
    guestInput.placeholder = "Please enter your name…";
    guestInput.focus();
    return;
  }

  guestNameDisplay.textContent = raw;

  if (selectedSide === "groom") {
    sideBadgeDisplay.textContent = "( बेहुला पट्टिको — Groom's Side )";
  } else if (selectedSide === "bride") {
    sideBadgeDisplay.textContent = "( बेहुली पट्टिको — Bride's Side )";
  } else {
    sideBadgeDisplay.textContent = "";
  }

  tryPlayMusic();

  nameScreen.classList.add("fade-out");
  setTimeout(() => {
    nameScreen.style.display = "none";
    mainScene.classList.add("visible");
    launchSprinkles();
  }, 860);
}

guestSubmitBtn.addEventListener("click", openInvitation);
guestInput.addEventListener("keydown", (e) => { if (e.key === "Enter") openInvitation(); });
guestInput.addEventListener("input", () => { guestInput.classList.remove("error"); });

openCardBtn.addEventListener("click", () => { invitationBook.classList.add("open"); });
closeCardBtn.addEventListener("click", () => { invitationBook.classList.remove("open"); });

playMusicBtn.addEventListener("click", () => {
  if (!musicPlaying) {
    bgMusic.play().then(() => {
      musicPlaying = true;
      playMusicBtn.textContent = "⏸  Pause Music";
    });
  } else {
    bgMusic.pause();
    playMusicBtn.textContent = "▶  Play Music";
    musicPlaying = false;
  }
});

function setupPhotoUpload(frameId, inputId, imgId) {
  const frame = document.getElementById(frameId);
  const input = document.getElementById(inputId);
  const img   = document.getElementById(imgId);
  if (!frame || !input || !img) return;
  frame.addEventListener("click", () => input.click());
  input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { img.src = ev.target.result; };
    reader.readAsDataURL(file);
  });
}

setupPhotoUpload("photo1Frame", "photo1Input", "photo1Img");
setupPhotoUpload("photo2Frame", "photo2Input", "photo2Img");

const weddingDate = new Date("2026-06-23T11:15:00Z").getTime();
const daysEl    = document.getElementById("days");
const hoursEl   = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

function pad(n) { return String(n).padStart(2, "0"); }

function updateCountdown() {
  const diff = weddingDate - Date.now();
  if (diff <= 0) {
    [daysEl, hoursEl, minutesEl, secondsEl].forEach(el => { if (el) el.textContent = "00"; });
    clearInterval(countdownTimer);
    return;
  }
  if (daysEl)    daysEl.textContent    = pad(Math.floor(diff / 86400000));
  if (hoursEl)   hoursEl.textContent   = pad(Math.floor((diff % 86400000) / 3600000));
  if (minutesEl) minutesEl.textContent = pad(Math.floor((diff % 3600000) / 60000));
  if (secondsEl) secondsEl.textContent = pad(Math.floor((diff % 60000) / 1000));
}

updateCountdown();
const countdownTimer = setInterval(updateCountdown, 1000);