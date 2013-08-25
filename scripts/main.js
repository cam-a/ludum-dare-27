var viewport, win, then, now, fps, ctx, width, height, newX, newY;
var timeLeft = 10000;
var TWO_PI = 2*Math.PI;
var friction = 0.8;
var gravity = 1000;
var gameRunning = false;
var viewportModifier = 1;
var currentLevelIndex = 0;

setup();
start();

function setup() {
  file = filenames[Math.floor(Math.random()*filenames.length)];
  $('#start span').html(file);
  viewport = document.getElementById('viewport');
  ctx = viewport.getContext('2d');
  win = $(window);
  width = 1000; //win.width();
  height = 200; //win.height();
  viewport.width = width;
  viewport.height = height;
  resize();
  $('.startgame').click(function() {
    startLevel(currentLevelIndex, player);
  });
  $('.nextgame').click(function() {
    startLevel(++currentLevelIndex, player);
  });
  $(window).on('keyup', function(e) {
    if (!gameRunning && e.keyCode===32)
      startLevel(currentLevelIndex, player);
  });
  $(window).on('resize', resize);
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

var viewportWidth, viewportHeight;
function resize() {
  viewportWidth = $(window).width()-25;
  viewportModifier = viewportWidth/width;
  viewportHeight = viewportModifier*height;
  viewport.width = viewportWidth;
  viewport.height = viewportHeight+5;
}
