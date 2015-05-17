var curframe = -1;

var preloader = setInterval(preloadloop, 10);
function preloadloop(){
	//load assets
	if(ButtonImage.ready && StarCaptainImage.ready && GeneralMeanImage.ready && SCRadarImage.ready && GMRadarImage.ready && SCShieldImage.ready && GMShieldImage.ready && SCThrustImage.ready) {
		clearInterval(preloader);

		//requestAnimationFrame(frame);
		
		gameloop = function(step)
		{
			if(curframe < 0)
			{
				ChangeMenu(Menus.Main);
			}
			curframe = step; //curframe is necessary for animations to know how long they've been playing
			if(MenuShowing)
			{
				drawMenu();
			}
			else
			{
				update();
			}
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
	else
	{
		//TODO: display loading animation
	}
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var MenuShowing = true;
var MenuID = Menus.Main;
var Controls = [];
var MouseDown = false;
var MouseDownX = 0;
var MouseDownY = 0;

var CameraX = 0;
var CameraY = 0;
var keys = [];
var bindex = 1;
var newbindex = bindex;
var target = 0;
var newtarget = target;
var camlock = true;
var showtrails = true;
var guntimer = -1;

var mouse = {
    p: new Vector()
};

var gravity = 0.5;

var particles = [];
var newParticles = [];
var bullets = [];
var scengineflames = [];
var gmengineflames = [];
var trails = [];

//Declare all buttons here
var btnBegin = new Button("Begin", SCREEN_WIDTH / 2 - 115, 500, 230, 90, btnBegin_Click, ButtonImage);

function btnBegin_Click()
{
	ChangeMenu(Menus.None);
}

var sun = new Entity('Sun', new Vector(0, 0), 300, {
	image: SunImage
});
particles.push(sun); //the sun is particles[0] - this is important for holding it still
trails.push([]);

var starcaptain = new Entity('Star Captain', new Vector(1024, 320), 25,	{
	mass: 10,
	image: StarCaptainImage
});
starcaptain.thrusting = false;
particles.push(starcaptain); //this means Star Captain will be particles[1] - this is important
trails.push([]);

var generalmean = new Entity("General Mean", new Vector(3072, 3072), 50, {
	mass: 3000,
	image: GeneralMeanImage
});
generalmean.thrusting = false;
generalmean.hp = 2000;
particles.push(generalmean); //General Mean is particles[2] - important for toggling bindex between him and Star Captain
trails.push([]);

var bouncyplanet = new Entity('Bouncy Planet', new Vector(3072, 0), 100, {
	velocity: new Vector(0, -6)
});
particles.push(bouncyplanet); //bouncy planet is currently particles[3] - this may not last
trails.push([]);

var mercury = new Entity('Mercury', new Vector(-10240, 0), 80, {
	velocity: new Vector(0, -4.8)
});
particles.push(mercury); //mercury is particles[4]... for now.
trails.push([]);

var venus = new Entity('Venus', new Vector(0, 40000), 120, {
	velocity: new Vector(3, 0)
});
particles.push(venus); //venus is particles[5]... for now
trails.push([]);

var jupiter = new Entity("Jupiter", new Vector(120000, 0), 160, {
	velocity: new Vector(0, 2)
});
particles.push(jupiter);
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

//TODO: get rid of this anti-functional monstrosity of a global variable with refactoring
// Right now it keeps track of what entities collided on the last call to do_collisions
var collidedEntities = [];
function do_collisions() {
	collidedEntities = [];
    for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        for (var j = 0; j < i; j++) {
            var p2 = particles[j];

			if(p.checkCollision(p2)){
				p.resolveCollision(p2);
				collidedEntities.push(p);
				collidedEntities.push(p2);
			}
        }
    }
}

function do_bulletcollisions()
{
	var removed = [];
	for(var i = 0; i < bullets.length; i++)
	{
		if(bullets[i].checkCollision(generalmean))
		{
			removed.push(i);
			generalmean.hp--;
			if(generalmean.shieldframe < 0)
			{
				generalmean.shieldframe = curframe;
			}
		}
	}
	
	//removed all collided bullets
	for(var r = removed.length - 1; r >= 0; r--)
	{
		bullets.splice(removed[r], 1);
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

function do_bullets(dt) {
    for (var i1 = 0; i1 < bullets.length; i1++) {
        var p1 = bullets[i1];
        p1.pos.set(p1.pos.add(p1.velocity.mul(0.5 * dt)));
    }
    for (var i2 = 0; i2 < bullets.length; i2++) {
        var p2 = bullets[i2];
        p2.velocity.set(p2.velocity.add(p2.acceleration.mul(dt)));
    }
    for (var i3 = 0; i3 < bullets.length; i3++) {
        var p3 = bullets[i3];
        p3.pos.set(p3.pos.add(p3.velocity.mul(0.5 * dt)));
    }
	do_bulletcollisions();
}

function do_scengineflames(dt) {
    for (var i1 = 0; i1 < scengineflames.length; i1++) {
        var p1 = scengineflames[i1];
        p1.pos.set(p1.pos.add(p1.velocity.mul(0.5 * dt)));
    }
    for (var i2 = 0; i2 < scengineflames.length; i2++) {
        var p2 = scengineflames[i2];
        p2.velocity.set(p2.velocity.add(p2.acceleration.mul(dt)));
    }
    for (var i3 = 0; i3 < scengineflames.length; i3++) {
        var p3 = scengineflames[i3];
        p3.pos.set(p3.pos.add(p3.velocity.mul(0.5 * dt)));
    }
}

function do_gmengineflames(dt) {
    for (var i1 = 0; i1 < gmengineflames.length; i1++) {
        var p1 = gmengineflames[i1];
        p1.pos.set(p1.pos.add(p1.velocity.mul(0.5 * dt)));
    }
    for (var i2 = 0; i2 < gmengineflames.length; i2++) {
        var p2 = gmengineflames[i2];
        p2.velocity.set(p2.velocity.add(p2.acceleration.mul(dt)));
    }
    for (var i3 = 0; i3 < gmengineflames.length; i3++) {
        var p3 = gmengineflames[i3];
        p3.pos.set(p3.pos.add(p3.velocity.mul(0.5 * dt)));
    }
}

function FireBullet()
{
	var p = particles[1]; //manually set a variable to Star Captain's particle
	var bulletspeed = 20;
	var bulletradius = 2;
	
	var angle = p.angle - Math.PI / 2;
	var v = new Vector(Math.cos(angle) * bulletspeed, Math.sin(angle) * bulletspeed);
	v.set(v.add(p.velocity)); //add SC's velocity to the bullet because that's how it'd work
	
	var startpos = new Vector(Math.cos(angle) * p.radius + p.pos.x, Math.sin(angle) * p.radius + p.pos.y);
	var bullet = new Entity("", startpos, bulletradius, {
		velocity: v
	});
	bullet.shieldframe = curframe;
	bullets.push(bullet);
}

function CreateSCEngineFlame()
{
	var p = particles[1]; //manually set a variable to Star Captain's particle
	var firespeed = 12 + Math.random() * 5;
	var fireradius = 3 + Math.random() * 6;
	
	var angle = p.angle + Math.PI / 2 + ((Math.random() * 0.2) - 0.1);
	var pangle = p.angle + Math.PI / 2;
	var v = new Vector(Math.cos(angle) * firespeed, Math.sin(angle) * firespeed);
	v.set(v.add(p.velocity)); //add SC's velocity to the bullet because that's how it'd work
	
	var startpos = new Vector(Math.cos(pangle) * (p.radius * 0.8) + p.pos.x, Math.sin(pangle) * (p.radius * 0.8) + p.pos.y);
	var flame = new Entity("", startpos, fireradius, {
		velocity: v
	});
	flame.shieldframe = curframe;
	
	return flame;
}

function CreateGMEngineFlame()
{
	var p = particles[2]; //manually set a variable to General Mean's particle
	var firespeed = 12 + Math.random() * 5;
	var fireradius = 4 + Math.random() * 6;
	
	var angle = p.angle + Math.PI / 2 + ((Math.random() * 0.2) - 0.1);
	var pangle = p.angle + Math.PI / 2;
	var v = new Vector(Math.cos(angle) * firespeed, Math.sin(angle) * firespeed);
	v.set(v.add(p.velocity)); //add SC's velocity to the bullet because that's how it'd work
	
	var startpos = new Vector(Math.cos(pangle) * (p.radius * 0.9) + p.pos.x, Math.sin(pangle) * (p.radius * 0.9) + p.pos.y);
	var flame = new Entity("", startpos, fireradius, {
		velocity: v
	});
	flame.shieldframe = curframe;
	
	return flame;
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
		do_bullets(1.0 / 16);
		do_scengineflames(1.0 / 16);
		do_gmengineflames(1.0 / 16);
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
		//give General Mean a heftier feel by giving him lower acceleration
		var speed = (bindex == 1) ? 0.25 : 0.2;
		if(keys[K_UP])
		{
			if(bindex == 1)
			{
				starcaptain.thrusting = true;
			}
			else if(bindex == 2)
			{
				generalmean.thrusting = true;
			}
			//apply forward force
			var p = particles[bindex];
			var angle = p.angle - Math.PI / 2;
			var vx = Math.cos(angle) * speed;
			var vy = Math.sin(angle) * speed;
			p.velocity.set(p.velocity.add(new Vector(vx, vy)));
		}
		else
		{
			if(bindex == 1)
			{
				starcaptain.thrusting = false;
			}
			else if(bindex == 2)
			{
				generalmean.thrusting = false;
			}
		}
		if(keys[K_DOWN])
		{
			//apply reverse force
			var p = particles[bindex];
			var angle = p.angle + Math.PI / 2;
			var vx = Math.cos(angle) * (speed * 0.8); //reverse thrusters shouldn't be as strong as your main engine
			var vy = Math.sin(angle) * (speed * 0.8);
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
	
	//deal with repeated fire if you hold down the fire button
	if(bindex == 1 && guntimer >= 0)
	{
		var elapsed = curframe - guntimer;
		var interval = 200;
		var remainder = elapsed - interval;
		if(remainder >= 0)
		{
			FireBullet();
			guntimer = curframe + remainder;
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
			
			//Draw the Engine Flames if Star Captain is thrusting
			if(p.name == "Star Captain")
			{
				//draw the flame
				//ctx.drawImage(SCThrustImage, -p.radius, -p.radius);
				ctx.globalCompositeOperation = "lighter";
				var toberemoved = [];
				for(var fi = 0; fi < scengineflames.length; fi++)
				{
					var f = scengineflames[fi];
					var elapsed = curframe - f.shieldframe;
					var maxlife = 150;
					var lifeper = elapsed / maxlife;
					if(lifeper > 1)
					{
						toberemoved.push(fi);
					}
					else
					{
						var reducedradius = f.radius * (1 - lifeper);
						if(reducedradius > 1)
						{
							var gb = Math.floor(lifeper * 100);
							ctx.fillStyle = "rgba(255, " + gb + ", 0, 1)";
							ctx.beginPath();
							ctx.arc(f.pos.x + CameraX, f.pos.y + CameraY, reducedradius, 0, Math.PI * 2);
							ctx.fill();
						}
					}
				}
				ctx.globalCompositeOperation = "source-over";
				
				for(var tbr = toberemoved.length - 1; tbr >= 0; tbr--)
				{
					scengineflames.splice(toberemoved[tbr], 1);
				}
				
				if(starcaptain.thrusting)
				{
					if(scengineflames.length < 30)
					{
						for(var nef = 0; nef < 10; nef++)
						{
							scengineflames.push(CreateSCEngineFlame());
						}
					}
					else if(scengineflames.length < 50)
					{
						scengineflames.push(CreateSCEngineFlame());
					}
				}
			}
			else if(p.name == "General Mean")
			{
				//draw the flames
				ctx.globalCompositeOperation = "lighter";
				var toberemoved = [];
				for(var fi = 0; fi < gmengineflames.length; fi++)
				{
					var f = gmengineflames[fi];
					var elapsed = curframe - f.shieldframe;
					var maxlife = 150;
					var lifeper = elapsed / maxlife;
					if(lifeper > 1)
					{
						toberemoved.push(fi);
					}
					else
					{
						var reducedradius = f.radius * (1 - lifeper);
						if(reducedradius > 1)
						{
							var gb = Math.floor(lifeper * 100);
							ctx.fillStyle = "rgba(255, " + gb + ", 0, 1)";
							ctx.beginPath();
							ctx.arc(f.pos.x + CameraX, f.pos.y + CameraY, reducedradius, 0, Math.PI * 2);
							ctx.fill();
						}
					}
				}
				ctx.globalCompositeOperation = "source-over";
				
				for(var tbr = toberemoved.length - 1; tbr >= 0; tbr--)
				{
					gmengineflames.splice(toberemoved[tbr], 1);
				}
				
				if(generalmean.thrusting)
				{
					if(gmengineflames.length < 30)
					{
						for(var nef = 0; nef < 10; nef++)
						{
							gmengineflames.push(CreateGMEngineFlame());
						}
					}
					else if(gmengineflames.length < 50)
					{
						gmengineflames.push(CreateGMEngineFlame());
					}
				}
			}
			//draw the image, properly rotated
			ctx.save();
			ctx.translate(imgx, imgy);
			ctx.rotate(p.angle);
			ctx.drawImage(p.image, -p.radius, -p.radius);
			ctx.restore();
			//ctx.rotate(-p.angle);
			//ctx.translate(-imgx, -imgy);
			
			//This new segment just draws Star Captain's shield
			if(p.shieldframe >= 0)
			{
				if(p.name == "Star Captain")
				{
					var percent = (curframe - p.shieldframe) / 400;
					var frame = Math.floor(percent * 6);
					if(frame < 6)
					{
						ctx.drawImage(SCShieldImage, 50 * frame, 0, 50, 50, p.pos.x + CameraX - p.radius, p.pos.y + CameraY - p.radius, 50, 50);
					}
					else
					{
						p.shieldframe = -1;
					}
				}
				else if(p.name == "General Mean")
				{
					var percent = (curframe - p.shieldframe) / 400;
					var frame = Math.floor(percent * 6);
					if(frame < 6)
					{
						ctx.drawImage(GMShieldImage, 100 * frame, 0, 100, 100, p.pos.x + CameraX - p.radius, p.pos.y + CameraY - p.radius, 100, 100);
					}
					else
					{
						p.shieldframe = -1;
					}
				}
			}
		}
		
		if(i == bindex)
		{
			//compute the angle for the radar, and the distance for the HUD
			var t = particles[target];
			var diffx = t.pos.x - p.pos.x;
			var diffy = t.pos.y - p.pos.y;
			var ang = Math.atan2(diffy, diffx);
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
		}
    }
	
	//Draw the radar UI (this is outside the particle loop now, because it's supposed to be a UI overlay
	//if you're Star Captain, draw his radar indicator
	if(bindex == 1)
	{
		var t = particles[target];
		var diffx = t.pos.x - starcaptain.pos.x;
		var diffy = t.pos.y - starcaptain.pos.y;
		var ang = Math.atan2(diffy, diffx);
		var imgx = starcaptain.pos.x + CameraX;
		var imgy = starcaptain.pos.y + CameraY;
		//draw Star Captain's radar indicator
		ctx.save();
		ctx.translate(imgx, imgy);
		ctx.rotate(ang);
		ctx.drawImage(SCRadarImage, -100, -100);
		ctx.restore();
		//ctx.rotate(-ang);
		//ctx.translate(-imgx, -imgy);
	}
	else if(bindex == 2)
	{
		//draw General Mean's radar indicator
		ctx.save();
		ctx.translate(imgx, imgy);
		ctx.rotate(ang);
		ctx.drawImage(GMRadarImage, -80, -80);
		ctx.restore();
		//ctx.rotate(-ang);
		//ctx.translate(-imgx, -imgy);
	}
	
	//draw bullets
	var bullets_to_remove = 0;
	for(var b = 0; b < bullets.length; b++)
	{
		//draw canvas arcs for bullets
		var p = bullets[b];

		if(curframe - p.shieldframe > 1000)
		{
			bullets_to_remove++;
		}
		else
		{
			ctx.beginPath();
			ctx.arc(p.pos.x + CameraX, p.pos.y + CameraY, p.radius, 0, Math.PI * 2, false);
			ctx.fillStyle = "#FF0000"; //p.colour;
			ctx.fill();
			ctx.closePath();
		}
	}
	
	for(var i = 0; i < bullets_to_remove; i++)
	{
		bullets.shift();
	}
	
	//display the current target destination
	ctx.textAlign = "left";
	ctx.font = "20px sans-serif";
	ctx.fillStyle = "#999999";
	ctx.fillText("Target: " + particles[target].name, 10, 25);
	
	//display distance to target
	ctx.textAlign = "right";
	ctx.fillText("Distance: " + dist, SCREEN_WIDTH - 10, 25);
	
	drawControls();
}

function ChangeMenu(menu)
{
	Controls = [];
	if(menu == Menus.Main)
	{
		Controls.push(btnBegin);
	}
	else if(menu == Menus.None)
	{
		MenuShowing = false;
	}
}

function drawMenu()
{
	ctx.fillStyle = "#666666";
	ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
	
	if(MenuID == Menus.Main)
	{
		ctx.fillStyle = "#000000";
		ctx.textAlign = "center";
		ctx.font = "80px Arial, sans-serif";
		ctx.fillText("Bouncy Planet", SCREEN_WIDTH / 2, 120);
	}
	
	drawControls();
}

function drawControls()
{
	for(var c = 0; c < Controls.length; c++)
	{
		Controls[c].draw(ctx);
	}
}

/*
var lastTime = 0;
function frame(time){
	var delta = time - lastTime;
	lastTime = time;
	requestAnimationFrame(frame);
}
*/
