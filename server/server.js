import express from 'express';
import { readFile, writeFile } from 'fs/promises';
import logger from 'morgan';
import {playerDatabase} from "./player-db.js";
let knownUsers = [];


// let usersFile = 'UsersFile.json';

// Create the Express app and set the port number.
const app = express();

// Initialize the database.



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/client', express.static('client'));


class PeopleServer {
  constructor(dburl) {
    this.dburl = dburl; 
    this.app = express();
    this.app.use('/', express.static('client'));
  }

  async initRoutes(){ 

    const self = this;

    this.app.post('/addUser', async (request, response) => {
      const {username, password} = request.query;
      const person = await self.db.saveUsername(username, password);
      response.send(JSON.stringify(person));
      response.end();
    });

    this.app.get('/signin', async (request, response) => {
      const {username, password} = request.query;
      const person = await self.db.signin(username, password);
      response.send(JSON.stringify(person));
      response.end();
    });

    this.app.put('/update', async (req, res) => {
      try {
        const { username, password } = req.query;
        const person = await self.db.updatePerson(username, password);
        res.send(JSON.stringify(person));
      } catch (err) {
        res.status(502).send(err);
      }
    });

    this.app.put('/updateNumHands', async (req, res) => {
      try {
        const { username, numHands } = req.query;
        const person = await self.db.updateNumHands(username,numHands);
        res.send(JSON.stringify(person));
      } catch (err) {
        res.status(502).send(err);
      }
    });
    this.app.put('/updateCash', async (req, res) => {
      try {
        const { username, cash } = req.query;
        const person = await self.db.updateCash(username, cash);
        res.send(JSON.stringify(person));
      } catch (err) {
        res.status(502).send(err);
      }
    });
      this.app.get('/getUser', async (req, res) => {
        try {
          const person = await self.db.getUser(req.query.username);
          res.send(JSON.stringify(person));
          res.end();
        } catch (err) {
          res.status(502).send(err);
        }
      });

    //TODO ADD PATCH AND DELETE

    // This matches all routes that are not defined.
    this.app.all('*', async (request, response) => {
      response.status(404).send(`Not found: ${request.path}`);
    });
  }

  async initdb(){
    this.db = new playerDatabase(this.dburl);
    await this.db.connect();
  }

  async start(){
// Start the server.
    await this.initRoutes();
    await this.initdb();
    let port = process.env.PORT || 8080;
    this.app.listen(port, () => {
      console.log(`Server started on http://localhost:${port}`);
    });
  }
}

const server = new PeopleServer(process.env.DATABASE_URL);
server.start();

