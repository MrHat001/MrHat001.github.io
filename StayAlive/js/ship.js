// ship.js
// dependencies: app.draw module
// description: singleton object
"use strict";
var app = app || {};

app.ship = {
	color: "yellow",
	x: 320,
	y: 240,
	width: 36,
	height: 58,
	speed: 250,
	torsoImage: undefined,
	legsImage: undefined,
	frameRow: 0,
	frameCol: 0,
	frameWidth: 301,
	frameHeight: 224,
	bufferX: 17,
	bufferY: 16,
	numCols: 8,
	numRows: 4,
	left: undefined,
	right: undefined,
	up: undefined,
	down: undefined,
	lastTime: 0,
	frameDelay: undefined,		// set in init
	
	
	MAX_HEALTH: 10,
	health: undefined,
	// 0-up 1-right 2-down 3-left
	shootDirection: 0,
	init: function(){
		this.frameDelay = 1/7;
		this.health = this.MAX_HEALTH;
		this.x = 320;
		this.y = 240;
	}, 
	// 28, 2, 17, 21
	draw : function(ctx){
		var halfW = this.width/2;
		var halfH = this.height/2;
		
		if(!this.torsoImage){
			app.draw.rect(ctx, this.x - halfW, this.y - halfH, this.width, this.height, this.color);
		} else {
			// leg animation draw
			var imageX = this.frameCol * this.frameWidth + (this.frameCol + 1) * this.bufferX;
			var imageY = this.frameRow * this.frameHeight + (this.frameRow + 1) * this.bufferY;
			
			ctx.drawImage(this.legsImage,
				imageX, imageY, this.frameWidth, this.frameHeight,
				this.x - halfW, this.y, this.width, 28);
		
			// sprite size-299x309
			// width-38	height-39
			// margin-16x15
			switch(this.shootDirection){
				// shooting up
				case 0:
					ctx.drawImage(this.torsoImage,
						965, 15, 299, 309,
						this.x - halfW, this.y - halfH, this.width, 39);
					break;
				// shooting right
				case 1:
					ctx.drawImage(this.torsoImage,
						16, 15, 299, 309,
						this.x - halfW, this.y - halfH, this.width, 39);
					break;
				// shooting down
				case 2:
					ctx.drawImage(this.torsoImage,
						651, 15, 299, 309,
						this.x - halfW, this.y - halfH, this.width, 39);
					break;
				// shooting left
				case 3:
					ctx.drawImage(this.torsoImage,
						331, 15, 299, 309,
						this.x - halfW, this.y - halfH, this.width, 39);
					break;
				default:
					
					break;
			}
		}
		
		
		
		// health bar
		ctx.fillStyle = "#0F0";
		ctx.fillRect(this.x - halfW, this.y + halfH, 
			(this.health * this.width)/this.MAX_HEALTH, 4);
	},
	
	// updates which frame in the animation to draw
	updateAnimation: function(dt){
		// leg animation update
		if(this.right){
			// right
			if(this.frameRow != 0){
				this.frameRow = 0;
				this.frameCol = 0;
			}
		} else if(this.left){
			// left
			if(this.frameRow != 1){
				this.frameRow = 1;
				this.frameCol = 0;
			}
		} else if(this.down){
			// down
			if(this.frameRow != 2){
				this.frameRow = 2;
				this.frameCol = 0;
			}
		} else if(this.up){
			// up
			if(this.frameRow != 3){
				this.frameRow = 3;
				this.frameCol = 0;
			}
		}
		
		this.lastTime += dt;
		if(this.lastTime >= this.frameDelay){
			this.lastTime = 0;
			this.frameCol++;
		}
		if(this.frameCol >= this.numCols){
			this.frameCol = 0;
		}
	},
	
	moveLeft: function(dt){
		this.x -= this.speed * dt;
		this.right = false;
		this.left = true;
		this.up = false;
		this.down = false;
		this.updateAnimation(dt);
	},
	
	moveRight: function(dt){
		this.x += this.speed * dt;
		this.right = true;
		this.left = false;
		this.up = false;
		this.down = false;
		this.updateAnimation(dt);
	},
	
	moveUp: function(dt){
		this.y -= this.speed * dt;
		this.right = false;
		this.left = false;
		this.up = true;
		this.down = false;
		this.updateAnimation(dt);
	},
	
	moveDown: function(dt){
		this.y += this.speed * dt;
		this.right = false;
		this.left = false;
		this.up = false;
		this.down = true;
		this.updateAnimation(dt);
	}
};