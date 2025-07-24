const gameArea = document.getElementById("gameArea");
const shooter = document.getElementById("shooter");
const scoreBoard = document.getElementById("scoreBoard");
const gameOverMessage = document.getElementById("gameOver");

let score = 0;
let isGameOver = false;
let bubbleIntervals = [];

// Keyboard controls
document.addEventListener("keydown", (e) => {
  if (isGameOver) return;

  const shooterRect = shooter.getBoundingClientRect();
  if (e.key === "ArrowLeft" && shooterRect.left > 0) {
    shooter.style.left = `${shooter.offsetLeft - 30}px`;
  } else if (e.key === "ArrowRight" && shooterRect.right < window.innerWidth) {
    shooter.style.left = `${shooter.offsetLeft + 30}px`;
  } else if (e.key === " ") {
    shootBullet();
  }
});

// Mobile buttons
// Mobile buttons
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const shootBtn = document.getElementById("shootBtn");

let leftInterval = null;
let rightInterval = null;

function moveShooter(distance) {
  const shooterRect = shooter.getBoundingClientRect();
  if (distance < 0 && shooterRect.left > 0) {
    shooter.style.left = `${shooter.offsetLeft + distance}px`;
  } else if (distance > 0 && shooterRect.right < window.innerWidth) {
    shooter.style.left = `${shooter.offsetLeft + distance}px`;
  }
}

// LEFT button touch events
leftBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  if (isGameOver) return;
  if (leftInterval) return; // prevent multiple intervals
  moveShooter(-30); // immediate move on touchstart
  leftInterval = setInterval(() => moveShooter(-30), 100);
});
leftBtn.addEventListener("touchend", (e) => {
  e.preventDefault();
  clearInterval(leftInterval);
  leftInterval = null;
});
leftBtn.addEventListener("touchcancel", (e) => {
  e.preventDefault();
  clearInterval(leftInterval);
  leftInterval = null;
});

// RIGHT button touch events
rightBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  if (isGameOver) return;
  if (rightInterval) return; // prevent multiple intervals
  moveShooter(30); // immediate move on touchstart
  rightInterval = setInterval(() => moveShooter(30), 100);
});
rightBtn.addEventListener("touchend", (e) => {
  e.preventDefault();
  clearInterval(rightInterval);
  rightInterval = null;
});
rightBtn.addEventListener("touchcancel", (e) => {
  e.preventDefault();
  clearInterval(rightInterval);
  rightInterval = null;
});

// SHOOT button touch event
shootBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  if (isGameOver) return;
  shootBullet();
});


function shootBullet() {
  const bullet = document.createElement("div");
  bullet.classList.add("bullet");

  const shooterRect = shooter.getBoundingClientRect();
  const gameAreaRect = gameArea.getBoundingClientRect();

  const shooterCenterX = shooterRect.left + shooterRect.width / 2;
  const relativeX = shooterCenterX - gameAreaRect.left - 5; // center bullet (10px wide)

  bullet.style.left = `${relativeX}px`;
  bullet.style.bottom = `${window.innerHeight - shooterRect.top + 20}px`;

  gameArea.appendChild(bullet);

  const bulletInterval = setInterval(() => {
    bullet.style.bottom = `${parseInt(bullet.style.bottom) + 10}px`;

    const bubbles = document.querySelectorAll(".bubble");
    const bulletRect = bullet.getBoundingClientRect();

    bubbles.forEach((bubble) => {
      const bubbleRect = bubble.getBoundingClientRect();

      if (
        bulletRect.left < bubbleRect.right &&
        bulletRect.right > bubbleRect.left &&
        bulletRect.top < bubbleRect.bottom &&
        bulletRect.bottom > bubbleRect.top
      ) {
        bubble.remove();
        bullet.remove();
        clearInterval(bulletInterval);
        score++;
        scoreBoard.textContent = `Score: ${score}`;
      }
    });

    if (parseInt(bullet.style.bottom) > window.innerHeight) {
      bullet.remove();
      clearInterval(bulletInterval);
    }
  }, 20);
}

function createBubble() {
  if (isGameOver) return;

  const bubble = document.createElement("div");
  const size = Math.random() * 50 + 30;

  bubble.classList.add("bubble");
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  bubble.style.left = `${Math.random() * (window.innerWidth - size)}px`;
  bubble.style.top = `-100px`;

  gameArea.appendChild(bubble);

  const fallSpeed = Math.random() * 1 + 1;

  const fallInterval = setInterval(() => {
    bubble.style.top = `${parseFloat(bubble.style.top) + fallSpeed}px`;

    const bubbleRect = bubble.getBoundingClientRect();
    const shooterRect = shooter.getBoundingClientRect();

    if (
      bubbleRect.left < shooterRect.right &&
      bubbleRect.right > shooterRect.left &&
      bubbleRect.top < shooterRect.bottom &&
      bubbleRect.bottom > shooterRect.top
    ) {
      gameOver();
      clearInterval(fallInterval);
      bubble.remove();
    }

    if (parseFloat(bubble.style.top) > window.innerHeight) {
      bubble.remove();
      clearInterval(fallInterval);
    }
  }, 20);

  bubbleIntervals.push(fallInterval);
}

function gameOver() {
  isGameOver = true;
  gameOverMessage.style.display = "block";
  scoreBoard.textContent = `Final Score: ${score}`;
  bubbleIntervals.forEach(clearInterval);
  bubbleIntervals = [];
}

function startGame() {
  setInterval(createBubble, 1000);
}

startGame();
