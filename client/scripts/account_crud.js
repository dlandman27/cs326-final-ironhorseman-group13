
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

    await fetch("/getUserInfo?authToken=" + localAuthToken, {
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

document.getElementById("change_pwd_button").addEventListener("click", async () => {
    let localAuthToken = getLocalAuthToken();
    const newPwd = document.getElementById("change_password").value;
    console.log("new pass is " + newPwd);

    let responseText = "";

    await fetch("/setPassword?authToken=" + localAuthToken + "&password=" + newPwd, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    }).then(response => response.text()).then(r => responseText = r);

    document.getElementById("account_info").innerHTML = "got the following:<br>" + responseText;
});

document.getElementById("del_account").addEventListener("click", async () => {
    let responseText = "";

    await fetch("/deleteUser?name=cow", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    }).then(response => response.text()).then(r => responseText = r);

    window.alert(responseText);
});