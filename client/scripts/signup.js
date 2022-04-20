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



document.getElementById("signup_form").addEventListener("submit",function(e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirm_password = document.getElementById("password_confirm").value;
    const response = await fetch(`/getUser`, {
        method: 'GET',
      });
    const data = await response.json();
    if(password !== confirm_password){
        alert("Passwords do not match");
    }
    else if(data.name ===username){
        alert("Username already exists");
    }
    else{
        const response2 = await fetch(`/addUser`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: username, password: confirm_password, money: 1000,faction:"not Chosen" }),
          });
        const data2 = await response.json();
        if(response2.ok){
            
            alert("Account created");
            window.location.href = "index.html";
        }
        else{
            alert("did not succeeed");
        }
    }
});