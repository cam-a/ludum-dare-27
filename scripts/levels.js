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
    safeZone: {x:960, y:80, width:40, height:40}
  }
];

function renderLevel(ctx, level, player) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = 'black';

  for(i=0; i<level.walls.length; i++) {
    ctx.rect(level.walls[i].x, level.walls[i].y, level.walls[i].width, level.walls[i].height);
  }
  ctx.fill();

  ctx.fillStyle = 'red';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.fillStyle = 'rgba(0,255,0,0.5)';
  ctx.fillRect(level.safeZone.x, level.safeZone.y, level.safeZone.width, level.safeZone.height);

  ctx.fillStyle = 'green';
  ctx.fillRect(loadingBar.x, loadingBar.y, loadingBar.width, loadingBar.height);

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