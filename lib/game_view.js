/* globals key*/

const Ship = require('./ship');

const GameView = function(game, ctx) {
  this.game = game;
  this.ctx = ctx;
  this.ship = this.game.addShip();
  this.started = false;
  this.over = false;
};

GameView.prototype.start = function () {
  // TODO: refactor these lines
  if (this.started === true) {
    return;
  } else if (this.started === false) {
    this.started = true;
    $('#instruction1').text("");
    $('#instruction2').text("");
    $('#instruction3').text("");
  }
  // TODO: replace the above lines with removeEventListener. can't get it
  // to work!!! :(
  // removeEventListener("click", () => this.start());
  this.bindKeyHandlers();
  // start attacking when the game starts
  this.attackInterval = this.attack();

  // momentarily pause attack when the user changes tabs, and resume attacking
  // when the user is back on the game's page.
  window.addEventListener('blur', () => this.pauseAttacks());
  window.addEventListener('focus', () => this.resumeAttacking());
  //start the animation
  requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.animate = function(){
  // LET'S ANIMATE BABY
  this.game.draw(this.ctx);
  this.moveEnemies();
  this.moveBullets();
  if (this.ship) {
    this.moveShip();
  }
  this.game.checkCollisions(this.ctx);
  this.removeBullets();
  this.checkIfOver();
  //every call to animate requests causes another call to animate.
  //need to set a timeout to allow other async functions, like firing computer
  //bullets, and pausing between respawns, to execute.
  let that = this;
  setTimeout(() => requestAnimationFrame(this.animate.bind(this)), 0);
};

GameView.prototype.bindKeyHandlers = function () {
  const ship = this.ship;
  key("space", (e) => {
    e.preventDefault();
    this.game.fireBullet(this.ship.position);
  });
};

GameView.prototype.moveShip = function(){
  if (key.isPressed("A")) this.ship.move([-5, 0]);
  if (key.isPressed("D")) this.ship.move([5, 0]);
};

GameView.prototype.moveEnemies = function() {
  if (this.game.enemies.length === 0) {
    return;
  }
  if (this.game.enemies.some(enemy => (enemy.position[0] + 290 > this.game.DIM_X))) {
    this.game.enemies.forEach((enemy) => {
      enemy.direction = "left";
    });
  }
  if (this.game.enemies.some(enemy => (enemy.position[0] < 0 ))) {
    this.game.enemies.forEach((enemy) => {
      enemy.direction = "right";
    });
  }
  this.game.enemies.forEach((enemy) => {
    enemy.move();
  });
};

GameView.prototype.moveBullets = function() {
  this.allBullets().forEach((bullet) => {
    bullet.move(bullet.dy);
  });
};

GameView.prototype.removeBullets = function() {
  this.game.userBullets.forEach((bullet, idx) => {
    if (bullet.position[1] < 0) {
      this.game.userBullets.splice(idx, 1);
    }
  });
  this.game.computerBullets.forEach((bullet, idx) => {
    if (bullet.position[1] > this.game.DIM_Y) {
      this.game.computerBullets.splice(idx, 1);
    }
  });
  if (this.game.ships[0]){
    this.ship = this.game.ships[0];
  }
};

GameView.prototype.attack = function(){
  return setInterval(() => this.game.fireComputerBullets(), 2500);
};

GameView.prototype.resumeAttacking = function() {
    this.attackInterval = this.attack();
};
GameView.prototype.pauseAttacks = function() {
    let that = this;
    clearInterval(that.attackInterval);
};

GameView.prototype.allBullets = function() {
  return this.game.userBullets.concat(this.game.computerBullets);
};

GameView.prototype.renderLoad = function() {
  this.ctx.fillStyle = this.game.BG_COLOR;
  this.ctx.fillRect(0, 0, this.game.DIM_X, this.game.DIM_Y);
  let that = this;
  $('#instruction1').text("A and D to move");
  $('#instruction2').text("spacebar to shoot");
  $('#instruction3').text("click to start");

  addEventListener("click", this.start.bind(this));
};

GameView.prototype.checkIfOver = function() {
  // if the game is already over, don't do anything new
  if (this.over) { return; }


  if (this.game.enemies.length === 0) {
    this.started = false;
    this.over = true;
    this.ship = null;
    let that = this;
    // addEventListener("click", this.restart.bind(this));
    this.game.displayWinScreen();
  } else if (this.game.lives === 0) {
    this.started = false;
    this.over = true;
    this.ship = null;
    // addEventListener("click", this.restart.bind(this));
    this.game.displayLoseScreen();
  }
};

// GameView.prototype.restart = function() {
//   this.started = true;
//   this.over = false;
//   $('#win-lose-text').text("");
//   $('#restart').text("");
//   this.game.lives = 3;
//   this.game.score = 0;
//   this.game.addEnemies();
//   this.ship = this.game.addShip();
//   // this.start();
// };

module.exports = GameView;
