'use strict';

var SCREEN_WIDTH = 1024;
var SCREEN_HEIGHT = 640;

var ANGLE_INCREMENT = Math.PI / 64;

var SC_ACCEL = 1;
var GM_ACCEL = 0.2;
var EP_ACCEL = 0.8;

//arrow keys
var K_UP = 38;
var K_DOWN = 40;
var K_LEFT = 37;
var K_RIGHT = 39;
//WASD keys
var A_UP = 87;
var A_DOWN = 83;
var A_LEFT = 65;
var A_RIGHT = 68;
//key used for shooting
var K_FIRE = 90;
var A_FIRE = 88;
//other necessary keys
var K_SPACE = 32;
var K_ENTER = 13;
var K_ESC = 27;
var K_TAB = 9;
var K_SHIFT = 16;
var K_TRAILS = 84;
var K_RADAR = 82;

var Menus = new function()
{
	this.Main = 0;
	this.Pause = 1;
	this.Story1 = 2;
	this.Story2 = 3;
	this.End = 4;
	this.Controls = 5;
	this.None = 6;
}

var ButtonImage = new Image();
ButtonImage.ready = false;
ButtonImage.onload = function(){this.ready = true;};
ButtonImage.src = "img/button2.png";

var UIBoxImage = new Image();
UIBoxImage.ready = false;
UIBoxImage.onload = function(){this.ready = true;};
UIBoxImage.src = "img/uibox.png";

var TalkBackgroundImage = new Image();
TalkBackgroundImage.ready = false;
TalkBackgroundImage.onload = function(){this.ready = true;};
TalkBackgroundImage.src = "img/talkbackground.png";

var TalkBG2Image = new Image();
TalkBG2Image.ready = false;
TalkBG2Image.onload = function(){this.ready = true;};
TalkBG2Image.src = "img/talkbg2.png";

var ArrowButtonImage = new Image();
ArrowButtonImage.ready = false;
ArrowButtonImage.onload = function(){this.ready = true;};
ArrowButtonImage.src = "img/arrowbutton.png";

var KidsRoomImage = new Image();
KidsRoomImage.ready = false;
KidsRoomImage.onload = function(){this.ready = true;};
KidsRoomImage.src = "img/story1.png";

var KidIconImage = new Image();
KidIconImage.ready = false;
KidIconImage.onload = function(){this.ready = true;};
KidIconImage.src = "img/kidicon.png";

var GMIconImage = new Image();
GMIconImage.ready = false;
GMIconImage.onload = function(){this.ready = true;};
GMIconImage.src = "img/meanicon.png";

var SCIconImage = new Image();
SCIconImage.ready = false;
SCIconImage.onload = function(){this.ready = true;};
SCIconImage.src = "img/scicon.png";

var PresidentIconImage = new Image();
PresidentIconImage.ready = false;
PresidentIconImage.onload = function(){this.ready = true;};
PresidentIconImage.src = "img/president.png";

var AgentIconImage = new Image();
AgentIconImage.ready = false;
AgentIconImage.onload = function(){this.ready = true;};
AgentIconImage.src = "img/agenticon.png";

var MomIconImage = new Image();
MomIconImage.ready = false;
MomIconImage.onload = function(){this.ready = true;};
MomIconImage.src = "img/momicon.png";

var SunImage = new Image();
SunImage.ready = false;
SunImage.onload = function(){this.ready = true;};
SunImage.src = "img/sun.png";

var BouncyPlanetImage = new Image();
BouncyPlanetImage.ready = false;
BouncyPlanetImage.onload = function(){this.ready = true;};
BouncyPlanetImage.src = "img/bouncyplanet.png";

var MercuryImage = new Image();
MercuryImage.ready = false;
MercuryImage.onload = function(){this.ready = true;};
MercuryImage.src = "img/mercury.png";

var VenusImage = new Image();
VenusImage.ready = false;
VenusImage.onload = function(){this.ready = true;};
VenusImage.src = "img/venus.png";

var JupiterImage = new Image();
JupiterImage.ready = false;
JupiterImage.onload = function(){this.ready = true;};
JupiterImage.src = "img/jupiter.png";

var PlutoImage = new Image();
PlutoImage.ready = false;
PlutoImage.onload = function(){this.ready = true;};
PlutoImage.src = "img/pluto.png";

var StarCaptainImage = new Image();
StarCaptainImage.ready = false;
StarCaptainImage.onload = function(){this.ready = true;};
StarCaptainImage.src = "img/starcaptain.png";

var GeneralMeanImage = new Image();
GeneralMeanImage.ready = false;
GeneralMeanImage.onload = function(){this.ready = true;};
GeneralMeanImage.src = "img/generalmean.png";

var SCRadarImage = new Image();
SCRadarImage.ready = false;
SCRadarImage.onload = function(){this.ready = true;};
SCRadarImage.src = "img/scradar.png";

var GMRadarImage = new Image();
GMRadarImage.ready = false;
GMRadarImage.onload = function(){this.ready = true;};
GMRadarImage.src = "img/gmradar.png";

var SCShieldImage = new Image();
SCShieldImage.ready = false;
SCShieldImage.onload = function(){this.ready = true;};
SCShieldImage.src = "img/scshield.png";

var GMShieldImage = new Image();
GMShieldImage.ready = false;
GMShieldImage.onload = function(){this.ready = true;};
GMShieldImage.src = "img/gmshield.png";

var EPShieldImage = new Image();
EPShieldImage.ready = false;
EPShieldImage.onload = function(){this.ready = true;};
EPShieldImage.src = "img/epshield.png";

var Smoke1Image = new Image();
Smoke1Image.ready = false;
Smoke1Image.onload = function(){this.ready = true;};
Smoke1Image.src = "img/smoke1.png";

var Smoke2Image = new Image();
Smoke2Image.ready = false;
Smoke2Image.onload = function(){this.ready = true;};
Smoke2Image.src = "img/smoke2.png";

var Smoke3Image = new Image();
Smoke3Image.ready = false;
Smoke3Image.onload = function(){this.ready = true;};
Smoke3Image.src = "img/smoke3.png";

var Fire1Image = new Image();
Fire1Image.ready = false;
Fire1Image.onload = function(){this.ready = true;};
Fire1Image.src = "img/fire1.png";

var Fire2Image = new Image();
Fire2Image.ready = false;
Fire2Image.onload = function(){this.ready = true;};
Fire2Image.src = "img/fire2.png";

var Fire3Image = new Image();
Fire3Image.ready = false;
Fire3Image.onload = function(){this.ready = true;};
Fire3Image.src = "img/fire3.png";