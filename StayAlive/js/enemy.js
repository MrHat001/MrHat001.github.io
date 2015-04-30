"use strict"
app.Enemy = function(){

	// creates the enemy, but also passes in which side is closest to the player
	// for a spawn point
	// type signifies if it is: 1-weak or 2-strong
	function Enemy(image, canvasWidth, canvasHeight, side, type){
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.active = true;
		this.age = Math.floor(Math.random() * 128);
		this.color = "#A2B";
		this.image = image;
		this.width = 17;
		this.height = 20;
		this.type = type;
		
		if(side === 0){
			this.x = this.canvasWidth / 2;
			this.y = 0;
		} else if(side === 1){
			this.x = this.canvasWidth;
			this.y = this.canvasHeight / 2;
		} else if(side === 2){
			this.x = this.canvasWidth / 2;
			this.y = this.canvasHeight;
		} else if(side === 3){
			this.x = 0;
			this.y = this.canvasHeight / 2;
		}
		
		if(this.type == 1){
			this.MAX_HEALTH = 3;
			this.health = 3;
			this.xVelocity = 100;
			this.yVelocity = 100;
			this.speed = 100;
			this.width = 35;
			this.height = 36;
		} else if(this.type == 2){
			this.MAX_HEALTH = 6;
			this.health = 6;
			this.xVelocity = 50;
			this.yVelocity = 50;
			this.speed = 50;
			this.width = 47;
			this.height = 50;
			this.x = 0;
			this.y = this.canvasHeight / 2;
		}
	};
	
	var p = Enemy.prototype;
	
	p.draw = function(ctx){
		var halfW = this.width / 2;
		var halfH = this.height / 2;
		
		if(!this.image){
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x - halfW, this.y - halfH, this.width, this.height);
		} else{
			if(this.type == 1){
				// sprite size- 475x491
				// width-23	height-24
				// margin size- 21x24
				if(this.xVelocity >= 0 && Math.abs(this.xVelocity) >= Math.abs(this.yVelocity)){
					// right
					ctx.drawImage(this.image,
						21, 24, 475, 491,
						this.x - halfW, this.y - halfH, this.width, this.height);
				} else if(this.xVelocity <= 0 && Math.abs(this.xVelocity) >= Math.abs(this.yVelocity)){
					// left
					ctx.drawImage(this.image,
						523, 24, 475, 491,
						this.x - halfW, this.y - halfH, this.width, this.height);
				} else if(this.yVelocity >= 0 && Math.abs(this.yVelocity) >= Math.abs(this.xVelocity)){
					// down
					ctx.drawImage(this.image,
						1024, 24, 475, 491,
						this.x - halfW, this.y - halfH, this.width, this.height);
				} else if(this.yVelocity <= 0 && Math.abs(this.yVelocity) >= Math.abs(this.xVelocity)){
					// up
					ctx.drawImage(this.image,
						1519, 24, 475, 491,
						this.x - halfW, this.y - halfH, this.width, this.height);
				}
			} else if(this.type == 2){
				// sprite size- 487x519
				// width-31	height-33
				// margin size- 22x26
				if(this.xVelocity >= 0 && Math.abs(this.xVelocity) >= Math.abs(this.yVelocity)){
					// right
					ctx.drawImage(this.image,
						22, 26, 487, 519,
						this.x - halfW, this.y - halfH, this.width, this.height);
				} else if(this.xVelocity <= 0 && Math.abs(this.xVelocity) >= Math.abs(this.yVelocity)){
					// left
					ctx.drawImage(this.image,
						537, 26, 487, 519,
						this.x - halfW, this.y - halfH, this.width, this.height);
				} else if(this.yVelocity >= 0 && Math.abs(this.yVelocity) >= Math.abs(this.xVelocity)){
					// down
					ctx.drawImage(this.image,
						1055, 26, 487, 519,
						this.x - halfW, this.y - halfH, this.width, this.height);
				} else if(this.yVelocity <= 0 && Math.abs(this.yVelocity) >= Math.abs(this.xVelocity)){
					// up
					ctx.drawImage(this.image,
						1555, 26, 487, 519,
						this.x - halfW, this.y - halfH, this.width, this.height);
				}
			}
		}
		
		// health bar
		// ****	easy enemy: #FF0	medium enemy: #F80	boss: #F00
		ctx.fillStyle = "#F00";
		ctx.fillRect(this.x - halfW, this.y + halfH, 
			(this.health * this.width)/this.MAX_HEALTH, 3);
	};
	
	p.update = function(dt){
		this.x += this.xVelocity * dt;
		this.y += this.yVelocity * dt;
		this.age++;
		this.active = this.active && inBounds(this);
	};
	
	p.explode = function(){
		this.active = false;
	};
	
	// Private
	function inBounds(obj){
		return obj.y <= obj.canvasHeight + obj.height * 0.5;
	};
	
	return Enemy;
}();