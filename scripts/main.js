var viewport;
var win;
var then;
var now;
var fps;
var ctx;
var width;
var height;
var player = {x:0, y:0, width:10, height:10, vx:0, vy:0, ax:5000, jumpPower:300, sticking:500, wallJumpPower:500, wallJumpAngle:Math.PI/4, jumpDecel:0.5, jumpedOnKeyPress:false, airborne:false, collidingOn:{top:false, bottom:false, left:false, right:false}};
var level = [
  {x:150, y:167, width:90, height:33},
  {x:240, y:133, width:40, height:67},
  {x:280, y:80, width:40, height:120},
  {x:280, y:0, width:40, height:65},
  {x:350, y:0, width:70, height:180},
  {x:450, y:40, width:200, height:160},
  {x:690, y:0, width:40, height:155},
  {x:750, y:140, width:40, height:60},
  {x:810, y:0, width:80, height:155},
  {x:960, y:120, width:40, height:20},
  {x:940, y:80, width:20, height:60},
  {x:0, y:0, width:1, height:200},
  {x:1000, y:0, width:1, height: 200}
];
var loadingBar = {x:0, y:0, width:0, height:200};
var timeLeft = 10000;
var TWO_PI = 2*Math.PI;
var keysDown = {};
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

var elapsedSeconds;
var willCollide;
var i;
function update(dt) {
  timeLeft -= dt;
  loadingBar.width = 1000-timeLeft/10;
  fps = ~~(1000/dt);
  elapsedSeconds = dt/1000;

  if (!player.airborne) player.vx *= friction;
  else player.vx *= 0.9;
  player.vy += gravity*elapsedSeconds;

  willCollide = false;

  player.y += player.vy*elapsedSeconds;
  player.x += player.vx*elapsedSeconds;

  player.collidingOn = {top:false, bottom:false, left:false, right:false};
  for (i=0; i<level.length; i++) {
    if (handleCollision(level[i], player)) willCollide = true;
  }
  if (!willCollide) {
    player.airborne = true;
  }
  else {
    player.airborne = false;
  }
  if (player.x < 0) player.x = 0;
  else if (player.x+player.width > width) player.x = width-player.width;
  if (player.y+player.height > height) {
    player.y = height-player.height;
    player.vy = 0;
    player.collidingOn.bottom = true;
    player.airborne = false;
  }
  if (player.y < 0) {
    player.y = 0;
    player.vy = 0;
    player.collidingOn.top = true;
  }

  if (38 in keysDown || 87 in keysDown || 32 in keysDown) { // up
    if (!player.airborne && !player.jumpedOnKeyPress) {
      player.vy = -player.jumpPower;

      if (!player.collidingOn.bottom) {
        if (player.collidingOn.right) {
          player.vx = -player.wallJumpPower;
        }
        else if (player.collidingOn.left) {
          player.vx = player.wallJumpPower;
        }
      }

      player.jumpedOnKeyPress = true;
    }
  }
  else {
    player.jumpedOnKeyPress = false;
    if (player.vy < 0) player.vy *= player.jumpDecel;
  }
  if (37 in keysDown || 65 in keysDown) { // left
    if (player.collidingOn.right && !player.collidingOn.bottom) {
      if (player.sticking <= 0) {
        player.vx -= player.ax*elapsedSeconds;
      }
    }
    else {
      player.vx -= player.ax*elapsedSeconds;
    }
  }
  if (39 in keysDown || 68 in keysDown) { // right
    if (player.collidingOn.left && !player.collidingOn.bottom) {
      if (player.sticking <= 0) {
        player.vx += player.ax*elapsedSeconds;
      }
    }
    else {
      player.vx += player.ax*elapsedSeconds;
    }
  }

  if (player.collidingOn.left || player.collidingOn.right) {
    if (player.sticking > 0)
      player.sticking -= dt;
  }
  else player.sticking = 500;
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = 'black';

  for(i=0; i<level.length; i++) {
    ctx.rect(level[i].x, level[i].y, level[i].width, level[i].height);
  }
  ctx.fill();
  if (player.sticking > 0)
    ctx.fillStyle = 'red';
  else
    ctx.fillStyle = 'green';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.fillStyle = 'blue';
  ctx.fillRect(loadingBar.x, loadingBar.y, loadingBar.width, loadingBar.height);

  ctx.fillStyle = "white";
  ctx.font = "bold 16px Arial";
  ctx.fillText(fps + ' fps', 20, 20);
  ctx.fillText(player.x, 20, 50);

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

var willCollide;
var minXOffset;
var minYOffset;
var xOffset;
var yOffset;
var xDiff;
var yDiff;
function handleCollision(staticObj, dynamicObj) {
  var willCollide = {l:false, r:false, t:false, b:false};

  minXOffset = staticObj.width/2 + dynamicObj.width/2;
  minYOffset = staticObj.height/2 + dynamicObj.height/2;

  xOffset = (staticObj.x+staticObj.width/2) - (dynamicObj.x+dynamicObj.width/2);
  yOffset = (staticObj.y+staticObj.height/2) - (dynamicObj.y+dynamicObj.height/2);

  xDiff = minXOffset-Math.abs(xOffset);
  yDiff = minYOffset-Math.abs(yOffset);

  if (xDiff >= 0 && yDiff >=0) { // collision
    if (yDiff < xDiff) { // collision on top or bottom
      if (yOffset > 0) { // collision on top
        dynamicObj.y = staticObj.y-dynamicObj.height;
        if (dynamicObj.vy > 0) dynamicObj.vy = 0;
        dynamicObj.airborne = false;
        dynamicObj.collidingOn.bottom = true;
        willCollide.t = true;
      }
      else { // collision on bottom
        dynamicObj.y = staticObj.y+staticObj.height;
        if(dynamicObj.vy < 0) dynamicObj.vy = 0;
        dynamicObj.collidingOn.top = true;
        willCollide.b = true;
      }
    }
    else { // collision on left or right
      if (xOffset > 0) { // collision on left
        dynamicObj.x = staticObj.x-dynamicObj.width;
        if (dynamicObj.vx > 0) dynamicObj.vx = 0;
        dynamicObj.collidingOn.right = true;
        willCollide.l = true;
      }
      else { // collision on right
        dynamicObj.x = staticObj.x+staticObj.width;
        if (dynamicObj.vx < 0) dynamicObj.vx = 0;
        dynamicObj.collidingOn.left = true;
        willCollide.r = true;
      }
    }
    return true;
  }
  return false;
}

addEventListener("keydown", function (e) {
  keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
  delete keysDown[e.keyCode];
}, false);