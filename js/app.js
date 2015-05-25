
//
// Main application logic for player and enemy objects
// Version 1.0
//

// global vars
"use strict";
var theScore=0;
var newX=200;
var newY=425;  // initial x and y cooodinates to place player at bottom center

//
// Constructor for enemy class
//
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';

    // enemy enters from the left and in a random row
    this.x = 0;
    var row = Math.floor((Math.random() * 3) + 1);
    switch(row) {
        case 1:  this.y = 60;  break;  //row 1
        case 2:  this.y = 145; break;  //row 2
        case 3:  this.y = 230; break;  //row 3
    }

    // set a random speed in pixels per second
    this.enemySpeed = Math.floor((Math.random() * 400) + 100);
};

//
// Update the enemy's position
// Parameter: dt, a time delta between ticks
//
Enemy.prototype.update = function(dt) {
    // wrap back around when off right hand side of canvas
    // and reset random speed and row
    if (this.x > 505 ) {
        this.x = -300;
        this.enemySpeed = Math.floor((Math.random() * 400) + 100);
        var row = Math.floor((Math.random() * 3) + 1);
        switch(row) {
            case 1:  this.y = 60;  break;  //row 1
            case 2:  this.y = 145; break;  //row 2
            case 3:  this.y = 230; break;  //row 3
            default: this.y = 60;  break;  //row 1
        }
    } else {
        // Movement multiplied by the dt parameter
        // to ensure the game runs at the same speed on all computers.
        this.x += this.enemySpeed * dt;
    }
    this.checkCollision();
};

//
// Function to check if we hit the player:
//
Enemy.prototype.checkCollision = function() {
    // if this enemy is on the same row as the player and its edges overlap
    // the players sprite, then decrement the score and reset the player
    // to starting position
    if (this.y === player.y) {
        if (this.x+50.5 > player.y-50.5 && this.x-50.5 < player.y+10.5) {
            theScore--;
            document.getElementById('score').innerHTML = theScore;
            document.getElementById('ouch').play();
            player.reset();
        }
    }
};

//
// Draw this enemy on the screen
//
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

//
// Constructor for player class
//
var Player = function() {
    this.sprite = 'images/char-pink-girl.png';
    this.x = 200;
    this.y = 425;
};

Player.prototype.update = function() {
    // change player position based on handleInput()
    this.x = newX;
    this.y = newY;
};

//
// Draw the player on the screen
//
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//
// Resets the player to the starting position
//
Player.prototype.reset = function() {
    // reset player to the starting position
    newX = 200;
    newY = 425;
};

//
// Handle user input
// Only down, up, right and left arrows keys are recognized
//
Player.prototype.handleInput = function(key) {
    switch (key) {
        case 'up':
            // Increment the score and reset the player position to start
            // whenever player reaches the water row
            if (this.y == 0) {
                theScore++;
                document.getElementById('score').innerHTML = theScore;
                document.getElementById('yea').play();
                this.reset();
            } else {  // move player up 1 row
                newX=this.x;

                switch(this.y) {
                    case 425:
                        newY = 325;
                        break;
                    case 325:
                        newY = 230;
                        break;
                    case 230:
                        newY = 145;
                        break;
                    case 145:
                        newY = 60;
                        break;
                    case 60:
                        newY = 0;
                        break;
                }
                player.update();
            }
            break;

        case 'down':
            // Make sure we don't go past the bottom
            if (this.y >= 425) {
                newY = 425;
            } else {  // move player down 1 row
                newX=this.x;
                switch(this.y) {
                    case 325:
                        newY = 425;
                        break;
                    case 230:
                        newY = 325;
                        break;
                    case 145:
                        newY = 230;
                        break;
                    case 60:
                        newY = 145;
                        break;
                    case 0:
                        newY = 60;
                        break;
                }
                this.update();
            }
            break;


        case 'right':
            newY = this.y;
            newX = this.x + 101;
            // Make sure we don't go past the right border
            if (this.x > 400) {
                newX = 400;
            }
            player.update();
            break;

        case 'left':
            newY=this.y;
            newX = this.x - 101;
            // Make sure we don't go past the left border
            if (this.x < 0) {
                newX = 0;
            }
            player.update();
            break;
        default:
    }
};


//
// Instantiate enemy and player objects.
// Enemy objects in placed in the allEnemies array
//
var audio = new Audio('sounds/start.mp3');
audio.play();

var player = new Player();
var enemy1 = new Enemy();
var enemy2 = new Enemy();
var enemy3 = new Enemy();
var allEnemies = [enemy1, enemy2, enemy3];


//
// listens for key presses and sends the key pressed to the
// Player.handleInput() method
//
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
