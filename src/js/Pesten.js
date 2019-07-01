import Card from "@/js/Card";
import Move from "@/js/Move";
import State from "@/js/State";

class Pesten {
    constructor() {
        this.rules = {
            allColors: ['hearts', 'spades', 'clubs', 'diamonds'],
            allowedAnywhere: ['J', 'Joker'],
            allTypes: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', 'Joker'],
            changeColorCards: ['J', 'Joker'],
            bounceCards: ['2', 'Joker'],
            reverseDirectionCards: ['A'],
            pestCards: ['2', '7', '8', 'J', 'K', 'A', 'Joker'],
            skipCards: {'7': -1, '8': 1, 'K': -1},
            takeCards: {'2': 2, 'Joker': 5},
            jokerAmount: 2,
            takeCardsWhenNoMove: 1,
            playerStartCardAmount: 8,
            playerCount: 2,
        };

        this.newGame();
    }

    newGame() {
        this.maxPossibleTake = Math.max(...Object.values(this.rules.takeCards));

        this.state = new State(this.rules.playerCount);

        for (let type of this.rules.allTypes) {
            let colorAmountOfType = type === 'Joker' ? this.rules.jokerAmount : this.rules.allColors.length;
            for (let i = 0; i < colorAmountOfType; i++)
                this.state.backupDeck.push(new Card(this.rules.allColors[i], type));
        }

        this.shuffle(this.state.backupDeck);
        this.state.activeDeck.push(this.state.backupDeck.pop());

        for (let player of this.state.players)
            player.deck = this.state.backupDeck.splice(0, this.rules.playerStartCardAmount);
    }

    randomMove(state) {
        let moves = this.possibleMoves(state);
        let move = moves[Math.floor(Math.random() * moves.length)];

        this.doMove(state, move);

        return move;
    }

    gameWinner(state) {
        for (let player of state.players) {
            if (player.deck.length === 0) {
                let playerIndex = state.players.indexOf(player);
                if (state.players.reduce((a, b) => a.takeCards + b.takeCards) > 0)
                    continue;
                return playerIndex;
            }
        }
        return false;
    }

    // Move: {type: enum('card','take','color', 'switch'), value: either(array, int)}
    doMove(state, move) {
        state.players.forEach(p => {
            if (p.canPlayAfterTake)
                p.takeIfNoMoves = true;
        });

        let currentPlayer = state.players[state.turn];
        let forceNextTurn = false;
        let repeatTurn = false;

        if (move.type === 'card') {
            this.playCard(state, move);
        } else if (move.type === 'take') {
            let playerCards = currentPlayer.deck;
            // Add n cards to deck
            let cardsTaken = state.backupDeck.splice(0, move.value);
            cardsTaken.forEach(c => playerCards.push(c));
            // Reduce turn to try again with newly taken card
            currentPlayer.takeIfNoMoves = false;
            currentPlayer.takeCards = 0;

            if (!currentPlayer.canPlayAfterTake)
                forceNextTurn = true;
            currentPlayer.canPlayAfterTake = true;
            repeatTurn = true;

            if (state.backupDeck.length <= this.maxPossibleTake) {
                // this.Shuffle active deck onto backup deck
                let newBackupDeck = state.activeDeck.splice(0, state.activeDeck.length - 1);
                this.shuffle(newBackupDeck);
                newBackupDeck.forEach(c => state.backupDeck.push(c));
            }
        } else if (move.type === 'bounce') {
            state.players[this.nextTurn(state)].takeCards = move.value.take;
            currentPlayer.takeCards = 0;
            move.value = move.value.cardIndex;
            this.playCard(state, move);
        } else if (move.type === 'color') {
            currentPlayer.changeColor = false;
            let topCard = state.activeDeck[state.activeDeck.length - 1];
            topCard.color = move.value;
        } else if (move.type === 'switch') {
            // do nothing
        }

        if (forceNextTurn)
            state.turn = this.nextTurn(state);
        else if (!repeatTurn && currentPlayer.takeCards === 0 && !currentPlayer.changeColor)
            state.turn = this.nextTurn(state);
    }

    playCard(state, move) {
        console.log(JSON.stringify({state, move}));
        let playerCards = state.players[state.turn].deck;
        let playedCard = playerCards[move.value];
        let currentPlayer = state.players[state.turn];

        if (this.rules.reverseDirectionCards.includes(playedCard.type))
            state.direction *= -1;

        if (playedCard.type in this.rules.takeCards)
            state.players[this.nextTurn(state)].takeCards += this.rules.takeCards[playedCard.type];

        // Last card is being played
        if (playerCards.length === 1 && this.rules.pestCards.includes(playerCards[0].type)) {
            currentPlayer.takeCards += 2;
            currentPlayer.canPlayAfterTake = false;
            if (playedCard.type in this.rules.skipCards)
                if (this.isNextTurnMyTurn(state, state.turn + this.rules.skipCards[playedCard.type] * state.direction, currentPlayer))
                    currentPlayer.canPlayAfterTake = true;

        } else if (playedCard.type in this.rules.skipCards)
            state.turn += this.rules.skipCards[playedCard.type] * state.direction;

        if (this.rules.changeColorCards.includes(playedCard.type))
            currentPlayer.changeColor = true;

        state.activeDeck.push(playedCard);
        playerCards.splice(move.value, 1);
    }


    // Card {color: 'hearts', type: '}
    possibleMoves(state) {

        let currentPlayer = state.players[state.turn];
        if (currentPlayer.changeColor) {
            // Joker has just been played, this possible moves is for which colors to pick;
            return this.rules.allColors.map(c => new Move('color', c));
        }

        if (currentPlayer.takeCards > 0) {
            if (currentPlayer.deck.find(c => this.rules.bounceCards.includes(c.type)))
            // Bounce card can be played on top of pest card
                return currentPlayer.deck.filter(c => this.rules.bounceCards.includes(c.type)).map(c => new Move('bounce', {
                    cardIndex: currentPlayer.deck.indexOf(c),
                    take: currentPlayer.takeCards
                }));
            return [new Move('take', currentPlayer.takeCards)];
        }

        let playerCards = currentPlayer.deck;
        let topCard = state.activeDeck[state.activeDeck.length - 1];
        let possible = [];

        if (topCard === undefined)
            possible = playerCards;
        else for (let card of playerCards)
            if (card.type === topCard.type || card.color === topCard.color || this.rules.allowedAnywhere.includes(card.type))
                possible.push(card);

        let moves = possible.map(p => new Move('card', playerCards.indexOf(p), p));

        if (moves.length === 1 && possible[0].type === 'Joker')
            moves.push(new Move('take', 1));

        if (moves.length === 0 && currentPlayer.takeIfNoMoves)
            moves.push(new Move('take', this.rules.takeCardsWhenNoMove));

        if (moves.length === 0)
            moves.push(new Move('switch', false));

        return moves;
    }

    isNextTurnMyTurn(state, setTurn, player) {
        let myTurn = state.players.indexOf(player);
        return myTurn === this.nextTurn(state, setTurn);
    }

    nextTurn(state, turn = false) {
        if (turn === false)
            turn = state.turn;
        return (turn + state.players.length * 10 + state.direction) % state.players.length;
    }

    previousTurn(state) {
        return (state.turn + state.players.length - state.direction) % state.players.length;
    }

    shuffle(array) {
        let m = array.length, t, i;

        // While there remain elements to this.shuffle…
        while (m) {

            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);

            // And swap it with the current element.
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }

        return array;
    }
}

export default new Pesten();
