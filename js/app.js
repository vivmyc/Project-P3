
//
// Main application logic for player and enemy objects
// Version 1.0
//

// global vars
"use strict";
var newX = 203;
var newY = 416;
var theScore = 0;
var NUM_ENEMIES = 3;

//
// Constructor for enemy class
//
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';

    // enemy enters from the left and in a random row
    this.x = 0;
    this.y = pickARow();

    // set a random speed in pixels per second
    this.enemySpeed = Math.floor((Math.random() * 400) + 100);
};

function pickARow() {
    var yAxis = 230;
    var row = Math.floor((Math.random() * 3) + 1);

//water y a-xis 1
//payment rows y-axis: 84, 167, 250,
//grass rows y_axis: 333, 416
    switch(row) {
        case 1:  yAxis = 84;  break;  //row 1
        case 2:  yAxis = 167; break;  //row 2
        case 3:  yAxis = 250; break;  //row 3
    }
    return(yAxis);
}

//
// Update the enemy's position
// Parameter: dt, a time delta between ticks
//
Enemy.prototype.update = function(dt) {
    // wrap back around when off right hand side of canvas
    // and reset random speed and row
    if (this.x > 505 ) {
        this.x = -300;
        this.y = pickARow();
        this.enemySpeed = Math.floor((Math.random() * 400) + 100);

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
        if (this.x+100 > player.x && this.x < player.x+100) {
            //console.log('enemy x=' + this.x + ' player x=' + player.x);
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
    this.x = 203;
    this.y = 425;
};

Player.prototype.update = function() {
    // change player position based on handleInput()
    this.x = newX;
    this.y = newY;
    //this.checkCollision();
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
    newX = 203;
    newY = 416;
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
            // rows y-axis: 1, 84, 167, 250, 333, 416
            if (this.y < 84) {
                theScore++;
                document.getElementById('score').innerHTML = theScore;
                document.getElementById('yea').play();
                this.reset();
            } else {  // move player up 1 row
                newX = this.x;
                newY = this.y - 83;
                player.update();
            }
            break;

        case 'down':
            // Make sure we don't go past the bottom
            if (this.y >= 416) {
                newY = 416;
            } else {  // move player down 1 row
                newX=this.x;
                newY = this.y + 83;
                this.update();
            }
            break;

// Columns
// 1: 001-101
// 2: 102-202
// 3: 203-303
// 4: 304-404
// 5: 405-505

        case 'right':
            newY = this.y;
            // Make sure we don't go past the right border
            if (this.x >= 405) {
                newX = 405;
            } else {
                newX = this.x + 101;
            }
            player.update();
            break;

        case 'left':
            newY=this.y;

            // Make sure we don't go past the left border
            if (this.x <= 1) {
                newX = 1;
            } else {
                newX = this.x - 101;
            }
            player.update();
            break;
        default:
    }
};


//
// Instantiate enemy and player objects.
// Enemy objects are placed in the allEnemies array
//
var audio = new Audio('sounds/start.mp3');
var player = new Player();
var allEnemies = [];

audio.play();
for (var cnt=0; cnt<NUM_ENEMIES; cnt++) {
    allEnemies.push(new Enemy());
}


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
