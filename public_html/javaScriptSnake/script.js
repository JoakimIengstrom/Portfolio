document.addEventListener("keydown", keyPressed);

let canvas = document.getElementById("snakeGame");
let scoreDisplay = document.getElementById("snakeGameScore");
let highestScoreDisplay = document.getElementById("snakeGameHighestScore");
let c = canvas.getContext("2d");
const cell = 30;
const rows = 18;
const cols = 18;
canvas.height = rows * cell;
canvas.width = cols * cell;

let dir = {
  x: 0,
  y: 0,
};
let snakeInitial = {
  x: (rows * cell) / 2,
  y: (cols * cell) / 2,
};
let tail = [];
for (let i = 0; i < 3; i++) {
  tail.push({
    x: snakeInitial.x - i * cell,
    y: snakeInitial.y,
  });
}
let food = {
  x: snakeInitial.x + 2 * cell,
  y: snakeInitial.y,
};
let score = 0;
let highestScore = 0;
let start = true;

function play() {
  setTimeout(() => {
    if (
      tail[0].x < 0 ||
      tail[0].x === canvas.width ||
      tail[0].y < 0 ||
      tail[0].y === canvas.height
    ) {
      tail = [];
      for (let i = 0; i < 3; i++) {
        tail.push({
          x: snakeInitial.x - i * cell,
          y: snakeInitial.y,
        });
      }
      dir = {
        x: 0,
        y: 0,
      };
      score = 0;
      start = true;
      while (inTail(food)) {
        food = {
          x: Math.floor(Math.random() * cols) * cell,
          y: Math.floor(Math.random() * rows) * cell,
        };
      }
    }
    if (check(tail[0].x, tail[0].y)) {
      for (let i = 0; i < score; i++) {
        tail.pop();
      }
      score = 0;
    }
    if (tail[0].x === food.x && tail[0].y === food.y) {
      score++;
      tail.push({
        x: tail[tail.length - 1].x,
        y: tail[tail.length - 1].y,
      });
      while (inTail(food)) {
        food = {
          x: Math.floor(Math.random() * cols) * cell,
          y: Math.floor(Math.random() * rows) * cell,
        };
      }
    }
    if (!(dir.x === 0 && dir.y === 0))
      for (let t = tail.length - 1; t > 0; t--) {
        tail[t].x = tail[t - 1].x;
        tail[t].y = tail[t - 1].y;
        start = false;
      }
    tail[0].x += dir.x;
    tail[0].y += dir.y;
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "red";
    c.fillRect(food.x + 1, food.y + 1, cell - 2, cell - 2);
    for (let t in tail) {
      c.fillStyle = "lime";
      c.fillRect(tail[t].x + 1, tail[t].y + 1, cell - 2, cell - 2);
    }
    scoreDisplay.innerHTML = `Score: ${score}`;
    if (highestScore < score) highestScore = score;
    highestScoreDisplay.innerHTML = `Highest score: ${highestScore}`;
    requestAnimationFrame(play);
  }, 1000 / 15);
}
requestAnimationFrame(play);

function inTail(food) {
  for (let t in tail) {
    if (food.x === tail[t].x && food.y === tail[t].y) {
      return true;
    }
  }
  return false;
}

function check(x, y) {
  for (let i = 2; i < tail.length; i++) {
    if (x === tail[i].x && y === tail[i].y) {
      return true;
    }
  }
  return false;
}

function keyPressed(e) {
  switch (e.keyCode) {
    case 37:
      turnLeft();
      break;
    case 38:
      e.preventDefault();
      turnUpp();
      break;
    case 39:
      turnRight();
      break;
    case 40:
      e.preventDefault();
      turnDown();
      break;
  }
}