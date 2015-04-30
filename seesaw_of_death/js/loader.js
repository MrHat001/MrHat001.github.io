/*
loader.js
variable 'app' is in global scope - i.e. a property of window.
app is our single global object literal - all other functions and properties of 
the game will be properties of app.
*/
"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

app.KEYBOARD = {
	"KEY_SPACE": 32,
	"KEY_UP": 38,
	"KEY_Z":90
};

app.keydown = [];

app.IMAGES = {
	bombImage: "images/bomb.png",
	zkeyImage: "images/z-key.png",
	upkeyImage: "images/up-key.png",
	player1Images: "images/player1spritesheet.png",
	player2Images: "images/player2spritesheet.png",
	explosionImages: "images/explosion.png"
};

window.onload = function(){
	console.log("window.onload called");
	
	window.addEventListener("keydown", function(e){
		app.keydown[e.keyCode] = true;
	});
	
	window.addEventListener("keyup", function(e){
		app.keydown[e.keyCode] = false;
	});
	
	app.queue = new createjs.LoadQueue(false);
	app.queue.installPlugin(createjs.Sound);
	app.queue.on("complete", function(){
		console.log("images loaded called");
		app.game.init();
	});
	
	app.queue.loadManifest([
			{id:"bombImage", src:"images/bomb.png"},
			{id:"zkeyImage", src:"images/z-key.png"},
			{id:"upkeyImage", src:"images/up-key.png"},
			{id:"player1Images", src:"images/player1spritesheet.png"},
			{id:"player2Images", src:"images/player2spritesheet.png"},
			{id:"explosionImages", src:"images/explosion.png"},
			{id:"explosionSound", src:"sounds/grenade.wav"},
			{id:"gruntSound", src:"sounds/grunt.wav"},
			{id:"backgroundSound", src:"sounds/background.wav"}
	]);
}