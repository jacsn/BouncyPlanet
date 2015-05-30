'use strict';
var curframe = -1;

var loadcounter = 0;
var dots = "";

var preloader = setInterval(preloadloop, 10);
function preloadloop(){
	//load assets
	if(ButtonImage.ready && UIBoxImage.ready && TalkBackgroundImage.ready && TalkBG2Image.ready && ArrowButtonImage.ready && KidsRoomImage.ready && KidIconImage.ready && GMIconImage.ready && SCIconImage.ready && PresidentIconImage.ready && AgentIconImage.ready && MomIconImage.ready && SunImage.ready && BouncyPlanetImage.ready && MercuryImage.ready && VenusImage.ready && JupiterImage.ready && PlutoImage.ready && StarCaptainImage.ready && GeneralMeanImage.ready && SCRadarImage.ready && GMRadarImage.ready && SCShieldImage.ready && GMShieldImage.ready && EPShieldImage.ready) {
		clearInterval(preloader);

		//requestAnimationFrame(frame);
		
		var gameloop = function(step)
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
		loadcounter++;
		if(loadcounter >= 50)
		{
			loadcounter = 0;
			if(dots == "...")
			{
				dots = "";
			}
			else
			{
				dots += ".";
			}
		}
		
		//show the loading message until it loads
		preloadClearScreen();
		ctx.fillStyle = "#FFFFFF";
		ctx.font = "60px Arial, sans-serif";
		ctx.textAlign = "left";
		var loadx = SCREEN_WIDTH/2 - ctx.measureText("Loading.").width/2;
		ctx.fillText("Loading" + dots,loadx,SCREEN_HEIGHT/2);
	}
}

