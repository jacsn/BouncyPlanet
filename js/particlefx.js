'use strict';

var generalMeanExplosion = [{
		image: function(){
			return function(){
				return [Fire1Image, Fire2Image, Fire3Image][Math.floor(Math.random()*3)];
			}
		},
		width: 0,
		height: 0,
		ttl: 0,
		emitCount: 300,
		particleTTL: function(){ return Math.random()*1000 },
		particleVelocity: function(){
			var angle = Math.PI*2*Math.random();
			var speed = 50*Math.random();
			return function(t){
				return {
					x: Math.cos(angle) * speed,
					y: Math.sin(angle) * speed
				}
			}
		},
		rotation: function(){
			var dir = Math.floor(Math.random()*3)-1
			return function(t){
				return Math.PI*2 * t/3000 * dir;
			}
		}
	}, {
		image: function(){
			return function(){
				return [Smoke1Image, Smoke2Image, Smoke3Image][Math.floor(Math.random()*3)];
			}
		},
		width: 0,
		height: 0,
		ttl: 0,
		emitCount: 200,
		particleTTL: function(){ return 3000 * Math.random() },
		particleVelocity: function(){
			var angle = Math.PI*2*Math.random();
			var speed = 125*Math.random();
			return function(t){
				return {
					x: Math.cos(angle) * speed,
					y: Math.sin(angle) * speed
				}
			}
		},
		opacity: function(){
			return function(t){
				if(t < 100){
					return t/200
				}
				return (Math.max(2500-t, 0))/5000
			}
		},
		rotation: function(){
			var dir = Math.floor(Math.random()*3)-1
			return function(t){
				return Math.PI*2 * t/3000 * dir;
			}
		}
	}
];

var generalMeanSmoke = {
	image: function(){
		return function(){
			return [Smoke1Image, Smoke2Image, Smoke3Image][Math.floor(Math.random()*3)];
		}
	},
	width: 0,
	height: 0,
	ttl: null,

	emitCount: function(){
		var hpPercent = generalmean.hp / maxhp;
		if(hpPercent > .90){
			return 0;
		}else if(hpPercent > .30){
			return 1;
		}else if(hpPercent > .025){
			return 2;
		}else if(hpPercent > 0){
			return 3;
		}else{
			return 0;
		}
	},
	emitInterval: function(){
		var hpPercent = generalmean.hp / maxhp;
		if(hpPercent > .8){
			return 500;
		}else if(hpPercent > .6){
			return 250;
		}else if(hpPercent > .3){
			return 100;
		}else{
			return 50;
		}
	},
	particleTTL: function(){
		return 3000;
	},

	particleVelocity: function(){
		var angle = Math.PI*2*Math.random();
		var speed = 50*Math.random();
		var velocity = {
			x: generalmean.velocity.x * 8 + Math.cos(angle) * speed,
			y: generalmean.velocity.y * 8 + Math.sin(angle) * speed
		}
		return function(t){
			return velocity;
		}
	},

	opacity: function(){
		return function(t){
			if(t < 1000){
				return t / 1000;
			}
			return Math.max((2500 - t) / 1500, 0);
		}
	},

	rotation: function(){
		var dir = Math.floor(Math.random()*3)-1
		return function(t){
			return Math.PI*2 * t/3000 * dir;
		}
	}
};
