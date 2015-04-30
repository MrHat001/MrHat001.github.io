// blastem.js
"use strict";
// if app exists use the existing copy
// else create a new object literal
var app = app || {};

app.blastem = {
	// CONSTANT properties
	WIDTH : 640, 
	HEIGHT: 480,
	FIRE_RATE: 7,
	ENEMY_PROBABILITY_PER_SECOND: 2.0,
	
	
	// variable properties
	canvas : undefined,
	ctx :  undefined,
	dt: 1/60.0, // "delta time"
	ship: undefined,
	pulsar: undefined,
	playerBullets: [],
	cooldown: 0,
	enemies: [],
	score: 0,
	explosions: [],
	menuSelect: undefined,
	spacePressed: undefined,
	enemyWave: undefined,
	waveDone: false,
	allDead: false,
	waveCoolDown: -1,
	waveNum: undefined,
	bossRound: false,
	bossImage: undefined,
	enemy1Image: undefined,
	enemy2Image: undefined,
	backgroundImage: undefined,
	spaceDown: undefined,
		
    init : function() {
			this.canvas = document.querySelector('canvas');
			this.canvas.width = this.WIDTH;
			this.canvas.height = this.HEIGHT;
			
			// the canvas context enables us to 
			// interact with the canvas api
			this.ctx = this.canvas.getContext('2d');
			
			// set up player ship
			this.ship = app.ship;
			//this.ship.init();
			
			// player torso
			var image = new Image();
			image.src = app.IMAGES['playerTorsoImage'];
			this.ship.torsoImage = image;
			
			// player legs
			var image = new Image();
			image.src = app.IMAGES['playerLegsImage'];
			this.ship.legsImage = image;
			
			var image = new Image();
			image.src = app.IMAGES['explosionAnimationImage'];
			this.explosionImage = image;
			
			// enemies
			var image = new Image();
			image.src = app.IMAGES['enemy1Image'];
			this.enemy1Image = image;
			
			var image = new Image();
			image.src = app.IMAGES['enemy2Image'];
			this.enemy2Image = image;
			
			// boss			
			var image = new Image();
			image.src = app.IMAGES['bossImage'];
			this.bossImage = image;
			
			// background
			var image = new Image();
			image.src = app.IMAGES['backgroundImage'];
			this.backgroundImage = image;
			
			this.menuSelect = 1;
			this.waveDone = false;
			this.bossRound = false;
			
			// draw the screen once
			this.update();
    	},
    	
    update: function(){
		// PAUSED?
		if (app.paused){
				this.drawPauseScreen(this.ctx);
				return;
		 }
		if(!app.win && !app.loose && !app.menu && !app.instructions){		
			// UPDATE
			// move sprites
			this.moveSprites();
		
			// CHECK FOR COLLISIONS	
			this.checkForCollisions();
		
			// DRAW	
			// i) draw background
			this.ctx.drawImage(this.backgroundImage, 0, 0, this.WIDTH, this.HEIGHT);
			
			if(this.waveDone && this.allDead){
				if(this.waveCoolDown == 0){
					this.waveDone = false;
					this.allDead = false;
					this.waveCoolDown = -1;
				} else {
					this.waveCoolDown--;
					//console.log(this.waveCoolDown);
					//debugger;
					this.ctx.save();
					this.ctx.textAlign = "center";
					this.ctx.textBaseLine = "middle";
					app.draw.text(this.ctx, "Wave Complete", this.WIDTH/2, this.HEIGHT/2, 60, "black");
					this.ctx.restore();
				}
			}
		
			// ii) draw sprites
			this.ctx.globalAlpha = 0.9;
			this.drawSprites();
		
		
			// iii) draw HUD
			this.ctx.globalAlpha = 1.0;
			this.drawHUD();
		} else {		
			if(this.spaceDown && !app.keydown[app.KEYBOARD.KEY_SPACE]){
				this.spaceDown = false;
			}
			if(app.win){
				this.drawYouWinScreen(this.ctx);
			} else if(app.loose){
				this.drawYouDieScreen(this.ctx);
			} else if(app.menu){
				this.drawMainMenu(this.ctx);
			} else if(app.instructions){
				this.drawInstructionsScreen(this.ctx);
			}
		}
		
		// LOOP
		// this calls the update() function 60 FPS
		// what happens is we don't use bind?
		app.animationID = requestAnimationFrame(this.update.bind(this));
	},
	
	restart: function(){
		this.enemyWave = new app.Wave();
		this.waveNum = 1;
		this.ship.init();
		this.enemies = [];
		this.startSoundtrack();
	},
	
	drawPauseScreen: function(ctx){
		ctx.save();
		//app.draw.backgroundGradient(this.ctx,this.WIDTH,this.HEIGHT);
		app.draw.rect(this.ctx, 0, 0, this.WIDTH, this.HEIGHT, "#FFF");
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		app.draw.text(this.ctx, "... PAUSED ...", this.WIDTH/2, this.HEIGHT/2, 60, "black");
		ctx.restore();
	},
	
	// Draws Main Menu
	// uses up and down to select option
	// uses space to select option
	drawMainMenu: function(ctx){
		// select your option
		if(app.keydown[app.KEYBOARD.KEY_SPACE] && !this.spaceDown){
			this.spaceDown = true;
			if(this.menuSelect == 1){
				app.menu = false;
				this.restart();
			} else if(this.menuSelect == 2){
				app.menu = false;
				app.instructions = true;
			}
			this.spacePressed = true;
		}
		
		// arrow keys to go up/down in the menu
		if(app.keydown[app.KEYBOARD.KEY_UP]){
			this.menuSelect = 1;
			//console.log("up");
		} else if(app.keydown[app.KEYBOARD.KEY_DOWN]){
			this.menuSelect = 2;
			//console.log("down");
		}
		ctx.save();
		//app.draw.backgroundGradient(this.ctx,this.WIDTH,this.HEIGHT);
		app.draw.rect(this.ctx, 0, 0, this.WIDTH, this.HEIGHT, "#FFF");
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		app.draw.text(this.ctx, "Stay Alive!", this.WIDTH/2, this.HEIGHT/2 - 50, 60, "black");
		app.draw.text(this.ctx, "By Everett Leo", this.WIDTH/2 + 130, this.HEIGHT / 2 - 20, 15, "black");
		if(this.menuSelect == 1){
			app.draw.text(this.ctx, "Play Game!", this.WIDTH/2, this.HEIGHT/2, 30, "red");
			app.draw.text(this.ctx, "Instructions!", this.WIDTH/2, this.HEIGHT/2 + 40, 30, "black");
		} else if(this.menuSelect == 2){
			app.draw.text(this.ctx, "Play Game!", this.WIDTH/2, this.HEIGHT/2, 30, "black");
			app.draw.text(this.ctx, "Instructions!", this.WIDTH/2, this.HEIGHT/2 + 40, 30, "red");
		}
		app.draw.text(this.ctx, "use up/down/space to select", this.WIDTH - 140, this.HEIGHT - 20
			, 15, "black");
		ctx.restore();
	},
	
	// Draws Game Over screen
	drawYouDieScreen: function(ctx){
		if(app.keydown[app.KEYBOARD.KEY_SPACE] && !this.spaceDown){
			this.spacedown = true;
			app.loose = false;
			app.menu = true;
		}
	
		ctx.save();
		//app.draw.backgroundGradient(this.ctx,this.WIDTH,this.HEIGHT);
		app.draw.rect(this.ctx, 0, 0, this.WIDTH, this.HEIGHT, "#FFF");
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		app.draw.text(this.ctx, "You Died!", this.WIDTH/2, this.HEIGHT/2, 60, "black");
		app.draw.text(this.ctx, "Press Space Bar to return to the Main Menu.", 
			this.WIDTH/2, 340, 15, "black");
		ctx.restore();
	},
	
	// Draws You Win screen
	drawYouWinScreen: function(ctx){
		if(app.keydown[app.KEYBOARD.KEY_SPACE] && !this.spaceDown){
			this.spaceDown = true;
			app.win = false;
			app.menu = true;
		}
	
		ctx.save();
		//app.draw.backgroundGradient(this.ctx,this.WIDTH,this.HEIGHT);
		app.draw.rect(this.ctx, 0, 0, this.WIDTH, this.HEIGHT, "#FFF");
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		app.draw.text(this.ctx, "You Win!", this.WIDTH/2, this.HEIGHT/2, 60, "black");
		app.draw.text(this.ctx, "Press Space Bar to return to the Main Menu.", 
			this.WIDTH/2, 340, 15, "black");
		ctx.restore();
	},
	
	// Draws the Instructions
	drawInstructionsScreen: function(ctx){
		/*if(this.spacePressed){
			this.spacePressed = false;
			app.keydown = [];
		}*/
	
		if(app.keydown[app.KEYBOARD.KEY_SPACE] && !this.spaceDown){
			this.spaceDown = true;
			app.instructions = false;
			app.menu = true;
			//console.log("space");
		}
		
		ctx.save();
		//app.draw.backgroundGradient(this.ctx,this.WIDTH,this.HEIGHT);
		app.draw.rect(this.ctx, 0, 0, this.WIDTH, this.HEIGHT, "#FFF");
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		app.draw.text(this.ctx, "Instructions", this.WIDTH/2, 140, 55, "black");
		app.draw.text(this.ctx, "You must survive 5 waves of enemies as they try to kill you.",
			this.WIDTH/2, 180, 15, "black");
		app.draw.text(this.ctx, "Use the W,A,S,D keys to move around",
			this.WIDTH/2, 200, 15,"black");
		app.draw.text(this.ctx, "And use the arrow keys to shoot.", this.WIDTH/2, 220, 15, "black");
		app.draw.text(this.ctx, "But beware, some enemies are tougher than others", 
			this.WIDTH/2, 240, 15, "black");
		app.draw.text(this.ctx, "Press Space Bar to return to the Main Menu.", 
			this.WIDTH/2, 340, 15, "black");
		
		ctx.restore();
	},
	
	drawSprites : function (){
		this.ship.draw(this.ctx); // the player knows how to draw itself
		//this.pulsar.updateAndDraw(this.ctx, {x:100, y:100});
		for(var i = 0; i < this.playerBullets.length; i++){
			this.playerBullets[i].draw(this.ctx);
		}
		for(var i = 0; i < this.enemies.length; i++){
			this.enemies[i].draw(this.ctx);
		}
		for(var i = 0; i < this.explosions.length; i++){
			this.explosions[i].draw(this.ctx);
		}
	},
	
	moveSprites: function(){
		// WASD to move
		if(app.keydown[app.KEYBOARD.KEY_A]){
			this.ship.moveLeft(this.dt);
		}
		
		if(app.keydown[app.KEYBOARD.KEY_D]){
			this.ship.moveRight(this.dt);
		}
		
		if(app.keydown[app.KEYBOARD.KEY_W]){
			this.ship.moveUp(this.dt);
		}
		
		if(app.keydown[app.KEYBOARD.KEY_S]){
			this.ship.moveDown(this.dt);
		}
		
		var paddingX = this.ship.width / 2;
		this.ship.x = app.utilities.clamp(this.ship.x, paddingX, this.WIDTH - paddingX);
		
		var paddingY = this.ship.height / 2;
		this.ship.y = app.utilities.clamp(this.ship.y, paddingY, this.HEIGHT - paddingY);
		
		this.cooldown--;
		// arrow keys to shoot
		if(this.cooldown <= 0 && app.keydown[app.KEYBOARD.KEY_LEFT]){
			this.shoot(this.ship.x - this.ship.width/2, this.ship.y, -1, 0);
			this.cooldown = 60 / this.FIRE_RATE;
		} else if(this.cooldown <= 0 && app.keydown[app.KEYBOARD.KEY_RIGHT]){
			this.shoot(this.ship.x + this.ship.width/2, this.ship.y, 1, 0);
			this.cooldown = 60 / this.FIRE_RATE;
		} else if(this.cooldown <= 0 && app.keydown[app.KEYBOARD.KEY_UP]){
			this.shoot(this.ship.x, this.ship.y - this.ship.height/2, 0, 1);
			this.cooldown = 60 / this.FIRE_RATE;
		} else if(this.cooldown <= 0 && app.keydown[app.KEYBOARD.KEY_DOWN]){
			this.shoot(this.ship.x, this.ship.y + this.ship.height/2, 0, -1);
			this.cooldown = 60 / this.FIRE_RATE;
		}
	
		// Bullets
		for(var i = 0; i < this.playerBullets.length; i++){
			this.playerBullets[i].update(this.dt);
		}
		this.playerBullets = this.playerBullets.filter(function(bullet){
			return bullet.active;
		});
		
		//Enemies
		for(var i = 0; i < this.enemies.length; i++){
			this.enemyAI(this.ship, this.enemies[i]);
			this.enemies[i].update(this.dt);
		}
		
		this.enemies = this.enemies.filter(function(enemy){
			return enemy.active;
		});
		
		if(Math.random() < this.ENEMY_PROBABILITY_PER_SECOND / 60 && !this.waveDone){
			var side = this.whichSpawn(this.ship);
			var type = this.enemyWave.getEnemyType();
			
			if(type == 0){
				this.waveDone = true;
				//this.waveCoolDown = 180;
				//console.log("Wave " + this.waveNum + " Completed");
			} else if(type == 3 && !this.bossRound){
				this.bossRound = true;
				//console.log("Boss Round");
				this.enemies.push(new app.Boss(this.bossImage, this.WIDTH, this.HEIGHT,
					side));
			}
			
			if(!this.waveDone && !this.bossRound){
				if(type == 1)
					this.enemies.push(new app.Enemy(this.enemy1Image, this.WIDTH, this.HEIGHT, side, type));
				else if(type == 2)
					this.enemies.push(new app.Enemy(this.enemy2Image, this.WIDHT, this.HEIGHT, side, type));
			}
		}
		
		// explosions
		for(var i = 0; i < this.explosions.length; i++){
			this.explosions[i].update(this.dt);
		}
		
		this.explosions = this.explosions.filter(function(exp){
			return exp.active;
		});
		
		if(this.waveDone && this.enemies.length == 0 && this.waveCoolDown == -1){
			this.allDead = true;
			this.waveCoolDown = 100;
			this.ship.health = this.ship.MAX_HEALTH;
		}
	},
	
	// return which wall the enemies spawn from depending on the
	// position of the player
	whichSpawn: function(player){
	// this.WIDTH, this.HEIGHT
		// return value - top: 0, right: 1, down: 2, left: 3
		var direction;
		
		//distances to the walls
		var rightD = this.WIDTH - player.x;
		var leftD = player.x;
		var upD = player.y;
		var downD = this.HEIGHT - player.y;
		
		if(upD < downD && upD < rightD && upD < leftD){					// closest to top 
			direction = 0;
		} else if(rightD < leftD && rightD < upD && rightD < downD){	// closest to right
			direction = 1;
		} else if(downD < upD && downD < rightD && downD < leftD){		// closest to left
			direction = 2;
		} else{															// closest to bottom
			direction = 3;
		}
		
		return direction;
	},
	
	// returns the farthest wall from the player
	oppositeSpawn: function(player){
		var direction;
		var rightD = this.WIDTH - player.x;
		var leftD = player.x;
		var upD = player.y;
		var downD = this.HEIGHT - player.y;
		
		if(upD > downD && upD > rightD && upD > leftD){
			direction = 0;
		} else if(rightD > leftD && rightD > upD && rightD > downD){
			direction = 1;
		} else if(downD > upD && downD > rightD && downD > leftD){
			direction = 2;
		} else {
			direction = 3;
		}
		
		return direction;
	},
	
	// Enemy AI - makes the enemies follow the player
	enemyAI: function(player, enemy){
		if(player.x - 2 <= enemy.x && player.x + 2 >= enemy.x){
			enemy.xVelocity = 0;
		} else if(player.x + 2 > enemy.x){
			if(enemy.xVelocity <= 0) enemy.xVelocity = enemy.speed;
		} else if(player.x - 2 < enemy.x){
			if(enemy.xVelocity >= 0) enemy.xVelocity = -enemy.speed;
		}
		
		if(player.y + 2 >= enemy.y && player.y - 2 <= enemy.y){
			enemy.yVelocity = 0;
		} else if(player.y + 2 > enemy.y){
			if(enemy.yVelocity <= 0) enemy.yVelocity = enemy.speed;
		} else if(player.y - 2 < enemy.y){
			if(enemy.yVelocity >= 0) enemy.yVelocity = -enemy.speed;
		}
	},
	
	// changed parameters
	// xDir=int(-1, 0, 1) that says which xDirection it should move in
	// yDir=int(-1, 0, 1) that says which yDirection it should move in
	shoot: function(x, y, xDir, yDir){
		//console.log("Bang!");
		if(xDir === -1 && yDir === 0){			// left
			this.playerBullets.push(new app.Bullet(x, y, -400, 0));
			this.ship.shootDirection = 3;
		} else if(xDir === 1 && yDir === 0){	// right
			this.playerBullets.push(new app.Bullet(x, y, 400, 0));
			this.ship.shootDirection = 1;
		} else if(xDir === 0 && yDir === 1){	// up
			this.playerBullets.push(new app.Bullet(x, y, 0, 400));
			this.ship.shootDirection = 0;
		} else if(xDir === 0 && yDir === -1){	// down
			this.playerBullets.push(new app.Bullet(x, y, 0, -400));
			this.ship.shootDirection = 2;
		}
		
		//this.playerBullets.push(new app.Bullet(x, y, 200));
		createjs.Sound.play("bullet");
	},
	
	checkForCollisions: function(){
		var self = this;
		
		this.playerBullets.forEach(function(bullet){
			self.enemies.forEach(function(enemy){
				if(self.collides(bullet, enemy)){
					enemy.health--;
					bullet.active = false;
					if(enemy.health == 0){
						enemy.explode();
						self.score++;
						self.createExplosion(
							enemy.x - enemy.width/2, enemy.y - enemy.height/2,
							 -enemy.xVelocity / 4, -enemy.yVelocity);
						if(self.score >= 10){
							//app.win = true;
						}
					}
				}
			});
		});
		
		this.enemies.forEach(function(enemy){
			if(self.collides(enemy, self.ship)){
				self.ship.health--;
				enemy.explode();
				// self.ship.explode();
				self.score -= 5;
				self.createExplosion(enemy.x, enemy.y, -enemy.xVelocity / 4,
					-enemy.yVelocity);
				if(self.ship.health == 0){
					// call GAME OVER screen
					app.loose = true;
				}
			}
		});
	},
	
	collides: function(a, b){
		var a = Object.create(a);
		var b = Object.create(b);
		
		a.x -= a.width/2;
		a.y -= a.height/2;
		b.x -= b.width/2;
		b.y -= b.height/2;
	
		return a.x < b.x + b.width &&
			a.x + a.width > b.x &&
			a.y < b.y + b.height &&
			a.y + a.height > b.y;
	},
	
	drawHUD: function(){
		app.draw.text(this.ctx, "score = " + this.score, 10, 20, 20, "black");
	},
	
	createExplosion: function(x, y, xVelocity, yVelocity){
		var exp = new app.ExplosionSprite(this.explosionImage, 84, 84, 265, 250, 1/7);
		// faster and larger
		//var exp = new app.ExplosionSprite(this.explosionImage, 200, 200, 84, 84, 1/14);
		
		// slower and smaller
		//var exp = new app.ExplosionSprite(this.explosionImage, 30, 30, 84, 84, 1/3);
		
		// image 2
		//var exp = new app.ExplosionSprite(this.explosionImage2, 128, 128, 64, 64, 1/16);
		
		// image 3
		//var exp = new app.ExplosionSprite(this.explosionImage3, 64, 32, 256, 128, 1/12);
		
		exp.x = x;
		exp.y = y;
		//exp.xVelocity = xVelocity;
		//exp.yVelocity = yVelocity;
		this.explosions.push(exp);
		createjs.Sound.play("explosion");
	},
	
	startSoundtrack: function(){
		createjs.Sound.stop();
		createjs.Sound.play("soundtrack", {loop: -1, volume: 0.5});
	}
    
};