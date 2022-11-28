const GameMechanics = (function() {
    let counting = 4;
    
    const begin = function() {
        // Start the game
        /* Get the canvas and 2D context */
        const cv = $("canvas").get(0);
        const context = cv.getContext("2d");

        /* Create the sounds */
        const sounds = {
            background: new Audio("music/background.mp3"),
            gameover: new Audio("music/level_completed.mp3")
        };

        const totalGameTime = 240;   // Total game time in seconds
        const fireMaxAge = 2000;     // The maximum age of the fire in milliseconds
        let gameStartTime = 0;      // The timestamp when the game starts

        /* Create the game area */
                                        //top, left, bottom, right
        const gameArea = BoundingBox(context, 50, 100, 430, 750);

        // Playground.getLastLocation();
        Playground.initiateStatistics(Authentication.getUser().username);
        
        /* Create the sprites in the game */

        // Create skeletons
        const skeleton1 = Skeleton(context, 50, 410);
        const skeleton2 = Skeleton(context, 800, 410);
        
        // Create Obstacle (Obstacle size: 48 x 48)
        let temp = Playground.getObstacles();
        let obstacles = [];

        for (let i = 0; i < temp.length; i++){
            obstacles.push(Obstacle(context, temp[i]["anyName"]["x"], temp[i]["anyName"]["y"]));
        }

        // Create the player as according the user setting
        var player;
        var gem;            // opponent's gem to be shown
        let fireX;
        let fireY;
        let fireColor = "white";
        let anotherPlayerX;
        let anotherPlayerY;

        let {playerX, playerY, gemX, gemY} = StartGame.retrieveLocation();
        console.log(Authentication.getUser().username+ " location: " + playerX+", "+playerY);
        if (Authentication.getUser().avatar == "white"){
            player = Player(context, playerX, playerY, gameArea, 0);   // start from bottom left corner
            gem = Gem(context, gemX, gemY, "green");           // The eneger core of the opponent
            fireColor = "white";

        }
        else if (Authentication.getUser().avatar == "green"){
            player = Player(context, playerX, playerY, gameArea, 1);   // start from top right corner
            gem = Gem(context, gemX, gemY, "purple");         // The eneger core of the opponent
            fireColor = "green";
        }
        anotherPlayerX = gemX;
        anotherPlayerY = gemY;
        var fire = Fire(context, 1000, 1000, fireColor);    // to make the fire invisible
        var anotherPlayer = Player(context, anotherPlayerX, anotherPlayerY, gameArea, 2); // make the opponent be black ghost
        

        Playground.initiateLocation(Authentication.getUser().username, playerX, playerY);

        /* The main processing of the game */
        function doFrame(now) {
            $("#game-start").hide();
            $("#game-over").hide();

            // play background music
            sounds.background.play();

            if (gameStartTime == 0) gameStartTime = now;

            /* Update the time remaining */
            const gameTimeSoFar = now - gameStartTime;
            const timeRemaining = Math.ceil((totalGameTime * 1000 - gameTimeSoFar) / 1000);
            $("#time-remaining").text(timeRemaining);


            /* Collect the gem here */
            const targetBox = gem.getBoundingBox();
            const box = player.getBoundingBox();

            // the first player reaching the gem
            if (box.intersect(targetBox)){
                Playground.updateGemStatistics(Authentication.getUser().username);  // update gem stat to 1
            }

            /* Handle the game over situation here */
            if (Playground.gemIsCollected()){
                sounds.background.pause();
                sounds.gameover.play();
                $("#game-over").show();
                Socket.disconnect();
                return;
            }

            if (timeRemaining == 0) {
                sounds.background.pause();
                sounds.gameover.play();
                $("#game-over").show();
                return;
            }

            // update position of the opponent
            let {xOpponentLocation, yOpponentLocation} = Playground.getOpponentLastLocation();
            anotherPlayer.setXY(xOpponentLocation, yOpponentLocation);
            if (anotherPlayerX < xOpponentLocation) {   // moving right
                anotherPlayer.move(3);
                anotherPlayer.stop(3);
            } else if (anotherPlayerX > xOpponentLocation) {    // moving left
                anotherPlayer.move(1);
                anotherPlayer.stop(1);
            } else if (anotherPlayerY < yOpponentLocation) {    // moving downwards
                anotherPlayer.move(4);
                anotherPlayer.stop(4);
            } else if (anotherPlayerY > yOpponentLocation) {    // moving upwards
                anotherPlayer.move(2);
                anotherPlayer.stop(2);
            }
            anotherPlayerX = xOpponentLocation;
            anotherPlayerY = yOpponentLocation;
            

            /* Update the sprites */
            temp = Playground.getObstacles();
            obstacles = [];
            for (let i = 0; i < temp.length; i++){
                obstacles.push(Obstacle(context, temp[i]["anyName"]["x"], temp[i]["anyName"]["y"]));
            }
            obstacles.forEach(function(obstacle) {
                obstacle.update(now);
            });
            skeleton1.update(now);
            skeleton2.update(now);
            player.update(now);
            anotherPlayer.update(now);
            if (fire.getAge(now) > fireMaxAge){
                // fire = Fire(context, 1000, 1000, fireColor);
                fire.changeLocation(1000,1000);
            }
            fire.update(now);
            gem.update(now);
            
            /* Clear the screen */
            context.clearRect(0, 0, cv.width, cv.height);

            /* Draw the sprites */
            obstacles.forEach(function(obstacle) {
                obstacle.draw(now);
            });
            skeleton1.draw();
            skeleton2.draw();
            player.draw();
            anotherPlayer.draw();
            fire.draw();
            gem.draw();
            
            /* Process the next frame */
            requestAnimationFrame(doFrame);
        }

        $(document).on("keydown", function(event) {
            
            /* Handle the key down */
            switch (event.keyCode) {
                case 37: player.move(1); break;
                case 38: player.move(2); break;
                case 39: player.move(3); break;
                case 40: player.move(4); break;
                case 32: player.speedUp(); break;

                // key 'Q'
                case 81: player.putObstacle(); break;
                // key 'W'
                case 87:{ 
                    player.burnObstacle(); 
                    fireX = player.fireXLocation();
                    fireY = player.fireYLocation();
                    // fire.changeLocation(fireX, fireY);
                    fire = Fire(context, fireX, fireY, fireColor);
                    break;
                }
            }
        });

        /* Handle the keyup of arrow keys and spacebar */
        $(document).on("keyup", function(event) {

            /* Handle the key up */
            switch (event.keyCode) {
                case 37: player.stop(1); break;
                case 38: player.stop(2); break;
                case 39: player.stop(3); break;
                case 40: player.stop(4); break;
                case 32: player.slowDown(); break;
            }
        });


        /* Start the game */
        requestAnimationFrame(doFrame);

    };

    // Countdown to start the game if pairing-up is down
    const countdown = function() {
        // Decrease the remaining time
        counting = counting - 1;
        console.log(counting);
        // Continue the countdown if there is still time;
        // otherwise, start the game when the time is up
        if (counting > 0){
            document.getElementById("game-title").innerHTML = counting;
            setTimeout(countdown, 1000);
        } else {
            document.getElementById("game-title").innerHTML = "Start!";
            counting = 4;   // initialize for the next game
            setTimeout(begin, 1000);
        }
    };

    return {countdown, begin};
})();