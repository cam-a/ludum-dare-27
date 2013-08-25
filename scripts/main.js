var viewport;
var win;
var then;
var now;
var fps;
var ctx;
var width;
var height;
var timeLeft = 10000;
var TWO_PI = 2*Math.PI;
var friction = 0.8;
var gravity = 1000;
var newX;
var newY;

setup();
start();

function setup() {
  viewport = document.getElementById('viewport');
  ctx = viewport.getContext('2d');
  win = $(window);
  width = 1000; //win.width();
  height = 200; //win.height();
  viewport.width = width;
  viewport.height = height;
}
function start() {
  then = Date.now();
  player.x = 50;
  player.y = 190;
  requestAnimationFrame(frame);
}

function frame() {
  now = Date.now();
  update(now-then);
  draw();
  requestAnimationFrame(frame);
  then = now;
}

var i;
function update(dt) {
  timeLeft -= dt;

  fps = ~~(1000/dt);
  elapsedSeconds = dt/1000;

  updateLevel(dt, levels[0], player);
  updatePlayer(dt, keysDown);
}

function draw() {
  renderLevel(ctx, levels[0], player);
}