function preloadClearScreen()
{
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
	drawStars();
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var MenuShowing = true;
var MenuID = Menus.Main;
var TalkBoxes = [];
var curTB = -1;
var pauseTB = -1;
var gmwins = false;
var Controls = [];
var MouseDown = false;
var MouseDownX = 0;
var MouseDownY = 0;
var LastX = 0;
var LastY = 0;

var gametimer = -1;
var dinnertime = false;
var pausetimer = -1;
var CameraX = -3000 + SCREEN_WIDTH / 2;
var CameraY = 200 + SCREEN_HEIGHT / 2;
var keys = [];
var bindex = 1;
var newbindex = bindex;
var target = 0;
var newtarget = target;
var showradar = true;
var showtrails = true;
var guntimer = -1;
var maxhp = 1000;

var mouse = {
    p: new Vector()
};

var gravity = 0.5;

var particles = [];
var bullets = [];
var scengineflames = [];
var gmengineflames = [];
var trails = [];

//Declare TalkBoxes here
//ID 0
TalkBoxes.push(new TalkBox(KidIconImage, "Oh no! The evil General Mean approaches the system. What sinister plans could he have in mind?", new Button("", SCREEN_WIDTH - 105, SCREEN_HEIGHT - 105, 100, 100, btnTB01, ArrowButtonImage), "fact", -1));
//ID 1
TalkBoxes.push(new TalkBox(KidIconImage, "And can Star Captain, hero of Bouncy Planet, stop him?", new Button("", SCREEN_WIDTH - 105, SCREEN_HEIGHT - 105, 100, 100, btnTB02, ArrowButtonImage), "fact", -1));
//ID 2
TalkBoxes.push(new TalkBox(GMIconImage, "I will destroy this solar system. With my massive ship, the Mighty Hammerhead, I will knock every planet out of orbit!", new Button("", SCREEN_WIDTH - 105, SCREEN_HEIGHT - 105, 100, 100, btnTB03, ArrowButtonImage), "fiction", -1));
//ID 3
TalkBoxes.push(new TalkBox(PresidentIconImage, "Star Captain... Come in, Star Captain... You have to stop General Mean! The people of Bouncy Planet need your help!", new Button("", SCREEN_WIDTH - 105, SCREEN_HEIGHT - 105, 100, 100, btnTB04, ArrowButtonImage), "fiction", -1));
//ID 4
TalkBoxes.push(new TalkBox(SCIconImage, "I read you, Mr. President. I'll shoot him down before he can reach Bouncy Planet.", new Button("", SCREEN_WIDTH - 105, SCREEN_HEIGHT - 105, 100, 100, btnTB05, ArrowButtonImage), "fiction", 60000));
//ID 5
TalkBoxes.push(new TalkBox(GMIconImage, "Mwahaha! I have knocked Pluto out of orbit!", new Button("", SCREEN_WIDTH - 105, SCREEN_HEIGHT - 105, 100, 100, btnTB06, ArrowButtonImage), "fiction", 30000));
//ID 6
TalkBoxes.push(new TalkBox(GMIconImage, "Mwahaha! I have knocked Jupiter out of orbit!", new Button("", SCREEN_WIDTH - 105, SCREEN_HEIGHT - 105, 100, 100, btnTB06, ArrowButtonImage), "fiction", 30000));
//ID 7
TalkBoxes.push(new TalkBox(GMIconImage, "Mwahaha! I have knocked Venus out of orbit!", new Button("", SCREEN_WIDTH - 105, SCREEN_HEIGHT - 105, 100, 100, btnTB06, ArrowButtonImage), "fiction", 30000));
//ID 8
TalkBoxes.push(new TalkBox(GMIconImage, "Mwahaha! I have knocked Mercury out of orbit!", new Button("", SCREEN_WIDTH - 105, SCREEN_HEIGHT - 105, 100, 100, btnTB06, ArrowButtonImage), "fiction", 30000));
//ID 9
TalkBoxes.push(new TalkBox(GMIconImage, "Mwahaha! I have knocked Bouncy Planet out of orbit!", new Button("", SCREEN_WIDTH - 105, SCREEN_HEIGHT - 105, 100, 100, btnTB07, ArrowButtonImage), "fiction", 30000));
//ID 10
TalkBoxes.push(new TalkBox(SCIconImage, "Nooooo!!!", new Button("", SCREEN_WIDTH - 105, SCREEN_HEIGHT - 105, 100, 100, btnTB06, ArrowButtonImage), "fiction", 10000));
//ID 11
TalkBoxes.push(new TalkBox(GMIconImage, "Victory is mine!", new Button("", SCREEN_WIDTH - 105, SCREEN_HEIGHT - 105, 100, 100, btnTB08, ArrowButtonImage), "fiction", 30000));
//ID 12
TalkBoxes.push(new TalkBox(KidIconImage, "No one can stop General Mean! He leaves the solar system in ruins, its planets bouncing through space out of control. The End.", new Button("", SCREEN_WIDTH - 105, SCREEN_HEIGHT - 105, 100, 100, btnTB09, ArrowButtonImage), "fact", 60000));
//ID 13
TalkBoxes.push(new TalkBox(SCIconImage, "General Mean, you are vanquished. My work here is done.", new Button("", SCREEN_WIDTH - 105, SCREEN_HEIGHT - 105, 100, 100, btnTB16, ArrowButtonImage), "fiction", 60000));
//ID 14
TalkBoxes.push(new TalkBox(KidIconImage, "Star Captain defeated General Mean, but the solar system had paid a heavy price. True to his word, though, Star Captain protected Bouncy Planet, and the people lived happily ever after. The End.", new Button("", SCREEN_WIDTH - 105, SCREEN_HEIGHT - 105, 100, 100, btnTB09, ArrowButtonImage), "fact", 60000));
//ID 15
TalkBoxes.push(new TalkBox(KidIconImage, "Star Captain defeated General Mean, but the solar system had paid a heavy price. Not even Bouncy Planet had been spared from the destruction. The End.", new Button("", SCREEN_WIDTH - 105, SCREEN_HEIGHT - 105, 100, 100, btnTB09, ArrowButtonImage), "fact", 60000));
//ID 16
TalkBoxes.push(new TalkBox(KidIconImage, "Star Captain defeated General Mean and protected the solar system. The people of Bouncy Planet lived happily ever after. The End.", new Button("", SCREEN_WIDTH - 105, SCREEN_HEIGHT - 105, 100, 100, btnTB09, ArrowButtonImage), "fact", 60000));
//ID 17
TalkBoxes.push(new TalkBox(KidIconImage, "Star Captain defeated General Mean, and the solar system was safe... for the most part. Unfortunately, General Mean had focused his attacks on Bouncy Planet, and it now bounces through space out of control. The End.", new Button("", SCREEN_WIDTH - 105, SCREEN_HEIGHT - 105, 100, 100, btnTB09, ArrowButtonImage), "fact", 60000));
//ID 18
TalkBoxes.push(new TalkBox(AgentIconImage, "Dinner's ready. Get in here and eat.", new Button("", SCREEN_WIDTH - 105, SCREEN_HEIGHT - 105, 100, 100, btnTB11, ArrowButtonImage), "fiction", 30000));
//ID 19
TalkBoxes.push(new TalkBox(KidIconImage, "Huh? Hold on, let me finish this first.", new Button("", SCREEN_WIDTH - 105, SCREEN_HEIGHT - 105, 100, 100, btnTB12, ArrowButtonImage), "fact", 30000));
//ID 20
TalkBoxes.push(new TalkBox(MomIconImage, "How long is it going to take?", new Button("", SCREEN_WIDTH - 105, SCREEN_HEIGHT - 105, 100, 100, btnTB13, ArrowButtonImage), "fact", 30000));
//ID 21
TalkBoxes.push(new TalkBox(KidIconImage, "I don't know.", new Button("", SCREEN_WIDTH - 105, SCREEN_HEIGHT - 105, 100, 100, btnTB14, ArrowButtonImage), "fact", 30000));
//ID 22
TalkBoxes.push(new TalkBox(MomIconImage, "Then it'll have to wait. Your food's getting cold.", new Button("", SCREEN_WIDTH - 105, SCREEN_HEIGHT - 105, 100, 100, btnTB15, ArrowButtonImage), "fact", 30000));
//ID 23
TalkBoxes.push(new TalkBox(KidIconImage, "*Sigh* Okaaaay!", new Button("", SCREEN_WIDTH - 105, SCREEN_HEIGHT - 105, 100, 100, btnTB09, ArrowButtonImage), "fact", 30000));
//ID 24
TalkBoxes.push(new TalkBox(GMIconImage, "Nooooo!!!", new Button("", SCREEN_WIDTH - 105, SCREEN_HEIGHT - 105, 100, 100, btnTB10, ArrowButtonImage), "fiction", 60000));

function btnTB01()
{
	setTalkBox(1);
}

function btnTB02()
{
	clearTalkBox();
	ChangeMenu(Menus.Story2);
}

function btnTB03()
{
	setTalkBox(3);
}

function btnTB04()
{
	NewGame();
	ChangeMenu(Menus.None);
	setTalkBox(4);
}

function btnTB05()
{
	clearTalkBox();
}

function btnTB06()
{
	if(gmwins)
	{
		setTalkBox(11);
	}
	else
	{
		clearTalkBox();
	}
}

function btnTB07()
{
	setTalkBox(10);
}

function btnTB08()
{
	ChangeMenu(Menus.End);
	setTalkBox(12);
}

function btnTB09()
{
	ChangeMenu(Menus.Main);
}

function btnTB10()
{
	ChangeMenu(Menus.End);
	
	var casualties = 0;
	var missionsuccess = true;
	if(!bouncyplanet.stable)
	{
		missionsuccess = false;
		casualties++;
	}
	if(!mercury.stable)
	{
		casualties++;
	}
	if(!venus.stable)
	{
		casualties++;
	}
	if(!jupiter.stable)
	{
		casualties++;
	}
	if(!pluto.stable)
	{
		casualties++;
	}
	
	if(casualties < 3) //two or fewer planets ruined
	{
		if(missionsuccess)
		{
			setTalkBox(16);
		}
		else
		{
			setTalkBox(17);
		}
	}
	else
	{
		if(missionsuccess)
		{
			setTalkBox(14);
		}
		else
		{
			setTalkBox(15);
		}
	}
}

function btnTB11()
{
	ChangeMenu(Menus.End);
	setTalkBox(19);
}

function btnTB12()
{
	setTalkBox(20);
}

function btnTB13()
{
	setTalkBox(21);
}

function btnTB14()
{
	setTalkBox(22);
}

function btnTB15()
{
	setTalkBox(23);
}

function btnTB16()
{
	setTalkBox(24);
}

//Declare all buttons here
var btnBegin = new Button("Begin", SCREEN_WIDTH / 2 - 140, 480, 280, 100, btnBegin_Click, ButtonImage);
btnBegin.x += 10;
btnBegin.width -= 20;
btnBegin.y += 10;
btnBegin.height -= 20;

var btnResume = new Button("Resume", SCREEN_WIDTH / 2 - 140, 480, 280, 100, btnResume_Click, ButtonImage);
btnResume.x += 10;
btnResume.width -= 20;
btnResume.y += 10;
btnResume.height -= 20;

var btnQuit = new Button("Quit", SCREEN_WIDTH / 2 - 140, 240, 280, 100, btnMainMenu_Click, ButtonImage);
btnQuit.x += 10;
btnQuit.width -= 20;
btnQuit.y += 10;
btnQuit.height -= 20;

var btnControls = new Button("Controls", SCREEN_WIDTH / 2 - 140, 360, 280, 100, btnControls_Click, ButtonImage);
btnControls.x += 10;
btnControls.width -= 20;
btnControls.y += 10;
btnControls.height -= 20;

var btnBackMain = new Button("Back", SCREEN_WIDTH / 2 - 140, 480, 280, 100, btnMainMenu_Click, ButtonImage);
btnBackMain.x += 10;
btnBackMain.width -= 20;
btnBackMain.y += 10;
btnBackMain.height -= 20;

var btnBackPause = new Button("Back", SCREEN_WIDTH / 2 - 140, 480, 280, 100, btnBackPause_Click, ButtonImage);
btnBackPause.x += 10;
btnBackPause.width -= 20;
btnBackPause.y += 10;
btnBackPause.height -= 20;

function btnBegin_Click()
{
	ChangeMenu(Menus.Story1);
	CameraX = -3000 + SCREEN_WIDTH / 2;
	CameraY = 200 + SCREEN_HEIGHT / 2;
}

function btnResume_Click()
{
	ChangeMenu(Menus.None);
}

function btnMainMenu_Click()
{
	gametimer = -1;
	ChangeMenu(Menus.Main);
}

function btnControls_Click()
{
	ChangeMenu(Menus.Controls);
}

function btnBackPause_Click()
{
	ChangeMenu(Menus.Pause);
}

var sun = new Entity('Sun', new Vector(0, 0), 300, {
	image: SunImage
});
particles.push(sun); //the sun is particles[0] - this is important for holding it still
trails.push([]);

var starcaptain = new Entity('Star Captain', new Vector(3100, -200), 25,	{
	mass: 10,
	velocity: new Vector(-8, -3),
	image: StarCaptainImage
});
starcaptain.thrusting = false;
particles.push(starcaptain); //this means Star Captain will be particles[1] - this is important
trails.push([]);

var generalmean = new Entity("General Mean", new Vector(505000, 5000), 50, {
	mass: 2000,
	image: GeneralMeanImage
});
generalmean.thrusting = false;
generalmean.hp = maxhp;
particles.push(generalmean); //General Mean is particles[2] - important for toggling bindex between him and Star Captain
trails.push([]);

var bouncyplanet = new Entity('Bouncy Planet', new Vector(3072, 0), 100, {
	velocity: new Vector(0, -6),
	image: BouncyPlanetImage
});
particles.push(bouncyplanet); //bouncy planet is currently particles[3] - this may not last
trails.push([]);

var mercury = new Entity('Mercury', new Vector(-10240, 0), 80, {
	velocity: new Vector(0, -4.8),
	image: MercuryImage
});
particles.push(mercury); //mercury is particles[4]... for now.
trails.push([]);

var venus = new Entity('Venus', new Vector(0, 40000), 120, {
	velocity: new Vector(3, 0),
	image: VenusImage
});
particles.push(venus); //venus is particles[5]... for now
trails.push([]);

var jupiter = new Entity("Jupiter", new Vector(120000, 0), 140, {
	velocity: new Vector(0, 2),
	image: JupiterImage
});
particles.push(jupiter);
trails.push([]);

var pluto = new Entity("Pluto", new Vector(300000, 0), 90, {
	velocity: new Vector(0, -1),
	image: PlutoImage
});
particles.push(pluto);
trails.push([]);


function NewGame()
{
	//reset all the important variables
	for(var i = 0; i < trails.length; i++)
	{
		trails[i] = [];
	}
	
	bullets = [];
	scengineflames = [];
	gmengineflames = [];
	
	pausetimer = -1;
	CameraX = -3000 + SCREEN_WIDTH / 2;
	CameraY = 200 + SCREEN_HEIGHT / 2;
	bindex = 1;
	newbindex = bindex;
	target = 0;
	newtarget = target;
	showradar = true;
	showtrails = true;
	guntimer = -1;
	gmwins = false;
	
	//reset all the entities to their starting states
	starcaptain.pos = new Vector(3000, -200);
	starcaptain.velocity = new Vector(-8, -3);
	starcaptain.angle = 0;
	
	generalmean.pos = new Vector(505000, 5000);
	generalmean.radius = 50;
	generalmean.velocity = new Vector();
	generalmean.mass = 2000;
	generalmean.angle = 0;
	generalmean.hp = maxhp;
	
	bouncyplanet.pos = new Vector(3072, 0);
	bouncyplanet.velocity = new Vector(0, -6);
	bouncyplanet.hitsun = false;
	bouncyplanet.stable = true;
	
	mercury.pos = new Vector(-10240, 0);
	mercury.velocity = new Vector(0, -4.8);
	mercury.hitsun = false;
	mercury.stable = true;
	
	venus.pos = new Vector(0, 40000);
	venus.velocity = new Vector(3, 0);
	venus.hitsun = false;
	venus.stable = true;
	
	jupiter.pos = new Vector(120000, 0);
	jupiter.velocity = new Vector(0, 2);
	jupiter.hitsun = false;
	jupiter.stable = true;
	
	pluto.pos = new Vector(300000, 0);
	pluto.velocity = new Vector(0, -1);
	pluto.hitsun = false;
	pluto.stable = true;
	
	//start the game timer
	gametimer = curframe;
	dinnertime = false;
}

function compute_forces(particleList) {
	particleList = particleList || particles;
    for (var i = 0; i < particleList.length; i++) {
        var p = particleList[i];
        p.acceleration.set(0);

        for (var j = 0; j < i; j++) {
            var p2 = particleList[j];

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
function do_collisions(particleList) {
	particleList = particleList || particles;
	collidedEntities = [];
    for (var i = 0; i < particleList.length; i++) {
        var p = particleList[i];
        for (var j = 0; j < i; j++) {
            var p2 = particleList[j];

			if(p.checkCollision(p2)){
				p.resolveCollision(p2);
				collidedEntities.push(p);
				collidedEntities.push(p2);
			}
        }
    }
}

function do_bulletcollisions(particleList)
{
	particleList = particleList || particles;
	var removed = [];
	for(var i = 0; i < particleList.length; i++)
	{
		if(particleList[i].checkCollision(generalmean))
		{
			removed.push(i);
			if(generalmean.hp > 0)
			{
				generalmean.hp--;
				
				//change general mean's physical properties to match his escape pod
				if(generalmean.hp <= 0)
				{
					generalmean.mass = 10;
					generalmean.radius = 20;
					//shoot GM's escape pod out the right side of the ship
					var epangle = generalmean.angle;
					var epspeed = 50;
					var epx = epspeed * Math.cos(epangle);
					var epy = epspeed * Math.sin(epangle);
					generalmean.velocity.set(generalmean.velocity.add(new Vector(epx, epy)));
					generalmean.angle = epangle + Math.PI / 2;
					//begin the "end cutscene"
					setTalkBox(13);
				}
			}
			
			if(generalmean.shieldframe < 0)
			{
				generalmean.shieldframe = curframe;
			}
		}
	}
	
	//removed all collided particleList
	for(var r = removed.length - 1; r >= 0; r--)
	{
		particleList.splice(removed[r], 1);
	}
}

function do_physics(dt, particleList) {
	particleList = particleList || particles;
    for (var i1 = 0; i1 < particleList.length; i1++) {
        var p1 = particleList[i1];
        p1.pos.set(p1.pos.add(p1.velocity.mul(0.5 * dt)));
    }
    compute_forces();
    for (var i2 = 0; i2 < particleList.length; i2++) {
        var p2 = particleList[i2];
        p2.velocity.set(p2.velocity.add(p2.acceleration.mul(dt)));
    }
    for (var i3 = 0; i3 < particleList.length; i3++) {
        var p3 = particleList[i3];
        p3.pos.set(p3.pos.add(p3.velocity.mul(0.5 * dt)));
    }
    do_collisions(particleList);
}

function do_bullets(dt, particleList) {
	particleList = particleList || bullets;
    for (var i1 = 0; i1 < particleList.length; i1++) {
        var p1 = particleList[i1];
        p1.pos.set(p1.pos.add(p1.velocity.mul(0.5 * dt)));
    }
    for (var i2 = 0; i2 < particleList.length; i2++) {
        var p2 = particleList[i2];
        p2.velocity.set(p2.velocity.add(p2.acceleration.mul(dt)));
    }
    for (var i3 = 0; i3 < particleList.length; i3++) {
        var p3 = particleList[i3];
        p3.pos.set(p3.pos.add(p3.velocity.mul(0.5 * dt)));
    }
	do_bulletcollisions(particleList);
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
	var bulletradius = 3;
	
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
	var firespeed = (generalmean.hp > 0) ? 12 + Math.random() * 5 : 8 + Math.random() * 5;
	var fireradius = (generalmean.hp > 0) ? 4 + Math.random() * 6 : 2 + Math.random() * 4;
	
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

function update()
{
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
	sun.pos.x = 0;
	sun.pos.y = 0;
	
	if(bindex == 1 || bindex == 2)
	{
		//give General Mean a heftier feel by giving him lower acceleration
		var speed = (bindex == 1) ? SC_ACCEL : (generalmean.hp > 0) ? GM_ACCEL : EP_ACCEL;
		if(keys[K_UP] || keys[A_UP])
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
		if(keys[K_DOWN] || keys[A_DOWN])
		{
			//apply reverse force
			var p = particles[bindex];
			var angle = p.angle + Math.PI / 2;
			var vx = Math.cos(angle) * (speed * 0.8); //reverse thrusters shouldn't be as strong as your main engine
			var vy = Math.sin(angle) * (speed * 0.8);
			p.velocity.set(p.velocity.add(new Vector(vx, vy)));
		}
		if(keys[K_LEFT] || keys[A_LEFT])
		{
			//turn left
			particles[bindex].angle -= ANGLE_INCREMENT;
		}
		if(keys[K_RIGHT] || keys[A_RIGHT])
		{
			//turn right
			particles[bindex].angle += ANGLE_INCREMENT;
		}
	}
	
	//deal with repeated fire if you hold down the fire button
	if(guntimer >= 0)
	{
		var elapsed = curframe - guntimer;
		var interval = 250;
		var remainder = elapsed - interval;
		if(remainder >= 0)
		{
			FireBullet();
			guntimer = curframe + remainder;
		}
	}

	updateAI();

    render();
	
	checkPlanets();
	
	//update target and bindex after updating and rendering to prevent weirdness
	if(newtarget != target)
	{
		target = newtarget;
	}
	
	if(newbindex != bindex)
	{
		bindex = newbindex;
		guntimer = -1;
	}
	
	if(target == bindex)
	{
		target++;
	}
	
	if(!dinnertime)
	{
		var gametime = curframe - gametimer;
		if(gametime > 1200000) //twenty minutes
		{
			dinnertime = true;
			setTalkBox(18);
		}
	}
}

function render() {
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
	ctx.strokeStyle = "#0000FF";
	
	//keep the camera locked on Star Captain (or whichever body is at bindex)
	CameraX = -particles[bindex].pos.x + SCREEN_WIDTH / 2;
	CameraY = -particles[bindex].pos.y + SCREEN_HEIGHT / 2;
	
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

	drawStars();

	var dist = 0;
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
				ctx.globalCompositeOperation = "lighter";
				var toberemoved = [];
				for(var fi = 0; fi < scengineflames.length; fi++)
				{
					var f = scengineflames[fi];
					var elapsed = curframe - f.shieldframe;
					var maxlife = 150;
					var lifeper = elapsed / maxlife;
					if(lifeper > 1 || lifeper < 0) //sometimes the elapsed variable winds up negative? I don't know why. This seems like some kind of terrible bug...
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
			if(p.name == "General Mean")
			{
				//account for General Mean's battle damage
				var lifeper = generalmean.hp / maxhp;
				var shipframe = 0;
				if(generalmean.hp <= 0)
				{
					shipframe = 5;
				}
				else if(lifeper < 0.2)
				{
					shipframe = 4;
				}
				else if(lifeper < 0.4)
				{
					shipframe = 3;
				}
				else if(lifeper < 0.6)
				{
					shipframe = 2;
				}
				else if(lifeper < 0.8)
				{
					shipframe = 1;
				}
				
				ctx.save();
				ctx.translate(imgx, imgy);
				ctx.rotate(p.angle);
				ctx.drawImage(p.image, 100 * shipframe, 0, 100, 100, -50, -50, 100, 100);
				ctx.restore();
			}
			else
			{
				ctx.save();
				ctx.translate(imgx, imgy);
				ctx.rotate(p.angle);
				ctx.drawImage(p.image, -p.radius, -p.radius);
				ctx.restore();
				//ctx.rotate(-p.angle);
				//ctx.translate(-imgx, -imgy);
			}
			
			//This new segment just draws Star Captain's and General Mean's shields
			if(p.shieldframe >= 0)
			{
				if(p.name == "Star Captain") //other (actual) particles make use of shieldframe as a ttl timer
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
						if(generalmean.hp > 0)
						{
							ctx.drawImage(GMShieldImage, 100 * frame, 0, 100, 100, p.pos.x + CameraX - p.radius, p.pos.y + CameraY - p.radius, 100, 100);
						}
						else
						{
							ctx.drawImage(EPShieldImage, 40 * frame, 0, 40, 40, p.pos.x + CameraX - p.radius, p.pos.y + CameraY - p.radius, 40, 40);
						}
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
			//compute the distance for the HUD
			var t = particles[target];
			var diffx = t.pos.x - p.pos.x;
			var diffy = t.pos.y - p.pos.y;
			dist = Math.sqrt(diffx * diffx + diffy * diffy) - t.radius - p.radius;
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
	if(showradar)
	{
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
			var t = particles[target];
			var diffx = t.pos.x - generalmean.pos.x;
			var diffy = t.pos.y - generalmean.pos.y;
			var ang = Math.atan2(diffy, diffx);
			var imgx = generalmean.pos.x + CameraX;
			var imgy = generalmean.pos.y + CameraY;
			//draw General Mean's radar indicator
			ctx.save();
			ctx.translate(imgx, imgy);
			ctx.rotate(ang);
			ctx.drawImage(GMRadarImage, -125, -125);
			ctx.restore();
			//ctx.rotate(-ang);
			//ctx.translate(-imgx, -imgy);
		}
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
			ctx.fillStyle = "#FF9900"; //p.colour;
			ctx.fill();
			ctx.closePath();
		}
	}
	
	for(var i = 0; i < bullets_to_remove; i++)
	{
		bullets.shift();
	}
	
	//display the current target destination
	ctx.font = "20px Bitwise, sans-serif";
	ctx.fillStyle = "#FFFFFF";
	var targettext = "Target: " + particles[target].name;
	ctx.drawImage(UIBoxImage, ctx.measureText(targettext).width - 400, -45);
	
	ctx.textAlign = "left";
	ctx.fillText(targettext, 10, 25);
	
	//display distance to target
	var distancetext = "Distance: " + dist;
	ctx.drawImage(UIBoxImage, SCREEN_WIDTH - ctx.measureText(distancetext).width - 80, -45);
	ctx.textAlign = "right";
	ctx.fillText(distancetext, SCREEN_WIDTH - 10, 25);
	
	//display speed
	if(curTB < 0)
	{
		var playerspeed = (particles[bindex].velocity.length() * 10) + "";
		//whole numbers only, please
		var sdot = playerspeed.indexOf(".");
		if(sdot >= 0)
		{
			playerspeed = playerspeed.substring(0, sdot);
		}
		var speedtext = "Speed: " + playerspeed;
		ctx.drawImage(UIBoxImage, ctx.measureText(speedtext).width - 400, SCREEN_HEIGHT - 50);
		ctx.textAlign = "left";
		ctx.fillText(speedtext, 10, SCREEN_HEIGHT - 12);
	}
	
	drawControls();
}

function checkPlanets()
{
	//Pluto first
	var plutostable = pluto.isOrbitStable();
	if(pluto.stable != plutostable)
	{
		pluto.stable = plutostable;
		setTalkBox(5);
	}
	
	//Jupiter second
	var jupiterstable = jupiter.isOrbitStable();
	if(jupiter.stable != jupiterstable)
	{
		jupiter.stable = jupiterstable;
		setTalkBox(6);
	}
	
	//Venus third
	var venusstable = venus.isOrbitStable();
	if(venus.stable != venusstable)
	{
		venus.stable = venusstable;
		setTalkBox(7);
	}
	
	//Mercury fourth
	var mercurystable = mercury.isOrbitStable();
	if(mercury.stable != mercurystable)
	{
		mercury.stable = mercurystable;
		setTalkBox(8);
	}
	
	//Mercury fourth
	var bpstable = bouncyplanet.isOrbitStable();
	if(bouncyplanet.stable != bpstable)
	{
		bouncyplanet.stable = bpstable;
		setTalkBox(9);
	}
	
	if(plutostable || jupiterstable || venusstable || mercurystable || bpstable)
	{
		gmwins = false;
	}
	else
	{
		gmwins = true;
	}
}

function drawStars()
{
	// Draw starfield
	for(var i = 0; i < stars.length; i++){
		stars[i].render();
	}
}

function ChangeMenu(menu)
{
	for(var c = 0; c < Controls.length; c++)
	{
		Controls[c].state = ButtonState.UP;
	}
	Controls = [];
	MenuShowing = true;
	
	if(menu == Menus.Main)
	{
		clearTalkBox();
		Controls.push(btnBegin);
		Controls.push(btnControls);
	}
	else if(menu == Menus.Controls)
	{
		if(MenuID == Menus.Main)
		{
			Controls.push(btnBackMain);
		}
		else if(MenuID == Menus.Pause)
		{
			Controls.push(btnBackPause);
		}
	}
	else if(menu == Menus.Story1)
	{
		setTalkBox(0);
	}
	else if(menu == Menus.Story2)
	{
		setTalkBox(2);
	}
	else if(menu == Menus.Pause)
	{
		if(MenuID == Menus.None)
		{
			pausetimer = curframe;
			pauseTB = curTB;
			clearTalkBox();
		}
		Controls.push(btnQuit);
		Controls.push(btnControls);
		Controls.push(btnResume);
	}
	else if(menu == Menus.None)
	{
		if(MenuID == Menus.Pause) //if we're unpausing
		{
			var pausetime = curframe - pausetimer;
			//deal with all the timers
			if(guntimer >= 0)
			{
				guntimer += pausetime;
			}
			
			if(gametimer >= 0)
			{
				gametimer += pausetime;
			}
			
			for(var i = 0; i < particles.length; i++)
			{
				var p = particles[i];
				if(p.shieldframe >= 0)
				{
					p.shieldframe += pausetime;
				}
			}
			
			for(var i = 0; i < bullets.length; i++)
			{
				var b = bullets[i];
				if(b.shieldframe >= 0)
				{
					b.shieldframe += pausetime;
				}
			}
			
			for(var i = 0; i < scengineflames.length; i++)
			{
				var f = scengineflames[i];
				if(f.shieldframe >= 0)
				{
					f.shieldframe += pausetime;
				}
			}
			
			for(var i = 0; i < gmengineflames.length; i++)
			{
				var g = gmengineflames[i];
				if(g.shieldframe >= 0)
				{
					g.shieldframe += pausetime;
				}
			}
			
			pausetimer = -1;
			
			setTalkBox(pauseTB);
			pauseTB = -1;
		}
		MenuShowing = false;
	}
	
	MenuID = menu;
	//send a mousemove event to all controls to prevent double-clicking
	for(var c = 0; c < Controls.length; c++)
	{
		Controls[c].pick(LastX, LastY, EventType.MOVE, MouseDown, MouseDownX, MouseDownY);
	}
}

function drawMenu()
{
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
	
	if(MenuID == Menus.Main)
	{
		drawStars();
		ctx.fillStyle = "#FFFFFF";
		ctx.textAlign = "center";
		ctx.font = "80px Bitwise, Arial, sans-serif";
		ctx.fillText("Bouncy Planet", SCREEN_WIDTH / 2, 120);
	}
	else if(MenuID == Menus.Story1)
	{
		ctx.drawImage(KidsRoomImage, 0, 0);
	}
	else if(MenuID == Menus.Story2)
	{
		drawStars();
	}
	else if(MenuID == Menus.End)
	{
		ctx.drawImage(KidsRoomImage, 0, 0);
	}
	else if(MenuID == Menus.Pause)
	{
		drawStars();
		ctx.fillStyle = "#FFFFFF";
		ctx.textAlign = "center";
		ctx.font = "80px Bitwise, Arial, sans-serif";
		ctx.fillText("Pause Menu", SCREEN_WIDTH / 2, 120);
	}
	else if(MenuID == Menus.Controls)
	{
		drawStars();
		ctx.fillStyle = "#FFFFFF";
		ctx.textAlign = "center";
		ctx.font = "80px Bitwise, Arial, sans-serif";
		ctx.fillText("Controls", SCREEN_WIDTH / 2, 120);
		var line2 = FillWrapText("Arrow keys (or WASD) - Steer your ship", "24px Bitwise, Arial, sans-serif", "left", SCREEN_WIDTH * 3 / 4, 100, 200);
		var line3 = FillWrapText("Tab - Switch Target (Shift+Tab to cycle backwards through targets)", "24px Bitwise, Arial, sans-serif", "left", SCREEN_WIDTH * 3 / 4, 100, line2 - 10);
		var line4 = FillWrapText("Space - Toggle between ships", "24px Bitwise, Arial, sans-serif", "left", SCREEN_WIDTH * 3 / 4, 100, line3 - 10);
		var line5 = FillWrapText("Z (or X) - Fire Star Captain's weapons", "24px Bitwise, Arial, sans-serif", "left", SCREEN_WIDTH * 3 / 4, 100, line4 - 10);
		var line6 = FillWrapText("R - Toggle Radar display", "24px Bitwise, Arial, sans-serif", "left", SCREEN_WIDTH * 3 / 4, 100, line5 - 10);
		var line7 = FillWrapText("T - Toggle visible trails", "24px Bitwise, Arial, sans-serif", "left", SCREEN_WIDTH * 3 / 4, 100, line6 - 10);
	}
	
	drawControls();
}

function setTalkBox(id)
{
	//remove the previous Talk Box button from Controls (if there is one)
	clearTalkBox();
	
	//set the current Talk Box and add its button to Controls
	if(id >= 0 && id < TalkBoxes.length)
	{
		curTB = id;
		Controls.push(TalkBoxes[id].button);
		TalkBoxes[id].frame = curframe;
	}
	
	//send a mousemove event to each of the controls to prevent double-clicking
	for(var c = 0; c < Controls.length; c++)
	{
		Controls[c].pick(LastX, LastY, EventType.MOVE, MouseDown, MouseDownX, MouseDownY);
	}
}

function clearTalkBox()
{
	//remove the previous Talk Box button from Controls (if there is one)
	var removed = -1;
	for(var i = 0; i < TalkBoxes.length; i++)
	{
		TalkBoxes[i].button.state = ButtonState.UP;
		TalkBoxes[i].frame = -1;
		var io = Controls.indexOf(TalkBoxes[i].button);
		if(io >= 0)
		{
			removed = io;
		}
	}
	if(removed >= 0)
	{
		Controls.splice(removed, 1);
	}
	
	curTB = -1;
}

function drawControls()
{
	if(curTB >= 0)
	{
		if(TalkBoxes[curTB].timelimit >= 0 && curframe - TalkBoxes[curTB].frame > TalkBoxes[curTB].timelimit) //talk boxes need to be timed so that things don't go out of control
		{
			TalkBoxes[curTB].button.event();
		}
		else
		{
			TalkBoxes[curTB].draw();
		}
	}
	
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
