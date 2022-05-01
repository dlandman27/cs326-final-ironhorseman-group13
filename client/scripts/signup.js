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


async function createUser(username,password) {
    const response = await fetch(`/addUser?username=${username}&password=${password}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    return data;
}
  
document.getElementById("signup_form").addEventListener("submit", async function(e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirm_password = document.getElementById("password_confirm").value;

    if(password !== confirm_password){
      alert("Passwords do not match");
    }
    else{
      let obj = await createUser(username,password);
      obj = JSON.parse(JSON.stringify(obj));
      console.log(obj)
      if(obj !== "Success"){
        alert("Username already exists");
      }
    }
});