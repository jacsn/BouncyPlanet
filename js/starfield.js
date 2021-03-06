'use strict';

var STARFIELD_WIDTH = 2048;
var STARFIELD_HEIGHT = 1080;
var STAR_COUNT = 75;
var STAR_MIN_SPEED = .05;
var STAR_MAX_SPEED = .25;
var STAR_SIZE = 2;

function Star(){
	this.x = Math.random() * STARFIELD_WIDTH;
	this.y = Math.random() * STARFIELD_HEIGHT;
	this.speed = Math.random()*(STAR_MAX_SPEED - STAR_MIN_SPEED) + STAR_MIN_SPEED;
}

Star.prototype.render = function(){
	//var playerPos = particles[bindex].pos;
	var x = (this.x - this.speed * -CameraX) % STARFIELD_WIDTH;
	var y = (this.y - this.speed * -CameraY) % STARFIELD_HEIGHT;
	while(x < 0){
		x += STARFIELD_WIDTH;
	}
	while(y < 0){
		y += STARFIELD_HEIGHT;
	}

	ctx.fillStyle='#fff';
	ctx.fillRect(x, y, STAR_SIZE, STAR_SIZE);
}

// Create stars
var stars = [];
for(var i = 0; i < STAR_COUNT; i++){
	stars.push(new Star());
}

