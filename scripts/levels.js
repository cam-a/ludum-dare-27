var levels = [
  {
    width: 1000,
    height: 200,
    playerX: 50,
    playerY: 190,
    walls: [
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
    ],
    safeZone: {x:960, y:80, width:40, height:40},
    loadingBar: {x:0, y:0, width:0, height:200}
  }
];

var filenames = ['README.bat', 'harmless.exe', 'notatrojan.exe', 'HTTPS://65.222.202.53/~TILDE/PUB/CIA-BIN/ETC/INIT.DLL?FILE=__AUTOEXEC.BAT.MY%20OSX%20DOCUMENTS-INSTALL.EXE.RAR.INI.TAR.DOÇX.PHPHPHP.XHTML.TML.XTL.TXXT.0DAY.HACK.ERS_(1995)_BLURAY_CAM-XVID.EXE.TAR.[SCR].LISP.MSI.LNK.ZDA.GNN.WRBT.OBJ.O.H.SWF.DPKG.APP.ZIP.TAR.TAR.CO.GZ.A.OUT.EXE'];

var currentLevel = levels[0];
var response, file;
function startLevel(number, player) {
  currentLevel = levels[number];
  player.x = currentLevel.playerX;
  player.y = currentLevel.playerY;
  file = filenames[Math.floor(Math.random()*filenames.length)];
  gameRunning = true;
}

var elapsedSeconds, willCollide;
function updateLevel(dt, player) {
  if (currentLevel.loadingBar.width < 1000) currentLevel.loadingBar.width += dt/10;

  elapsedSeconds = dt/1000;

  willCollide = false;

  player.y += player.vy*elapsedSeconds;
  player.x += player.vx*elapsedSeconds;

  player.collidingOn = {top:false, bottom:false, left:false, right:false};
  for (i=0; i<currentLevel.walls.length; i++) {
    if (handleCollision(currentLevel.walls[i], player)) willCollide = true;
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
}

function renderLevel(ctx, player) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = 'black';

  for(i=0; i<currentLevel.walls.length; i++) {
    ctx.rect(currentLevel.walls[i].x, currentLevel.walls[i].y, currentLevel.walls[i].width, currentLevel.walls[i].height);
  }
  ctx.fill();

  ctx.fillStyle = 'red';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.fillStyle = 'rgba(0,255,0,0.5)';
  ctx.fillRect(currentLevel.safeZone.x, currentLevel.safeZone.y, currentLevel.safeZone.width, currentLevel.safeZone.height);

  ctx.fillStyle = 'green';
  ctx.fillRect(currentLevel.loadingBar.x, currentLevel.loadingBar.y, currentLevel.loadingBar.width, currentLevel.loadingBar.height);

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

var willCollide, minXOffset, minYOffset, xOffset, yOffset, xDiff, yDiff;
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