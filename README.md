# CSCI-BuffGames ![Project Logo]()
## Description: 
The Buff Games is a web-based game hub inspired by platforms like NY Times Games, designed specifically for the University of Colorado Boulder community. Our application features a collection of fun, interactive mini-games themed around CU Boulder culture, student life, and landmarks. Players can choose from multiple Boulder-inspired games, compete for high scores, and climb the global leaderboard, which tracks top performers across all games. 


## Contributors: 
- [Wilson Narog](https://github.com/WHNarog)
- [Dylan Sandusky](https://github.com/Twinularity)
- [Caden Davis](https://github.com/Anonas3675)
- [Ryan Natvig](https://github.com/ryanrocksforever)
- [Evan Feng](https://github.com/Evancholy1)
- [Logan Oran](https://github.com/OramLogan)

## Project Stack:
+ Frontend
  + HTML (rendering webpage)
  + Handlebars (dynamically rendering webpage)
  + Javascript (making webpages interactive)
  + CSS (rendering webpage)
  + Bootstrap (rendering webpage)
+ Backend
  + Node.js (Runtime environment for running backend JS)
  + Express (writing APIs)
+ DataBase
  + SQL
+ Hosting Website
  + Render

## Prerequisites: 
- Docker Desktop
- WSL (if running windows operating system) (The wsl distribution we used was Ubuntu)

## Instructions to run Application:
1) Navigate to the ProjectSourceCode directory
2) Run the command "docker compose up" in the terminal (Make sure you have you have created a .env file with the proper elements, or this won't work)
3) Once you see "DataBase connection successful" printed to the terminal, navigate to your web browser and go to [localhost:3000](http://localhost:3000)
4) Register a new account, login and use the website
5) To terminate the application press "ctrl + c". Then run "docker compose down" in your terminal. If you want to delete saved data as well, run "docker compose down -v"

## Instructions to run tests:
 - The tests should auto run when the command "docker compose up" is run in the terminal.
 - The output of the tests will print in your terminal. The first test is "Testing Register API Positive". The last test is "Testing Login API Positive"

## [Deployed Application](https://software-dev-buff-games.onrender.com/)
## [Video Demo](https://o365coloradoedu-my.sharepoint.com/:v:/g/personal/dysa4879_colorado_edu/EQCTsmN0MMpOnrYyuuG_t8YBpI1IIMmWw56JJFS8VDQIOA)
