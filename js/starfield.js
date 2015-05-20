'use strict';

var STARFIELD_WIDTH = 2048;
var STARFIELD_HEIGHT = 1080;
var STAR_COUNT = 50;
var STAR_MIN_SPEED = .25;
var STAR_MAX_SPEED = 1;
var STAR_SIZE = 3;

function Star(){
	this.x = Math.random() * STARFIELD_WIDTH;
	this.y = Math.random() * STARFIELD_HEIGHT;
	this.speed = Math.random()*(STAR_MAX_SPEED - STAR_MIN_SPEED) + STAR_MIN_SPEED;
}

Star.prototype.render = function(){
	var playerPos = particles[bindex].pos;
	var x = (this.x - this.speed * playerPos.x) % STARFIELD_WIDTH;
	var y = (this.y - this.speed * playerPos.y) % STARFIELD_HEIGHT;

	ctx.fillStyle='#fff';
	ctx.fillRect(x, y, STAR_SIZE, STAR_SIZE);
}

var stars = [];
for(var i = 0; i < STAR_COUNT; i++){
	stars.push(new Star());
}
