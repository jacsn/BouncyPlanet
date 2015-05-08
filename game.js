window.onload = function()
{

var Circle = function (c, r, cor, cof) { // Fix CoR & CoF
    this.c = c;
    this.r = r;
    this.colour = "#" + (Math.round(((this.r - 15) /10) * 255)).toString(16) + "0000"; // based off of r, which seems to change sometimes?
    this.m = r * r * Math.PI;
    this.v = new Vector();
    this.a = new Vector();
    this.cor = cor;
    this.cof = cof;
	this.img = null;
	this.angle = 0;
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
	if(StarCaptainImage.ready) //load assets
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
var bindex = 1;
var camlock = true;
var showtrails = true;

var mouse = {
    p: new Vector()
};

var gravity = 0.5;

var particles = [];
var newParticles = [];
var trails = [];

var sun = new Circle(new Vector(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2), 300, 0.95, 0.95);
particles.push(sun); //the sun is particles[0] - this is important for holding it still
trails.push([]);

var starcaptain = new Circle(new Vector(SCREEN_WIDTH, SCREEN_HEIGHT / 2), 22, 0.95, 0.95);
starcaptain.m = 10;
starcaptain.img = StarCaptainImage;
particles.push(starcaptain); //this means Star Captain will be particles[1] - this is important
trails.push([]);

var bouncyplanet = new Circle(new Vector(SCREEN_WIDTH * 2, SCREEN_HEIGHT / 2), 100, 0.95, 0.95);
bouncyplanet.v = new Vector(0, -8);
particles.push(bouncyplanet); //bouncy planet is currently particles[2] - this may not last
trails.push([]);


window.addEventListener("mousemove", function (e) {

});

window.addEventListener("mousedown", function (e) {
    mouse.p.x = e.pageX - canvas.getBoundingClientRect().left - CameraX;
    mouse.p.y = e.pageY - canvas.getBoundingClientRect().top - CameraY;
	//removed because I don't want planets appearing when you click anymore. It gets annoying.
	/*
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
	*/
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
		e.preventDefault();/*
		if(++bindex >= particles.length)
		{
			bindex = 0;
			CameraX = -particles[bindex].c.x + SCREEN_WIDTH / 2;
			CameraY = -particles[bindex].c.y + SCREEN_HEIGHT / 2;
		}*/
	}
	else if(e.which == 32)
	{
		//camlock = !camlock;
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
			//apply forward force
			var p = particles[bindex];
			var angle = p.angle - Math.PI / 2;
			var vx = Math.cos(angle) * speed;
			var vy = Math.sin(angle) * speed;
			p.v.set(p.v.add(new Vector(vx, vy)));
		}
		if(keys[K_DOWN])
		{
			//apply reverse force
			var p = particles[bindex];
			var angle = p.angle + Math.PI / 2;
			var vx = Math.cos(angle) * speed;
			var vy = Math.sin(angle) * speed;
			p.v.set(p.v.add(new Vector(vx, vy)));
		}
		if(keys[K_LEFT])
		{
			//turn left
			particles[bindex].angle -= ANGLE_INCREMENT;
		}
		if(keys[K_RIGHT])
		{
			//turn right
			particles[bindex].angle += ANGLE_INCREMENT;
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

    for (var i = 0; i < particles.length; i++)
	{
		if(particles[i].img === null)
		{
			var p = particles[i];

			ctx.beginPath();
			ctx.arc(p.c.x + CameraX, p.c.y + CameraY, p.r, 0, Math.PI * 2, false);
			ctx.fillStyle = "#AA0000"; //p.colour;
			ctx.fill();
			ctx.closePath();
		}
		else
		{
			var p = particles[i];
			var imgx = p.c.x + CameraX;
			var imgy = p.c.y + CameraY;
			
			ctx.translate(imgx, imgy);
			ctx.rotate(p.angle);
			ctx.drawImage(p.img, -p.r, -p.r);
			ctx.rotate(-p.angle);
			ctx.translate(-imgx, -imgy);
		}
    }
}

//update();

}