// ==== Request Animation Frame ====
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

// ==== Creating the canvas ====
var canvas = document.createElement('canvas')
var ctx = canvas.getContext('2d')
canvas.width = 800
canvas.height = 500
document.body.appendChild(canvas)

// ==== Defining the graphics ====

// Background image
var bgImage = new Image()
bgImage.src = 'images/background.jpeg'
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

// ==== Defining the Game Objects ====

var player_paddle = {
  speed: 4, // movement in pixels per second
  score: 0,
  x: 785,
  y: 100,
}

var ai_paddle = {
  speed: 3.8, // this is the AI trick
  score: 0,
  x: 10,
  y: 100,
}

var ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  speed_X: 4,
  speed_Y: 4,
}

// ==== Player's Keyboard Input (Handle keyboard controls) ====

var playerInput = {}

addEventListener('keydown', function(e) {
  playerInput[e.keyCode] = true
})

addEventListener('keyup', function(e) {
  delete playerInput[e.keyCode]
})

// ==== Reset the round when any of the two paddles score ====

var reset = function() {
  ball.x = canvas.width / 2
  ball.y = canvas.height / 2
}

// ==== Update Game Objects ====

var update = function() {
  // == Ball's movement ==

  ball.x = ball.x + ball.speed_X
  ball.y = ball.y + ball.speed_Y

  // Computer Scores
  if (ball.x >= canvas.width) {
    ai_paddle.score++
    reset()
  }

  // Player Scores
  if (ball.x <= 0) {
    player_paddle.score++
    reset()
  }
  // Ball hit the borders
  if (ball.y >= canvas.height - ballImage.height || ball.y <= 0) {
    ball.speed_Y = -1 * ball.speed_Y
  }

  // == Player's movement ==

  // 38 is the up keycode
  if (38 in playerInput) {
    if (player_paddle.y > 0) player_paddle.y -= player_paddle.speed
  }

  // 40 is the up keycode
  if (40 in playerInput) {
    if (player_paddle.y < canvas.height - paddleImage.height)
      player_paddle.y += player_paddle.speed
  }

  // == Compuers's movement (Following the ball)==

  if (ai_paddle.y < ball.y) {
    if (ai_paddle.y < canvas.height - paddleImage.height)
      ai_paddle.y += ai_paddle.speed
  } else {
    if (ai_paddle.y > 0) ai_paddle.y -= ai_paddle.speed
  }

  // == Collision ==
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

// ==== Draw Everything ====

var draw = function() {
  // Drawing the background
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0, bgImage.width, bgImage.height, 0, 0, canvas.width, canvas.height)
  }

  // Drawing the paddles
  if (paddleReady) {
    ctx.drawImage(paddleImage, player_paddle.x, player_paddle.y)
    ctx.drawImage(paddleImage, ai_paddle.x, ai_paddle.y)
  }

  // Drawing the ball
  if (ballReady) {
    ctx.drawImage(ballImage, ball.x, ball.y)
  }

  // Drawing the scores
  ctx.fillStyle = 'white'
  ctx.font = '30px ARIAL BLACK'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(ai_paddle.score + '\t\t\t' + player_paddle.score, 400, 20)
}

// ==== Main ====

var main = function() {

  update()
  draw()

  // Request to do this again
  requestAnimationFrame(main)
}

// ==== Play Game ====

main()
