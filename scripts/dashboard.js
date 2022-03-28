// document.getElementById("minimize_player_info_container_button").addEventListener("click",function(){
//     if(document.getElementsByClassName("player_info_container")[0].classList.contains("minimized")){
//         document.getElementsByClassName("player_info_container")[0].classList.remove("minimized");
//     }
//     else{
//         document.getElementsByClassName("player_info_container")[0].classList.add("minimized");
//     }
// })

function signout(){
    console.log("lksfdj;asf")
    window.location.href = "index.html";
}

document.getElementById("signout-button").addEventListener("click",signout);

document.getElementById("account-button").addEventListener("click",function(){
    window.location.href = "account.html";
});

function clickFactionButton(){
    const buttons = document.getElementsByClassName("faction-logo");
    for(let i = 0;i<buttons.length;i++){
        buttons[i].addEventListener("click",function(){
            for(let j = 0;j<buttons.length;j++){
                buttons[j].classList.remove("selected");
            }
            this.classList.add("selected");
            button_color = buttons[i].style.backgroundColor;
            console.log(button_color)
        });
    }
}

clickFactionButton();

// goto table 1
document.getElementById("table1-card").addEventListener("click",function(){
    
    window.location.href = "gameBoard1.html";
});

// goto table 2
document.getElementById("table2-card").addEventListener("click",function(){
    window.location.href = "gameBoard2.html";
});

// goto table 3
document.getElementById("table3-card").addEventListener("click",function(){
    window.location.href = "gameBoard3.html";
});

// goto table 4
document.getElementById("table4-card").addEventListener("click",function(){
    window.location.href = "gameBoard4.html";
});

// goto table 3
document.getElementById("table5-card").addEventListener("click",function(){
    window.location.href = "gameBoard5.html";
});
