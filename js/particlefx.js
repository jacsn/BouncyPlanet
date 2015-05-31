'use strict';

var generalMeanExplosion = [{
		image: function(){ return [Fire1Image, Fire2Image][Math.floor(Math.random()*2)]},
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
