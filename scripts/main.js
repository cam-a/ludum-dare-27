var viewport;
var win;
var then;
var now;
var fps;
var ctx;
var width;
var height;
var player = {x:0, y:0, speed:500};
var TWO_PI = 2*Math.PI;
var keysDown = {};

setup();
start();

function setup() {
  viewport = document.getElementById('viewport');
  ctx = viewport.getContext('2d');
  win = $(window);
  width = win.width();
  height = win.height();
  viewport.width = width;
  viewport.height = win.height();
}
function start() {
  then = Date.now();
  player.x = width/2;
  player.y = height/2;
  requestAnimationFrame(frame);
}

function frame() {
  now = Date.now();
  update(now-then);
  draw();
  requestAnimationFrame(frame);
  then = now;
}

function update(dt) {
  fps = ~~(1000/dt);
  console.log(fps);
  var distance = player.speed * dt/1000;
  if (38 in keysDown) { // up
    player.y -= distance;
  }
  if (40 in keysDown) { // down
    player.y += distance;
  }
  if (37 in keysDown) { // left
    player.x -= distance;
  }
  if (39 in keysDown) { // right
    player.x += distance;
  }
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  ctx.beginPath();
  ctx.arc(player.x, player.y, 50, 0, TWO_PI);
  ctx.stroke();
}

addEventListener("keydown", function (e) {
  keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
  delete keysDown[e.keyCode];
}, false);