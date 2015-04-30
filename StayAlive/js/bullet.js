// bullet.js
// dependencies: none

"use strict";
var app = app || {};

app.Bullet = function(){

	function Bullet(x,y,xspeed, yspeed){
		// ivars - unique for every instance
		this.x = x;
		this.y = y;
		this.active = true;
		this.xVelocity = xspeed;
		this.yVelocity = -yspeed;
		this.width = 3;
		this.height = 3;
		this.color = "#0F0";
	} // end Bullet Constructor
	
	
	var p = Bullet.prototype;
		
	p.update = function(dt) {
		this.x += this.xVelocity * dt;
		this.y += this.yVelocity * dt;
		this.active = this.active && inBoundsY(this.y) && inBoundsX(this.x);
	};

	p.draw = function(ctx) {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	};
	
	// private method
	function inBounds(y){
		return y >= -10;
	};
	
	// checks if the bullet is onscreen y-axis
	function inBoundsY(y){
		return y >= -10 && y <= 490;
	};
	
	// checks if the bullet is onscreen x-axis
	function inBoundsX(x){
		return x >= -10 && x <= 650;
	};

	return Bullet; 
}();
