function makeBackgroundGrid(){
    // var grid = document.getElementById("background-grid");
    // grid.style.backgroundColor = "white";
    // for(var i = 0; i < 10; i++){
    //     var box = document.createElement("div");
    //     box.style.height = "100px";
    //     box.style.aspectRatio = "1/1";
    //     box.style.position = "absolute";
    //     box.style.zIndex = "-1";
    //     box.style.backgroundColor = "black";
    //     grid.appendChild(box);
    // }
}

makeBackgroundGrid();

function startCard(){
    let signup_card = document.getElementById("signup_card");
    let login_card = document.getElementById("login_card");
    signup_card.style.position = "fixed";
    signup_card.style.backgroundColor = "maroon";
    signup_card.style.left = "50px";
    signup_card.style.zIndex = "2";
    login_card.style.position = "absolute";
    login_card.style.zIndex = "3";
}

startCard();

function swapCard(){
    let signup_card = document.getElementById("signup_card");
    let login_card = document.getElementById("login_card");
    signup_card.style.animation = "rotateToBottom 1s";
    login_card.style.animation = "rotateToTop 1s";
    setTimeout(function(){
        signup_card.style.left = "0px";
        signup_card.style.zIndex = "3";
    },1000)
}

// swapCard();

document.getElementById("signup_button").addEventListener("click",function(){
    let signup_card = document.getElementById("signup_card");
    let login_card = document.getElementById("login_card");

    signup_card.style.zIndex = "3";
    login_card.style.zIndex = "2";
});

document.getElementById("login_button").addEventListener("click",function(){
    let signup_card = document.getElementById("signup_card");
    let login_card = document.getElementById("login_card");

    signup_card.style.zIndex = "2";
    login_card.style.zIndex = "3";
});