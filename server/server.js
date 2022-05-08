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


// async function reloadUsers() {
//   try {
//     const data = await readFile(usersFile, { encoding: 'utf8' });
//     knownUsers = JSON.parse(data);
//   } catch (err) {
//     knownUsers = [];
//   }
// }

// //saves
// // async function saveUsers() {
// //   try {
// //     const data = JSON.stringify(knownUsers);
// //     await writeFile(usersFile, data, { encoding: 'utf8' });
// //   } catch (err) {
// //     console.log(err);
// //   }
// // }


// //functions
// async function addUserFunc(response,name,cash,faction,password){
//   if(name === undefined || cash === undefined || faction === undefined || password === undefined){
//     response.writeHead(400, { 'Content-Type': 'text/plain' });
//     response.write(JSON.stringify({ message: 'invalid input' }));
//     response.end();
//   }
//   else{
//     await reloadUsers();
//     knownUsers.push({name: name , faction: faction , cash: cash, password:password });
//     await saveUsers();
//     response.writeHead(200, { 'Content-Type': 'text/plain' });
//     response.end();
//   }
// }

// function nameExists(name) {
//   for(let i = 0; i < knownUsers.length; i++){
//     if(knownUsers[i].name === name){
//       return true;
//     }
//   }
//   return false;
// }

// function getUser(name){
//   for(let i = 0; i < knownUsers.length; i++){
//     if(knownUsers[i].name === name){
//       return knownUsers[i];
//     }
//   }
// }

// async function readUsers(response, name) {
//   await reloadUsers();
//   if (nameExists(name)) {
//     response.writeHead(200, { 'Content-Type': 'application/json' });
//     response.write(JSON.stringify(getUser(name)));
//     response.end();
//   } else {
//     // 404 - Not Found
//     response.json({ error: `Counter '${name}' Not Found` });
//   }
// }

// async function updateUserFunc(response,name,cash,faction,password){
//    if (nameExists(name)) {
//     await reloadUsers();
//     let count = -1;
//     for(let i = 0; i < knownUsers.length; i++){
//       if(knownUsers[i].name === name){
//         count = i;
//         break;
//       }
//     }
//     knownUsers[count].name = name;
//     knownUsers[count].cash = cash;
//     knownUsers[count].faction = faction;
//     knownUsers[count].password = password;
//     await saveUsers();
//     response.write(JSON.stringify(getUser(name)));
//     response.end();
//   }
//   else{
//       response.json({ error: 'Not Implemented' });
//       response.end();
//   }
// }

// async function destroyUserFunc(response,name){
//   await reloadUsers();
//   if(name === undefined){
//     response.write(JSON.stringify({ message: nameExists(name)}));
//     response.end();
//   }
//   else if(getUser(name)){
//     let count = -1;
//     for(let i = 0; i < knownUsers.length; i++){
//       if(knownUsers[i].name === name){
//         count = i;
//         break;
//       }
//     }
//     knownUsers.splice(count,1);
//     response.write(JSON.stringify({ message: 'destroyed' }));
//     await saveUsers();
//     response.end();
//   }
//   else{
//     response.json({ message: "not found" }); 
//   }
// }

// this is used on the account info page
    // app.get("/getUser", async (request, response) => {
    //   // the ID of the person who requested their account info
    //   //const authToken = request.body.username;
    //   console.log("getUser request by auth token: " + JSON.stringify(request.query));
    //   const authToken = request.query.authToken;

    //   // perform some sort of lookup using the ID we got

    //   const accData = {
    //     username: "fake username",
    //     cash: 420,
    //     faction: "fake faction/ability name"
    //   }

    //   response.status(200).send(accData);
    // });

    // // perform some sort of validation for the password
    //   // ie, no fewer than k amount of characters
    // function isPasswordValid(pwd) {
    //   let isValid = true;
    //   if (pwd.length < 5) {
    //     isValid = false;
    //   }
    //   return isValid;
    // }

    // app.post("/setPassword", async (request, response) => {
    //   const authToken = request.query.authToken;
    //   const pwd = request.query.password;

    //   console.log("setPassword request by auth token: " + authToken + ", password requested is " + pwd);

    //   if (isPasswordValid(pwd)) {
    //     response.status(200).send({ "message": "your password has been changed" });
    //   } else {
    //     response.status(200).send({ "error": "invalid password" });
    //   }
    // });

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
          const username = req.query;
          const person = self.db.getUser(username);
          res.send(JSON.stringify(person));
          res.end();
        } catch (err) {
          res.status(502).send(err);
        }
      });

// app.get('/getUser', async (request, response) => {
//   const queryVar = request.query;
//   readUsers(response,queryVar.name);
// });

// app.patch('/updateUser',  async (request, response) => {
//   const queryVar = request.query;
//   updateUserFunc(response,queryVar.name,queryVar.cash,queryVar.faction,queryVar.password);
// });

// app.delete('/deleteUser',  async (request, response) => {
//   const queryVar = request.query;
//   destroyUserFunc(response,queryVar.name);
// });


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

