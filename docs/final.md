# Team Name: Iron Horseman
### Application Name: RPG Blackjack
# Spring 2022

# Overview:
A unique take on the Blackjack playing cards game.  Users may select an interactive ability to bring into each round of gameplay, including:
"sneaking" from the deck, taking 2 of the 3 most optimal cards.  "Reverse", where the outcome of a game being won is flipped.  "Multiplier", where the bet is multiplied upon winning.

# Team Overview

## Names/Usernames
- dlandman27 - Dylan Landman
- JaredStarman - Jared Starman
- brandonhalig - Brandon Halig
- jasonmilhaven - Jason Milhaven

## Division of Labor, and Team Member Responibilities
-Dylan Landman - HTML/CSS frontend
-Jared Starman - Backend and database
-Brandon Halig - helped us on the last day idk what to write here
-Jason Milhaven - Player interface, controls, gameplay

## UI ScreenShots
screenshots are in the docs/screenshots folder
![Preview](https://github.com/dlandman27/cs326-final-ironhorseman-group13/blob/main/docs/screenshots/dashboard.jpg)
![Preview](https://github.com/dlandman27/cs326-final-ironhorseman-group13/blob/main/docs/screenshots/account.jpg)
![Preview](https://github.com/dlandman27/cs326-final-ironhorseman-group13/blob/main/docs/screenshots/how_to_play.jpg)
![Preview](https://github.com/dlandman27/cs326-final-ironhorseman-group13/blob/main/docs/screenshots/game.jpg)
![Preview](https://github.com/dlandman27/cs326-final-ironhorseman-group13/blob/main/docs/screenshots/sign_in_page.jpg)

## API and routes:
- getUser: a get request returning the username, password, ability, cash, and num hands of a player given a username
- addUser: creates a new user account in the database
- signin: a get request which is a shorthand for returning info of a user after signing in
- update: updates a username and/or password of a player given their username
- updateNumHands: put request which updates the number of hands of Blackjack that a player has won
- updateCash: put request updating the money of a given user

# interal API/functions
- saveUsername(): Creates a User
- getUser(): Read Function, gets the username/password of the given username
- UpdatePerson(): Updates the password of the given username
- topTenPlayerScores(): Read Function, Gets the top 10 users in the database
- UpdateNumHands(): Updates the number of hands in the game
- updateCash(): Used to add/remove cash/score to the given user

## Entities:
The sole "data entity" in our project is the player.  We have a single table for the list of players.

## Authentication
Users register via the signup page.  You cannot access the other pages without having logged into an account.

## Conclusion
In making a "CRUD" app, we learned about the different components involved and systems of a web app.  Some of the difficulties we encountered include: time management, dividing up responsibilities, communication, and coordinating different components of the app.  We were given many of the tools to create the web app, and largely were not lacking in preperation.  What we would do differently next time is: plan ahead and agree on specifics of components of the web app, such as the API, database and tables, and web pages.
