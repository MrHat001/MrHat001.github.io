"use strict"
var app = app || {};
app.Wave = function(){
	
	// initialize the Wave object
	function Wave(){
		this.waveArray = [];
		this.whichWave = 0;
		
		this.waveOne = {
			totalNum: 30,
			currentNum: 30,
			numEnemyOne: 30,
			numEnemyTwo: 0
		};
	
		this.waveTwo = {
			totalNum: 30,
			currentNum: 30,
			numEnemyOne: 25,
			numEnemyTwo: 5
		};
	
		this.waveThree = {
			totalNum: 35,
			currentNum: 35,
			numEnemyOne: 25,
			numEnemyTwo: 10
		};
	
		this.waveFour = {
			totalNum: 35,
			currentNum: 35,
			numEnemyOne: 20,
			numEnemyTwo: 15
		};
	
		this.waveFive = {
			totalNum: 1,
			currentNum: 1,
			numEnemyOne: 0,
			numEnemyTwo: 0,
			numBoss: 1
		};
		
		this.waveArray.push(this.waveOne);
		this.waveArray.push(this.waveTwo);
		this.waveArray.push(this.waveThree);
		this.waveArray.push(this.waveFour);
		this.waveArray.push(this.waveFive);
		
		/*for(var i = 0; i < this.waveArray.length; i++)
		{
			console.log(this.waveArray[i]);
		}*/		
	};
	
	var p = Wave.prototype;
	
	// gets which type of enemy to create whenever we need to make a new enemy
	// 0 return means that the wave is over
	p.getEnemyType = function(){
		var enemy1Num = this.waveArray[this.whichWave].numEnemyOne;
		var enemy2Num = this.waveArray[this.whichWave].numEnemyTwo;
		var currentNum = this.waveArray[this.whichWave].currentNum;
		
		// wave is done
		if(currentNum == 0){
			this.getNextWave();
			return 0;
		}
		
		// the boss is in this wave
		if(enemy1Num == enemy2Num && enemy1Num == 0 && currentNum != 0){
			return 3;
		}
		
		var percent1 = enemy1Num;
		var percent2 = enemy2Num + enemy1Num;
		var pick = Math.floor((Math.random() * currentNum));
		
		if(pick < percent1 && enemy1Num > 0){
			this.waveArray[this.whichWave].numEnemyOne -= 1;
			this.waveArray[this.whichWave].currentNum -= 1;
			//console.log(this.waveArray[this.whichWave]);
			return 1;
		} else if(pick >= percent1 && enemy2Num > 0){
			this.waveArray[this.whichWave].numEnemyTwo -= 1;
			this.waveArray[this.whichWave].currentNum -= 1;
			//console.log(this.waveArray[this.whichWave]);
			return 2;
		}
	};
	
	// when a wave is empty increment number of which wave we are looking at
	p.getNextWave = function(){
		//console.log("wave completed");
		if(this.whichWave < 5){
			this.whichWave++;
		} else {
			app.win = true;
		}
	};
	
	return Wave;
}();