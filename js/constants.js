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

var RadarImage = new Image();
RadarImage.ready = false;
RadarImage.onload = function(){this.ready = true;};
RadarImage.src = "img/radar.png";
