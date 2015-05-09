var preloader = setInterval(preloadloop, 10);
function preloadloop(){
	//load assets
	if(StarCaptainImage.ready && RadarImage.ready && GeneralMeanImage.ready) {
		clearInterval(preloader);

		//requestAnimationFrame(frame);
		
		gameloop = function(step){
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

var CameraX = 0;
var CameraY = 0;
var keys = [];
var bindex = 1;
var newbindex = bindex;
var target = 0;
var newtarget = target;
var camlock = true;
var showtrails = true;

var mouse = {
    p: new Vector()
};

var gravity = 0.5;

var particles = [];
var newParticles = [];
var trails = [];

var sun = new Entity('Sun', new Vector(0, 0), 300);
particles.push(sun); //the sun is particles[0] - this is important for holding it still
trails.push([]);

var starcaptain = new Entity('Star Captain', new Vector(1024, 320), 22,	{
	mass: 10,
	image: StarCaptainImage
});
particles.push(starcaptain); //this means Star Captain will be particles[1] - this is important
trails.push([]);

var generalmean = new Entity("General Mean", new Vector(3072, 3072), 50, {
	image: GeneralMeanImage
});
particles.push(generalmean); //General Mean is particles[2] - important for toggling bindex between him and Star Captain
trails.push([]);

var bouncyplanet = new Entity('Bouncy Planet', new Vector(3072, 320), 100, {
	velocity: new Vector(0, -6)
});
particles.push(bouncyplanet); //bouncy planet is currently particles[3] - this may not last
trails.push([]);

var mercury = new Entity('Mercury', new Vector(-8192, 320), 80, {
	velocity: new Vector(0, -5)
});
particles.push(mercury); //mercury is particles[4]... for now.
trails.push([]);

var venus = new Entity('Venus', new Vector(512, 10240), 120, {
	velocity: new Vector(4, 0)
});
particles.push(venus); //venus is particles[5]... for now
trails.push([]);

function compute_forces() {
    for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.acceleration.set(0);

        for (var j = 0; j < i; j++) {
            var p2 = particles[j];

            var d = p.pos.sub(p2.pos);
            var norm = Math.sqrt(10.0 + d.lengthSq());
            var mag = gravity / (norm * norm * norm);

            p.acceleration.set(p.acceleration.sub(d.mul(mag * p2.mass)));
            p2.acceleration.set(p2.acceleration.add(d.mul(mag * p.mass)));
        }
    }
}

function do_collisions() {
    for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        for (var j = 0; j < i; j++) {
            var p2 = particles[j];

			if(p.checkCollision(p2)){
				p.resolveCollision(p2);
			}
        }
    }
}

function do_physics(dt) {
    for (var i1 = 0; i1 < particles.length; i1++) {
        var p1 = particles[i1];
        p1.pos.set(p1.pos.add(p1.velocity.mul(0.5 * dt)));
    }
    compute_forces();
    for (var i2 = 0; i2 < particles.length; i2++) {
        var p2 = particles[i2];
        p2.velocity.set(p2.velocity.add(p2.acceleration.mul(dt)));
    }
    for (var i3 = 0; i3 < particles.length; i3++) {
        var p3 = particles[i3];
        p3.pos.set(p3.pos.add(p3.velocity.mul(0.5 * dt)));
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
			if(trails[p].length > 1)
			{
				//we want to make sure that each point in the trails is far enough away from the previous one so that slow-moving bodies don't have noticibly shorter tails
				var diffx = trails[p][trails[p].length - 1].x - particles[p].pos.x;
				var diffy = trails[p][trails[p].length - 1].y - particles[p].pos.y;
				if((diffx * diffx) + (diffy * diffy) >= 9)
				{
					trails[p].push(particles[p].pos.clone());
					while(trails[p].length > 1000)
					{
						trails[p].shift();
					}
				}
			}
			else
			{
				trails[p].push(particles[p].pos.clone());
			}
		}
		else
		{
			trails[p] = [];
		}
	}
	
	//hold the sun still
	particles[0].pos.x = 0;
	particles[0].pos.y = 0;
	
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
			p.velocity.set(p.velocity.add(new Vector(vx, vy)));
		}
		if(keys[K_DOWN])
		{
			//apply reverse force
			var p = particles[bindex];
			var angle = p.angle + Math.PI / 2;
			var vx = Math.cos(angle) * speed;
			var vy = Math.sin(angle) * speed;
			p.velocity.set(p.velocity.add(new Vector(vx, vy)));
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
	
	//update target and bindex after updating and rendering to prevent weirdness
	if(newtarget != target)
	{
		target = newtarget;
	}
	
	if(newbindex != bindex)
	{
		bindex = newbindex;
	}
	
	if(target == bindex)
	{
		target++;
	}
}

