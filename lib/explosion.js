const Explosion = function(ctx, position, img, game) {
  this.ctx = ctx;
  this.position = position;
  this.width = 40;
  this.height = 40;
  this.img = img;
  this.game = game;
};

Explosion.prototype.draw = function() {
  this.ctx.drawImage(this.img, this.position[0], this.position[1], this.width, this.height);
};

Explosion.prototype.cascade = function(d2, d3, d4) {
  snd.play();
  setTimeout(this.cascadeSecond(d2, d3, d4), 150);
  this.ctx.drawImage(this.img, this.position[0], this.position[1], this.width, this.height);
};

Explosion.prototype.cascadeSecond = function(d2, d3, d4) {
  this.game.explosions = [d2];
  setTimeout(() => this.cascadeThird(d3, d4), 150);
};

Explosion.prototype.cascadeThird = function(d3, d4){
  this.game.explosions = [d3];
  setTimeout(() => this.cascadeFourth(d4), 150);
};

Explosion.prototype.cascadeFourth = function(d4){
  this.game.explosions = [d4];
  setTimeout(() => this.clear(), 150);
};

Explosion.prototype.clear = function() {
  this.game.explosions = [];
};

const snd = new Audio('./audio/fighter_destroyed.wav');

module.exports = Explosion;
