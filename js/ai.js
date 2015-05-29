'use strict';

function findIntercept(a, b, acceleration){
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

	var speed = tracer.velocity.add(new Vector(target.pos.x - tracer.pos.x, target.pos.y - tracer.pos.y));
	var relativeSpeed = speed.sub(target.velocity);

	return {
		angle: angle,
		x: target.pos.x,
		y: target.pos.y,
		speed: speed.length(),
		relativeSpeed: relativeSpeed.length()
	};
}

function starCaptainAI(){
	var enemy = particles[bindex];
	var me = starcaptain;
	var intercept = findIntercept(me, enemy, .25);
	me.angle = intercept.angle + Math.PI/2;
	window.intercept = intercept;
	if(guntimer < 0){
		guntimer = curframe;
	}
	me.thrusting = true;
	var angle = me.angle - Math.PI / 2;
	var speed = SC_ACCEL;
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

	me.angle = findIntercept(me, target, .2).angle + Math.PI/2;
	me.thrusting = true;
	var angle = me.angle - Math.PI / 2;
	var speed = GM_ACCEL;
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
