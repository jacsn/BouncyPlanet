window.onload = function()
{

var Vector = function (x, y) {
    this.x = x || 0;
    this.y = y || 0;
};

Vector.prototype = { // typeof VAR === "object" | VAR instanceof Vector
    constructor: Vector,

    set: function (set) {
        if (typeof set === "object") {
            this.x = set.x;
            this.y = set.y;
        } else {
            this.x = set;
            this.y = set;
        }

        return this;
    },

    equals: function (v) {
        return ((v.x === this.x) && (v.y === this.y));
    },

    clone: function () {
        return new Vector(this.x, this.y);
    },

    mul: function (mul) {
        if (typeof mul === "object") {
            return new Vector(this.x * mul.x, this.y * mul.y);
        } else {
            return new Vector(this.x * mul, this.y * mul);
        }
    },

    div: function (div) {
        return new Vector(this.x / div, this.y / div);
    },

    add: function (add) {
        if (typeof add === "object") {
            return new Vector(this.x + add.x, this.y + add.y);
        } else {
            return new Vector(this.x + add, this.y + add);
        }
    },

    sub: function (sub) {
        if (typeof sub === "object") {
            return new Vector(this.x - sub.x, this.y - sub.y);
        } else {
            return new Vector(this.x - sub, this.y - sub);
        }
    },

    reverse: function () {
        return this.mul(-1);
    },

    abs: function () {
        return new Vector(Math.abs(this.x), Math.abs(this.y));
    },

    dot: function (v) {
        return (this.x * v.x + this.y * v.y);
    },

    length: function () {
        return Math.sqrt(this.dot(this));
    },

    lengthSq: function () {
        return this.dot(this);
    },

    setLength: function (l) {
        return this.normalize().mul(l);
    },

    lerp: function (v, s) {
        return new Vector(this.x + (v.x - this.x) * s, this.y + (v.y - this.y) * s);
    },

    normalize: function () {
        return this.div(this.length());
    },

    truncate: function (max) {
        if (this.length() > max) {
            return this.normalize().mul(max);
        } else {
            return this;
        }
    },

    dist: function (v) {
        return Math.sqrt(this.distSq(v));
    },

    distSq: function (v) {
        var dx = this.x - v.x,
            dy = this.y - v.y;
        return dx * dx + dy * dy;
    },

    cross: function (v) {
        return this.x * v.y - this.y * v.x;
    }
};

if (typeof Math.sign == "undefined") {
    Math.sign = function (x) {
        return x === 0 ? 0 : x > 0 ? 1 : -1;
    };
}











var Circle = function (c, r, cor, cof) { // Fix CoR & CoF
    this.c = c;
    this.r = r;
    this.colour = "#" + (Math.round(((this.r - 15) /10) * 255)).toString(16) + "0000"; // based off of r, which seems to change sometimes?
    this.m = r * r * Math.PI;
    this.v = new Vector();
    this.a = new Vector();
    this.cor = cor;
    this.cof = cof;
};


function checkCCCol(a, b) {
    var d = a.c.sub(b.c);
    var r = a.r + b.r;
    if (d.lengthSq() < r * r) {
        return true;
    } else {
        return false;
    }
}

function resCCCol(a, b) {
    var d = a.c.sub(b.c);

    d.set(d.normalize());

    var v = b.v.sub(a.v);

    var dot = d.dot(v);

    if (dot >= 0) {
        var tm = a.m + b.m;

        var c = d.mul(2 * dot / tm);



        a.v.set(a.v.add(c.mul(b.m)));
        b.v.set(b.v.sub(c.mul(a.m)));
    }
}









var preloader = setInterval(preloadloop, 10);
function preloadloop()
{
	if(true) //load assets
	{
		clearInterval(preloader);
		
		gameloop = function(step)
		{
			update();
		};
		
		//Gameloop setup in the browser is here
		var animationFrame = window.requestAnimationFrame;
		var recursiveAnimation = function(step)
		{
			gameloop(step);
			animationFrame(recursiveAnimation, canvas);
		};
		//start the game loop
		animationFrame(recursiveAnimation, canvas);
	}
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var w = canvas.width;
var h = canvas.height;

var CameraX = 0;
var CameraY = 0;
var keys = [];
var bindex = 0;
var camlock = true;
var showtrails = false;

var mouse = {
    p: new Vector()
};

var gravity = 0.5;

var particles = [];
var newParticles = [];
var trails = [];

var sun = new Circle(new Vector(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2), 100, 0.95, 0.95);
sun.m = 100000;
particles.push(sun);
trails.push([]);


window.addEventListener("mousemove", function (e) {

});

window.addEventListener("mousedown", function (e) {
    mouse.p.x = e.pageX - canvas.getBoundingClientRect().left - CameraX;
    mouse.p.y = e.pageY - canvas.getBoundingClientRect().top - CameraY;
	
	var removed = false;
	for(var i = 1; i < particles.length; i++)
	{
		var diff = mouse.p.sub(particles[i].c);
		var r = particles[i].r;
		
		if(diff.lengthSq() <= r * r)
		{
			particles.splice(i, 1);
			trails.splice(i, 1);
			while(bindex >= particles.length)
			{
				bindex--;
			}
			removed = true;
		}
	}

	if(!removed)
	{
		var body = new Circle(mouse.p.clone(), Math.random() * 10 + 15, 0.95, 0.95);
		body.v = new Vector(0, -10);
		newParticles.push(body);
	}
});

window.addEventListener("mouseup", function (e) {

});

window.addEventListener("keydown", function (e) {
	keys[e.which] = true;
	
	if(e.which == 9)
	{
		e.preventDefault();
	}
});

window.addEventListener("keyup", function (e) {
	keys[e.which] = false;
	
	if(e.which == 9)
	{
		e.preventDefault();
		if(++bindex >= particles.length)
		{
			bindex = 0;
			CameraX = -particles[bindex].c.x + SCREEN_WIDTH / 2;
			CameraY = -particles[bindex].c.y + SCREEN_HEIGHT / 2;
		}
	}
	else if(e.which == 32)
	{
		camlock = !camlock;
	}
	else if(e.which == 84)
	{
		showtrails = !showtrails;
	}
});


function compute_forces() {
    for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.a.set(0);

        for (var j = 0; j < i; j++) {
            var p2 = particles[j];

            var d = p.c.sub(p2.c);
            var norm = Math.sqrt(10.0 + d.lengthSq());
            var mag = gravity / (norm * norm * norm);

            p.a.set(p.a.sub(d.mul(mag * p2.m)));
            p2.a.set(p2.a.add(d.mul(mag * p.m)));

        }
    }

}


function do_collisions() {
    for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        for (var j = 0; j < i; j++) {
            var p2 = particles[j];

            if (checkCCCol(p, p2)) {
                resCCCol(p, p2);
            }
        }

    }
}


