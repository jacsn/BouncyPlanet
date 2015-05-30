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

	return {
		angle: angle,
		x: target.pos.x,
		y: target.pos.y,
		distance: a.pos.sub(target.pos).length()
	};
}

function starCaptainAI(){
	var me = starcaptain;
	var enemy = generalmean;

	var attackSpeed = 35;

	var intercept = findIntercept(me, enemy, SC_ACCEL);
	me.angle = intercept.angle + Math.PI/2;

	window.relativeSpeed = me.velocity.sub(enemy.velocity).length();
	window.slowDistance = .5*(Math.pow(relativeSpeed, 2) - Math.pow(attackSpeed, 2)) / SC_ACCEL;
	window.intercept = intercept;
	window.distance = me.pos.sub(enemy.pos).length();
	if(slowDistance > intercept.distance && generalmean.velocity.length() < starcaptain.velocity.length()){
		me.angle = Math.atan2(me.velocity.y, me.velocity.x) + Math.PI + Math.PI/2;
	}

	if(guntimer < 0){
		guntimer = curframe;
	}

	if(distance > 300){
		me.thrusting = true;
		var angle = me.angle - Math.PI / 2;
		var speed = SC_ACCEL;
		var vx = Math.cos(angle) * speed;
		var vy = Math.sin(angle) * speed;
		me.velocity.set(me.velocity.add(new Vector(vx, vy)));
	}else{
		me.thrusting = false;
	}
}

function generalMeanAI(){
	var me = generalmean;
	var enemy = starcaptain;

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

	me.angle = findIntercept(me, target, GM_ACCEL).angle + Math.PI/2;
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
		//starCaptainAI();
	}else{
		starCaptainAI();
		//generalMeanAI();
	}
}
