import * as http from 'http';
import * as url from 'url';
import { readFile, writeFile } from 'fs/promises';

let knownUsers = [];


let usersFile = 'UsersFile.json';
//reloads


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
async function addUserFunc(response,name,cash){
  if(name === undefined || word === undefined || score ===undefined){
    response.writeHead(400, { 'Content-Type': 'text/plain' });
    response.write(JSON.stringify({ message: 'invalid input' }));
    response.end();
  }
  else{
    await reloadUsers();
    knownUsers.push({name: name , word: word , score: score });
    await saveWordScore();
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end();
  }
}

async function findUserFunc(response,name,cash){
  if(name === undefined || word === undefined || score ===undefined){
    response.writeHead(400, { 'Content-Type': 'text/plain' });
    response.write(JSON.stringify({ message: 'invalid input' }));
    response.end();
  }
  else{
    await reloadUsers();
    knownUsers.push({name: name , word: word , score: score });
    await saveWordScore();
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end();
  }
}

async function updateUserFunc(response,name,cash){
  if(name === undefined || word === undefined || score ===undefined){
    response.writeHead(400, { 'Content-Type': 'text/plain' });
    response.write(JSON.stringify({ message: 'invalid input' }));
    response.end();
  }
  else{
    await reloadUsers();
    knownUsers.push({name: name , word: word , score: score });
    await saveWordScore();
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end();
  }
}

async function destroyUserFunc(response){
  await reloadGameScore();
  gameScores.sort((a, b) => b.score - a.score);
  let len = Math.min(10,gameScores.length);
  let arr = gameScores.slice(0,len);
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(arr));
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
    highestWordScoresFunc(response);
  }
  else if (methodVar == 'PATCH' && pathVar.startsWith('/updateUser')){
    gameScoreFunc(response,queryVar.name,queryVar.score);
  }
  else if (methodVar == 'DELETE' && pathVar.startsWith('/updateUser')){
    gameScoreFunc(response,queryVar.name,queryVar.score);
  }

  else{
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.write(JSON.stringify({ message: 'Failure' }));
    response.end();
  }
}


// Start the server on port 3000.
http.createServer(basicServer).listen(3000, () => {
  console.log('Server started on port 3000');
});