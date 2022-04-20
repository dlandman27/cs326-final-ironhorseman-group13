
// called when the body of the HTML has finished loading
document.addEventListener("DOMContentLoaded", async function() {
    // the authentication token should be some sort of token or ID given to this person's client
    // for now, we will just assume it is set to zero
    let localAuthToken = localStorage.getItem("authToken");
    if (localAuthToken != null) {
        localAuthToken = parseInt(localAuthToken);
    } else {
        localAuthToken = 12345;
    }

    let responseText = "";

    await fetch("/getUser?authToken=" + localAuthToken, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        /*body: {
            localAuthToken
        }*/
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
    document.getElementById("account_info").style.color = "white";
});
