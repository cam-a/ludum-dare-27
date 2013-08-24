var viewport;
var win;
var then;
var now;
var fps;
var ctx;
var width;
var height;
var player = {x:0, y:0, width:20, height:30, vx:0, vy:0, ax:10000, jumpPower:800, airborne:false};
var level = [
  {x:300, y:300, width:50, height:100},
  {x:500, y:400, width:100, height:100},
  {x:600, y:550, width:100, height:50}
];
var TWO_PI = 2*Math.PI;
var keysDown = {};
var friction = 0.8;
var gravity = 2000;
var newX;
var newY;

setup();
start();

function setup() {
  viewport = document.getElementById('viewport');
  ctx = viewport.getContext('2d');
  win = $(window);
  width = 800; //win.width();
  height = 600; //win.height();
  viewport.width = width;
  viewport.height = height;
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
  var elapsedSeconds = dt/1000;
  if (38 in keysDown) { // up
    if(!player.airborne) {
      player.vy = -player.jumpPower;
      player.airborne = true;
    }
  }
  if (37 in keysDown) { // left
    player.vx -= player.ax*elapsedSeconds;
  }
  if (39 in keysDown) { // right
    player.vx += player.ax*elapsedSeconds;
  }

  player.vx *= friction;
  player.vy += gravity*elapsedSeconds;

  for (var i=0; i<level.length; i++) {
    handleCollision(level[i], player);
  }
  player.y += player.vy*elapsedSeconds;
  player.x += player.vx*elapsedSeconds;

  if (player.x < 0) player.x = 0;
  else if (player.x+player.width > width) player.x = width-player.width;
  if(player.y+player.height > height) {
    player.y = height-player.height;
    player.vy = 0;
    player.airborne = false;
  }
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = 'black';

  for(var i=0; i<level.length; i++) {
    ctx.rect(level[i].x, level[i].y, level[i].width, level[i].height);
  }
  ctx.fill();
  ctx.fillStyle = 'red';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, height);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(width, height);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(width, height);
  ctx.lineTo(width, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(width, 0);
  ctx.lineTo(0, 0);
  ctx.stroke();
}

function handleCollision(staticObj, dynamicObj) {
  var willCollide = {l:false, r:false, t:false, b:false};

  var minXOffset = staticObj.width/2 + dynamicObj.width/2;
  var minYOffset = staticObj.height/2 + dynamicObj.height/2;

  var xOffset = (staticObj.x+staticObj.width/2) - (dynamicObj.x+dynamicObj.width/2);
  var yOffset = (staticObj.y+staticObj.height/2) - (dynamicObj.y+dynamicObj.height/2);

  var xDiff = minXOffset-Math.abs(xOffset);
  var yDiff = minYOffset-Math.abs(yOffset);

  if (xDiff >= 0 && yDiff >=0) { // collision
    if (yDiff < xDiff) { // collision on top or bottom
      if (yOffset > 0) { // collision on top
        dynamicObj.y = staticObj.y-dynamicObj.height;
        if (dynamicObj.vy > 0) dynamicObj.vy = 0;
        player.airborne = false;
        willCollide.t = true;
      }
      else { // collision on bottom
        dynamicObj.y = staticObj.y+staticObj.height;
        if(dynamicObj.vy < 0) dynamicObj.vy = 0;
        willCollide.b = true;
      }
    }
    else { // collision on left or right
      if (xOffset > 0) { // collision on left
        dynamicObj.x = staticObj.x-dynamicObj.width;
        if (dynamicObj.vx > 0) dynamicObj.vx = 0;
        willCollide.l = true;
      }
      else { // collision on right
        dynamicObj.x = staticObj.x+staticObj.width;
        if (dynamicObj.vx < 0) dynamicObj.vx = 0;
        willCollide.r = true;
      }
    }
  }
  return willCollide;
}

addEventListener("keydown", function (e) {
  keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
  delete keysDown[e.keyCode];
}, false);