// === Request Animation Frame ===
window.requestAnimFrame = function() {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60)
    }
  )
}

// === Creating the canvas ===
var canvas = document.createElement('canvas')
var ctx = canvas.getContext('2d')
canvas.width = 800
canvas.height = 500
document.body.appendChild(canvas)

// === Defining the graphics ===

// Background image
var bgImage = new Image()
bgImage.src = 'images/background.png'
var bgReady = false
bgImage.onload = function() {
  bgReady = true
}

// Paddles Image
var paddleImage = new Image()
paddleImage.src = 'images/paddle.png'
var paddleReady = false
paddleImage.onload = function() {
  paddleReady = true
}

// Ball Image
var ballImage = new Image()
ballImage.src = 'images/ball.png'
var ballReady = false
ballImage.onload = function() {
  ballReady = true
}

// === Defining the Game Objects ===

var player_paddle = {
  speed: 5, //movement in pixels per second
  score: 0,
  x: 785,
  y: 100,
}

var ai_paddle = {
  speed: 5, //this is the AI trick
  score: 0,
  x: 10,
  y: 100,
}

var ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  speed_X: 3,
  speed_Y: 3,
}

// === Player's Keyboard Input (Handle keyboard controls) ===

var keysDown = {}

addEventListener(
  'keydown',
  function(e) {
    keysDown[e.keyCode] = true
  },
  false
)

addEventListener(
  'keyup',
  function(e) {
    delete keysDown[e.keyCode]
  },
  false
)

// === Reset the round when any of the two paddles score ===

var reset = function() {
  ball.x = canvas.width / 2
  ball.y = canvas.height / 2
}

// === Update Game Objects ===

var update = function() {
  //ball movement -----------------------
  ball.x = ball.x + ball.speed_X
  ball.y = ball.y + ball.speed_Y

  if (ball.x >= canvas.width) {
    //ai_paddle scored
    ai_paddle.score++
    reset()
  }

  if (ball.x <= 0) {
    //player_paddle scored
    player_paddle.score++
    reset()
  }

  if (ball.y >= canvas.height - ballImage.height || ball.y <= 0) {
    ball.speed_Y = -1 * ball.speed_Y
  }

  //player_paddle movement -------------
  if (38 in keysDown) {
    // Player holding UP
    if (player_paddle.y > 0) player_paddle.y -= player_paddle.speed
  }

  if (40 in keysDown) {
    // Player holding DOWN
    if (player_paddle.y < canvas.height - paddleImage.height)
      player_paddle.y += player_paddle.speed
  }

  //ai_paddle movement -----------------
  //following the ball
  if (ai_paddle.y < ball.y) {
    if (ai_paddle.y < canvas.height - paddleImage.height)
      ai_paddle.y += ai_paddle.speed
  } else {
    if (ai_paddle.y > 0) ai_paddle.y -= ai_paddle.speed
  }

  // collision
  if (
    (ball.x < player_paddle.x + paddleImage.width &&
      ball.x + ballImage.width > player_paddle.x &&
      ball.y < player_paddle.y + paddleImage.height &&
      ballImage.height + ball.y > player_paddle.y) ||
    (ball.x < ai_paddle.x + paddleImage.width &&
      ball.x + ballImage.width > ai_paddle.x &&
      ball.y < ai_paddle.y + paddleImage.height &&
      ballImage.height + ball.y > ai_paddle.y)
  ) {
    ball.speed_X = -1 * ball.speed_X
  }
}

// === Draw Everything ===
var draw = function() {
  if (bgReady) {
    ctx.drawImage(
      bgImage,
      0,
      0,
      bgImage.width,
      bgImage.height,
      0,
      0,
      canvas.width,
      canvas.height
    )
  }

  if (paddleReady) {
    ctx.drawImage(paddleImage, player_paddle.x, player_paddle.y)
    ctx.drawImage(paddleImage, ai_paddle.x, ai_paddle.y)
  }

  if (ballReady) {
    ctx.drawImage(ballImage, ball.x, ball.y)
  }

  // Score
  ctx.fillStyle = 'white'
  ctx.font = '30px ARIAL BLACK'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(
    'AI: ' + ai_paddle.score + '\t\tPlayer: ' + player_paddle.score,
    390,
    10
  )
}

// === Main ===
var main = function(then) {
  var now = Date.now()
  var delta = now - then

  update(delta / 1000)
  draw()

  then = now

  // Request to do this again
  requestAnimationFrame(main)
}

// === Play Game ===
var then = Date.now()
reset()
main(then)
