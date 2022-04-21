//containts all main functions to interact w server
import * as crud from './crud.js';


async function allCounters() {
  const json = await crud.readAllCounters();
  all.innerHTML = JSON.stringify(json);
}

createButton.addEventListener('click', async (e) => {
  const name = nameText.value;
  const json = await crud.createCounter(name);
  output.innerHTML = JSON.stringify(json);
  await allCounters();
});

readButton.addEventListener('click', async (e) => {
  const name = nameText.value;
  const json = await crud.readCounter(name);
  output.innerHTML = JSON.stringify(json);
  await allCounters();
});

updateButton.addEventListener('click', async (e) => {
  const name = nameText.value;
  const json = await crud.updateCounter(name);
  output.innerHTML = JSON.stringify(json);
  await allCounters();
});

deleteButton.addEventListener('click', async (e) => {
  const name = nameText.value;
  const json = await crud.deleteCounter(name);
  output.innerHTML = JSON.stringify(json);
  await allCounters();
});

allCounters();