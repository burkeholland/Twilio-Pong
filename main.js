(function() {

  var Ball, Player;

  Ball = (function() {

    Ball.prototype.position = {
      x: 640 / 2,
      y: 240 / 2
    };

    Ball.prototype.velocity = {
      x: 2,
      y: 2
    };

    Ball.prototype.max_velocity = 4;

    Ball.prototype.reset = function() {
      this.position.x = 640 / 2;
      this.position.y = 240 / 2;
      this.velocity.x = -this.velocity.x;
      this.velocity.y = 2;
    };

    Ball.prototype.update = function() {
      if (this.velocity.x > this.max_velocity) {
        this.velocity.x = this.max_velocity;
      }
      if (this.velocity.y > this.max_velocity) {
        this.velocity.y = this.max_velocity;
      }
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      if (this.position.y > 228 || this.position.y < 12) {
        return this.velocity.y = -this.velocity.y;
      }
    };

    Ball.prototype.draw = function(context) {
      context.save();
      context.translate(-12, -12);
      context.drawImage(this.image, this.position.x, this.position.y, 24, 24);
      return context.restore();
    };

    function Ball() {
      this.image = new Image();
      this.image.src = 'ball.png';
    }

    return Ball;

  })();

  Player = (function() {

    Player.prototype.velocity = 0;
    Player.prototype.score = 0;
    Player.prototype.up = false;
    Player.prototype.down = false;
    Player.prototype.delay = 20;
    Player.prototype.acceleration = 2;

    Player.prototype.update = function() {

      this.$el.text(this.score);

      if (this.down) {
        this.velocity += this.acceleration;
      }
      
      if (this.up) {
        this.velocity -= this.acceleration;
      }
      
      this.velocity *= 0.9;
      this.position.y += this.velocity;

      if (this.position.y > 180) {
        this.position.y = 180;
      } else if (this.position.y < 0) {
        this.position.y = 0;
      }

    };

    Player.prototype.draw = function(context) {
      context.fillRect(this.position.x, this.position.y, 10, 60);
    };

    function Player(position, $el) {

      this.position = position != null ? position : {
        x: 0,
        y: 0
      };

      this.$el = $el;
    }

    return Player;
  })();

  $(function() {

    var $ready, ball, canvas, context, draw, get_animation_frame, is_paused, player_1, player_2, start;

    canvas = document.getElementById('game-canvas');
    canvas.width = 640;
    canvas.height = 240;
    context = canvas.getContext('2d');
    $ready = $(document.getElementById('ready-overlay'));
    is_paused = true;

    player_1 = new Player({
      x: 0,
      y: 0
    }, $(document.getElementById('player1-score')));

    player_2 = new Player({
      x: 630,
      y: 0
    }, $(document.getElementById('player2-score')));

    ball = new Ball();

    get_animation_frame = function() {
      return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, element) {
        return window.setTimeout(callback, 1000 / 60);
      };
    };

    $(document).bind('keydown', function(event) {
      switch (event.keyCode) {
        case 87:
          return player_1.up = true;
        case 83:
          return player_1.down = true;
      }
    });

    $(document).bind('keyup', function(event) {
      switch (event.keyCode) {
        case 87:
          return player_1.up = false;
        case 83:
          return player_1.down = false;
      }
    });

    start = Date.now();

    $(document).bind('keypress', function(event) {
      if (event.keyCode === 13 && is_paused) {
        $ready.hide();
        is_paused = false;
        start = Date.now();
      }
    });

    draw = function(timestamp) {
      var _ref, _ref2, _ref3, _ref4;

      if (is_paused) {
        get_animation_frame()(draw, canvas);
        return;
      }

      if (ball.position.x > 640) {
        player_1.score++;
        ball.reset();
      }

      if (ball.position.x < 0) {
        player_2.score++;
        ball.reset();
      }

      if ((12 < (_ref = ball.position.x) && _ref < 22)) {
        if ((player_1.position.y < (_ref2 = ball.position.y) && _ref2 < player_1.position.y + 60)) {
          ball.velocity.x = -ball.velocity.x + Math.abs(player_1.velocity) * 0.5;
          ball.velocity.y = player_1.velocity;
        }
      }

      if ((622 < (_ref3 = ball.position.x) && _ref3 < 632)) {
        if ((player_2.position.y < (_ref4 = ball.position.y) && _ref4 < player_2.position.y + 60)) {
          ball.velocity.x = -ball.velocity.x + Math.abs(player_2.velocity) * 0.5;
          ball.velocity.y = player_2.velocity;
        }
      }

      player_2.position.y -= (player_2.position.y - ball.position.y + 30) / player_2.delay;
      ball.update();
      player_1.update();
      player_2.update();
      context.clearRect(0, 0, 640, 480);
      context.fillStyle = '#336699';
      player_1.draw(context);
      player_2.draw(context);
      ball.draw(context);

      get_animation_frame()(draw, canvas);

    };

    draw();
    
  });

}).call(this);
