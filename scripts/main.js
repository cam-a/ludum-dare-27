var viewport, win, then, now, fps, ctx, width, height, newX, newY;
var timeLeft = 10000;
var TWO_PI = 2*Math.PI;
var friction = 0.8;
var gravity = 1000;
var gameRunning = false;
var viewportModifier = 1;
var currentLevelIndex = 0;

$(window).click(function() {
  $(window).unbind('click');
  $('#intro').css('display', 'none');
  $('#main-h1').css('display', 'block');
  $('#download-wait').css('display', 'block');
  $('#file-list').css('display', 'block');
  setup();
  start();
})

function setup() {
  setupRAF();
  file = filenames[0];
  $('#start span').html(file);
  viewport = document.getElementById('viewport');
  ctx = viewport.getContext('2d');
  win = $(window);
  width = 1000; //win.width();
  height = 200; //win.height();
  viewport.width = width;
  viewport.height = height;
  resize();
  $('.file').click(function() {
    player.x = 50;
    player.y = 190;
    currentLevelIndex = $(this).attr('index');
    file = filenames[currentLevelIndex];
    $('#start span').html(file);
    $('#file-list').css('display', 'none');
    $('#start').css('display', 'block');
    currentLevel = levels[currentLevelIndex];
    levels[currentLevelIndex].loadingBar.width = 0;
    $(window).on('keyup', function(e) {
    if (!gameRunning && e.keyCode===32)
      startLevel(currentLevelIndex, player);
    });
  });
  $('.startgame').click(function() {
    startLevel(currentLevelIndex, player);
  });
  $('.newgame').click(function() {
    $('.prompt').css('display', 'none');
    $('#file-list').css('display', 'block');
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

var setupRAF = function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
       || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
      timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
  };
}