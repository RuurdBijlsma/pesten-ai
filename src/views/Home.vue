<template>
    <div class="home">
        <md-content class="content" :key="updateKey">
            <h1>this.pesten!</h1>
            <!--<p v-for="gameLine in gamePlay">{{gameLine}}</p>-->
            <div class="deck">
                <h2>Deck</h2>
                <p>Top card:</p>
                <card-view :card="this.pesten.state.activeDeck[pesten.state.activeDeck.length - 1]"/>
                <p>Opponent deck size: {{pesten.state.players[computerTurn].deck.length}}</p>
            </div>
            <div class="my-cards">
                <h2>My Cards</h2>
                <div v-for="card in this.pesten.state.players[playerTurn].deck" class="move">
                    <card-view :card="card"/>
                    <md-button
                            v-if="possibleMoves
                                .filter(m => !!m.card)
                                .find(m => m.card.type === card.type && m.card.color === card.color)"
                            @click="playerMove(possibleMoves
                                .filter(m => !!m.card)
                                .find(m => m.card.type === card.type && m.card.color === card.color))"
                            class="md-dense md-primary">Do move
                    </md-button>
                </div>
            </div>
            <div class="possible-moves"
                 v-if="this.pesten.state.turn === playerTurn && possibleMoves.filter(m => !m.card).length > 0">
                <h2>Possible Moves</h2>
                <div v-for="move in possibleMoves.filter(m => !m.card)" class="move">
                    <move-view :move="move"/>
                    <md-button @click="playerMove(move)" class="md-dense md-primary">Do move</md-button>
                </div>
            </div>
        </md-content>

        <md-content>
            <h2>Moves log </h2>
            <p>Newest moves on top</p>
            <p>Computer is player {{computerTurn}}, human is player {{playerTurn}}</p>
            <div v-for="{move, turn} in gameMoves.slice().reverse()" :move="move">
                <h3>Player: {{turn}}</h3>
                <move-view :move="move"/>
            </div>
        </md-content>
    </div>
</template>

<script>
    import MoveView from "@/components/MoveView";
    import CardView from '@/components/CardView';
    import Pesten from "../js/Pesten";

    export default {
        name: 'home',
        components: {MoveView, CardView},
        data() {
            return {
                playerTurn: 0,
                computerTurn: 1,
                gamePlay: [],
                possibleMoves: [],
                pesten: new Pesten(),
                gameMoves: [],
                updateKey: 0
            }
        },
        async mounted() {
            this.playAiGame();
            // return;

            console.log(this.pesten);
            this.pesten.newGame();
            let startTurn = 1;
            this.pesten.state.turn = startTurn;

            if (startTurn === this.computerTurn)
                this.computerPlay();

            this.possibleMoves = this.pesten.possibleMoves(this.pesten.state);

            this.checkWin();
            this.forceUpdate();
        },
        methods: {
            playAiGame(){

                let repeats = 100;
                let smartWins = 0;
                let dumbWins = 0;
                for(let i = 0; i < repeats; i++){
                    let pest = new Pesten();
                    while (true) {
                        if (pest.state.turn === 0)
                            pest.bestMove(pest.state);
                        else
                            pest.randomMove(pest.state);

                        let winner = pest.gameWinner(pest.state);
                        if (winner !== false) {
                            if(winner === 0)
                                smartWins++;
                            else dumbWins++;
                            console.log("Winner is ", winner === 0 ? 'smart' : 'dumb');
                            break;
                        }
                    }
                }
                console.log({smartWins, dumbWins})
            },
            playerMove(move) {
                if (this.pesten.state.turn === this.playerTurn) {
                    this.pesten.doMove(this.pesten.state, move);
                    this.gameMoves.push({turn: this.playerTurn, move});

                    if (this.pesten.state.turn === this.computerTurn)
                        this.computerPlay();

                    if (this.pesten.state.turn === this.playerTurn)
                        this.possibleMoves = this.pesten.possibleMoves(this.pesten.state);

                    this.forceUpdate();
                    this.checkWin();
                }
            },
            computerPlay(log = true) {

                let moves = [];
                while (this.pesten.gameWinner(this.pesten.state) === false && this.pesten.state.turn === this.computerTurn)
                    moves.push(this.pesten.bestMove(this.pesten.state, log));

                moves.forEach(move => this.gameMoves.push({turn: this.computerTurn, move}));

                console.log("computer", moves);
                return moves;
            },
            checkWin() {
                let winner = this.pesten.gameWinner(this.pesten.state);
                if (winner !== false)
                    alert("Player " + winner + " is winner!");
            },
            forceUpdate() {
                this.updateKey++;
            }
        }
    }
</script>

<style scoped>
    .home {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }

    .move {
        display: flex;
        justify-content: left;
    }

    .md-content {
        padding: 25px;
    }
</style>
