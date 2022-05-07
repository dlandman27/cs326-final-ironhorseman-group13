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

// 


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
        //add crud operation
        
    }
}

clickFactionButton();

// goto table 1
document.getElementById("table1-card").addEventListener("click",function(){
    
    window.location.href = "game.html";
});

// goto table 2
document.getElementById("table2-card").addEventListener("click",function(){
    window.location.href = "table_2.html";
});

// goto table 3
document.getElementById("table3-card").addEventListener("click",function(){
    window.location.href = "table_3.html";
});

// goto table 4
document.getElementById("table4-card").addEventListener("click",function(){
    window.location.href = "table_4.html";
});

// goto table 3
document.getElementById("table5-card").addEventListener("click",function(){
    window.location.href = "table_5.html";
});

function minimize(){
    const navbar = document.getElementsByClassName("navbar")[0];
    const avatar_image = document.getElementsByClassName("avatar-image")[0];
    const main_dashboard = document.getElementById("main-dashboard");
    main_dashboard.style.height = parseInt(window.innerHeight)+"px";
    console.log()
    if(window.innerWidth < 900){
        navbar.classList.add("minimized");
        avatar_image.classList.add("minimized");
        main_dashboard.classList.add("minimized");
    }
    else{
        navbar.classList.remove("minimized");
        avatar_image.classList.remove("minimized");
        main_dashboard.classList.remove("minimized");
    }
    
}

window.onresize = minimize;
window.onload = minimize;

document.getElementsByClassName("leaderboard-container")[0].addEventListener("click",function(){
    const leaderboard_container = document.getElementsByClassName("leaderboard-container")[0];
    const containers = document.getElementsByClassName("main-section-container");
    if(leaderboard_container.classList.contains("fullscreen")){
        for(let i = 0;i<containers.length;i++){
            if(!containers[i].classList.contains("leaderboard-container")){
                containers[i].classList.remove("hidden");
            }
        }
        const top_row = document.getElementById("top-row");
        top_row.classList.remove("hidden");
        leaderboard_container.classList.remove("fullscreen");
    }
    else{
        for(let i = 0;i<containers.length;i++){
            if(!containers[i].classList.contains("leaderboard-container")){
                containers[i].classList.add("hidden");
            }
        }
        
        const top_row = document.getElementById("top-row");
        top_row.classList.add("hidden");
        leaderboard_container.classList.add("fullscreen");
    }
    
});

document.getElementById("leaderboard-button").addEventListener("click",function(){
    const leaderboard_container = document.getElementsByClassName("leaderboard-container")[0];
    const containers = document.getElementsByClassName("main-section-container");
    if(leaderboard_container.classList.contains("fullscreen")){
        for(let i = 0;i<containers.length;i++){
            if(!containers[i].classList.contains("leaderboard-container")){
                containers[i].classList.remove("hidden");
            }
        }
        const top_row = document.getElementById("top-row");
        top_row.classList.remove("hidden");
        leaderboard_container.classList.remove("fullscreen");
    }
    else{
        for(let i = 0;i<containers.length;i++){
            if(!containers[i].classList.contains("leaderboard-container")){
                containers[i].classList.add("hidden");
            }
        }
        
        const top_row = document.getElementById("top-row");
        top_row.classList.add("hidden");
        leaderboard_container.classList.add("fullscreen");
    }
});