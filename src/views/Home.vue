<template>
    <div class="home">
        <md-content class="content" :key="updateKey">
            <h1>Pesten!</h1>
            <!--<p v-for="gameLine in gamePlay">{{gameLine}}</p>-->
            <div class="deck">
                <h2>Deck</h2>
                <p>Top card:</p>
                <card-view :card="pesten.state.activeDeck[pesten.state.activeDeck.length - 1]"></card-view>
            </div>
            <div class="my-cards">
                <h2>My Cards</h2>
                <card-view v-for="card in pesten.state.players[playerTurn].deck" :card="card"></card-view>
            </div>
            <div class="possible-moves" v-if="pesten.state.turn === playerTurn">
                <h2>Possible Moves</h2>
                <div v-for="move in possibleMoves" class="move">
                    <move-view :move="move"></move-view>
                    <md-button @click="playerMove(move)" class="md-primary">Do move</md-button>
                </div>
            </div>
        </md-content>

        <md-content>
            <h2>Moves log</h2>
            <p>Computer is player {{computerTurn}}, human is player {{playerTurn}}</p>
            <div v-for="{move, turn} in gameMoves" :move="move">
                <h3>Player: {{turn}}</h3>
                <move-view :move="move"></move-view>
            </div>
        </md-content>
    </div>
</template>

<script>
    import pesten from '@/js/Pesten';
    import MoveView from "@/components/MoveView";
    import CardView from '@/components/CardView';

    console.log(pesten);

    export default {
        name: 'home',
        components: {MoveView, CardView},
        data() {
            return {
                playerTurn: 0,
                computerTurn: 1,
                gamePlay: [],
                possibleMoves: [],
                pesten,
                gameMoves: [],
                updateKey: 0
            }
        },
        async mounted() {
            pesten.newGame();
            let startTurn = 1;
            pesten.state.turn = startTurn;

            if (startTurn === this.computerTurn)
                this.computerPlay();

            this.possibleMoves = pesten.possibleMoves(pesten.state);

            this.checkWin();
            this.forceUpdate();
        },
        methods: {
            playerMove(move) {
                if (pesten.state.turn === this.playerTurn) {
                    pesten.doMove(pesten.state, move);
                    this.gameMoves.push({turn: this.playerTurn, move});

                    if (pesten.state.turn === this.computerTurn)
                        this.computerPlay();

                    if (pesten.state.turn === this.playerTurn)
                        this.possibleMoves = pesten.possibleMoves(pesten.state);

                    this.forceUpdate();
                    this.checkWin();
                }
            },
            computerPlay(log = true) {

                let moves = [];
                while (pesten.gameWinner(pesten.state) === false && pesten.state.turn === this.computerTurn)
                    moves.push(pesten.randomMove(pesten.state, log));

                moves.forEach(move => this.gameMoves.push({turn: this.computerTurn, move}));

                console.log("computer", moves);
                return moves;
            },
            checkWin() {
                let winner = pesten.gameWinner(pesten.state);
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

    .md-content {
        padding: 25px;
    }
</style>
