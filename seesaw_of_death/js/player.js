"use strict"

var app = app || {};

app.Player = function(){
	function Player(inImage, inX, inY, inWidth, inHeight){
		console.log("Player constuctor called");
		
		this.image = inImage;
		this.x = inX;
		this.y = inY;
		this.width = inWidth;
		this.height = inHeight;
		this.color = "green";
		
		this.animate = false;
		this.frameWidth = 30;
		this.frameHeight = 75;
		this.frameDelay = 4;
		this.numCols = 4;
		this.totalFrames = 4;
		this.frameIndex = 0;
		this.lastTime = 0;
	};
	
	var p = Player.prototype;
	
	p.draw = function(ctx){
		var halfW = this.width / 2;
		var halfH = this.height / 2;
		if(!this.image){
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x - halfW, this.y - halfH, this.width, this.height);
		} else {
			var col = this.frameIndex % this.numCols;
			var imageX = col * this.frameWidth;
			var imageY = 0;
			
			ctx.drawImage(this.image,
				imageX, imageY, this.frameWidth, this.frameHeight,
				this.x - halfW, this.y - halfH, this.width, this.height
			);
		}
	};
	
	p.update = function(){
		if(this.animate){
			this.lastTime += 1;
			if(this.lastTime >= this.frameDelay){
				this.lastTime = 0;
				this.frameIndex++;
			}
			if(this.frameIndex >= this.totalFrames){
				this.frameIndex = 0;
				this.animate = false;
			}
		}
	};
	
	p.input = function(){
		if(!this.animate){
			this.animate = true;
		}
	};

	return Player;
}();