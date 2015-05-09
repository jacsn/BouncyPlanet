'use strict';

function Entity(name, pos, radius, options){
	options = options || {};

	this.name = name;
	this.pos = pos;
	this.radius = radius;

	this.mass = options.mass || this.radius*this.radius*Math.PI;
	this.velocity = options.velocity || new Vector();
	this.acceleration = options.acceleration || new Vector();
	this.friction = options.friction || .95;
	this.restitution = options.restitution || .95;
	this.angle = options.angle || 0;

	this.image = options.image || null;
}

Entity.prototype.checkCollision = function(other){
    var d = this.pos.sub(other.pos);
    var r = this.radius + other.radius;
    if (d.lengthSq() < r * r){
        return true;
    } else {
        return false;
    }
}

//TODO is "restitute" the proper verb?
Entity.prototype.restituteCollision = function(other){
    var d = this.pos.sub(other.pos);

    d.set(d.normalize());

    var v = other.velocity.sub(this.velocity);

    var dot = d.dot(v);

    if (dot >= 0) {
        var tm = this.mass + other.mass;

        var c = d.mul(2 * dot / tm);

        this.velocity.set(this.velocity.add(c.mul(other.mass)));
        other.velocity.set(other.velocity.sub(c.mul(this.mass)));
    }
}
