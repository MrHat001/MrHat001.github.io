"use strict"
var app = app || {};

app.Boss = function(){

	function Boss(image, canvasWidth, canvasHeight, side){
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.active = true;
		this.color = "blue";
		this.image = image;
		this.width = 57;
		this.height = 45;
		this.MAX_HEALTH = 50;
		this.health = 50;
		this.xVelocity = 85;
		this.yVelocity = 85;
		this.speed = 76;
		this.coolDown = 30;
		this.doesAttack = false;
		// get these according to the side
		
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
	};
	
	var p = Boss.prototype;
		
	p.draw = function(ctx){
		var halfW = this.width / 2;
		var halfH = this.height / 2;
		
		if(!this.image){
			app.draw.rect(ctx, this.x - halfW, this.y - halfH, this.width, this.height, this.color);
		} else {
			// sprite size-596x472
			// width-38	height-30
			// margin size x-27	y-23
			if(this.xVelocity >= 0 && Math.abs(this.xVelocity) >= Math.abs(this.yVelocity)){
				// right
				ctx.drawImage(this.image,
					655, 23, 596, 472,
					this.x - halfW, this.y - halfH, this.width, this.height);
			} else if(this.xVelocity <= 0 && Math.abs(this.xVelocity) >= Math.abs(this.yVelocity)){
				// left
				ctx.drawImage(this.image,
					27, 23, 596, 472,
					this.x - halfW, this.y - halfH, this.width, this.height);
			} else if(this.yVelocity >= 0 && Math.abs(this.yVelocity) >= Math.abs(this.xVelocity)){
				// down
				ctx.drawImage(this.image,
					1282, 23, 596, 472,
					this.x - halfW, this.y - halfH, this.width, this.height);
			} else if(this.yVelocity <= 0 && Math.abs(this.yVelocity) >= Math.abs(this.xVelocity)){
				// up
				ctx.drawImage(this.image,
					1910, 23, 596, 472,
					this.x - halfW, this.y - halfH, this.width, this.height);
			}
		}
		
		ctx.fillStyle = "#F00";
		ctx.fillRect(this.x - halfW, this.y + halfH, 
			(this.health * this.width)/this.MAX_HEALTH, 3);
	};
	
	p.update = function(dt){
		this.coolDown--;
		if(this.coolDown <= 0){
			var chance = Math.random() * 100;
			if(this.health <= 15){
				if(chance >= 50){
					this.health += 10;
				}
			}
			this.coolDown = 30;
		}
		
		this.x += this.xVelocity * dt;
		this.y += this.yVelocity * dt;
	};
	
	p.explode = function(){
		this.active = false;
		app.win = true;
	}
	
	return Boss;
}();