function render() {
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
	ctx.strokeStyle = "#AA0000";
	
	if(camlock)
	{
		//keep the camera locked on Star Captain (or whichever body is at bindex)
		CameraX = -particles[bindex].pos.x + SCREEN_WIDTH / 2;
		CameraY = -particles[bindex].pos.y + SCREEN_HEIGHT / 2;
	}
	
	if(showtrails)
	{
		//draw movement trails for all bodies in motion
		for(var t = 1; t < trails.length; t++) //start with 1 instead of 0 because the sun doesn't move currently
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
		if(particles[i].image === null)
		{
			//draw canvas arcs for bodies which have no image assigned to them
			var p = particles[i];

			ctx.beginPath();
			ctx.arc(p.pos.x + CameraX, p.pos.y + CameraY, p.radius, 0, Math.PI * 2, false);
			ctx.fillStyle = "#AA0000"; //p.colour;
			ctx.fill();
			ctx.closePath();
		}
		else
		{
			var p = particles[i];
			var imgx = p.pos.x + CameraX;
			var imgy = p.pos.y + CameraY;
			
			//draw the body's image, properly rotated
			ctx.save();
			ctx.translate(imgx, imgy);
			ctx.rotate(p.angle);
			ctx.drawImage(p.image, -p.radius, -p.radius);
			ctx.restore();
			//ctx.rotate(-p.angle);
			//ctx.translate(-imgx, -imgy);
		}
		
		if(i == bindex)
		{
			
			//compute the angle for the radar, and the distance for the HUD
			var t = particles[target];
			var diffx = t.pos.x - p.pos.x;
			var diffy = t.pos.y - p.pos.y;
			var ang = Math.atan2(diffy, diffx) + Math.PI / 2;
			var dist = Math.sqrt(diffx * diffx + diffy * diffy) - t.radius - p.radius;
			if(dist < 0)
			{
				dist = "0";
			}
			else
			{
				dist = dist + "";
			}
			
			//whole numbers only, please
			var dot = dist.indexOf(".");
			if(dot >= 0)
			{
				dist = dist.substring(0, dot);
			}
			
			if(i == bindex)
			{
				//draw the radar indicator
				ctx.save();
				ctx.translate(imgx, imgy);
				ctx.rotate(ang);
				ctx.drawImage(RadarImage, -50, -50);
				ctx.restore();
				//ctx.rotate(-ang);
				//ctx.translate(-imgx, -imgy);
			}
		}
    }
	
	//display the current target destination
	ctx.textAlign = "left";
	ctx.font = "20px sans-serif";
	ctx.fillStyle = "#999999";
	ctx.fillText("Target: " + particles[target].name, 10, 25);
	
	//display distance to target
	ctx.textAlign = "right";
	ctx.fillText("Distance: " + dist, SCREEN_WIDTH - 10, 25);
}

/*
var lastTime = 0;
function frame(time){
	var delta = time - lastTime;
	lastTime = time;
	requestAnimationFrame(frame);
}
*/
