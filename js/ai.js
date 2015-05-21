'use strict';

function updateAI(){
	var enemy = particles[bindex];
	var me;
	if(enemy === starcaptain){
		me = generalmean;
	}else{
		me = starcaptain;
		me.angle =  Math.atan2(
			enemy.pos.y - me.pos.y,
			enemy.pos.x - me.pos.x
		) + Math.PI/2;
		if(guntimer < 0){
			guntimer = curframe;
		}
	}
}
