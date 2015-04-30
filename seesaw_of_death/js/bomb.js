"use strict"

var app = app || {};

app.Bomb = function(){
	function Bomb(inImage, inX, inY, inRadius){
		console.log("Bomb constuctor called");
		
		this.image = inImage;
		this.startX = inX;
		this.startY = inY;
		this.x = inX;
		this.y = inY;
		this.radius = inRadius;
		this.color = "red";
		this.timer = 0;
		this.countDown = 20;
		this.font = "bold 20px Ariel";
		this.vel = 0;
		this.acc = 0;
		this.start = false;
		this.rot = 0;
		this.active = true;
		
		// explosion
		this.explode = false;
		this.explosionImage = new Image();
		this.explosionImage.src = app.IMAGES["explosionImages"];
		this.frameWidth = 96;
		this.frameHeight = 96;
		this.frameDelay = 5;
		this.numCols = 5;
		this.numRows = 4;
		this.totalFrames = this.numCols * this.numRows;
		this.frameIndex = 0;
		this.lastTime = 0;
	};
	
	var p = Bomb.prototype;
	
	p.draw = function(ctx){
	//debugger;
		ctx.save();
		ctx.translate(this.x, this.y);
		if(this.start && !this.explode){
			if(this.vel > 0){
				this.rot += 2;
			} else {
				this.rot -= 2;
				
			}
		}
		ctx.rotate(this.rot * Math.PI / 180);
		if(this.active){
			if(!this.image){
				ctx.save();
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
				ctx.fillStyle = this.color;
				ctx.fill();
				ctx.restore();
			} else {
				ctx.drawImage(this.image, -this.radius, -this.radius, this.radius * 2, this.radius * 2);
			}
		}
		
		ctx.font = this.font;
		if(!this.explode){
			if(this.countDown >= 10){
				ctx.fillText(this.countDown, -10, 7);
			} else {
				ctx.fillText("0" + this.countDown, -10, 7);
			}
		}
		ctx.restore();
		
		if(this.explode){
			var col = this.frameIndex % this.numCols;
			var row = Math.floor(this.frameIndex / this.numCols);
			var imageX = col * this.frameWidth;
			var imageY = row * this.frameHeight;
			//debugger;
			ctx.drawImage(
				this.explosionImage,
				imageX, imageY, this.frameWidth, this.frameHeight,
				this.x - this.frameWidth, this.y - this.frameHeight,
				this.frameWidth * 2, this.frameHeight * 2
			)
		}
	};
	
	p.update = function(){
		if(this.start){
			if(this.explode){
				this.lastTime += 1;
				if(this.lastTime >= this.frameDelay){
					this.lastTime = 0;
					this.frameIndex++;
				}
				if(this.frameIndex >= this.totalFrames){
					this.frameIndex = 0;
					if(this.x < 0){
						this.player1lose();
					} else {
						this.player2lose();
					}
				}
			}
				
			if(this.countDown == 0){
				this.explodeBomb();
			}
		
			this.vel += this.acc / 5;
			if(this.vel >= 2){
				this.vel = 2;
			} else if(this.vel <= -2){
				this.vel = -2;
			}
			
			if(this.explode){
				this.vel = 0;
			}
		
		
			if(this.x < 150 && this.x > -150){
				this.x += this.vel;
			}
		
			if(this.x >= 150){
				this.explodeBomb();
			} else if(this.x <= -150){
				this.explodeBomb();
			}
		
			this.timer++;
			if(this.timer > 60 && this.countDown > 0 && this.start){
				this.countDown--;
				this.timer = 0;
			}
		}
	};
	
	p.explodeBomb = function(){
		if(!this.explode){
			this.active = false;
			this.explode = true;
		}
		createjs.Sound.play("explosionSound");
	};
	
	p.player1lose = function(){
		app.game.player2Point();
		this.reset();
	};
	
	p.player2lose = function(){
		app.game.player1Point();
		this.reset();
	}
	
	p.bothlose = function(){
		this.reset();
	}
	
	p.reset = function(){
		this.x = this.startX;
		this.y = this.startY;
		this.vel = 0;
		this.acc = 0;
		this.rot = 0;
		this.timer = 0;
		this.countDown = 20;
		this.start = false;
		this.explode = false;
		this.active = true;
		app.game.player1Ready = false;
		app.game.player2Ready = false;
		app.Seesaw.reset();
	};
	
	p.startBomb = function(){
		if(!this.start){
			this.rot = 0;
			this.start = true;
		}
	};
	
	return Bomb;
}();