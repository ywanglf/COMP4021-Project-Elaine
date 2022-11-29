# :video_game: COMP4021 Game Project By Elaine    :video_game:
Name: WANG, Yiran

Student ID: 20689735

## :space_invader:	 To run the game
I can run the project without `package.json`. I guess it is because I installed them somewhere else. I still put the `package.json` file but I am not so sure whether it would work or not. So sorry about this. 
```
npm install express bcrypt express-session
```

```
node game_server.js
```


Requirements and Grading Scheme: https://course.cse.ust.hk/comp4021/2022f_project/comp4021_project_marking_2022f.pdf

## :space_invader:	 Game Description
Ghost Chain 

An online multiplayer game. Every ghost has its own energy core and it also wants to seize the other's energy core to become stronger. Each ghost can create obstacles to prevent the opponent from obtaining their own energy core, or destroy the obstacles set by the opponent to plunder the opponent's core. The one that gets the core in the battle wins. 

## :space_invader:	 Game Mechanics
Two players start at the same time and they need to protect their own energy core to be stolen by the opponent.

The player can either:
1. Move the ghost by pressing `up, left, down, right` 
2. Set the obstacle to hinder the opponent by `key Q`
3. Clear the path to steal the opponent's crystal by burning the obstacle by `key W`
4. Cheatmode: speedup the ghost by pressing `space bar`

The player would only win if he/she steals the energy core, otherwise it is a draw.

## :space_invader:	 Checklist
### Game front page
* [x] Game description and instructions
* [x] Player registration 
* [x] Player sign-in
* [x] Player pair up
### Game play page
* [x] Things in the game
* [x] Players’ interaction
* [x] Game controls
* [x] Game duration
* [x] Cheat mode
### Game over page
* [x] Player statistics
* [x] Player ranking
* [x] Restart the game/ back to front page
### Others
* [x] Graphic and sounds
* [ ] Project video
