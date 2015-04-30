// city.js
"use strict";
// if app exists use the existing copy
// else create a new object literal
var app = app || {};


app.city = {
	// CONSTANT properties
	
	// variable properties
	renderer: undefined,
	scene: undefined,
	camera: undefined,
	myobjects: [],
	paused: false,
	dt: 1/60,
	controls: undefined,
	// **added stuffs
	playerBox: undefined,
	playerBB: undefined,
	fishBB: undefined,
	texture_placeholder : undefined,
	skyMesh : undefined,
	
	testMesh: undefined,
	
	CURRENT_LEVEL : 0, 
	MAX_GOOD_FISH:  0, 
	MAX_BAD_FISH : 0, 
	NUM_GOOD_FISH : 0,
	NUM_BAD_FISH : 0,
	FISH_SPEED : .001,
	score: 0,
	
	//***lazers***
	lazerArray: [],
	spaceDown: false,
	//***lazers***
	
	zombieArray :[],
	
	fishArray : [],
	
	init : function() {
		
		console.log('init called');
		this.controls = new THREE.FirstPersonControls(this.camera);
		// EWWW
		/*this.texture_placeholder = document.createElement( 'canvas' );
		this.texture_placeholder.width = 128;
		this.texture_placeholder.height = 128;*/
		this.MAX_BAD_FISH = 2;
		this.MAX_GOOD_FISH = 5;
		
		this.setupThreeJS();
		this.setupWorld();
		// Load models
		var loader = new THREE.JSONLoader();
		//loader.load( "models/angelfish.js", this.addModelToScene.bind(this) );
		//loader.load( "models/angelfish.js", this.addModelToScene.bind(this) );
		this.resetLevel();

	},
		
	addModelToScene: function( geometry, materials ){
		var material = new THREE.MeshFaceMaterial( materials );
		this.testMesh = new THREE.Mesh( geometry, material );
		this.testMesh.scale.set(10, 10, 10);
		this.scene.add( this.testMesh );
	},
		
    	    	
    update: function(){
	// schedule next animation frame
    	app.animationID = requestAnimationFrame(this.update.bind(this));
    	
		// PAUSED?
		if (app.paused){
			this.drawPauseScreen();
			return;
		 }
		// UPDATE
		this.controls.update(this.dt);
		// **update playerBB
		var xOffset = this.camera.position.x - this.playerBox.position.x;
		var yOffset = this.camera.position.y - this.playerBox.position.y;
		var zOffset = this.camera.position.z - this.playerBox.position.z;
		this.playerBox.position.x = this.camera.position.x;
		this.playerBox.position.y = this.camera.position.y;
		this.playerBox.position.z = this.camera.position.z;
		var offsetVector = new THREE.Vector3(xOffset, yOffset, zOffset);
		this.playerBB.translate(offsetVector);
	
		this.skyMesh.position = (this.camera.position);
		
		// ********shoot code********
		if(!app.keydown[app.KEYBOARD.KEY_SPACE] && this.spaceDown)
			this.spaceDown = false;
		if(app.keydown[app.KEYBOARD.KEY_SPACE] && !this.spaceDown){
			//console.log("shoot");
			this.shoot();
			this.spaceDown = true;
		}
		
		// lazers!
		for(var i = 0; i < this.lazerArray.length; i++){
			if(!this.lazerArray[i].active){
				this.scene.remove(this.lazerArray[i].mesh);
				this.scene.remove(this.lazerArray[i].BB);
			}
		}
		
		this.lazerArray = this.lazerArray.filter(function(lazer){
			return lazer.active;
		});
		
		for(var i = 0; i < this.lazerArray.length; i++){
			// move everything first
			this.lazerArray[i].mesh.position.x += this.lazerArray[i].velocity.x;
			this.lazerArray[i].mesh.position.y += this.lazerArray[i].velocity.y;
			this.lazerArray[i].mesh.position.z += this.lazerArray[i].velocity.z;
			this.lazerArray[i].BB.translate(this.lazerArray[i].velocity);
			
			for(var j = 0; j < this.zombieArray.length;j++){
				if(this.lazerArray[i].BB.isIntersectionBox(this.zombieArray[j].BB)){
				
					this.scene.remove(this.zombieArray[j].Mesh);
					this.scene.remove(this.zombieArray[j].BB);
					this.zombieArray[j].active = false;
					this.scene.remove(this.lazerArray[i].mesh);
					this.scene.remove(this.lazerArray[i].BB);
					this.lazerArray[i].active = false;
					// increment score
					this.score +=5;
				}
			}
			
			for(var j = 0; j < this.fishArray.length; j++){
				if(this.lazerArray[i].BB.isIntersectionBox(this.fishArray[j].BB)){
					this.scene.remove(this.fishArray[j].Mesh);
					this.scene.remove(this.fishArray[j].BB);
					this.fishArray[j].active = false;
					this.scene.remove(this.lazerArray[i].mesh);
					this.scene.remove(this.lazerArray[i].BB);
					this.lazerArray[i].active = false;
					// decrement score
					console.log("hit fish");
					this.score-=10;
				}
			}
		}
		
		this.checkLazerBoundaries();
		//***lazers***
	
		// bounds for the camera
		if(this.camera.position.x > 500)
			this.camera.position.x = 500;
		else if(this.camera.position.x < -500)
			this.camera.position.x = -500;
		if(this.camera.position.y > 500)
			this.camera.position.y = 500;
		else if(this.camera.position.y < -500)
			this.camera.position.y = -500;
		if(this.camera.position.z > 500)
			this.camera.position.z = 500;
		else if(this.camera.position.z < -500)
			this.camera.position.z = -500;
		
		// DRAW	
		this.renderer.render(this.scene, this.camera);
		
		this.zombieArray = this.zombieArray.filter(function(zombie){
			return zombie.active;
		});
		
		this.fishArray = this.fishArray.filter(function(fish){
			return fish.active;
		});
		
		this.updateFish();
		// Render HUD
		this.drawHUD();
	},
	
	drawHUD : function()
	{
		document.querySelector('#score').innerHTML = "Score: " + this.score + " Zombies left: " + (this.zombieArray.length);
	},
	
	
	drawPauseScreen : function()
	{
		document.querySelector('#pauseScreen').style.display = 'block';
	},
	updateFish : function()
	{
		// if all the zombies are dead, then time to reset the level
		if(this.zombieArray.length == 0){ console.log("Resetting level"); this.resetLevel();		}

		// Every fish flees the closest ZombieFish
		for(var  i = 0; i < this.fishArray.length; i++)
		{

			this.FISH_SPEED = 3;
			
			var x = app.utilities.getRandom(-this.FISH_SPEED,this.FISH_SPEED);
			var y = app.utilities.getRandom(-this.FISH_SPEED,this.FISH_SPEED);
			var z = app.utilities.getRandom(-this.FISH_SPEED,this.FISH_SPEED);
			this.fishArray[i].Mesh.translateX(x); 
			this.fishArray[i].Mesh.translateY(y); 
			this.fishArray[i].Mesh.translateZ(z);
			this.fishArray[i].BB.setFromObject(this.fishArray[i].Mesh);
		}

		// Every zombiefish chases the closest Fish
		for(var i =0; i< this.zombieArray.length; i++)
		{
			var closestFishLength;
			var closestFishIndex;
			
			var x = app.utilities.getRandom(-this.FISH_SPEED,this.FISH_SPEED);
			var y = app.utilities.getRandom(-this.FISH_SPEED,this.FISH_SPEED);
			var z = app.utilities.getRandom(-this.FISH_SPEED,this.FISH_SPEED);
			this.zombieArray[i].Mesh.translateX(x); 
			this.zombieArray[i].Mesh.translateY(y); 
			this.zombieArray[i].Mesh.translateZ(z);
			this.zombieArray[i].BB.setFromObject(this.zombieArray[i].Mesh);
			//this.zombieArray[i].position.set(this.zombieArray[i].position.x +x,this.zombieArray[i].position.y +y,this.zombieArray[i].position.z +z);// this.zombieArray[i].position.y = y; this.zombieArray[i].position.z = z;
		}
	},
	
	distToPoint : function(object1X,object1Y,object1Z, object2X,object2Y,object2Z)
	{
		var objectDistance = Math.sqrt((object2X-object1X)*(object2X-object1X) + 
                      (object2Y-object1Y)*(object2Y-object1Y) + 
                      (object2Z-object1Z)*(object2Z-object1Z));
					  
		return objectDistance;
	},
	
	GetDirections : function (x1, x2)
	{
		return (x2 - x1); // if returns negative, that means we need to go neg in this direction
	},
	
	// Get the vector oppo
	getOpposingVector : function (x,y,z, x2, y2, z2)
	{
		var xDist = x2 - x;
		var yDist = y2 - y; 
		var zDist = z2 - z;
	},
	
	
	loadTexture:function( path ) 
	{
		
		var texture = new THREE.Texture( this.texture_placeholder );
		var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 });
		var image = new Image();
		image.onload = function () {

			texture.image = this;
			texture.needsUpdate = true;

		};
		image.src = path;
		console.log("Loaded texture: " + image.src);
		
		
		return material;
	},
	
	setupThreeJS: function() {
				this.scene = new THREE.Scene();
				//this.scene.fog = new THREE.Fog(0x000000, 0.004);

				this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
				this.camera.position.y = 200;
				//this.camera.position.z = 400;
				this.camera.rotation.x = -45 * Math.PI / 180;
				
				// **player Bounding Box
				var bBGeometry = new THREE.CubeGeometry(10, 10, 10);
				var bBMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
				this.playerBox = new THREE.Mesh(bBGeometry, bBMaterial);				
				this.playerBox.position.x = this.camera.position.x;
				this.playerBox.position.y = this.camera.position.y;
				this.playerBox.position.z = this.camera.position.z;
				this.scene.add(this.playerBox);

				this.playerBB = new THREE.Box3();
				this.playerBB.setFromObject(this.playerBox);
				this.scene.add(this.playerBB);
	
				// ???? skybox stuff
				this.texture_placeholder = document.createElement( 'canvas' );
				this.texture_placeholder.width = 128;
				this.texture_placeholder.height = 128;
				
				// Set up skybox
				var materials = [

					this.loadTexture( 'textures/cube/skybox/px.jpg' ), // right
					this.loadTexture( 'textures/cube/skybox/nx.jpg' ), // left
					this.loadTexture( 'textures/cube/skybox/py.jpg' ), // top
					this.loadTexture( 'textures/cube/skybox/ny.jpg' ), // bottom
					this.loadTexture( 'textures/cube/skybox/pz.jpg' ), // back
					this.loadTexture( 'textures/cube/skybox/nz.jpg' )  // front

				];
				
				// Add the box mesh and stuff
				this.skyMesh = new THREE.Mesh( new THREE.CubeGeometry( 1000, 1000, 1000, 100, 100, 100 ), new THREE.MeshFaceMaterial( materials ) );
				this.skyMesh.scale.x = - 1; // necessary
				this.scene.add( this.skyMesh );
				
				this.renderer = new THREE.WebGLRenderer({antialias: true});
				this.renderer.setSize( window.innerWidth, window.innerHeight );
				this.renderer.shadowMapEnabled = true;
				document.body.appendChild(this.renderer.domElement );

				this.controls = new THREE.FirstPersonControls(this.camera);
				this.controls.movementSpeed = 100;
				this.controls.lookSpeed = 0.15;
				this.controls.autoForward = false;
	},
	
	
	// Takes a position and makes a fish.
	makeZombieFish : function(fx, fy, fz)
	{
		var mat = new THREE.MeshPhongMaterial({color: 0xde1f29, overdraw: true});
		var geom = new THREE.CubeGeometry(20,20,20);
		var fish = new THREE.Mesh(geom, mat);
		fish.castShadow = true;
		/*var boundingbox = new THREE.Box3();
		boundingBox.setFromObject(fish);*/
		

		fish.position.set(fx,fy,fz);
		
		var boundingBox = new THREE.Box3();
		boundingBox.setFromObject(fish);
		
		this.scene.add(fish);
		
		var returnable = {
			Mesh: fish,
			BB: boundingBox,
			active: true
		};
		return returnable;
		
	},
	
	// Takes a position and makes a fish.
	makeFish : function(fx, fy, fz)
	{
		console.log("Make fish: " + fx +", " + fy + "," + fz);
		var mat = new THREE.MeshPhongMaterial({color: 0xc4dcf5, overdraw: true});
		var geom = new THREE.CubeGeometry(20,20,20);
		var fish = new THREE.Mesh(geom, mat);
		fish.castShadow = true;

		fish.position.set(fx,fy,fz);
		
		this.scene.add(fish);
		
		var boundingBox = new THREE.Box3();
		boundingBox.setFromObject(fish);
		
		var returnable = {
			Mesh: fish,
			BB: boundingBox,
			active: true
		};
		return returnable;
		
	},
	
	// Reset the level and the number of fish.
	resetLevel : function()
	{
	
		for(var  i = 0; i < this.fishArray.length; i++)
		{
			this.scene.remove(this.fishArray[i].Mesh);
			this.scene.remove(this.fishArray[i].BB);
		}
		
		for(var  i = 0; i < this.zombieArray.length; i++)
		{
			this.scene.remove(this.zombieArray[i].Mesh);
			this.scene.remove(this.zombieArray[i].BB);
		}
	
		// Increase the amount of stuff that's going on
		this.MAX_BAD_FISH = this.MAX_BAD_FISH*1.5;
		this.MAX_GOOD_FISH = this.MAX_GOOD_FISH*1.5;
		
		// Update numbers
		this.NUM_BAD_FISH = this.MAX_BAD_FISH;
		this.NUM_GOOD_FISH = this.MAX_BAD_FISH; 
		
		// Obliterate remaining fish
		this.fishArray = [];
		this.zombieArray = [];
		
		for(var  i = 0; i < this.MAX_BAD_FISH; i++)
		{
			this.zombieArray.push(this.makeZombieFish( app.utilities.getRandom(-300,300), app.utilities.getRandom(-300,300), app.utilities.getRandom(-300,300) ));
		}
		
		for(var  i = 0; i < this.MAX_GOOD_FISH; i++)
		{
			this.fishArray.push(this.makeFish( app.utilities.getRandom(-300,300), app.utilities.getRandom(-300,300), app.utilities.getRandom(-300,300) ));
		}
		
		
	},
	
	
	
	setupWorld: function() {

				var geo = new THREE.PlaneGeometry(2000, 2000, 40, 40);
				var mat = new THREE.MeshPhongMaterial({color: 0x116130, overdraw: true, transparent: true, opacity: .2});
				var floor = new THREE.Mesh(geo, mat);
				floor.rotation.x = -0.5 * Math.PI;
				floor.translate(0,-900,0);
				floor.receiveShadow = true;
				this.scene.add(floor);
				

			
				// add directional light and enable shadows
				var light = new THREE.DirectionalLight(0xf9f1c2, 1);
				light.position.set(400, 400, 400);
				light.castShadow = true;
				light.shadowMapWidth = 2048;
				light.shadowMapHeight = 2048;
				
				var d = 1000;
				light.shadowCameraLeft = d;
				light.shadowCameraRight = -d;
				light.shadowCameraTop = d;
				light.shadowCameraBottom = -d;
				light.shadowCameraFar = 2500;
				this.scene.add(light);
				// light 2
				var light = new THREE.DirectionalLight(0xf9f1c2, 1);
				light.position.set(-400, 400, -400);
				light.castShadow = true;
				light.shadowMapWidth = 1024;
				light.shadowMapHeight = 1024;
				
				var d = 1000;
				light.shadowCameraLeft = d;
				light.shadowCameraRight = -d;
				light.shadowCameraTop = d;
				light.shadowCameraBottom = -d;
				light.shadowCameraFar = 2500;
				this.scene.add(light);
	},

	
	shoot: function(){
	
		
		var s= createjs.Sound.play("l1", {loop:0, volume:1});
		s.play();
		var geometry = new THREE.SphereGeometry(5, 10, 10);
		var material = new THREE.MeshPhongMaterial({color: 0x000000});
		var lazer = new THREE.Mesh(geometry, material);
		lazer.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);
		this.scene.add(lazer);
		
		var xVelocity =Math.sin(this.controls.phi) * Math.cos(this.controls.theta); 
		var yVelocity =Math.cos(this.controls.phi);
		var zVelocity =Math.sin(this.controls.phi) * Math.sin(this.controls.theta);
		//console.log("camera position(x: " + this.camera.position.x + ", " + this.camera.position.y + ", " + this.camera.position.z + ")");
		//console.log("xVelocity: " + xVelocity + " | yVelocity: " + yVelocity + " | zVelocity: " + zVelocity);
		var lazerVelocity = new THREE.Vector3(xVelocity*5, yVelocity*5, zVelocity*5);
		var boundingBox = new THREE.Box3();
		boundingBox.setFromObject(lazer);
		this.scene.add(boundingBox);
		this.lazerArray.push({
			mesh: lazer, 
			velocity: lazerVelocity, 
			BB: boundingBox, 
			active: true
		});
	},
	
	checkLazerBoundaries: function(){
		for(var i = 0; i < this.lazerArray.length; i++){
			if(this.lazerArray[i].mesh.position.x - this.camera.position.x > 128 
					|| this.lazerArray[i].mesh.position.x - this.camera.position.x < -128){
				this.lazerArray[i].active = false;
			}
			if(this.lazerArray[i].mesh.position.y - this.camera.position.y > 128
					|| this.lazerArray[i].mesh.position.y - this.camera.position.y < -128){
				this.lazerArray[i].active = false;
			}
			if(this.lazerArray[i].mesh.position.z - this.camera.position.z > 128
					|| this.lazerArray[i].mesh.position.z - this.camera.position.z < -128){
				this.lazerArray[i].active = false;
			}
		}
	}
};