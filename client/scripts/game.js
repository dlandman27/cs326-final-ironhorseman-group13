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

    getValue() {
        return Math.min(this.rank, 10);
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
let playerCards = new Map();
let houseCards = new Map();

// the running total of the player's money, NOT the current hand score
let totalPlayerMoney = 900;

// the current bet
let bet = 0;

// assume that the game has two phases:
// bet phase: when the player decides how much money they want to bet
// game phase: the house draws cards, the player chooses to hit or stand
let isBetPhase = false;


// utility function to wait for x milliseconds seconds
const delay = x => new Promise(res => setTimeout(res, x));

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

// call this on a dict of cards to return the sum of the points
// preconditions: hand is of type Map
function getHandScore(hand, includeHiddenCards = true) {
    let sum = 0;

    for (const entry of hand.entries()) {
        if (entry[1].style.backgroundImage === "" || includeHiddenCards) {
            sum += entry[0].getValue();
        } else {
            console.log("card with a value of " + entry[0].getValue() + " is hidden");
        }
    }

    return sum;
}

// gets and validates the current bet of the player
function getCurrentBet() {
    let betInput = parseInt(document.getElementById("bet-textbox").value);

    if (isNaN(betInput)) {
        return -1;
    }

    // return -1 for invalid amount entered
    if (betInput > totalPlayerMoney || betInput < 0) {
        return -1;
    }

    return betInput;
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
    // show or hide all child elements
    for (const child of cardElement.children) {
        child.style.visibility = doTurnOver ? "hidden" : "visible";
    }

    if (doTurnOver) {
        cardElement.style.backgroundImage = "url(images/card_back_1.png)";
    } else {
        cardElement.style.removeProperty("background-image");
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

    hand.set(newCard, newCardElement);

    refreshHand(isPlayer);

    return newCard;
}

function refreshHand(isPlayer) {
    const cards = document.getElementById(isPlayer ? "player-hand" : "house-hand");
    const scoreCounter = document.getElementById(isPlayer ? "score-player" : "score-house");

    for (let i = 0; i < cards.childElementCount; i++) {
        const child = cards.children[i];

        const rot = i * 12.25 - 25;
        child.style["transform"] = "translate(50%, -50%) rotate(" + rot + "deg)";
        child.style.left = ((i * 15) - 120) + "px";
    }

    scoreCounter.innerHTML = (isPlayer ? "player score: " : "house score: ") + getHandScore(isPlayer ? playerCards : houseCards, false);
}

async function changeGamePhase() {
    isBetPhase = !isBetPhase;

    if (isBetPhase) {
        document.getElementById("bet-frame").animate(
            [
                { bottom: "-100%" },
                { bottom: "10%" }
            ],
            {
                duration: 250,
                iterations: 1,
                callback: () => { console.log("test callback"); }
            },
        );
    } else {
        document.getElementById("bet-frame").animate(
            [
                { bottom: "10%" },
                { bottom: "-100%" }
            ],
            {
                duration: 250,
                iterations: 1
            },
        );
        
    }

    console.log("waiting...");
    await delay(250);
    document.getElementById("bet-frame").style.bottom = isBetPhase ? "10%" : "-100%";
    console.log("done");
    


    document.getElementById("info-label").innerText = "";


    /*document.getElementById("bet-frame").style.visibility = isBetPhase ? "visible" : "hidden";*/
    document.getElementById("hit-button").style.visibility = isBetPhase ? "hidden" : "visible";
    document.getElementById("stand-button").style.visibility = isBetPhase ? "hidden" : "visible";
    document.getElementById("info-label").style.visibility = isBetPhase ? "hidden" : "visible";

    if (isBetPhase) {
        // BET PHASE

        updatePlayerMoney();

        document.getElementById("player-hand").innerHTML = "";
        document.getElementById("house-hand").innerHTML = "";

        playerCards = new Map();
        houseCards = new Map();

        document.getElementById("score-player").innerHTML = "";
        document.getElementById("score-house").innerHTML = "";
    } else {
        // GAME PHASE

        // draw the initial cards that the dealer gets
        let firstCard = dealCardTo(false);
        turnoverCard(houseCards.get(firstCard), true);
        dealCardTo(false);

        // draw the cards for the player
        dealCardTo(true);
        dealCardTo(true);
    }
}

// refresh the player's total money counter
function updatePlayerMoney() {
    // the "toFixed" function displays 2 decimals, like money
    document.getElementById("player-money").innerText = totalPlayerMoney.toFixed(2).toString();
}


function declareVictoryTo(isPlayerWinner) {
    document.getElementById("info-label").innerText = isPlayerWinner ? "you win" : "dealer wins";

    if (isPlayerWinner) {
        totalPlayerMoney += 2 * bet;
    } else {
        // do nothing - the player lost its money already
    }
}


// create the initial deck
resetDeck();

// set the phase to bet phase
changeGamePhase();


document.getElementById("deal-button").addEventListener("click", () => {
    if (getCurrentBet() === -1) {
        return;
    }

    bet = getCurrentBet();
    if (bet === -1) {
        return;
    }
    console.log("bet is: " + bet);

    // withhold the bet from the player's money counter
    totalPlayerMoney -= bet

    // display the player's total with the bet withheld
    updatePlayerMoney();

    // switch over to the bet phase
    changeGamePhase();
});

document.getElementById("hit-button").addEventListener("click", async () => {
    dealCardTo(true);

    let currentScore = getHandScore(playerCards);
    if (currentScore === 21) {
        declareVictoryTo(true);
        document.getElementById("info-label").innerText = "Blackjack!";
    } else if (currentScore > 21) {
        declareVictoryTo(false);
    }



    console.log("changing the game phase...");
    await delay(3000);
    changeGamePhase();
});

document.getElementById("stand-button").addEventListener("click", async () => {
    // turn over the house's hidden card
    for (const [card, element] of houseCards.entries()) {
        turnoverCard(element, false);
    }

    let houseScore = getHandScore(houseCards);
    let playerScore = getHandScore(playerCards);

    // update the house's score counter
    const scoreCounter = document.getElementById("score-house");
    scoreCounter.innerHTML = "house score: " + houseScore;
    
    if (houseScore > playerScore) {
        // first, check if the dealer's score is higher

        // then the house wins, player loses
        document.getElementById("info-label").innerText = "dealer wins";

        // subtract the bet from player's money, then update the display counter
        //totalPlayerMoney -= bet;
        updatePlayerMoney();

        declareVictoryTo(false);
    } else {
        // otherwise, we need to handle the dealer's turn
        // I'm going to go by the rules outlined here:
        // https://bicyclecards.com/how-to-play/blackjack - scroll down to "THE DEALER'S PLAY"



        //let doCheckVictoryConditions = true;

        // the dealer must take cards until its' score reaches 17 or more
        while (houseScore <= 16) {
            dealCardTo(false);
            houseScore = getHandScore(houseCards);

            if (houseScore > playerScore) {
                //declareVictoryTo(true);
                //return;
                break;
            }
        }

        // then we check for the following conditions:
        // if the dealer's score is over 21, the dealer loses
        // else, if the dealer's score is greater than the player's score, the dealer wins
        if (houseScore > 21) {
            // player wins
            declareVictoryTo(true);
        } else if (houseScore > playerScore) {
            // dealer wins
            declareVictoryTo(false);
        } else if (houseScore <= playerScore) {
            // player wins
            declareVictoryTo(true);
        }
    }

    console.log("changing the game phase...");
    await delay(3000);
    changeGamePhase();
});

/*document.addEventListener("keydown", (key) => {
    if (key.key != 'p') {
        return;
    }

    changeGamePhase();
});*/
