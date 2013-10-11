var player = {
  x:50,
  y:190,
  width:10,
  height:10,
  vx:0,
  vy:0,
  ax:5000,
  jumpPower:300,
  sticking:500,
  wallJumpPower:500,
  wallJumpAngle:Math.PI/4,
  jumpDecel:0.5,
  jumpedOnKeyPress:false,
  airborne:false,
  collidingOn:{top:false, bottom:false, left:false, right:false},
  safe: false
};

var keysDown = {};
function updatePlayer(dt, keysDown) {
  if (!player.airborne) player.vx *= friction;
  else player.vx *= 0.9;
  player.vy += gravity*dt/1000;

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

addEventListener("keydown", function (e) {
  keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
  delete keysDown[e.keyCode];
}, false);

$('#mobile-left').on('touchstart', function() {
  keysDown[37] = true;
  $('#mobile-left').addClass('mobile-active');
});
$('#mobile-right').on('touchstart', function() {
  keysDown[39] = true;
  $('#mobile-right').addClass('mobile-active');
});
$('#mobile-up').on('touchstart', function() {
  keysDown[38] = true;
  $('#mobile-up').addClass('mobile-active');
});
$('#mobile-left').on('touchend', function() {
  delete keysDown[37];
  $('#mobile-left').removeClass('mobile-active');
});
$('#mobile-right').on('touchend', function() {
  delete keysDown[39];
  $('#mobile-right').removeClass('mobile-active');
});
$('#mobile-up').on('touchend', function() {
  delete keysDown[38];
  $('#mobile-up').removeClass('mobile-active');
});
$('#mobile-left').on('touchcancel', function() {
  delete keysDown[37];
  $('#mobile-left').removeClass('mobile-active');
});
$('#mobile-right').on('touchcancel', function() {
  delete keysDown[39];
  $('#mobile-right').removeClass('mobile-active');
});
$('#mobile-up').on('touchcancel', function() {
  delete keysDown[38];
  $('#mobile-up').removeClass('mobile-active');
});
$('#mobile-left').on('touchleave', function() {
  delete keysDown[37];
  $('#mobile-left').removeClass('mobile-active');
});
$('#mobile-right').on('touchleave', function() {
  delete keysDown[39];
  $('#mobile-right').removeClass('mobile-active');
});
$('#mobile-up').on('touchleave', function() {
  delete keysDown[38];
  $('#mobile-up').removeClass('mobile-active');
});