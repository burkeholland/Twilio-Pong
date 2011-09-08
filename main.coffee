class Ball

  position:
    x: 640 / 2
    y: 240 / 2

  velocity:
    x: 2
    y: 2

  max_velocity: 4

  reset: ->
    @position.x = 640 / 2
    @position.y = 240 / 2
    
    @velocity.x = -@velocity.x
    @velocity.y = 2

  update: ->
    @velocity.x = @max_velocity if @velocity.x > @max_velocity
    @velocity.y = @max_velocity if @velocity.y > @max_velocity

    @position.x += @velocity.x
    @position.y += @velocity.y
    
    @velocity.y = -@velocity.y if @position.y > 228 or @position.y < 12

  draw: (context) ->
    context.save()
    context.translate(-12, -12)
    context.drawImage(@image, @position.x, @position.y, 24, 24)
    context.restore()

  constructor: ->
    @image = new Image()
    @image.src = 'ball.png'

class Player

  velocity: 0
  score: 0

  up: false
  down: false

  delay: 20
  acceleration: 2

  update: ->
    @$el.text(@score)
    @velocity += @acceleration if @down
    @velocity -= @acceleration if @up

    @velocity *= 0.9

    @position.y += @velocity

    if @position.y > 180
      @position.y = 180
    else if @position.y < 0
      @position.y = 0

  draw: (context) ->
    context.fillRect(@position.x, @position.y, 10, 60)

  constructor: (@position = { x: 0, y: 0 }, @$el) ->

$ ->

  canvas = document.getElementById('game-canvas')
  canvas.width = 640
  canvas.height = 240

  context = canvas.getContext('2d')

  $ready = $(document.getElementById('ready-overlay'))
  is_paused = true
  
  player_1 = new Player({ x: 0, y: 0 }, $(document.getElementById('player1-score')))
  player_2 = new Player({ x: 630, y: 0 }, $(document.getElementById('player2-score')))
  ball = new Ball()
  
  get_animation_frame = ->
    return window.requestAnimationFrame or
           window.webkitRequestAnimationFrame or
           window.mozRequestAnimationFrame or
           window.oRequestAnimationFrame or
           window.msRequestAnimationFrame or
           (callback, element) -> window.setTimeout(callback, 1000 / 60)
  
  $(document).bind 'keydown', (event) ->
    switch event.keyCode
      when 87
        player_1.up = true
      when 83
        player_1.down = true

  $(document).bind 'keyup', (event) ->
    switch event.keyCode
      when 87
        player_1.up = false
      when 83
        player_1.down = false

  start = Date.now()

  $(document).bind 'keypress', (event) ->
    if event.keyCode is 13 and is_paused
      $ready.hide()
      is_paused = false
      start = Date.now()
        
  draw = (timestamp) ->
    if is_paused
      get_animation_frame()(draw, canvas)
      return
    
    if ball.position.x > 640
      player_1.score++
      ball.reset()
    
    if ball.position.x < 0
      player_2.score++
      ball.reset()

    if 12 < ball.position.x < 22
      if player_1.position.y < ball.position.y < player_1.position.y + 60
        ball.velocity.x = -ball.velocity.x + Math.abs(player_1.velocity) * 0.5
        ball.velocity.y = player_1.velocity

    if 622 < ball.position.x < 632
      if player_2.position.y < ball.position.y < player_2.position.y + 60
        ball.velocity.x = -ball.velocity.x + Math.abs(player_2.velocity) * 0.5
        ball.velocity.y = player_2.velocity

    player_2.position.y -= (player_2.position.y - ball.position.y + 30) / player_2.delay

    ball.update()

    player_1.update()
    player_2.update()
    
    context.clearRect(0, 0, 640, 480)
    
    context.fillStyle = '#336699'
    player_1.draw(context)
    player_2.draw(context)

    ball.draw(context)

    get_animation_frame()(draw, canvas)

  draw()
