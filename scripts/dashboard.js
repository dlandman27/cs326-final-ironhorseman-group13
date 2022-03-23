document.getElementById("minimize_player_info_container_button").addEventListener("click",function(){
    if(document.getElementsByClassName("player_info_container")[0].classList.contains("minimized")){
        document.getElementsByClassName("player_info_container")[0].classList.remove("minimized");
    }
    else{
        document.getElementsByClassName("player_info_container")[0].classList.add("minimized");
    }
})

function signout(){
    // Goback to login page
    window.location.href = "index.html";
    // Clear local storage for user info
}