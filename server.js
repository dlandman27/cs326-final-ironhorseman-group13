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

async function updateUserFunc(response,name,cash,faction,password){
  if(name === undefined){
    response.writeHead(400, { 'Content-Type': 'text/plain' });
    response.write(JSON.stringify({ message: 'invalid input' }));
    response.end();
  }
  else{
    await reloadUsers();
    knownUsers.push({name: name , cash:cash, faction:faction, password:password });
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


// async function basicServer(request, response) {
//   // TODO: Implement the server
//   let theUrl = url.parse(request.url,true);
//   let queryVar = theUrl.query;
//   let pathVar = theUrl.pathname;
//   let methodVar = request.method;
  

//   if(methodVar == 'POST' && pathVar.startsWith('/addUser')){
//     addUserFunc(response,queryVar.name,queryVar.cash,queryVar.faction,queryVar.password);
//   }

//   else if (methodVar == 'GET' && pathVar.startsWith('/getUser')){
//     findUserFunc(response);
//   }
//   else if (methodVar == 'PATCH' && pathVar.startsWith('/updateUser')){
//     updateUserFunc(response,response,queryVar.name,queryVar.cash,queryVar.faction,queryVar.password);
//   }
//   else if (methodVar == 'DELETE' && pathVar.startsWith('/deleteUser')){
//     gameScoreFunc(response,queryVar.name,queryVar.score);
//   }
//   else{
//     response.writeHead(404, { 'Content-Type': 'text/plain' });
//     response.write(JSON.stringify({ message: 'Failure' }));
//     response.end();
//   }
// }

// // Start the server on port 3000.
// http.createServer(basicServer).listen(3000, () => {
//   console.log('Server started on port 3000');
// });


app.post('/addUser', async (request, response) => {
  const queryVar = request.query;
  addUserFunc(response,queryVar.name,queryVar.cash,queryVar.faction,queryVar.password);
});

app.get('/getUser', async (request, response) => {
  findUserFunc(response,request.query.name);
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