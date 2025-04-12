const gameUtils = {
  BG_COLOR: '#DAD294',
  SNAKE_COLOR: '#E53935',
  FOOD_COLOR: '#456596',
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

function createGameSettings(canvasWidth) {
  const scoreArea = 200;
  const gameArea = canvasWidth - scoreArea;
  const numTiles = 20;

  return {
    scoreArea,
    gameArea,
    frameRate: 10,
    numTiles,
    tileSize: gameArea / numTiles
  };
}

const gameSettings = {
  scoreArea: 200,
  gameArea: 600,
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

// DRAW FUNCTIONS

function clearCanvas() {
  ct.fillStyle = gameUtils.BG_COLOR;
  ct.fillRect(0, 0, canvas.width, canvas.height);
}

function drawFood() {
  ct.fillStyle = gameUtils.FOOD_COLOR;
  ct.fillRect(food.x * gameSettings.tileSize, food.y * gameSettings.tileSize, gameSettings.tileSize, gameSettings.tileSize);
}

function drawScoreArea() {
  ct.fillStyle = "#eee";
  ct.fillRect(0, canvas.height - gameSettings.scoreArea, canvas.width, gameSettings.scoreArea);
  ct.fillStyle = "#333";
  ct.font = "bold 100px Arial";
  ct.textAlign = "center"
  ct.textBaseline = "middle"
  ct.fillText(`Score: ${snake.body.length - 3}`, canvas.width / 2, canvas.height - gameSettings.scoreArea / 2);
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
      return resetGame();
    }

    if (snake.body.some(cell => cell.x === nextX && cell.y === nextY)) {
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
  drawFood();
  snake.draw();
  drawScoreArea();
}

function resetGame() {
  snake = new Snake();
  food = spawnFood();
}

setInterval(() => {
  requestAnimationFrame(gameLoop);
}, 1000 / gameSettings.frameRate)

// COMMANDS

document.addEventListener("keydown", (e) => {
  const key = e.keyCode;
  if (key === 37 && snake.speed.x !== 1) snake.setSpeed(-1, 0);
  if (key === 38 && snake.speed.y !== 1) snake.setSpeed(0, -1);
  if (key === 39 && snake.speed.x !== -1) snake.setSpeed(1, 0);
  if (key === 40 && snake.speed.y !== -1) snake.setSpeed(0, 1);
});