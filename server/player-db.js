import 'dotenv/config';
import pg from 'pg';

// Get the Pool class from the pg module.
const { Pool } = pg;

export class playerDatabase {
  constructor(dburl) {
    this.dburl = dburl;
  }

  //TODO NEED TO CHANGE POOL CONNECTION
  async connect() {
    const credentials = {
        user: "jvtrituwegxton",
        host: "ec2-52-3-2-245.compute-1.amazonaws.com",
        database: "db1udmi82ilfn5",
        password: "cde45dda0e33cd474b1c21d23398f04cb0c54c3715330eff9b88a1afe21166da",
        port: 5432,
        ssl: { rejectUnauthorized: false }
    };
    // Create a new Pool. The Pool manages a set of connections to the database.
    // It will keep track of unused connections, and reuse them when new queries
    // are needed. The constructor requires a database URL to make the
    // connection. You can find the URL of your database by looking in Heroku
    // or you can run the following command in your terminal:
    //
    //  heroku pg:credentials:url -a APP_NAME
    //
    // Replace APP_NAME with the name of your app in Heroku.
    this.pool = new Pool(credentials);

    // Create the pool.
    this.client = await this.pool.connect();

    // Init the database.
    await this.init();
  }

  async init() {
    const queryText = `
    create table if not exists users (
        username varchar(30) primary key,
        password varchar(30),
        numHands varchar(30),
        cash varchar(30)
      );
    
    create table if not exists playerScores (
        username varchar(30),
        score varchar(30)
    );
    `;
    const res = await this.client.query(queryText);
  }

  // Close the pool.
  async close() {
    this.client.release();
    await this.pool.end();
  }
  
  // Used in the leaderboard  
  async top10PlayerScores() {
    const queryText = 'select * from playerScores order by score desc limit 10';
    const res = await this.client.query(queryText);
    return res.rows;
  }

  async getUser(username) {
    let queryText =
    `
        SELECT * FROM users WHERE username = $1;
    `;
    const res = await this.client.query(queryText, [username]);

    return res.rows;
  }
  // CREATE a user in the database.
  async saveUsername(username, password) {

    const user = await this.getUser(username);
    
    let numHands = "0";
    let cash = "1000";
    if(user.length > 0){
        return "Username already exists";
    }
    else{
        let queryText =
        `
            INSERT INTO users (username, password, numHands, cash) VALUES ($1, $2, $3, $4);
        `;
        const res = await this.client.query(queryText, [username, password,numHands,cash]);
        return "Success";    
    }
  }
  async signin(username, password) {
    let queryText =
    `
        SELECT * FROM users WHERE username = $1 AND password = $2;
    `;
    const user = await this.client.query(queryText, [username, password]);

    if(user.rows.length === 0){
        return "Incorrect Username or Password";
    }

    return "Success";
  }

  async updatePerson(username, password) {
    const user = await this.getUser(username);

    let queryText =
      'UPDATE users SET password= $2 WHERE username = $1 RETURNING *';
    const res = await this.client.query(queryText, [username, password]);
    return res.rows;
  }
  
  async updateNumHands(username, numHands) {
    const user = await this.getUser(username);

    let queryText =
      'UPDATE users SET numHands= $2 WHERE username = $1 RETURNING *';
    const res = await this.client.query(queryText, [username, numHands]);
    return res.rows;
  }

  async updateCash(username, cash) {
    const user = await this.getUser(username);

    let queryText =
      'UPDATE users SET cash= $2 WHERE username = $1 RETURNING *';
    const res = await this.client.query(queryText, [username, cash]);
    return res.rows;
  }
}
