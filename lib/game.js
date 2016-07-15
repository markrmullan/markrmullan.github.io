const Ship = require('./ship');
const Enemy = require('./enemy');
const Utils = require('./utils');
const Bullet = require('./bullet');
const Explosion = require('./explosion');

const Game = function () {
  this.enemies = [];
  this.userBullets = [];
  this.computerBullets = [];
  this.ships = [];
  this.explosions = [];
  this.BG_COLOR = "#000000";
  this.DIM_X = Game.DIM_X;
  this.DIM_Y = Game.DIM_Y;
  this.lives = 3;
  this.score = 0;
  this.addEnemies();
};

Game.prototype.addEnemies = function(){
  const times = 10;
  for (let i = 0; i < times; i++) {
    this.add(new Enemy({game: this, position: [i * 40, 50], imgsrc: './images/Yellow_galaga.png'}));
  }
  for (let i = 0; i < times; i++) {
    this.add(new Enemy({game: this, position: [i * 40, 90], imgsrc: './images/red_sprite_3.png', width: 30, height: 30}));
  }
};

Game.prototype.addShip = function() {
  const ship = new Ship ({
    game: this,
    position: [this.DIM_X - 300, this.DIM_Y - 100]
  });

  this.add(ship);
  return ship;
};

Game.prototype.allObjects = function() {
  return [].concat(this.ships, this.enemies, this.userBullets, this.computerBullets);
};

Game.prototype.draw = function(ctx) {
  ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
  ctx.fillStyle = this.BG_COLOR;
  ctx.fillRect(0, 0, this.DIM_X, this.DIM_Y);
  this.allObjects().forEach((object) => {
    object.draw(ctx);
  });
  ctx.fillStyle = "#3a3838";
  ctx.fillRect(750, 0, 250, this.DIM_Y);
  ctx.font = "16px myFont";
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + this.score, this.DIM_X - 200, 250);
  for (let i = 0; i < this.lives - 1; i++) {
    ctx.drawImage(Game.img, (this.DIM_X - 200) + (i * 40), 300, 30, 30);
  }
  this.explosions.forEach((explosion) => {
    explosion.draw();
  });
};

Game.prototype.add = function (object) {
  if (object instanceof Enemy) {
    this.enemies.push(object);
  } else if (object instanceof Bullet) {
    this.userBullets.push(object);
  } else if (object instanceof Ship) {
    this.ships.push(object);
  } else {
    throw "wtf?";
  }
};

Game.prototype.checkCollisions = function(ctx) {
  const allObjects = this.allObjects();
  for (let i = 0; i < allObjects.length; i++) {
    for (let j = i + 1; j < allObjects.length; j++) {
      const obj1 = allObjects[i];
      const obj2 = allObjects[j];

      if (obj1.isCollidedWith(obj2)) {
        if (obj1 instanceof Enemy && obj2 instanceof Bullet) {
          const e = this.enemies.indexOf(obj1);
          const b = this.userBullets.indexOf(obj2);
          // check to see if the Bullet is a userBullet, because computerBullets should not destroy enemies
          if (e > -1 && b > -1) {
            this.enemies.splice(e, 1);
            this.userBullets.splice(b, 1);
            this.score += 100;
          }
        }
        // you got hit!
        if (obj1 instanceof Ship && obj2 instanceof Bullet) {
          this.ships[0].animateDestroy(ctx);
          this.ships = [];
          const b = this.computerBullets.indexOf(obj2);
          this.computerBullets.splice(b, 1);
          this.lives -= 1;
          setTimeout(() => this.respawnIfLivesLeft(), 1500);
        }
      }
    }
  }
};

Game.prototype.fireBullet = function(position) {
  // maximum bullet count of 2. make em accurate.
  if (this.userBullets.length === 2) {
    return;
  }
  let newBullet = new Bullet({position: [position[0] + 10, position[1] - 40], game: this, dy: [0, -10], imgsrc: './images/bullet.png'});
  newBullet.snd.play();
  this.userBullets.push(newBullet);
};

Game.prototype.fireComputerBullets = function() {
  // if there's more than 1 enemy still alive, find two of them to fire randomly
  if (this.enemies.length > 2) {
    // Get two random indices
    let a = Math.floor(Math.random() * this.enemies.length);
    let b = Math.floor(Math.random() * this.enemies.length);
    // let c = Math.floor(Math.random() * this.enemies.length);
    // Ensure that the indicies are different
    while (a === b) {
      b = Math.floor(Math.random() * this.enemies.length);
    }
    // Then grab the enemies from the enemies array
    let pos1 = this.enemies[a].position;
    let pos2 = this.enemies[b].position;
    // and fire
    this.computerBullets.push(new Bullet({position: [pos1[0] + 10, pos1[1] + 40], game: this, dy: [0, 5], imgsrc: './images/computer_bullet.png'}));
    this.computerBullets.push(new Bullet({position: [pos2[0] + 10, pos2[1] + 40], game: this, dy: [0, 5], imgsrc: './images/computer_bullet.png'}));
  } else if (this.enemies.length === 1) {
    // if there's one enemy alive, we want it to fire without throwing an error
    let pos = this.enemies[0].position;
    this.computerBullets.push(new Bullet({position: [pos[0] + 10, pos[1] + 40], game: this, dy: [0, 5], imgsrc: './images/computer_bullet.png'}));
  }
};

Game.prototype.respawnIfLivesLeft = function() {
  if (this.lives > 0) {
    this.addShip();
  }
};

Game.prototype.displayWinScreen = function() {
  this.enemies = [];
  this.userBullets = [];
  this.computerBullets = [];
  this.ships = [];
  this.explosions = [];
  $('#win-lose-text').text("You win!");
  // $('#restart-button').text("Restart");
};

Game.prototype.displayLoseScreen = function() {
  this.enemies = [];
  this.userBullets = [];
  this.computerBullets = [];
  this.ships = [];
  this.explosions = [];
  $('#win-lose-text').text("You lose!");
  // $('#restart').text("Click anywhere to restart");
};

// Galaga.js uses the dim_x and dim_y constants. keep.
Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.img = new Image();
Game.img.src = './images/Galaga_ship.png';

module.exports = Game;
