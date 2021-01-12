// "Crappy PONG" -- step by step
//
// Step 9: Homework
/*
* Make the ball bounce off the left and right 
  edges of the playfield, instead of "resetting".
  
* Add a scoring system! When the ball hits the
  left edge, the right paddle earns a point, and
  vice versa. Display each paddle's score, in
  "bold 40px Arial", at the top of the playfield 

* Prevent the paddles from moving out of the
  playfield, by having them "collide" with it.
  
* Let the user also move the paddles horizontally
  i.e. left and right within 100 pixels of the edges,
  using the 'A' and 'D' keys for the left paddle,
  and   the 'J' and 'L' keys for the right paddle
  
* Add a second ball, with half the velocity 
  of the first one.
*/

"use strict";
console.log(3);
/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

/*
0        1         2         3         4         5         6         7         8         9
123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

// =================
// KEYBOARD HANDLING
// =================

var g_keys = [];

function handleKeydown(evt) {
    g_keys[evt.keyCode] = true;
}

function handleKeyup(evt) {
    g_keys[evt.keyCode] = false;
}

// Inspects, and then clears, a key's state
//
// This allows a keypress to be "one-shot" e.g. for toggles
// ..until the auto-repeat kicks in, that is.
//
function eatKey(keyCode) {
    var isDown = g_keys[keyCode];
    g_keys[keyCode] = false;
    return isDown;
}

window.addEventListener("keydown", handleKeydown);
window.addEventListener("keyup", handleKeyup);

// ============
// PADDLE STUFF
// ============

// COMMON PADDLE STUFF

// A generic contructor which accepts an arbitrary descriptor object
function Paddle(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

// Add these properties to the prototype, where they will serve as
// shared defaults, in the absence of an instance-specific overrides.

Paddle.prototype.halfWidth = 10;
Paddle.prototype.halfHeight = 50;

Paddle.prototype.update = function () {
   
   	if (g_keys[this.GO_UP] && this.cy > 50) {
        this.cy -= 7;
    }
    if (g_keys[this.GO_DOWN] && this.cy < 350) {
        this.cy += 7;
    }
    if (g_keys[this.GO_LEFT] && this.cx > 10 ) {
       this.cx -=4;
       if(g_paddle2.cx <= 300){
       		g_paddle2.cx = 300;
       }
    }
    if (g_keys[this.GO_RIGHT] && this.cx < 390){
       this.cx += 4;
       if(g_paddle1.cx >= 100){
       		g_paddle1.cx = 100;
       }  
    }
  
};

Paddle.prototype.render = function (ctx) {
    // (cx, cy) is the centre; must offset it for drawing
    ctx.fillStyle = "blue";
    ctx.fillRect(this.cx - this.halfWidth,
                 this.cy - this.halfHeight,
                 this.halfWidth * 2,
                 this.halfHeight * 2);
};

Paddle.prototype.collidesWith = function (prevX, prevY, 
                                          nextX, nextY, 
                                          r) {
    var paddleEdge = this.cx;
    // Check X coords
    if ((nextX - r < paddleEdge && prevX - r >= paddleEdge) ||
        (nextX + r > paddleEdge && prevX + r <= paddleEdge)) {
        // Check Y coords
        if (nextY + r >= this.cy - this.halfHeight &&
            nextY - r <= this.cy + this.halfHeight) {
            // It's a hit!
            Ball.nextY *= 2;
            return true;
        }
    }
    // It's a miss!
    return false;
};

// PADDLE 1

var KEY_W = 'W'.charCodeAt(0);
var KEY_S = 'S'.charCodeAt(0);
var KEY_A = 'A'.charCodeAt(0);
var KEY_D = 'D'.charCodeAt(0);

var g_paddle1 = new Paddle({
    cx : 30,
    cy : 100,
   
    GO_UP   : KEY_W,
    GO_DOWN : KEY_S,
    GO_LEFT : KEY_A,
    GO_RIGHT :  KEY_D, 
});

// PADDLE 2

var KEY_I = 'I'.charCodeAt(0);
var KEY_K = 'K'.charCodeAt(0);
var KEY_J = 'J'.charCodeAt(0);
var KEY_L = 'L'.charCodeAt(0);

var g_paddle2 = new Paddle({
    cx : 370,
    cy : 300,
   
    GO_UP   : KEY_I,
    GO_DOWN : KEY_K,
    GO_LEFT : KEY_J,
    GO_RIGHT :  KEY_L,

});



// ==========
// BALL STUFF
// ==========

// BALL STUFF
function Ball(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

var g_ball1 = new Ball({
    cx: 51,
    cy: 200,
    radius: 20,
    mass: 2,
		angle2: 1,
    xVel: 4,
    yVel: 2
});

var g_ball2 = new Ball ({
    cx: 200,
    cy: 250,
    radius: 15,
		mass : 1,
		angle2: 2,
    xVel: 2,
    yVel: 1
});

Ball.prototype.update = function (){
    // Remember my previous position
  
    var prevX = this.cx;
    var prevY = this.cy;
    var oddeven = 2;
    // Compute my provisional new position (barring collisions)
    var nextX = prevX + this.xVel;
    var nextY = prevY + this.yVel;
    // Bounce off the paddles
    if (g_paddle1.collidesWith(prevX, prevY, nextX, nextY, this.radius) ||
        g_paddle2.collidesWith(prevX, prevY, nextX, nextY, this.radius))
    { 
        this.xVel *= -1.0;
        this.yVel *= 1.0;
    }
    
    // Bounce off top and bottom edges
    if (nextY < 0 ||                             // top edge
        (nextY > g_canvas.height)) {               // bottom edge
        this.yVel *= -1;
    }
    //Bounce off Left and Right edges
     if (nextX < 0 ||                             //left edge 
        nextX > g_canvas.width) {               //Right edge
      
        this.xVel *= -1;
    }
    
    //An attempt to make the balls detect if they overlap and then to bounce of eah other.
		// Wasin't able to get some nice bounce behaviour so they just kind of jump around or 			//	move 
    //  
    if(g_ball1.radius + g_ball1.cx+ g_ball2.radius > g_ball1.cx  && g_ball1.cx < g_ball2.cx + g_ball1.radius + g_ball2.radius && g_ball1.cy + g_ball1.radius + g_ball2.radius > g_ball2.cy && g_ball1.cy < g_ball2.cy + g_ball1.radius + g_ball2.radius){
    	
      var distance = Math.sqrt(
            ((g_ball1.cx - g_ball2.cx) * (g_ball1.cx - g_ball2.cx)) + ((g_ball1.cy - g_ball1.cy) * (g_ball1.cy-g_ball2.cy)));
						if (distance < g_ball1.radius + g_ball2.radius)
						{
          			g_ball1.yVel  *= -1;
                g_ball1.xVel  *= -1;
          	  	g_ball2.xVel *= -1;
                g_ball2.yVel *= -1;
                g_ball2.cx += 10;
                g_ball2.cy  -= 10;
						}
            if(g_ball2.cx < 0 || g_ball2.cx > 400 || g_ball2.cy > 400||g_ball2.cy < 0){
            		g_ball2.cx = 200;
                g_ball2.cy  = 200;
            }
            
    }
    score(nextX);
    // Reset if we fall off the left or right edges
    // ...by more than some arbitrary `margin`
    //
    var margin = 4 * this.radius;
    if (nextX < -margin ||
        nextX > g_canvas.width + margin) {
        this.reset();
    }
    //set different spins for the balls
    g_ball2.angle2 -= 0.1;
    g_ball1.angle2 += 0.04;

    // *Actually* update my position 
    // ...using whatever velocity I've ended up with
    //
    this.cx += this.xVel;
    this.cy += this.yVel;
   
};

Ball.prototype.reset = function () {
    this.cx = 300;
    this.cy = 100;
    this.xVel = -5;
    this.yVel = 4;
};

Ball.prototype.render = function (ctx) {

     g_ctx.save();
     g_ctx.beginPath();
 
     g_ctx.translate(this.cx-15,this.cy-15);
     g_ctx.scale(0.08,0.08);
     drawSmileyAt(g_ctx, 
                 this.cx, this.cy, 
                 this.radius, this.angle2);
   	 g_ctx.restore();
   	 
     ctx.fill();
     ctx.beginPath();
     ctx.fillStyle = "black";
};

var g_defaultSmileyX = 200,
    g_defaultSmileyY = 200,
    g_defaultSmileyRadius = 150;
    
    var newCx = g_defaultSmileyX,
        newCy = g_defaultSmileyY,
        newR  = g_defaultSmileyRadius;

function drawSmileyAt(ctx, cx, cy, radius, angle) {
    // This matrix trickery lets me take a "default smiley",
    // and transform it so I can draw it anyway, at any size,
    // and at any angle.
    ctx.save();
    ctx.translate(newCx, newCy);
    ctx.rotate(angle);
    var scale = radius / 10;
    ctx.scale(scale, scale);
    ctx.translate(-g_defaultSmileyX, -g_defaultSmileyY);
    drawDefaultSmiley(ctx);
    ctx.restore();
}
// =====
// UTILS
// =====
function clearCanvas(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    score();  
}

var g_player1 = 0;
var g_player2 = 0;
function score(x){
		if(x <= -1){
  	 		 g_player2 += 1;
  	}
    else if(x >=401){
	       g_player1 += 1;
    }
}
function DrawScoreBoard(ctx){			
    	g_ctx.font = "40px Arial";
			g_ctx.fillStyle = "black";
      g_ctx.fillText(g_player1,0,30);
      g_ctx.fillText(g_player2,320,30);
      g_ctx.beginPath();
}
// Check who is winning and display sad or happy smiley accordingly
function checkWinner(){

	if(g_player1 > g_player2){
	   g_ctx.save();
		 g_ctx.beginPath();
		 g_ctx.translate(100,20);
     g_ctx.scale(0.10,0.10);
     drawDefaultSmiley(g_ctx);
     g_ctx.restore();
     g_ctx.save();
     g_ctx.translate(250,20);
     g_ctx.scale(0.1,0.1);
     sadsmiley(g_ctx);
     g_ctx.beginPath();
     g_ctx.restore();
  }
  else if(g_player1 === g_player2){
     g_ctx.save();
     g_ctx.beginPath();
     g_ctx.translate(100,20);
     g_ctx.scale(0.10,0.10);
     drawDefaultSmiley(g_ctx);
    	g_ctx.restore();
    	g_ctx.save(); 
     g_ctx.translate(250,20);
     g_ctx.scale(0.1,0.1);
     drawDefaultSmiley(g_ctx);
     g_ctx.beginPath();
     g_ctx.restore();
 }
 else if(g_player2 > g_player1){
 	   g_ctx.save();
  	 g_ctx.beginPath();
		 g_ctx.translate(250,20);
     g_ctx.scale(0.10,0.10);
     drawDefaultSmiley(g_ctx);
     g_ctx.restore();
     g_ctx.save(); 
     g_ctx.translate(100,20);
     g_ctx.scale(0.1,0.1);
     sadsmiley(g_ctx);
     g_ctx.beginPath();
     g_ctx.restore();
  }
}

// =============
// GATHER INPUTS
// =============
function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}
// =================
// UPDATE SIMULATION
// =================
function updateSimulation() {
    if (shouldSkipUpdate()) return;
	
    g_ball1.update();
    g_ball2.update();
    g_paddle1.update();
    g_paddle2.update();
}
// Togglable Pause Mode
//
var KEY_PAUSE = 'P'.charCodeAt(0);
var KEY_STEP  = 'O'.charCodeAt(0);

var g_isUpdatePaused = false;

function shouldSkipUpdate() {
    if (eatKey(KEY_PAUSE)) {
        g_isUpdatePaused = !g_isUpdatePaused;
    }
    return g_isUpdatePaused && !eatKey(KEY_STEP);    
}
function drawCanvas(){
	g_ctx.fillStyle = "#00FFFF";
	g_ctx.fillRect(0, 0, g_ctx.canvas.width, g_ctx.canvas.height);
}

// =================
// RENDER SIMULATION
// =================
function renderSimulation(ctx) {
    clearCanvas(ctx);
  	drawCanvas();
  
    g_ball1.render(ctx);
    g_ball2.render(ctx);
    
    g_paddle1.render(ctx);
    g_paddle2.render(ctx);
    score(ctx);
    DrawScoreBoard(ctx);
    draw(ctx);
    
}

// =========
// MAIN LOOP
// =========
function mainIter() {
    if (!requestedQuit()) {
        gatherInputs();
        updateSimulation();
        renderSimulation(g_ctx);
    }
    else {
        window.clearInterval(intervalID);
    }
}
// Simple voluntary quit mechanism
//
var KEY_QUIT = 'Q'.charCodeAt(0);
function requestedQuit() {
    return g_keys[KEY_QUIT];
}
// ..and this is how we set it all up, by requesting a recurring periodic
// "timer event" which we can use as a kind of "heartbeat" for our game.
//
var intervalID = window.setInterval(mainIter, 16.666);

window.focus();

function drawgradientSad(g_ctx){
  		var gradient = g_ctx.createRadialGradient(150,150,600,200,200,10);
      gradient.addColorStop(0.7, "red");
			gradient.addColorStop(1, "yellow");
      gradient.addColorStop(0, "white");
	    g_ctx.fillStyle = gradient;
 	    g_ctx.fill();
 	    g_ctx.fillStyle = "black";
 	    g_ctx.lineWidth =10;
 	    g_ctx.stroke();
      g_ctx.beginPath();
}
function drawsadmouth(g_ctx){
      g_ctx.fillstyle = "black";
 			g_ctx.arc(200,300,70,9.5,Math.PI*2);
			g_ctx.lineWidth =7;
			g_ctx.stroke();
  		g_ctx.beginPath();
}

function drawcheeksEysSad(g_ctx){
		  g_ctx.fillstyle = "black";
   	  fillEllipse(g_ctx, 145, 150, 7, 30,	0);
      fillEllipse(g_ctx, 255, 150, 7, 30,	0);
      g_ctx.beginPath();
}
function sadsmiley(g_ctx){
   	  g_ctx.fillStyle = "yellow";
      g_ctx.arc(200,200,150,0,2*Math.PI);
      drawgradientSad(g_ctx);
      drawcheeksEysSad(g_ctx);
      drawsadmouth(g_ctx);
      g_ctx.beginPath();
}
function draw(g_ctx) { 
 		  g_ctx.save();
      g_ctx.beginPath();
      checkWinner();
  	  g_ctx.restore();
}
function fillEllipse(g_ctx, cx, cy, halfWidth, halfHeight, angle) {
    g_ctx.save(); // save the current ctx state, to restore later
    g_ctx.beginPath();
    // These "matrix ops" are applied in last-to-first order
    // ..which can seem a bit weird, but actually makes sense
    //
    // After modifying the ctx state like this, it's important
    // to restore it
    g_ctx.translate(cx, cy);
    g_ctx.rotate(angle);
    g_ctx.scale(halfWidth, halfHeight);
    // Just draw a unit circle, and let the matrices do the rest!
    g_ctx.arc(0, 0, 1, 0, Math.PI*2);
    g_ctx.fill();
    g_ctx.beginPath(); // reset to an empty path
    g_ctx.restore();
}
function drawDefaultSmiley(g_ctx) {
    // Here's an example of how to use the fillEllipse helper-function
    g_ctx.fillStyle = "yellow";
    g_ctx.arc(200,200,150,0,2*Math.PI);
    drawgradient(g_ctx); 
    drawcheeksEys(g_ctx);
    drawMouth(g_ctx);
    g_ctx.beginPath();
}
function drawgradient(g_ctx){
    g_ctx.fill();
    g_ctx.fillStyle = "black";
    g_ctx.lineWidth =10;
    g_ctx.stroke();
    g_ctx.beginPath();
}
function drawcheeksEys(g_ctx){
	  g_ctx.fillstyle = "black";
    fillEllipse(g_ctx, 129, 277, 5, 15,	1);
    fillEllipse(g_ctx, 270, 275, 5, 15,	Math.PI+2);
   	fillEllipse(g_ctx, 145, 150, 7, 30,	0);
    fillEllipse(g_ctx, 255, 150, 7, 30,	0);
    g_ctx.beginPath();
}
function drawMouth(g_ctx){
		//Mouth
	  g_ctx.beginPath();
		g_ctx.ellipse(200, 250, 55, 80, 45 * Math.PI/90, 5.2,-5.2);
		g_ctx.lineWidth =7;
		g_ctx.stroke();
		 //Second mouth line for extra effects
		g_ctx.lineWidth =5;
	  g_ctx.beginPath();
		g_ctx.arc(200,170,130,0.99,-4.1);
		g_ctx.stroke();
}
