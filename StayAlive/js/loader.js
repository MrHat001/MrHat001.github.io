/*
loader.js
variable app is in global scope - i.e. a property of window.
app is our single global object literal - all other functions and properties of 
the bubbles game will be properties of app.
*/
"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

// CONSTANTS
app.KEYBOARD = {
	"KEY_A": 65,
	"KEY_W": 87,
	"KEY_D": 68,
	"KEY_S": 83,
	"KEY_LEFT": 37, 
	"KEY_UP": 38, 
	"KEY_RIGHT": 39, 
	"KEY_DOWN": 40,
	"KEY_SPACE": 32
};

app.IMAGES = {
    backgroundImage: "images/Background.jpg",
    playerTorsoImage: "images/Human_Torso.png",
    playerLegsImage: "images/Human_Legs.png",
    enemy1Image: "images/Roboto_1.png",
    enemy2Image: "images/Roboto_2.png",
    bossImage: "images/Robot_Boss.png",
    explosionAnimationImage: "images/explosionAnimation.png"
 };


// properties of app that will be accessed by the blastem.js module
app.animationID = undefined;
app.paused = false;
app.win = false;
app.loose = false;
app.menu = true;
app.instructions = false;

// app.keydown array to keep track of which keys are down
// this is called a "key daemon"
// blastem.js will "poll" this array every frame
// this works because JS has "sparse arrays" - not every language does
app.keydown = [];
app.keyup = [];

// the Modernizr object is from the modernizr.custom.js file
Modernizr.load(
	{ 
		// load all of these files
		load : [
			'js/polyfills.js',
			'js/utilities.js',
			'js/game.js',
			'js/draw.js',
			'js/ship.js',
			'js/bullet.js',
			'js/enemy.js',
			'js/explosionSprite.js',
			'js/wave.js',
			'js/boss.js',
			app.IMAGES['backgroundImage'],
			app.IMAGES['playerTorsoImage'],
			app.IMAGES['playerLegsImage'],
			app.IMAGES['enemy1Image'],
			app.IMAGES['enemy2Image'],
			app.IMAGES['bossImage'],
			app.IMAGES['explosionAnimationImage']
		],
		
		// when the loading is complete, this function will be called
		complete: function(){
			
			// set up event handlers
			window.onblur = function(){
				app.paused = true;
				cancelAnimationFrame(app.animationID);
				app.keydown = []; // clear key daemon
				// call update() so that our paused screen gets drawn
				app.blastem.update();
				createjs.Sound.stop();
			};
			
			window.onfocus = function(){
				app.paused = false;
				cancelAnimationFrame(app.animationID);
				// start the animation back up
				app.blastem.update();
				app.blastem.startSoundtrack();
			};
			
			// event listeners
			window.addEventListener("keydown",function(e){
				//console.log("keydown=" + e.keyCode);
				app.keydown[e.keyCode] = true;
			});
				
			window.addEventListener("keyup",function(e){
				//console.log("keyup=" + e.keyCode);
				app.keydown[e.keyCode] = false;
			});
			
			// start loading sounds
			//createjs.Sound.alternateExtensions = ["mp3"];
			createjs.Sound.registerSound({id:"bullet", src:"sounds/lazer-beam.wav"});
			createjs.Sound.registerSound({id:"explosion", src:"sounds/explosion.wav"});
			createjs.Sound.registerSound({id:"soundtrack", src:"sounds/background.wav"});
						
			createjs.Sound.addEventListener("fileload", handleFileLoad);
			
			function handleFileLoad(e){
				//console.log("Preloaded Sound:", e.id, e.src);
				//if(e.src == "sounds/soundtrack.ogg") app.blastem.startSoundtrack();
			}
			
			// start game
			app.blastem.init();
		} // end complete
		
	} // end object
); // end Modernizr.load
