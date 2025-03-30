
const gameArea = {
  canvas: document.createElement("canvas"),

  start: function () {
    this.canvas.width = 500;
    this.canvas.height = 500;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

function component(width, height, color, x, y) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;

  this.update = function () {
    ctx = gameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

let snake = new component(70, 20, "blue", gameArea.canvas.width / 4, gameArea.canvas.height / 4);

function startGame() {
  gameArea.start();
}

function updateGameArea() {
  gameArea.clear();
  snake.update();
  if (snake.x + 1 < gameArea.canvas.width) {
    snake.x +=1;
  }
}

startGame();