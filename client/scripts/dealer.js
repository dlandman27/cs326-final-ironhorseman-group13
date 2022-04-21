class Deck {
    constructor() {
        this.deckList = this.newDeck();
    }

    newDeck(){
        let ranks = ["A","2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        let suits = ["♥", "♦", "♣", "♠"];
        let deck = [];

        for(let i = 0; i < ranks.length; i++){
            deck.push(ranks[i]+suits[0]);
            deck.push(ranks[i]+suits[1]);
            deck.push(ranks[i]+suits[2]);
            deck.push(ranks[i]+suits[3]);
        }
        return [...deck].concat([...deck]).concat([...deck]).concat([...deck]).concat([...deck]).concat([...deck]).map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
    }

    getDeckList(){
        return this.deckList;
    }

    getDeckLength(){
        return this.deckList.length;
    }

    dealCard(){
        return this.deckList.pop();
    }

    shuffleDeck(){
        this.deckList = this.newDeck();
    }
}

class Dealer{
    constructor() {
        this.dealerCards = [];
    }

    getDealerCards(){
        return this.dealerCards;
    }

    dealerDraw(card){
        this.dealerCards.push(card);
    }

    playerReset(){
        this.dealerCards = [];
    }

    getDealerTotal(){
        let total = 0;
        let numAces = 0;
        for(let i = 0; i < this.dealerCards.length; i++){
            if (dealerCards[i][0] === "A"){
                numAces += 1;
            }
            total = parseInt(dealerCards[i].replace("J", "10").replace("Q", "10").replace("K", "10").replace(/[^0-9]+/g, ""));
        }
        if(total + 11 < 21){
            total += 11 + numAces-1;
        }else{
            total += numAces;
        }

        return total;
    }
}

class Player{
    constructor() {
        this.playerCards = [];
    }

    getPlayerCards(){
        return this.playerCards;
    }

    playerDraw(card){
        this.playerCards.push(card);
    }

    playerReset(){
        this.playerCards = [];
    }

    getPlayerTotal(){
        let total = 0;
        let numAces = 0;
        for(let i = 0; i < this.dealerCards.length; i++){
            if (dealerCards[i][0] === "A"){
                numAces += 1;
            }
            total = parseInt(dealerCards[i].replace("J", "10").replace("Q", "10").replace("K", "10").replace(/[^0-9]+/g, ""));
        }
        if(total + 11 < 21){
            total += 11 + numAces-1;
        }else{
            total += numAces;
        }

        return total;
    }
}

export {Deck, Dealer, Player}