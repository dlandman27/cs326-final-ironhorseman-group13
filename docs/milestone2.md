# Team Name: Iron Horseman
### Application Name: Sorting Visualizer


# Team Overview

## Names/Usernames
- dlandman27 - Dylan Landman
- JaredStarman - Jared Starman
- brandonhalig - Brandon Halig
- jasonmilhaven - Jason Milhaven

## Team Member Responsibilities
- Dylan Landman - HTML/CSS frontend
- Jared Starman - Poker bot and game board in html
- Brandon Halig - Main game backend
- Jason Milhaven - Player interface, controls

## Description of API endpoints
- POST: /addUser - registers a new user with a given username, this is called at the signup page
- GET: /getUser - called with a userID, gets all the info of a given user account: username, cash, and faction (aka their "special ability" that they may use during the Blackjack game)
- PATCH: /updateUser - called with a userID, update any of the said info above
- DELETE: /deleteUser - called with a userID, called when a user wants to delete their account from the account page
- GET: /getUserInfo - an alias for /getUser, but returns the data in a slightly different format for the account page
- POST: /setPassword - called with a userId, updates the user's password

## Team Member Milestone 2 Contribution(s)
- Dylan Landman - worked on HTML/CSS/JS for Dashboard, Signup, and Home pages.  Created animations which are not yet fully implemented
- Brandon Halig - developed part of the game AI
- Jared Starman - planned and constructed the CRUD api, wrote most of the server code
- Jason Milhaven - wrote the client CRUD requests on the account page, worked on alterating user accounts, wrote portions of server code

## ScreenShots
Screenshots are in the docs/screenshots folder, or you can view them here:

signup page, which creates a user account
![Preview](https://github.com/dlandman27/cs326-final-ironhorseman-group13/blob/board/docs/screenshots/signup_sheet.png)

sign in page, which will send a request to login and retrieve the user info if accepted
![Preview](https://github.com/dlandman27/cs326-final-ironhorseman-group13/blob/board/docs/screenshots/index.png)

account page, which will allow a user to view their info via the /getUserInfo request
they can also change their password here
![Preview](https://github.com/dlandman27/cs326-final-ironhorseman-group13/blob/board/docs/screenshots/account_page.jpg)

account page after attempting to delete user account
![Preview](https://github.com/dlandman27/cs326-final-ironhorseman-group13/blob/board/docs/screenshots/account_alert.jpg)