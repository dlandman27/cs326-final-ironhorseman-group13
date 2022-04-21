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

let game = new NewGame;