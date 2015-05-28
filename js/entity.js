'use strict';

function Entity(name, pos, radius, options){
	options = options || {};

	this.name = name;
	this.pos = pos;
	this.radius = radius;

	this.mass = options.mass || this.radius*this.radius*Math.PI;
	this.velocity = options.velocity || new Vector();
	this.acceleration = options.acceleration || new Vector();
	this.angle = options.angle || 0;

	this.image = options.image || null;
	this.shieldframe = -1;
	this.hitsun = false;
	this.stable = true;
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

Entity.prototype.resolveCollision = function(other){
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
	
	//start shield animation if entity is a playable ship
	if(this.name == "Star Captain" || this.name == "General Mean")
	{
		if(this.shieldframe < 0) //we only want to start the animation if it hasn't already started; otherwise we could get stuck on the first frame
		{
			this.shieldframe = curframe;
		}
	}
	
	if(other.name == "Star Captain" || other.name == "General Mean")
	{
		//Apparently if some other body collides with "this" before "this" gets its turn in the collision loop, "this" will never have resolveCollision called. In that case, we need to activate the animation on the other body.
		if(other.shieldframe < 0)
		{
			other.shieldframe = curframe;
		}
	}
	
	//track when an entity hits the sun
	if(this.name == "Sun")
	{
		other.hitsun = true;
	}
	else if(other.name == "Sun")
	{
		this.hitsun = true;
	}
}

Entity.prototype.isOrbitStable = function(){
	//check isEscaping and hitsun
	if(this.stable) //no point checking if we're already knocked out
	{
		var stable = true;
		if(this.hitsun || this.isEscaping())
		{
			stable = false;
		}
		
		return stable;
	}
	else
	{
		return this.stable;
	}
}

Entity.prototype.isEscaping = function(b)
{
	//Test to see if the entity will escape body b's orbit
	var body = b || sun;
	//determine if entity is moving at escape velocity
	var m = body.mass;
	var v = Math.sqrt((this.velocity.x * this.velocity.x) + (this.velocity.y * this.velocity.y));
	var diffx = this.pos.x - body.pos.x;
	var diffy = this.pos.y - body.pos.y;
	var r = Math.sqrt(diffx * diffx + diffy * diffy);
	
	//formula for escape velocity is Math.sqrt((2 * g * m) / r);
	//Temporarily using 2 as the value for 2 * g, where g is the gravitational constant. I need to figure out what g should actually be in this case.
	return (v > Math.sqrt((2 * m) / r));
}