import * as http from 'http';
import * as url from 'url';
import express from 'express';
import { readFile, writeFile } from 'fs/promises';
import logger from 'morgan';

let knownUsers = [];


let usersFile = 'UsersFile.json';
//reloads
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/client', express.static('client'));

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
  if(name === undefined || cash === undefined || faction === undefined || password === undefined){
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

function nameExists(name) {
  for(let i = 0; i < knownUsers.length; i++){
    if(knownUsers[i].name === name){
      return true;
    }
  }
  return false;
}

function getUser(name){
  for(let i = 0; i < knownUsers.length; i++){
    if(knownUsers[i].name === name){
      return knownUsers[i];
    }
  }
}

async function readUsers(response, name) {
  await reloadUsers();
  if (nameExists(name)) {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(getUser(name)));
    response.end();
  } else {
    // 404 - Not Found
    response.json({ error: `Counter '${name}' Not Found` });
  }
}

async function updateUserFunc(response,name,cash,faction,password){
   if (nameExists(name)) {
    await reloadUsers();
    let count = -1;
    for(let i = 0; i < knownUsers.length; i++){
      if(knownUsers[i].name === name){
        count = i;
        break;
      }
    }
    knownUsers[count].name = name;
    knownUsers[count].cash = cash;
    knownUsers[count].faction = faction;
    knownUsers[count].password = password;
    await saveUsers();
    response.write(JSON.stringify(getUser(name)));
    response.end();
  }
  else{
      response.json({ error: 'Not Implemented' });
      response.end();
  }
}

async function destroyUserFunc(response,name){
  await reloadUsers();
  if(name === undefined){
    response.write(JSON.stringify({ message: nameExists(name)}));
    response.end();
  }
  else if(getUser(name)){
    let count = -1;
    for(let i = 0; i < knownUsers.length; i++){
      if(knownUsers[i].name === name){
        count = i;
        break;
      }
    }
    knownUsers.splice(count,1);
    response.write(JSON.stringify({ message: 'destroyed' }));
    await saveUsers();
    response.end();
  }
  else{
    response.json({ message: "not found" }); 
  }
}




app.post('/addUser', async (request, response) => {
  const queryVar = request.query;
  addUserFunc(response,queryVar.name,queryVar.cash,queryVar.faction,queryVar.password);
});

app.get('/getUser', async (request, response) => {
  const queryVar = request.query;
  readUsers(response,queryVar.name);
});

app.patch('/updateUser',  async (request, response) => {
  const queryVar = request.query;
  updateUserFunc(response,queryVar.name,queryVar.cash,queryVar.faction,queryVar.password);
});

app.delete('/deleteUser',  async (request, response) => {
  const queryVar = request.query;
  destroyUserFunc(response,queryVar.name);
});
//TODO ADD PATCH AND DELETE

// This matches all routes that are not defined.
app.all('*', async (request, response) => {
  response.status(404).send(`Not found: ${request.path}`);
});

// Start the server.
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});