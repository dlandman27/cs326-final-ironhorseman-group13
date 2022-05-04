/**
 * author: Jason Milhaven
*/

const suits = ["diamond", "heart", "spade", "club"];


class Card {

    getDisplayName() {
        switch (this.suit) {
            case 1:
                return "A";
            case 11:
                return "J";
            case 12:
                return "Q";
            case 13:
                return "K";
            default:
                return this.suit.toString();
        }
    }

    getDisplayColor() {
        return (this.suit === "diamond" || this.suit === "heart") ? "red" : "black";
    }

    getDisplayImg() {
        return "/client/images/suits/" + this.suit + ".png";
    }

    constructor(suit, rank) {
        // we're going to assume that suit is a string which may take on the following values:
        // diamond
        // heart
        // spade
        // club

        this.suit = suit;
        if (suits.indexOf(suit) === -1) {
            throw new Error("card suit not valid");
        }

        // the effective point value of the card, ranges from 1 to 13 inclusive
        // an Ace is represented by 1, whereas a King is 13
        this.rank = rank;
        if (rank < 1 || rank > 13) {
            throw new Error("card value not valid");
        }
    }
}



const deck = [];
const playerCards = [];
const houseCards = [];

let playerScore = 0;


// creates a standard deck of 52 cards
function resetDeck() {
    deck.length = 0;

    // create new set of 52 cards
    for (const suit of suits) {
        for (let n = 1; n <= 13; n++) {
            deck.push(new Card(suit, n));
        }
    }

    // shuffle the deck via Fisher-Yates
    for (let i = 0; i < deck.length; i++) {
        let other = Math.floor(Math.random() * deck.length);

        let temp = deck[i];
        deck[i] = deck[other];
        deck[other] = temp;
    }
}

// removes and returns a random card from the deck
function drawCard() {
    let randIndex = Math.floor(Math.random() * deck.length);
    const card = deck[randIndex];
    deck.splice(card, 1);
    return card;
}

// call this on a list of cards to return the sum of the points
function getHandScore(hand) {
    return hand.reduce((prev, cur) => prev + cur.rank, 0);
}

// gets and validates the current bet of the player
function getCurrentBet() {
    let bet = parseInt(document.getElementById("bet-textbox").innerText);

    // return -1 for invalid amount entered
    if (bet > playerScore || bet < 0) {
        return -1;
    }

    return bet;
}

// creates and returns a card in the DOM
// the parameter is a card object, and this returns an element
function createCardElement(card) {
    let cardElement = document.getElementById("dummy-card").cloneNode(true);
    cardElement.removeAttribute("id");
    cardElement.style.visibility = "visible";

    document.getElementsByTagName("body")[0].appendChild(cardElement);

    for (const label of cardElement.getElementsByClassName("label")) {
        label.innerText = card.rank.toString();
        label.style.color = card.getDisplayColor();
    }

    for (const img of cardElement.getElementsByClassName("card-suit-img")) {
        img.style.backgroundImage = "url(" + card.getDisplayImg() + ")";
    }

    return cardElement;
}

// params: bool isPlayer
// deal a card to either the player or to the dealer/house
function dealCardTo(isPlayer) {
    let hand = isPlayer ? playerCards : houseCards;
    let handElement = isPlayer ? document.getElementById("player-hand") : document.getElementById("house-hand");

    let newCard = deck.pop();
    hand.push(newCard);

    let newCardElement = createCardElement(newCard);
    handElement.appendChild(newCardElement);
}

function refreshHand(isPlayer) {
    const cards = document.getElementById(isPlayer ? "player-hand" : "house-hand");
    for (let i = 0; i < cards.childElementCount; i++) {
        const child = cards.children[i];

        const rot = i * 12.25 - 25;
        child.style["transform"] = "translate(50%, -50%) rotate(" + rot + "deg)";
        child.style.left = ((i * 15) - 120) + "px";
    }
}


// create the initial deck
resetDeck();


document.getElementById("deal-button").addEventListener("click", () => {
    console.log("deal button clicked");

    dealCardTo(true);
    dealCardTo(false);

    refreshHand(true);
    refreshHand(false);
});
