var SCREEN_WIDTH = 1024;
var SCREEN_HEIGHT = 640;

var ANGLE_INCREMENT = Math.PI / 64;

var K_UP = 38;
var K_DOWN = 40;
var K_LEFT = 37;
var K_RIGHT = 39;
//key used for shooting
var K_FIRE = 90;

var Menus = new function()
{
	this.Main = 0;
	this.None = 1;
}

var ButtonImage = new Image();
ButtonImage.ready = false;
ButtonImage.onload = function(){this.ready = true;};
ButtonImage.src = "img/button.png";

var SunImage = new Image();
SunImage.ready = false;
SunImage.onload = function(){this.ready = true;};
SunImage.src = "img/sun.png";

var BouncyPlanetImage = new Image();
BouncyPlanetImage.ready = false;
BouncyPlanetImage.onload = function(){this.ready = true;};
BouncyPlanetImage.src = "img/bouncyplanet.png";

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

var SCThrustImage = new Image();
SCThrustImage.ready = false;
SCThrustImage.onload = function(){this.ready = true;};
SCThrustImage.src = "img/scthrust.png";