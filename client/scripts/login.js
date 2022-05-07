// JS USED IN THE LOGIN/SIGNUP PAGE


// Randomly generates hearts club diamonds and spades
function dropdown_images(){
    const dropdown = setInterval(function(){
        let images = ["hearts","clubs","diamonds","spades"];
        let code = ["&#9829;","&#9827;","&#9830;","&#9824;"];
        let colors = ["maroon","#36454F"];
        let random_image = images[Math.floor(Math.random() * images.length)];
        let dropdown_item = document.createElement("div");
        dropdown_item.innerHTML = code[images.indexOf(random_image)];
        (random_image === "hearts" || random_image === "diamonds")? dropdown_item.style.color = colors[0] : dropdown_item.style.color = colors[1];
        dropdown_item.style.position = "absolute";
        dropdown_item.style.left = Math.floor(Math.random() * window.innerWidth) + "px";
        dropdown_item.style.fontSize = "100px";
        dropdown_item.style.userSelect = "none";
        dropdown_item.style.zIndex = "-1";
        dropdown_item.style.userSelect = "none";
        dropdown_item.style.opacity = Math.random();
        dropdown_item.style.animation = "move_suite_to_bottom 20s ease-in-out infinite";
        document.body.append(dropdown_item);
        setTimeout(function(){dropdown_item.remove()},20000);
    },Math.floor(Math.random() * 300) + 1000);
}

dropdown_images();

async function signin(username,password) {
    try {
      const response = await fetch(`/signin?username=${username}&password=${password}`, {
        method: 'GET',
      });
      const data = await response.json();
      return data;
    } catch (err) {
      console.log(err);
    }
}

document.getElementById("login_form").addEventListener("submit", async function(e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if(username == '' || password == ''){
        if(username === ""){
            document.getElementById("username").style.outline = "solid red 2px";
            document.getElementById("username").placeholder = "No username entered";
            document.getElementById("username").value = "";
        }
        else{
            document.getElementById("username").style.outline = "";
            document.getElementById("username").placeholder = "";
        }
        if(password === ""){
            document.getElementById("password").style.outline = "solid red 2px";
            document.getElementById("password").placeholder = "No password entered";
        }
        else{
            document.getElementById("password").style.outline = "";
            document.getElementById("password").placeholder = "";
        }
    }
    else{
        let obj = await signin(username,password);
        obj = JSON.parse(JSON.stringify(obj));
        console.log(obj)

        if(obj === "Success"){
            window.location.href = "https://secret-springs-74228.herokuapp.com/client/dashboard.html";
        }
        else{
            alert("Username and/or password is incorrect");
        }
    }
});
