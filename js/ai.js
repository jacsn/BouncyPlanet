'use strict';

function updateAI(){
	var enemy = particles[bindex];
	var me;
	if(enemy === starcaptain){
		me = generalmean;
	}else{
		me = starcaptain;
		var distance = me.pos.sub(enemy.pos);
		me.angle =  Math.atan2(
			enemy.pos.y - me.pos.y,
			enemy.pos.x - me.pos.x
		) + Math.PI/2;
		if(guntimer < 0 && distance.lengthSq() < 50000){
			guntimer = curframe;
		}
		
		var angle = me.angle - Math.PI / 2;
		
		var relvel = me.velocity.sub(enemy.velocity);
		
		if(relvel.lengthSq() < distance.length() || (distance.lengthSq() < 10000 && distance.lengthSq() > 100))
		{
			me.thrusting = true;
			var speed = .25;
			var vx = Math.cos(angle) * speed;
			var vy = Math.sin(angle) * speed;
			me.velocity.set(me.velocity.add(new Vector(vx, vy)));
		}
		else if(distance.lengthSq() < me.pos.add(me.velocity).sub(enemy.pos).lengthSq())
		{
			me.thrusting = true;
			var speed = .25;
			var vx = Math.cos(angle) * speed;
			var vy = Math.sin(angle) * speed;
			me.velocity.set(me.velocity.add(new Vector(vx, vy)));
		}
		else
		{
			me.thrusting = false;
		}
	}
}
