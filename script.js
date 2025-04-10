const BG_COLOR = '#DAD294';
const SNAKE_COLOR = '#E53935';
const FOOD_COLOR = '#456596';

const canvas = document.getElementById("canvas");
canvas.width = canvas.height = 600;
const ct = canvas.getContext("2d");

// SCREEN

const frameRate = 10;
const numTiles = 15;
const tileSize = canvas.width / numTiles;

// IMPORTANT VARIABLES

let pos, velocity, food, snake;


function init() {
  pos = { x: 8, y: 10 };
  velocity = { x: 0, y: 0 };

  snake = [
    { x: 6, y: 10},
    { x: 7, y: 10},
    { x: 8, y: 10},
  ];

  randomFood();
}

init();

function randomFood() {

  food = {
    x: Math.floor(Math.random() * numTiles),
    y: Math.floor(Math.random() * numTiles)
  };

  for (let cell of snake) {
    if (food.x === cell.x && food.y === cell.y) {
      return randomFood();
    }
  }
}

// FONT
function drawScore() {
  ct.fillStyle = "#333";
  ct.font = "bold 24px Arial";
  ct.fillText("Score: " + (snake.length - 3), 10, 30);
}

// COMMANDS
document.addEventListener("keydown", keydown);

function keydown(e) {
  switch (e.keyCode) {
    case 37:
      return velocity = { x: -1, y: 0 }
    case 38:
      return velocity = { x: 0, y: -1 }
    case 39:
      return velocity = { x: 1, y: 0 }
    case 40:
      return velocity = { x: 0, y: 1 }
  }

}

// GAME LOOP

function gameLoop() {
  ct.fillStyle = BG_COLOR;
  
  const scoreArea = canvas.height * (20/100);
  
  
  ct.fillRect(0, 0, canvas.width, canvas.height);
  drawScore();
  ct.fillStyle = FOOD_COLOR;
  ct.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);

  ct.fillStyle = SNAKE_COLOR;
  for (let cell of snake) {
    ct.fillRect(cell.x * tileSize, cell.y * tileSize, tileSize, tileSize);
  }

  pos.x += velocity.x;
  pos.y += velocity.y;

  if (snake[0].x === food.x && snake[0].y === food.y) {
    snake.push({...pos});
    pos.x += velocity.x;
    pos.y += velocity.y;
    randomFood();
  }
  
  if (velocity.x || velocity.y) {
    for (let cell of snake) {
      let outboundery = cell.x >= canvas.width / tileSize || cell.x < 0 || cell.y < 0 || cell.y >= canvas.height / tileSize;
      if (cell.x === pos.x && cell.y === pos.y || outboundery) {
        return init();
      }
    }
    snake.push({...pos});
    snake.shift();
  }
}

setInterval(() => {
  requestAnimationFrame(gameLoop);
}, 1000 / frameRate)