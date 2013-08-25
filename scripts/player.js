var player = {
  x:0,
  y:0,
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
  collidingOn:{top:false, bottom:false, left:false, right:false}
};