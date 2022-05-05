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
            if (this.dealerCards[i][0] === "A"){
                numAces += 1;
            }
            else if(this.dealerCards[i][0] === "J" || this.dealerCards[i][0] === "Q" || this.dealerCards[i][0] === "K" || this.dealerCards[i].includes("10")){
                total += 10;
            }
            else{
                total += parseInt(this.dealerCards[i][0]);
            }
        }
        if(numAces !== 0 && total + 11 < 17){
            total += 11 + numAces-1;
        }
        else{
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
        console.log(this.playerCards);
        for(let i = 0; i < this.playerCards.length; i++){
            if (this.playerCards[i][0] === "A"){
                numAces += 1;
            }
            else if(this.playerCards[i][0] === "J" || this.playerCards[i][0] === "Q" || this.playerCards[i][0] === "K" || this.playerCards[i].includes("10")){
                total += 10;
            }
            else{
                total += parseInt(this.playerCards[i][0]);
            }
        }
        if(numAces !== 0 && total + 11 < 21){
            total += 11 + numAces-1;
        }
        else{
            total += numAces;
        }
        console.log(total)
        return total;
    }
}

export {Deck, Dealer, Player}