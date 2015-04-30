"use strict"

var app = app || {};

app.Seesaw = {
	WIDTH		: 400,
	HEIGHT		: 10,
	
	x			: undefined,
	y			: undefined,
	image		: undefined,
	randomTilt	: undefined,
	tilt		: undefined,
	tiltVel		: undefined,
	moving		: undefined,
	color		: undefined,
	bomb		: undefined,
	player1		: undefined,
	player2		: undefined,

	init : function(inImage, inX, inY){
		console.log("Seesaw constructor called");
		this.x = inX;
		this.y = inY;
		this.image = inImage;
		this.randomTilt = Math.random() * 2 - 1;
		if(this.randomTilt > 0){
			this.tilt = 15;
		} else {
			this.tilt = -15;
		}
		this.tiltVel = 0;
		this.moving = false;
		this.color = "black";
		
		var bombImage = new Image();
		bombImage.src = app.IMAGES["bombImage"];
		this.bomb = new app.Bomb(bombImage, 0, -25, 20);

		var p1Image = new Image();
		p1Image.src = app.IMAGES["player1Images"];
		this.player1 = new app.Player(p1Image, -this.WIDTH / 2 + 10, -25, 60, 150);
		
		var p2Image = new Image();
		p2Image.src = app.IMAGES["player2Images"];
		this.player2 = new app.Player(p2Image, this.WIDTH / 2 -10, -25, 60, 150);
	},
	
	draw : function(ctx){
		var halfW = this.WIDTH / 2;
		var halfH = this.HEIGHT / 2;
	
		if(!this.image){
			ctx.beginPath();
			ctx.moveTo(this.x, this.y);
			ctx.lineTo(this.x - 63, this.y + 77);
			ctx.lineTo(this.x + 63, this.y + 77);
			ctx.closePath();
			ctx.fill();
		}
	
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.tilt * Math.PI / 180);
		
		if(!this.image){
			ctx.fillStyle = this.color;
			ctx.fillRect(-halfW, -halfH, this.WIDTH, this.HEIGHT);
		}
		
		this.player1.draw(ctx);
		this.player2.draw(ctx);
		this.bomb.draw(ctx);
		
		ctx.restore();
	},
	
	player1Up : function(){
		if(this.tilt == -15){
			this.tiltVel = 1;
		}
		this.player1.input();
	},
	
	player2Up : function(){
		if(this.tilt == 15){
			this.tiltVel = -1;
		}
		this.player2.input();
	},
	
	update : function(){
		if(this.tilt == 15 && this.tiltVel == 1){
			this.tiltVel = 0;
		} else if(this.tilt == -15 && this.tiltVel == -1){
			this.tiltVel = 0;
		}
		
		this.tilt += this.tiltVel;
		
		// bomb movement
		this.bomb.acc = this.tilt / 15;
		this.bomb.update();
		
		this.player1.update();
		this.player2.update();
	},
	
	reset : function(){
		this.randomTilt = Math.random() * 2 - 1;
		if(this.randomTilt > 0){
			this.tilt = 15;
		} else {
			this.tilt = -15;
		}
	},
	
	start : function(){
		this.bomb.startBomb();
	}
};