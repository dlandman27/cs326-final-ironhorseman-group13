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
        //return "/client/images/suits/" + this.suit + ".png";
        return "/images/suits/" + this.suit + ".png";
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

let currentRound = 0;

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

// is a button currently considered clicked?
// if true - buttons cannot be clicked on
// if false - the player may click on buttons
let isButtonClicked = false;


// values which we use to compare
let currentWinStreak = 0;

// values which are stored in the persistent database in the backend:
let totalHandsWon = 0;
let highestMoneyEarned = 0; // the largest amount
let highestWinStreak = 0;

let playerAbility = "sneak";




//const localUsername = localStorage.getItem("username");
const localUsername = "cow"; // pass is asdf

/*let responseText = "";
  const localPlayerInfo = await fetch("/", {
    method: "GET",
    //username: localUsername,
    headers: { "Content-Type": "application/json" },
  }).then(response => response.text()).then(r => responseText = r);

  console.log("got: " + localUsername);*/


async function getUser(username) {
  const response = await fetch(`/getUser?username=${username}`, {
    method: 'GET',
  });
  const data = await response.json();
  return data;
}

try {
    console.log("got: " + JSON.stringify(await getUser(localUsername)));
} catch (err) {
    console.log(err);
}



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
        
        currentRound++;
    }

    console.log("waiting...");
    await delay(250);
    document.getElementById("bet-frame").style.bottom = isBetPhase ? "10%" : "-100%";
    console.log("done");
    
    document.getElementById("info-label").innerText = "";

    document.getElementById("hit-button").style.visibility = isBetPhase ? "hidden" : "visible";
    document.getElementById("stand-button").style.visibility = isBetPhase ? "hidden" : "visible";
    document.getElementById("info-label").style.visibility = isBetPhase ? "hidden" : "visible";
    document.getElementById("ability-button").style.visibility = isBetPhase ? "hidden" : "visible";

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

        // shuffle the deck here?
        resetDeck();

        // draw the initial cards that the dealer gets
        let firstCard = dealCardTo(false);
        turnoverCard(houseCards.get(firstCard), true);
        dealCardTo(false);

        // draw the cards for the player
        dealCardTo(true);
        dealCardTo(true);

        document.getElementById("hit-button").addEventListener("click", onHitClicked);
        document.getElementById("stand-button").addEventListener("click", onStandClicked);
        document.getElementById("ability-button").addEventListener("click", onAbilityClicked);
    }
}

// refresh the player's total money counter
function updatePlayerMoney() {
    // the "toFixed" function displays 2 decimals, like money
    document.getElementById("player-money").innerText = totalPlayerMoney.toFixed(2).toString();
}


function declareVictoryTo(isPlayerWinner) {
    document.getElementById("hit-button").removeEventListener("click", onHitClicked);
    document.getElementById("stand-button").removeEventListener("click" ,onStandClicked);
    document.getElementById("ability-button").removeEventListener("click", onAbilityClicked);

    // perform the reverse ability, if applicable
    if (playerAbility === "reverse") {
        isPlayerWinner = !isPlayerWinner;
    }

    document.getElementById("info-label").innerText = isPlayerWinner ? "you win" : "dealer wins";

    if (isPlayerWinner) {
        if (playerAbility != "multipler") {
            totalPlayerMoney += 2 * bet;
        } else {
            totalPlayerMoney += 4 * bet;
        }
    } else if (playerAbility === "mule") {
        totalPlayerMoney += bet; // if ability is mule, add back the money we would have otherwise lost
    }

    if (isPlayerWinner) {
        totalHandsWon++;
        currentWinStreak++;

        if (currentWinStreak > highestWinStreak) {
            highestWinStreak = currentWinStreak;
            onSaveHighestWinstreak();
        }

        if (totalPlayerMoney > highestMoneyEarned) {
            highestMoneyEarned = totalPlayerMoney;
            onSavehighestMoneyEarned();
        }
    } else {
        currentWinStreak = 0;
    }
}

async function checkWinConditions() {
    let playerScore = getHandScore(playerCards);
    let dealerScore = getHandScore(houseCards);

    if (playerScore == 21) {
        declareVictoryTo(true);
        document.getElementById("info-label").innerText = "Blackjack!";
    } else if (dealerScore == 21) {
        declareVictoryTo(false);
    } else if (dealerScore > 21) {
        // player wins
        declareVictoryTo(true);
    } else if (playerScore > 21) {
        // dealer wins
        declareVictoryTo(false);
    } else if (dealerScore > playerScore) {
        // dealer wins
        declareVictoryTo(false);
    } else if (dealerScore <= playerScore) {
        // player wins
        declareVictoryTo(true);
    }

    await delay(3000);
    changeGamePhase();
}

async function onSaveHighestWinstreak() {
    // TODO - perform the saving here...
    
}

async function onSavehighestMoneyEarned() {
    // TODO - perform the saving here...

}

async function onSaveTotalHandsWon() {
    // TODO - perform the saving here...

}

// abilities:
// sneak: draw 3 cards but only take 2
// multiplier: double reward on win
// reverse: if dealer wins, then you actually win instead
// mule: when you lose the round, you don't lose the money you bet

// each player may only select 1 ability per game
// each active ability can only be used once every x rounds
function assignPlayerAbility(ability) {
    // TODO - call this function when loading the game
    playerAbility = ability;
}


// create the initial deck
resetDeck();

// set the phase to bet phase
changeGamePhase();

// TODO - call this thing given the ability the player select
//assignPlayerAbility("sneak");


async function resetButtons() {
    isButtonClicked = true;
    await delay(250);
    isButtonClicked = false;
}

document.getElementById("deal-button").addEventListener("click", () => {
    if (isButtonClicked) {
        return;
    }

    if (getCurrentBet() === -1) {
        return;
    }

    bet = getCurrentBet();
    if (bet === -1) {
        return;
    }


    resetButtons();
    


    console.log("bet is: " + bet);

    // withhold the bet from the player's money counter
    totalPlayerMoney -= bet

    // display the player's total with the bet withheld
    updatePlayerMoney();

    // switch over to the bet phase
    changeGamePhase();
});

async function onHitClicked() {
    if (isButtonClicked) {
        return;
    }
    resetButtons();

    dealCardTo(true);

    if (getHandScore(playerCards) >= 21) {
        checkWinConditions();
    }
}

async function onStandClicked() {
    if (isButtonClicked) {
        return;
    }
    resetButtons();


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

        // the dealer must take cards until its' score reaches 17 or more
        while (houseScore <= 16) {
            dealCardTo(false);
            houseScore = getHandScore(houseCards);

            if (houseScore > playerScore) {
                break;
            }
        }
    }

    checkWinConditions();
}

async function onAbilityClicked() {
    if (isButtonClicked) {
        return;
    }
    resetButtons();


    // if ability is sneak, take the two of 3 cards which bring the player closer to, but not above 21
    if (playerAbility === "sneak") {
        let topCards = [];
        for (let i = 0; i < 3; i++) { topCards.push(deck.pop()); }

        // sort ascending by value
        topCards.sort(x => x.getValue());

        if (topCards[1].getValue() + topCards[2].getValue() > 21) {
            topCards.splice(2, 1);
        } else {
            topCards.splice(0, 1);
        }

        // take the remaining cards, add them back to the deck
        // then deal them to the player
        for (let i = 0; i < 2; i++) {
            deck.push(topCards.pop());
            dealCardTo(true);
        }

        if (getHandScore(playerCards) >= 21) {
            checkWinConditions();
        }
    }
}
