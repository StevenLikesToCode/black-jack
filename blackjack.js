var dealerSum = 0;
var yourSum = 0;

var dealerAceCount = 0;
var yourAceCount = 0; 

var hidden;
var deck;

var canHit = true; //allows the player (you) to draw while yourSum <= 21
var canStay = true;

//chips
var yourCredits = 2500;
var bet;

//music
var shufflingbgm = new Audio('music/shuffling.mp3');
var card_turn_over = new Audio('music/card_turn_over.mp3');
var win = new Audio('music/win.mp3');
var lose = new Audio('music/lose.mp3');
var tie = new Audio('music/tie.mp3');

window.onload = function() {
    buildDeck();
    shuffleDeck();
    // setBets();
    startGame();
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); //A-C -> K-C, A-D -> K-D
        }
    }
    // console.log(deck);
    //deck = ["A-H", "A-C", "A-S", "A-D"];
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

function dealerStart() {
    hidden = deck.pop();
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    dealerSum = getValue(hidden) + getValue(card);
    dealerAceCount = checkAce(hidden) + checkAce(card);
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    document.getElementById("dealer-cards").append(cardImg);
}

function youStart(){
    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        yourSum = reduceAce(yourSum, yourAceCount);
        document.getElementById("your-cards").append(cardImg);
        document.getElementById("your-sum").innerText = yourSum;
        if (yourSum == 21)
        {
            message = "BlackJack!!!\nYou win!";
            win.play();
            document.getElementById("results").innerText = message;
            canHit = false;
            canStay = false;
        }
    }
}

function startGame() {
    dealerStart();
    youStart();
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);

}

function dealerJudge(){
    while ((dealerSum < 17) || (dealerSum < yourSum)){
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        dealerSum = reduceAce(dealerSum, dealerAceCount);
        document.getElementById("dealer-cards").append(cardImg);
    }
}

let endTurn = true;

function hit() {
    if (!canHit) {
        return;
    }
    card_turn_over.play();

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    if ((reduceAce(yourSum, yourAceCount) > 21) || (reduceAce(yourSum, yourAceCount)==21)) {
        canHit = false;
        canStay = false;
    }

    document.getElementById("your-sum").innerText = yourSum;
    if(yourSum > 21){
        message = "You Lose!";
        lose.play();
        document.getElementById("results").innerText = message;
    }else if(yourSum == 21){
        message = "BlackJack!!!\nYou win!";
        win.play();
        document.getElementById("results").innerText = message;
    }
}

function stay() {
    if (!canStay) {
        return;
    }
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;
    canStay = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";
    dealerJudge();
    let message = "";
    if(yourSum == 21){
        message = "BlackJack!!!\nYou win!";
        win.play();
    }
    else if (yourSum > 21) {
        message = "You Lose!";
        lose.play();
    }
    else if (dealerSum > 21) {
        message = "You win!";
        win.play();
    }
    //both you and dealer <= 21
    else if (yourSum == dealerSum) {
        message = "Tie!";
    }
    else if (yourSum > dealerSum) {
        message = "You Win!";
        win.play();
    }
    else if (yourSum < dealerSum) {
        message = "You Lose!";
        lose.play();
    }


    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;
}

// We use this function to get the value(int) of the card.
function getValue(card) {
    let data = card.split("-"); // "4-C" -> ["4", "C"]
    let value = data[0];

    if (isNaN(value)) { //A J Q K
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum =  playerSum - 10;
        playerAceCount = playerAceCount - 1;
    }
    return playerSum;
}
