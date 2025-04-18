const gameUtils = {
  BG_COLOR: '#e8cea8',
  SNAKE_COLOR: '#463e6c',
  FOOD_COLOR: '#10479f',
  GRID_COLOR: 'rgba(190, 168, 149, 1)',
};

// CANVAS SETTINGS
function createCanvas() {
  const canvas = document.getElementById("canvas");
  canvas.width = canvas.height = 800;
  const ct = canvas.getContext("2d");
  return { ct, canvas };
}

const { ct, canvas } = createCanvas();

// GAME SETTINGS
const gameSettings = {
  scoreArea: 100,
  gameArea: 700,
  frameRate: 10,
  numTiles: 20,
};
gameSettings.tileSize = gameSettings.gameArea / gameSettings.numTiles;

// SNAKE CLASS
class Snake {
  constructor() {
    this.body = [
      { x: 8, y: 10},
      { x: 7, y: 10},
      { x: 6, y: 10},
    ];
    this.speed = { x: 0, y: 0};
  }
  
  setSpeed(x, y) {
    this.speed = { x, y };
  }

  getHead() {
    return this.body[this.body.length - 1];
  }

  // queue

  move() {
    const newHead = {
      x: this.getHead().x + this.speed.x,
      y: this.getHead().y + this.speed.y
    };
    this.body.push(newHead);
    this.body.shift();
  }

  grow(x, y) {
    const newHead = {
      x: this.getHead().x + this.speed.x,
      y: this.getHead().y + this.speed.y
    };
    this.body.push(newHead);
  }

  draw() {
    ct.fillStyle = gameUtils.SNAKE_COLOR;
    for (let cell of this.body) {
      ct.fillRect(cell.x * gameSettings.tileSize, cell.y * gameSettings.tileSize, gameSettings.tileSize, gameSettings.tileSize);
    }
  }
}

// GAME STATE
let snake = new Snake();
let food = spawnFood();
let highScore = getHighScore();

function spawnFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * gameSettings.numTiles),
      y: Math.floor(Math.random() * gameSettings.numTiles)
    };
  } while (snake.body.some( cell => cell.x === newFood.x && cell.y === newFood.y));
  return newFood;
}

function getHighScore() {
  try {
    return localStorage.getItem("highScore");
  }
  catch(error) {
    console.error("Couldn't retrieve high score: ", error);
  }
}

function saveHighScore() {
  const score = snake.body.length - 3;
  try {
    const currentHighScore = localStorage.getItem("highScore");
    if (currentHighScore === null || score > currentHighScore) {
      localStorage.setItem("highScore", score);
      return;
    } 
  } catch (error) {
    console.error("Couldn't save high score: ", error);
  }
}

// DRAW FUNCTIONS
function clearCanvas() {
  ct.fillStyle = gameUtils.BG_COLOR;
  ct.fillRect(0, 0, canvas.width, canvas.height);
}

function drawTiles() {
  ct.strokeStyle = gameUtils.GRID_COLOR;
  for ( let y = 0; y < gameSettings.gameArea; y+= gameSettings.tileSize) {
    for (let x = 0; x < canvas.width; x+= gameSettings.tileSize) {
      ct.strokeRect(x, y, gameSettings.tileSize, gameSettings.tileSize);
    }
  }
}

function drawFood() {
  ct.fillStyle = gameUtils.FOOD_COLOR;
  ct.fillRect(food.x * gameSettings.tileSize, food.y * gameSettings.tileSize, gameSettings.tileSize, gameSettings.tileSize);
}

function drawScoreArea() {
  // bg
  const bgArea = { x: 0, y: canvas.height - gameSettings.scoreArea };
  ct.fillStyle = gameUtils.SNAKE_COLOR;
  ct.beginPath();
  ct.roundRect(bgArea.x, bgArea.y, canvas.width, gameSettings.scoreArea, [15,15,3,3]);
  ct.fill();

  // border
  const borderSize = 10;
  ct.fillStyle = "#2c0f2b";
  ct.beginPath();
  ct.roundRect(bgArea.x + borderSize, bgArea.y + borderSize, canvas.width - (borderSize * 2), gameSettings.scoreArea - (borderSize * 2), 15);
  ct.fill();

  // score
  ct.fillStyle = "beige";
  ct.font = "bold 40px Doto";
  ct.textAlign = "center";
  ct.textBaseline = "start";
  ct.shadowColor = "yellow";
  ct.shadowBlur = 15;
  ct.fillText(`Score: ${snake.body.length - 3}`, canvas.width / 2, canvas.height - gameSettings.scoreArea / 2);

  // high score
  ct.font = "bold 35px Doto";
  ct.textBaseline = "bottom"
  ct.shadowBlur = 15;
  ct.fillText(`High score: ${highScore ? highScore : 0}`, (canvas.width / 2) - borderSize, canvas.height - borderSize);
  ct.shadowBlur = 0;
}

// GAME LOOP
function gameLoop() {
  if (snake.speed.x !== 0 || snake.speed.y !== 0) {
    const head = snake.getHead();
    const nextX = head.x + snake.speed.x;
    const nextY = head.y + snake.speed.y;

    if (
      nextX < 0 || nextX >= canvas.width / gameSettings.tileSize ||
      nextY < 0 || nextY >= gameSettings.gameArea / gameSettings.tileSize
    ) {
      saveHighScore();
      return resetGame();
    }

    if (snake.body.some(cell => cell.x === nextX && cell.y === nextY)) {
      saveHighScore();
      return resetGame();
    }

    if (nextX === food.x && nextY === food.y) {
      snake.grow();
      food = spawnFood();
    } else {
      snake.move();
    }
  }

  clearCanvas();
  drawTiles();
  drawFood();
  snake.draw();
  drawScoreArea();
}

function resetGame() {
  snake = new Snake();
  food = spawnFood();
  highScore = getHighScore();
}

setInterval(() => {
  requestAnimationFrame(gameLoop);
}, 1000 / gameSettings.frameRate)

// COMMANDS
document.addEventListener("keydown", (e) => {
  const key = e.key;
  if (/^Arrow/.test(key)) e.preventDefault();
  if (key === "ArrowLeft" && snake.speed.x !== 1) snake.setSpeed(-1, 0);
  if (key === "ArrowUp" && snake.speed.y !== 1) snake.setSpeed(0, -1);
  if (key === "ArrowRight" && snake.speed.x !== -1) snake.setSpeed(1, 0);
  if (key === "ArrowDown" && snake.speed.y !== -1) snake.setSpeed(0, 1);
});