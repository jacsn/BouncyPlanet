var SCREEN_WIDTH = 1024;
var SCREEN_HEIGHT = 640;

var ANGLE_INCREMENT = Math.PI / 64;

var K_UP = 38;
var K_DOWN = 40;
var K_LEFT = 37;
var K_RIGHT = 39;

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
