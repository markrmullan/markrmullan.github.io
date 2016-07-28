/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	const GameView = __webpack_require__(8);
	
	document.addEventListener("DOMContentLoaded", () => {
	  const canvas = document.getElementById("game-canvas");
	  canvas.width = Game.DIM_X;
	  canvas.height = Game.DIM_Y;
	
	  const ctx = canvas.getContext("2d");
	  const game = new Game();
	  new GameView(game, ctx).renderLoad();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Ship = __webpack_require__(2);
	const Enemy = __webpack_require__(6);
	const Utils = __webpack_require__(4);
	const Bullet = __webpack_require__(7);
	const Explosion = __webpack_require__(5);
	
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(3);
	const Util = __webpack_require__(4);
	const Explosion = __webpack_require__(5);
	
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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(4);
	const Ship = __webpack_require__(2);
	
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


/***/ },
/* 4 */
/***/ function(module, exports) {

	const Util = {
	  inherits(childClass, parentClass) {
	    function Surrogate () {}
	    Surrogate.prototype = parentClass.prototype;
	    childClass.prototype = new Surrogate();
	    childClass.prototype.constructor = childClass;
	  },
	
	  dist (pos1, pos2) {
	  return Math.sqrt(
	    Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
	  );
	},
	};
	
	module.exports = Util;


/***/ },
/* 5 */
/***/ function(module, exports) {

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


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(3);
	const Util = __webpack_require__(4);
	const Bullet = __webpack_require__(7);
	
	function Enemy (options) {
	  MovingObject.call(this, options);
	  this.direction = "right";
	  this.position = options.position;
	  this.width = 40;
	  this.height = 40;
	  this.dx = 2;
	  this.img = new Image();
	  this.img.src = options.imgsrc;
	}
	Util.inherits(Enemy, MovingObject);
	
	module.exports = Enemy;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(4);
	const MovingObject = __webpack_require__(3);
	
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


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* globals key*/
	
	const Ship = __webpack_require__(2);
	
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map