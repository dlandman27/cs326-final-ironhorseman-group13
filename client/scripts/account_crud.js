
function getLocalAuthToken() {
    let localAuthToken = localStorage.getItem("authToken");
    if (localAuthToken != null) {
        localAuthToken = parseInt(localAuthToken);
    } else {
        localAuthToken = 12345;
    }
    return localAuthToken;
}

// called when the body of the HTML has finished loading
document.addEventListener("DOMContentLoaded", async function() {
    // the authentication token should be some sort of token or ID given to this person's client
    // for now, we will just assume it is set to zero
    let localAuthToken = getLocalAuthToken();

    let responseText = "";

    await fetch("/getUser?authToken=" + localAuthToken, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    }).then(response => response.text()).then(r => responseText = r);

    // do stuff with the account info object later?
    // account info should be populated with the following:
    // username
    // cash
    // faction

    //const accInfo = JSON.parse(responseText);

    // for now, just alert that we got the response text
    //window.alert("got the following: " + responseText);
    document.getElementById("account_info").innerHTML = "got the following:<br>" + responseText;
});
console.log(window.localStorage.getItem("username"));
let k = document.getElementById("navbar-username");
//k.innerHTML = `<H3>${window.localStorage.getItem("username")}</H3>`;
async function updatePerson(username, password) {
    const response = await fetch(
      `/person/update?username=${username}&password=${password}`,
      {
        method: 'PUT',
      }
    );
    const data = await response.json();
    return data;
  }

document.getElementById("change_pwd_button").addEventListener("click", async () => {
    
    const person = await updatePerson(window.localStorage.getItem("username"), document.getElementById("change_password").value);
    output.innerHTML = JSON.stringify(person);
    document.getElementById("account_info").innerHTML = "got the following:<br>" + responseText;
});