"use strict"

var app = app || {};

app.game = {
	WIDTH 			: 640,
	HEIGHT 			: 480,
	
	canvas			: undefined,
	ctx				: undefined,
	seesaw			: undefined,
	
	startScreen		: undefined,
	gameScreen		: undefined,
	endScreen		: undefined,
	
	player1Ready	: false,
	player1Score	: undefined,
	player2Ready	: false,
	player2Score	: undefined,
	
	zkeyImage		: undefined,
	upkeyImage		: undefined,
	
	soundtrack		: undefined,
	
	init : function(){
		console.log("game.init() called");
		
		this.canvas = document.querySelector('canvas');
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		this.ctx = this.canvas.getContext('2d');
		
		this.seesaw = app.Seesaw;
		this.seesaw.init(null, this.WIDTH / 2, this.HEIGHT * 3 / 5 - 20);
		
		this.player1Score = 0;
		this.player2Score = 0;
		
		this.zkeyImage = new Image();
		this.zkeyImage.src = app.IMAGES["zkeyImage"];
		
		this.upkeyImage = new Image();
		this.upkeyImage.src = app.IMAGES["upkeyImage"];
		
		this.startScreen = true;
		this.gameScreen = false;
		this.endScreen = false;
		
		this.soundtrak = createjs.Sound.play("backgroundSound", {loop:-1, volume:1});
		
		this.update();
	},
	
	update : function(){
		requestAnimationFrame(this.update.bind(this));
		
		this.moveSprites();
		
		this.drawSprites();
	},
	
	moveSprites : function(){	
		if(app.keydown[app.KEYBOARD.KEY_Z] && this.gameScreen){
			//this.seesaw.increaseLeftSide();
			this.seesaw.player1Up();
			createjs.Sound.play("gruntSound");
			
			if(!this.player1Ready){
				this.player1Ready = true;
			}
		}
	
		if(app.keydown[app.KEYBOARD.KEY_UP] && this.gameScreen){
			//this.seesaw.increaseRightSide();
			this.seesaw.player2Up();
			createjs.Sound.play("gruntSound");
			
			if(!this.player2Ready){
				this.player2Ready = true;
			}
		}
		
		if(app.keydown[app.KEYBOARD.KEY_SPACE]){
			if(this.startScreen){
				this.startScreen = false;
				this.gameScreen = true;
			}
			if(this.endScreen){
				this.endScreen = false;
				this.gameScreen = true;
				this.restart();
			}
		}
		
		if(this.player1Ready && this.player2Ready){
			this.seesaw.start();
		}
		
		this.seesaw.update();
	},
	
	drawSprites : function(){
		this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
		if(this.startScreen){					// draw starting screen
			this.ctx.font = "bold 40px Ariel";
			this.ctx.textAlign = "center";
			this.ctx.fillText("Seesaw of DEATH", this.WIDTH / 2, this.HEIGHT * 2 / 5);
			this.ctx.font = "bold 20px Ariel";
			this.ctx.fillText("or", this.WIDTH / 2, this.HEIGHT * 2 / 5 + 25);
			this.ctx.font = "bold 24px Ariel";
			this.ctx.fillText("How I learned to Hate the Bomb", this.WIDTH / 2, this.HEIGHT * 2 / 5 + 50);
			this.ctx.font = "bold 16px Ariel";
			this.ctx.fillText("(P.S. Dont touch the bomb)", this.WIDTH / 2, this.HEIGHT * 2 / 5 + 75);
			
			this.ctx.font = "bold 24px Ariel";
			this.ctx.fillText("Press SPACE to Start", this.WIDTH / 2, this.HEIGHT * 4 / 5);
		} else if(this.gameScreen){				// draw game screen
			this.ctx.font = "bold 24px Ariel";
			this.ctx.textAlign = "left";
			this.ctx.fillText("Player 1: " + this.player1Score, 50, 50);
			this.ctx.fillText("Player 2: " + this.player2Score, this.WIDTH - 150, 50);
		
			this.ctx.fillText("Player 1:", 50, 375);
			if(this.player1Ready){
				this.ctx.fillText("READY", 50, 400);
			} else {
				this.ctx.fillText("NOT READY", 50, 400);
			}
		
			this.ctx.drawImage(this.zkeyImage, 75, 410);
		
			this.ctx.fillText("Player 2:", this.WIDTH - 150, 375);
			if(this.player2Ready){
				this.ctx.fillText("READY", this.WIDTH - 150, 400);
			} else {
				this.ctx.fillText("NOT READY", this.WIDTH - 150, 400);
			}
		
			this.ctx.drawImage(this.upkeyImage, this.WIDTH - 125, 410);
		
			this.ctx.save();
			this.ctx.beginPath();
			this.ctx.moveTo(0, 345);
			this.ctx.lineTo(640, 345);
			this.ctx.closePath();
			this.ctx.stroke();
			this.ctx.restore();
		
			this.seesaw.draw(this.ctx);
		} else if(this.endScreen){				// draw end screen
			this.ctx.font = "bold 40px Ariel";
			this.ctx.textAlign = "center";
			if(this.player1Score == 5){
				this.ctx.fillText("PLAYER 1 WINS!", this.WIDTH / 2, this.HEIGHT * 2 / 5);
			} else {
				this.ctx.fillText("PLAYER 2 WINS!", this.WIDTH / 2, this.HEIGHT * 2 / 5);
			}
			this.ctx.font = "bold 24px Ariel";
			this.ctx.fillText("Press Space to Play Again", this.WIDTH / 2, this.HEIGHT * 3 / 5);
			this.ctx.font = "bold 16px Ariel";
			this.ctx.fillText("by Everett Leo", this.WIDTH - 80, this.HEIGHT - 20);
		}
	},
	
	restart : function(){
		console.log("game.restart() called");
		this.player1Score = 0;
		this.player2Score = 0;
	},
	
	player1Point : function(){
		this.player1Score++;
		if(this.player1Score == 5){
			this.gameScreen = false;
			this.endScreen = true;
		}
	},
	
	player2Point : function(){
		this.player2Score++;
		if(this.player2Score == 5){
			this.gameScreen = false;
			this.endScreen = true;
		}
	}
};