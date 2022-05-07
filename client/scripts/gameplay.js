import {Deck, Dealer, Player} from "./dealer.js";

class NewGame {
    constructor(){
        this.deck = new Deck();
        this.dealer = new Dealer();
        this.player = new Player();
    }

    getDeck(){
        return this.deck
    }
    getDealer(){
        return this.dealer
    }
    getPlayer(){
        return this.player
    }

    //returns json data with information of this round
    updateRound(){

    }
}

let game = new NewGame();


function playNewCard(player){
    if(player == "player"){
        game.player.playerDraw(game.deck.dealCard());
        console.log(game.player.getPlayerCards());

        // Display the player's card on the screen
        const player_hand = document.getElementsByClassName("player-cards-container")[0];
        let new_card = document.createElement("div");
        new_card.className = "card";
        new_card.innerHTML = game.player.getPlayerCards()[game.player.getPlayerCards().length-1];
        player_hand.appendChild(new_card);

        // Check if the player has busted
        if(game.player.getPlayerTotal() > 21){
            alert("Player has busted!");
        }
        else if (game.player.getPlayerTotal() === 21){
            alert("Player has 21!");
        }
    }
    else{
        game.dealer.dealerDraw(game.deck.dealCard());
        console.log(game.dealer.getDealerCards());

        // Display the dealer's card on the screen
        const dealer_hand = document.getElementsByClassName("dealer-cards-container")[0];
        let new_card = document.createElement("div");
        new_card.className = "card";
        new_card.innerHTML = game.dealer.getDealerCards()[game.dealer.getDealerCards().length-1];
        dealer_hand.appendChild(new_card);

        // Check if the dealer has busted
        if(game.dealer.getDealerTotal() > 21){
            alert("Dealer has busted!");
        }
        else if (game.dealer.getDealerTotal() === 21){
            alert("Dealer has 21!");
        }
    }
}
document.getElementById("hit-button").addEventListener("click", function(){
    console.log("hit");
    playNewCard("player");
});


document.getElementById("stand-button").addEventListener("click", function(){
    const timer = setInterval(function(){
        if(game.dealer.getDealerTotal > 21){
            alert("Dealer has busted!");
            clearInterval(timer);
        }
        else if (game.dealer.getDealerTotal() === 21){
            alert("Dealer has 21!");
            clearInterval(timer);
        }
        else if(game.dealer.getDealerTotal() > game.player.getPlayerTotal() && game.dealer.getDealerTotal() < 21){
            alert("Dealer wins!");
            clearInterval(timer);
        }
        else if(game.dealer.getDealerTotal() < 17){
            playNewCard("dealer");
        }
        else if(game.dealer.getDealerTotal() === game.player.getPlayerTotal()){
            alert("Draw!");
            clearInterval(timer);
        }
        else if(game.dealer.getDealerTotal() < game.player.getPlayerTotal() && game.dealer.getDealerTotal() >= 17){
            alert("Player wins!");
            clearInterval(timer);
        }
    },1000);
});