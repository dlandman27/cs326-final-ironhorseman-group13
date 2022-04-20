import * as http from 'http';
import * as url from 'url';
import { readFile, writeFile } from 'fs/promises';
import { appendFile } from 'fs';
//import { express} from './express.js';
import express from 'express';

let knownUsers = [];


let usersFile = 'UsersFile.json';
//reloads

const app = express();
app.use(express.static('client'));

async function reloadUsers() {
  try {
    const data = await readFile(usersFile, { encoding: 'utf8' });
    knownUsers = JSON.parse(data);
  } catch (err) {
    knownUsers = [];
  }
}

//saves
async function saveUsers() {
  try {
    const data = JSON.stringify(knownUsers);
    await writeFile(usersFile, data, { encoding: 'utf8' });
  } catch (err) {
    console.log(err);
  }
}

//functions
async function addUserFunc(response,name,cash,faction,password){
  if(name === undefined || word === undefined || score ===undefined){
    response.writeHead(400, { 'Content-Type': 'text/plain' });
    response.write(JSON.stringify({ message: 'invalid input' }));
    response.end();
  }
  else{
    await reloadUsers();
    knownUsers.push({name: name , faction: faction , cash: cash, password:password });
    await saveUsers();
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end();
  }
}

async function findUserFunc(response,name){
  if(name === undefined){
    response.writeHead(400, { 'Content-Type': 'text/plain' });
    response.write(JSON.stringify({ message: 'invalid input' }));
    response.end();
  }
  else{
    await reloadUsers();
    if(knownUsers.some(user => user.name === name)){
      response.writeHead(200, { 'Content-Type': 'text/plain' });
      response.write(JSON.stringify({message: "user exists"}));
    }
    await saveUsers();
   
    response.end();
  }
}

async function updateUserFunc(response,name,cash,table,password){
  if(name === undefined){
    response.writeHead(400, { 'Content-Type': 'text/plain' });
    response.write(JSON.stringify({ message: 'invalid input' }));
    response.end();
  }
  else{
    await reloadUsers();
    knownUsers.push({name: name , cash:cash, table:table, password:password });
    await saveUsers();
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end();
  }
}

async function destroyUserFunc(response,name){
  await reloadUsers();
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.write(JSON.stringify({message: "destroyed user"}));
  await saveUsers();
  response.end();
}


async function basicServer(request, response) {
  // TODO: Implement the server
  let theUrl = url.parse(request.url,true);
  let queryVar = theUrl.query;
  let pathVar = theUrl.pathname;
  let methodVar = request.method;
  

  if(methodVar == 'POST' && pathVar.startsWith('/addUser')){
    addUserFunc(response,queryVar.name,queryVar.word,queryVar.score);
  }
  else if (methodVar == 'GET' && pathVar.startsWith('/getUser')){
    findUserFunc(response);
  }
  else if (methodVar == 'PATCH' && pathVar.startsWith('/updateUser')){
    updateUserFunc(response,queryVar.name,queryVar.score);
  }
  else if (methodVar == 'DELETE' && pathVar.startsWith('/deleteUser')){
    gameScoreFunc(response,queryVar.name,queryVar.score);
  }
  else{
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.write(JSON.stringify({ message: 'Failure' }));
    response.end();
  }
}



// this is used on the account info page
app.get("/getUser", async (request, response) => {
  // the ID of the person who requested their account info
  //const authToken = request.body.username;
  console.log("getUser request by auth token: " + JSON.stringify(request.query));
  const authToken = request.query.authToken;

  // perform some sort of lookup using the ID we got

  const accData = {
    username: "fake username",
    cash: 420,
    faction: "fake faction/ability name"
  }

  response.status(200).send(accData);
});

// perform some sort of validation for the password
  // ie, no fewer than k amount of characters
function isPasswordValid(pwd) {
  let isValid = true;
  if (pwd.length < 5) {
    isValid = false;
  }
  return isValid;
}

app.post("/setPassword", async (request, response) => {
  const authToken = request.query.authToken;
  const pwd = request.query.password;

  console.log("setPassword request by auth token: " + authToken + ", password requested is " + pwd);

  if (isPasswordValid(pwd)) {
    response.status(200).send({ "message": "your password has been changed" });
  } else {
    response.status(200).send({ "error": "invalid password" });
  }
});

const port = 3000;
// Start the server.

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
