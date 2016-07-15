const MovingObject = require('./moving_object');
const Util = require('./utils');
const Bullet = require('./bullet');

function Enemy (options) {
  MovingObject.call(this, options);
  this.direction = "right";
  this.position = options.position;
  this.width = 40;
  this.height = 40;
  this.dx = 2;
  this.img = new Image ();
  this.img.src = options.imgsrc;
}
Util.inherits(Enemy, MovingObject);

module.exports = Enemy;
