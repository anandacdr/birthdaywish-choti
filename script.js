document.addEventListener('DOMContentLoaded', function() {
// --- Realistic Fireworks using Canvas ---
const canvas = document.getElementById('fireworks-canvas');
const ctx = canvas.getContext('2d');
let fireworks = [];
let animationFrameId;
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
function randomColor() {
  const colors = ['#ffd700', '#ff69b4', '#4fc3f7', '#adff2f', '#fffacd', '#ff5252', '#b6e0fe', '#fff'];
  return colors[Math.floor(Math.random() * colors.length)];
}
function Firework(x, y) {
  this.x = x;
  this.y = y;
  this.particles = [];
  for (let i = 0; i < 32; i++) {
    const angle = (Math.PI * 2 * i) / 32;
    const speed = 2 + Math.random() * 2;
    this.particles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      color: randomColor()
    });
  }
}
Firework.prototype.update = function() {
  this.particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.02; // gravity
    p.alpha -= 0.012;
  });
  this.particles = this.particles.filter(p => p.alpha > 0);
};
Firework.prototype.draw = function(ctx) {
  this.particles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.restore();
  });
};
function launchFireworkCanvas() {
  const x = 100 + Math.random() * (canvas.width - 200);
  const y = 100 + Math.random() * (canvas.height / 2);
  fireworks.push(new Firework(x, y));
}
function animateFireworks() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  fireworks.forEach(fw => {
    fw.update();
    fw.draw(ctx);
  });
  fireworks = fireworks.filter(fw => fw.particles.length > 0);
  animationFrameId = requestAnimationFrame(animateFireworks);
}
let fireworksInterval;
function startFireworksCanvas() {
  fireworks = [];
  animateFireworks();
  fireworksInterval = setInterval(launchFireworkCanvas, 600);
}
function stopFireworksCanvas() {
  clearInterval(fireworksInterval);
  cancelAnimationFrame(animationFrameId);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  fireworks = [];
}
// --- Fireworks for Welcome Page ---
const welcomeFireworksCanvas = document.getElementById('welcomeFireworks');
let welcomeFireworks = [];
let welcomeFireworksAnimationId;
let welcomeFireworksInterval;
function resizeWelcomeFireworksCanvas() {
  if (!welcomeFireworksCanvas) return;
  welcomeFireworksCanvas.width = window.innerWidth;
  welcomeFireworksCanvas.height = window.innerHeight;
}
resizeWelcomeFireworksCanvas();
window.addEventListener('resize', resizeWelcomeFireworksCanvas);
function launchWelcomeFirework() {
  if (!welcomeFireworksCanvas) return;
  const x = 100 + Math.random() * (welcomeFireworksCanvas.width - 200);
  const y = 100 + Math.random() * (welcomeFireworksCanvas.height / 2);
  welcomeFireworks.push(new Firework(x, y));
}
function animateWelcomeFireworks() {
  if (!welcomeFireworksCanvas) return;
  const ctx = welcomeFireworksCanvas.getContext('2d');
  ctx.clearRect(0, 0, welcomeFireworksCanvas.width, welcomeFireworksCanvas.height);
  welcomeFireworks.forEach(fw => {
    fw.update();
    fw.draw(ctx);
  });
  welcomeFireworks = welcomeFireworks.filter(fw => fw.particles.length > 0);
  welcomeFireworksAnimationId = requestAnimationFrame(animateWelcomeFireworks);
}
function startWelcomeFireworks() {
  welcomeFireworks = [];
  animateWelcomeFireworks();
  welcomeFireworksInterval = setInterval(launchWelcomeFirework, 700);
}
function stopWelcomeFireworks() {
  clearInterval(welcomeFireworksInterval);
  cancelAnimationFrame(welcomeFireworksAnimationId);
  if (welcomeFireworksCanvas) {
    const ctx = welcomeFireworksCanvas.getContext('2d');
    ctx.clearRect(0, 0, welcomeFireworksCanvas.width, welcomeFireworksCanvas.height);
  }
  welcomeFireworks = [];
}
// Multi-page navigation logic
const pages = [
  document.getElementById('welcomePage'),
  document.getElementById('surprisePage'),
  document.getElementById('notebookPage'),
  document.getElementById('finalPage')
];
let currentPage = 0;
function showPage(idx) {
  pages.forEach((p, i) => p.classList.toggle('hidden', i !== idx));
  currentPage = idx;
  if (idx === 0) { // Welcome Page
    createWelcomeSparkles();
    startWelcomeFireworks();
    playWelcomeAudio();
  } else {
    stopWelcomeFireworks();
    stopWelcomeAudio();
  }
  if (idx === 1) { // Surprise Page
    if (surpriseVideo && unmuteBtn) {
      surpriseVideo.muted = true;
      surpriseVideo.currentTime = 0;
      surpriseVideo.pause();
      unmuteBtn.style.display = '';
    }
    startFireworksCanvas();
  }
}
// Welcome popup logic
const welcomePopupBtn = document.getElementById('welcomePopupBtn');
const closeWelcomePopup = document.getElementById('closeWelcomePopup');
if (welcomePopupBtn && closeWelcomePopup) {
  welcomePopupBtn.onclick = () => {
    document.getElementById('welcomePopup').classList.remove('hidden');
  };
  closeWelcomePopup.onclick = () => {
    document.getElementById('welcomePopup').classList.add('hidden');
    showPage(1); // Show Surprise Page
    document.getElementById('surprisePage').classList.add('fullscreen-surprise');
  };
}
// Surprise page logic
const toNotebookBtn = document.getElementById('toNotebookBtn');
if (toNotebookBtn) {
  toNotebookBtn.onclick = () => {
    document.getElementById('surprisePage').classList.remove('fullscreen-surprise');
    stopFireworksCanvas();
    if (surpriseVideo) {
      surpriseVideo.pause();
    }
    showPage(2);
  };
}
// Notebook navigation
const images = [
  "images/Scooty Journey.jpeg",
  "images/together forever.jpeg",
  "images/Sunset are better when you're next to me.jpeg",
  "images/You make every day brighter.jpeg",
  "images/You're my Favorite kind of forever.jpeg",
  "images/You're the Calm to my storm.jpeg"
];
const wishes = [
  `Happy birthday mero choti❤️. Dherai Dherai Dherai Maya. Malai sadhai Maya, care Ra support garyeako mah maan dekhi nai thank you❤️. Ma monster jasto vayea Pani sadhai malai samjayeara aafai bolna aauxau. Malai sadhai fakauxau. Aani ma sangai basxau.`,
  `Choti tmi height mah sani xau tera harek Kura mah dherai nai genius xau. Love you 😘. Tmi malai guide garxau. Mero khusi mah happy hunxau Ra dukha mah Pani happy nai hunxau jhan dherai 😏.`,
  `Taha xina tmro life mah ma vayeara tmi khusi xau ki xina but mero life mah tmi god gift hau. Mailea tmi snaga jati jhagada garyea Pani tmi Bina mero life dark hunxa. Tmi mero white rasbari hau. Jun malai ekdam maan parxa.`,
  `Last mah chai- tmi sadhai happy basa. Tmro sab iccha Ganesh god le Pura gardisos.Tmro sab wish Pura hoss. Happy birthday choti😘. God bless you😇. I'm very lucky to have you 😘. Be with you forever ♾️💗.`
];
let page = 0;
function updateBook() {
  document.getElementById('leftPage').innerHTML = `<img src="${images[page]}" alt="wish" />`;
  // Only update the wish text, not the decorations or lines
  const rightPage = document.getElementById('rightPage');
  let wishText = rightPage.querySelector('.wish-text');
  if (!wishText) {
    wishText = document.createElement('div');
    wishText.className = 'wish-text';
    rightPage.appendChild(wishText);
  }
  wishText.innerHTML = wishes[page];
}
const backNotebookBtn = document.getElementById('backNotebookBtn');
const nextNotebookBtn = document.getElementById('nextNotebookBtn');
if (backNotebookBtn && nextNotebookBtn) {
  backNotebookBtn.onclick = function() {
    page = (page - 1 + wishes.length) % wishes.length;
    updateBook();
  };
  nextNotebookBtn.onclick = function() {
    page = (page + 1) % wishes.length;
    updateBook();
  };
  // Double click to go to previous/next page
  backNotebookBtn.addEventListener('dblclick', () => showPage(1));
  nextNotebookBtn.addEventListener('dblclick', () => showPage(3));
}
updateBook();
// Final page
const restartBtn = document.getElementById('restartBtn');
if (restartBtn) {
  restartBtn.onclick = () => {
    showPage(0);
  };
}
// Music player
const audio = document.getElementById('audio');
const musicBtn = document.getElementById('music-btn');
let playing = false;
musicBtn.onclick = function() {
  if (playing) {
    audio.pause();
    musicBtn.classList.remove('active');
  } else {
    audio.play();
    musicBtn.classList.add('active');
  }
  playing = !playing;
};
// Sparkles for notebook
function createSparkles() {
  const sparkles = document.getElementById('sparkles');
  for (let i = 0; i < 40; i++) {
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    s.style.animationDelay = (Math.random() * 2) + 's';
    sparkles.appendChild(s);
  }
}
createSparkles();
const surpriseVideo = document.getElementById('surprise-video');
const unmuteBtn = document.getElementById('unmuteBtn');
if (unmuteBtn && surpriseVideo) {
  unmuteBtn.onclick = function() {
    surpriseVideo.muted = false;
    surpriseVideo.play();
    unmuteBtn.style.display = 'none';
  };
  // Start video muted and paused until user clicks
  surpriseVideo.muted = true;
  surpriseVideo.pause();
}
// Add floating sparkles to Welcome Page
function createWelcomeSparkles() {
  const sparklesContainer = document.querySelector('.welcome-sparkles');
  if (!sparklesContainer) return;
  sparklesContainer.innerHTML = '';
  for (let i = 0; i < 30; i++) {
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    s.style.animationDelay = (Math.random() * 2) + 's';
    sparklesContainer.appendChild(s);
  }
}
// --- Background Music and Birthday Wish for Welcome Page ---
const backgroundMusic = document.getElementById('backgroundMusic');
const birthdayWish = document.getElementById('birthdayWish');
if (backgroundMusic) backgroundMusic.volume = 0.15;
if (birthdayWish) birthdayWish.volume = 1.0;

function playWelcomeAudio() {
  if (backgroundMusic) {
    backgroundMusic.currentTime = 0;
    backgroundMusic.volume = 0.15;
    backgroundMusic.play().catch(()=>{});
  }
  if (birthdayWish) {
    birthdayWish.currentTime = 0;
    birthdayWish.volume = 1.0;
    birthdayWish.play().catch(()=>{});
  }
}
function stopWelcomeAudio() {
  if (backgroundMusic) backgroundMusic.pause();
  if (birthdayWish) birthdayWish.pause();
}
// Start at welcome page
showPage(0);
}); 