# Milestone 3

## The player-db database
Our team implemented a PostgreSQL database. The main purpose of this database is to store the usernames, passwords, and overall game scores calculated
during games. The database interacts with 2 tables to conduct its CRUD operations. The first table: users, stores the username and password of each user. The second table:
playerScores, stores the scores/money accumulated while playing the game. The game utilizes the necessary CRUD operations to interact with the tables of the database

- saveUsername(): Creates a User

- getUser(): Read Function, gets the username/password of the given username

- UpdatePerson(): Updates the password of the given username

- topTenPlayerScores(): Read Function, Gets the top 10 users in the database

- UpdateNumHands(): Updates the number of hands in the game

- updateCash(): Used to add/remove cash/score to the given user

# Division of Labor
### Dylan: UI for non-table related pages, Login/Signup CRUD operations, CSS for pages, Database Implementation
### Jared: CRUD operations using Node
### Brandon: UX Implementation
### Jason: Game Implementation, created functionality between Server and Client for Scores.
