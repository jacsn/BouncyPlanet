'use strict';

function findInterceptAngle(a, b, acceleration){
	var tracer = new Entity(
		'tracer',
		new Vector(a.pos.x, a.pos.y),
		0, {
			velocity: new Vector(a.velocity.x, a.velocity.y)
		}
	);
	var target = new Entity(
		'target',
		new Vector(b.pos.x, b.pos.y),
		b.radius, {
			velocity: new Vector(b.velocity.x, b.velocity.y)
		}
	);
	var frames = 0;
	var speed = 0;
	while(true){
		frames++;
		do_physics(1/4, [tracer, target]);
		speed += acceleration;
		tracer.radius += speed;
		if(tracer.checkCollision(target)){
			break;
		}

		if(frames > 1000000){
			console.log('warning: aborting intercepting');
			return 0;
		}
	}

	var angle = Math.atan2(
		target.pos.y - tracer.pos.y,
		target.pos.x - tracer.pos.x
	);
	return angle;
}

function starCaptainAI(){
	var enemy = particles[bindex];
	var me = starcaptain;
	me.angle = findInterceptAngle(me, enemy, .25) + Math.PI/2;
	if(guntimer < 0){
		guntimer = curframe;
	}
	me.thrusting = true;
	var angle = me.angle - Math.PI / 2;
	var speed = .25;
	var vx = Math.cos(angle) * speed;
	var vy = Math.sin(angle) * speed;
	me.velocity.set(me.velocity.add(new Vector(vx, vy)));
}

function generalMeanAI(){
	var enemy = particles[bindex];
	var me = generalmean;

	var target;
	if(pluto.isOrbitStable()){
		target = pluto;
	}else if(jupiter.isOrbitStable()){
		target = jupiter;
	}else if(venus.isOrbitStable()){
		target = venus;
	}else if(mercury.isOrbitStable()){
		target = mercury;
	}else{
		target = bouncyplanet;
	}

	me.angle = findInterceptAngle(me, target, .2) + Math.PI/2;
	me.thrusting = true;
	var angle = me.angle - Math.PI / 2;
	var speed = .20;
	var vx = Math.cos(angle) * speed;
	var vy = Math.sin(angle) * speed;
	me.velocity.set(me.velocity.add(new Vector(vx, vy)));
}

function updateAI(){
	var enemy = particles[bindex];
	if(enemy === starcaptain){
		generalMeanAI();
	}else{
		starCaptainAI();
	}
}
