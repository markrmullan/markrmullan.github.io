const Util = require('./utils');
const MovingObject = require('./moving_object');

function Bullet (options) {
  MovingObject.call(this, options);
  this.dy = options.dy;
  this.position = options.position;
  this.width = 20;
  this.height = 20;
  this.game = options.game;
  this.img = new Image ();
  this.img.src = options.imgsrc;
  this.snd = new Audio('./audio/Galaga_Firing_Sound_Effect.mp3');
}
Util.inherits(Bullet, MovingObject);

module.exports = Bullet;
