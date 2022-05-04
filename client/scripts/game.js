/**
 * author: Jason Milhaven
*/

const suits = ["diamond", "heart", "spade", "club"];


class Card {

    getDisplayName() {
        switch (this.rank) {
            case 1:
                return "A";
            case 11:
                return "J";
            case 12:
                return "Q";
            case 13:
                return "K";
            default:
                return this.rank.toString();
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


// the shuffled deck of cards, initially 52
let deck = [];

// map of card objects to document elements which represent said card
let playerCards = {};
let houseCards = {};

// the running total player score, NOT the current hand score
let playerScore = 0;

// assume that the game has two phases:
// bet phase: when the player decides how much money they want to bet
// game phase: the house draws cards, the player chooses to hit or stand
let isBetPhase = false;


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
        label.innerText = card.getDisplayName();
        label.style.color = card.getDisplayColor();
    }

    for (const img of cardElement.getElementsByClassName("card-suit-img")) {
        img.style.backgroundImage = "url(" + card.getDisplayImg() + ")";
    }

    return cardElement;
}

function turnoverCard(cardElement, doTurnOver) {
    // TODO: remove this...
    //cardElement = document.getElementById("player-hand").childNodes[0];

    // show or hide all child elements
    for (const child of cardElement.children) {
        child.style.visibility = doTurnOver ? "hidden" : "visible";
    }

    if (doTurnOver) {
        cardElement.style.backgroundImage = "url(images/card_back_1.png)";
    } else {
        delete cardElement.style.backgroundImage;
    }
}

// params: bool isPlayer
// deal a card to either the player or to the dealer/house
function dealCardTo(isPlayer) {
    let hand = isPlayer ? playerCards : houseCards;
    let handElement = isPlayer ? document.getElementById("player-hand") : document.getElementById("house-hand");

    let newCard = deck.pop();

    let newCardElement = createCardElement(newCard);
    handElement.appendChild(newCardElement);

    hand[newCard] = newCardElement;

    refreshHand(isPlayer);

    return newCard;
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

function changeGamePhase() {
    isBetPhase = !isBetPhase;

    document.getElementById("bet-frame").style.visibility = isBetPhase ? "visible" : "hidden";
    document.getElementById("hit-button").style.visibility = isBetPhase ? "hidden" : "visible";
    document.getElementById("stand-button").style.visibility = isBetPhase ? "hidden" : "visible";

    if (isBetPhase) {
        // BET PHASE

        document.getElementById("player-hand").innerHTML = "";
        document.getElementById("house-hand").innerHTML = "";

        playerCards = {};
        houseCards = {};
    } else {
        // GAME PHASE

        // draw the initial cards that the dealer gets
        let firstCard = dealCardTo(false);
        turnoverCard(houseCards[firstCard], true);

        let secondCard = dealCardTo(false);
    }
}


// create the initial deck
resetDeck();

// set the phase to bet phase
changeGamePhase();


document.getElementById("deal-button").addEventListener("click", () => {
    // switch over to the bet phase
    changeGamePhase();
});

document.getElementById("hit-button").addEventListener("click", () => {
    dealCardTo(true);
});

document.getElementById("stand-button").addEventListener("click", () => {
    //turnoverCard(playerCards[playerCards.length - 1], true);
});

document.addEventListener("keydown", (key) => {
    if (key.key != 'p') {
        return;
    }

    changeGamePhase();
});
