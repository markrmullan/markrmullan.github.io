const MovingObject = require('./moving_object');
const Util = require('./utils');
const Explosion = require('./explosion');

const Ship = function(options) {
  MovingObject.call(this, options);
  this.game = options.game;
  this.position = options.position;
  this.width = 40;
  this.height = 40;
  this.img = new Image ();
  this.img.src = './images/Galaga_ship.png';
};

Util.inherits(Ship, MovingObject);

Ship.prototype.animateDestroy = function(ctx) {
  let tempPos = this.position;
  this.fetchDestroyImages();
  this.startDestroyCascade(ctx, tempPos);
};

Ship.prototype.fetchDestroyImages = function() {
  this.destroy1 = new Image();
  this.destroy1.src = './images/destroy1.png';

  this.destroy2 = new Image();
  this.destroy2.src = './images/destroy2.png';

  this.destroy3 = new Image();
  this.destroy3.src = './images/destroy3.png';

  this.destroy4 = new Image();
  this.destroy4.src = './images/destroy4.png';
};

Ship.prototype.startDestroyCascade = function(ctx, tempPos) {
  const d2 = new Explosion(ctx, tempPos, this.destroy2, this.game);
  const d3 = new Explosion(ctx, tempPos, this.destroy3, this.game);
  const d4 = new Explosion(ctx, tempPos, this.destroy4, this.game);

  this.game.explosions.push(new Explosion(ctx, tempPos, this.destroy1, this.game).cascade(d2, d3, d4));
};

module.exports = Ship;
