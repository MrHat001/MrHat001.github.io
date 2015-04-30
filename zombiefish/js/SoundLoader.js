// Note - file paths are relative to index.html when they are fired from here

createjs.Sound.alternateExtensions = ["mp3"];
createjs.Sound.registerSound( { id:"bgm1", src:"js/muzak/smoothjazz.ogg" } );
createjs.Sound.registerSound( { id:"bgm2", src:"js/muzak/RoccoW_seabattlesinspace.ogg" } );
createjs.Sound.registerSound( { id:"bgm3", src:"js/muzak/Goto80_-_5pyhun73r_3l337_v3r.ogg" } );
createjs.Sound.registerSound( { id:"shoom", src:"js/sound/shoom.ogg" } );
createjs.Sound.registerSound( { id:"l1", src:"js/sound/cannon.ogg" } );
createjs.Sound.registerSound( { id:"death", src:"js/sound/lostlife.ogg" } );
createjs.Sound.registerSound( { id:"pow", src:"js/sound/cannon.ogg" } );
createjs.Sound.addEventListener("fileload", handleFileLoad);

//console.log("Sound loader accessed.");

// fires on load
function handleFileLoad(e)
{
	//console.log("Preloaded Sound: ", e.id, e.src);
	if(e.src == "js/muzak/smoothjazz.ogg")
	{
		// start the soundtrack
		createjs.Sound.play("bgm1", {loop:-1, volume:0.3});
		
	}
}