function do_physics(dt) {
    for (var i1 = 0; i1 < particles.length; i1++) {
        var p1 = particles[i1];
        p1.c.set(p1.c.add(p1.v.mul(0.5 * dt)));
    }
    compute_forces();
    for (var i2 = 0; i2 < particles.length; i2++) {
        var p2 = particles[i2];
        p2.v.set(p2.v.add(p2.a.mul(dt)));
    }
    for (var i3 = 0; i3 < particles.length; i3++) {
        var p3 = particles[i3];
        p3.c.set(p3.c.add(p3.v.mul(0.5 * dt)));
    }
    do_collisions();
}

function update() {
    
    for(var newParticlesPos = 0; newParticlesPos < newParticles.length; newParticlesPos++)
    {
        particles.push(newParticles[newParticlesPos]);
		trails.push([]);
    }
    newParticles = [];
    
    for (var k = 0; k < 4; k++) { // increase the greater than value to increase simulation step rate
        do_physics(1.0 / 16); // increase the divisor to increase accuracy and decrease simulation speed 
    }
	
	for(var p = 0; p < particles.length; p++)
	{
		if(showtrails)
		{
			trails[p].push(particles[p].c.clone());
			while(trails[p].length > 1000)
			{
				trails[p].shift();
			}
		}
		else
		{
			trails[p] = [];
		}
	}
	
	//hold the sun still
	particles[0].c.x = 0;
	particles[0].c.y = 0;
	
	if(!camlock)
	{
		if(keys[K_UP])
		{
			CameraY += 5;
		}
		if(keys[K_DOWN])
		{
			CameraY -= 5;
		}
		if(keys[K_LEFT])
		{
			CameraX += 5;
		}
		if(keys[K_RIGHT])
		{
			CameraX -= 5;
		}
	}
	else
	{
		var speed = 0.25;
		if(keys[K_UP])
		{
			//apply upward force
			particles[bindex].v.set(particles[bindex].v.add(new Vector(0, -speed)));
		}
		if(keys[K_DOWN])
		{
			//apply downward force
			particles[bindex].v.set(particles[bindex].v.add(new Vector(0, speed)));
		}
		if(keys[K_LEFT])
		{
			//apply leftward force
			particles[bindex].v.set(particles[bindex].v.add(new Vector(-speed, 0)));
		}
		if(keys[K_RIGHT])
		{
			//apply rightward force
			particles[bindex].v.set(particles[bindex].v.add(new Vector(speed, 0)));
		}
	}

    render();
}

function render() {
    ctx.clearRect(0, 0, w, h);
	ctx.strokeStyle = "#AA0000";
	
	if(camlock)
	{
		CameraX = -particles[bindex].c.x + SCREEN_WIDTH / 2;
		CameraY = -particles[bindex].c.y + SCREEN_HEIGHT / 2;
	}
	
	if(showtrails)
	{
		for(var t = 1; t < trails.length; t++)
		{
			ctx.beginPath();
			ctx.moveTo(trails[t][0].x + CameraX, trails[t][0].y + CameraY);
			for(var d = 1; d < trails[t].length; d++)
			{
				ctx.lineTo(trails[t][d].x + CameraX, trails[t][d].y + CameraY);
			}
			ctx.stroke();
		}
	}

    for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        ctx.beginPath();
        ctx.arc(p.c.x + CameraX, p.c.y + CameraY, p.r, 0, Math.PI * 2, false);
        ctx.fillStyle = "#AA0000"; //p.colour;
        ctx.fill();
        ctx.closePath();
    }
}

//update();

}