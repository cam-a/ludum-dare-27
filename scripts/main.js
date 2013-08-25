var viewport, win, then, now, fps, ctx, width, height, newX, newY;
var timeLeft = 10000;
var TWO_PI = 2*Math.PI;
var friction = 0.8;
var gravity = 1000;
var gameRunning = false;

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

  $('.button').click(function() {
    $('#overlay').css('display', 'none');
    $('#prompt').css('display', 'none');
    startLevel(0, player);
  });
}
function start() {
  then = Date.now();
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
  if (gameRunning) {
    updateLevel(dt, player);
    updatePlayer(dt, keysDown);
  }
}

function draw() {
  renderLevel(ctx, player);
}
