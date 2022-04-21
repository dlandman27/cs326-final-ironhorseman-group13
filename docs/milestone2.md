# Team Name: Iron Horseman
### Application Name: Sorting Visualizer


# Team Overview

## Names/Usernames
- dlandman27 - Dylan Landman
- JaredStarman - Jared Starman
- brandonhalig - Brandon Halig
- jasonmilhaven - Jason Milhaven

## Team Member Responibilities
-Dylan Landman - HTML/CSS frontend
-Jared Starman - Poker bot and game board in html
-Brandon Halig - Main game backend
-Jason Milhaven - Player interface, controls

## 1) A brief and precise representation of APIs for you application
POST: /addUser - register a new user
GET: /getUser - called with a userID, gets all the info of a given user account: username, cash, faction/ability
PATCH: /updateUser - called with a userID, update any of the said info above
DELETE: /deleteUser - called with a userID, called when a user wants to delete their account
GET: /getUserInfo - an alias for /getUser, but returns the data in a slightly different format for the account page
POST: /setPassword - called with a userId, updates the user's password

## Team Member Milestone 2 Contribution(s)
-Dylan Landman - created the wireframes, and well as the entirety of the HTML/CSS/JS for Dashboard, Signup, and Home pages.  Created animations (not implemented).
-Brandon Halig -  developed part of the game AI
-Jared Starman - constructed CRUD api, wrote most of the server code
-Jason Milhaven - managed account page, worked on alterating user accounts via CRUD operations, wrote portions of server code

## ScreenShots
screenshots are in the docs/screenshots folder

signup page, which creates a user account
![Preview](https://github.com/dlandman27/cs326-final-ironhorseman-group13/blob/main/docs/screenshots/signup_sheet.png)

sign in page, which will send a request to login and retrieve the user info if accepted
![Preview](https://github.com/dlandman27/cs326-final-ironhorseman-group13/blob/main/docs/screenshots/index.png)

account page, which will allow a user to view their info via the /getUserInfo request
they can also change their password here
![Preview](https://github.com/dlandman27/cs326-final-ironhorseman-group13/blob/main/docs/screenshots/account_page.jpg)