const Util = require('./utils');
const Ship = require('./ship');

function MovingObject (options) {
  this.position = options.position;
  this.game = options.game;
}

MovingObject.prototype.move = function(delta) {
  if (this.direction === "right") {
    this.position[0] = this.position[0] + this.dx;
  }
  if (this.direction === "left") {
    this.position[0] = this.position[0] - this.dx;
  }
  if (delta) {
    this.position = [this.position[0] + delta[0], this.position[1] + delta[1]];

    //Prevents the 40px ship from moving off the 1000px wide screen, with a padding of 10px
    this.position[0] = Math.max(10, Math.min(this.position[0], this.game.DIM_X - 300));
  }
};

MovingObject.prototype.isCollidedWith = function(otherObject) {
  const centerDist = Util.dist(this.centerPoint(), otherObject.centerPoint());
  return centerDist < ((this.height / 2) + (otherObject.height / 2));
};

MovingObject.prototype.draw = function(ctx) {
  ctx.drawImage(this.img, this.position[0], this.position[1], this.width, this.height);
};

MovingObject.prototype.centerPoint = function(){
  return [this.position[0] + (this.width / 2), this.position[1] + (this.height / 2)];
};

module.exports = MovingObject;
