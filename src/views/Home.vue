<template>
    <div class="home">
        <div class="my-cards card-collection">
            <card-view
                    class="card"
                    v-for="card in pesten.state.players[playerTurn].deck"
                    :key="card.id"
                    :card="card"
                    @click.native="playCard"
            />
        </div>
        <div class="table-top">
            <div class="deck">
                <card-view class="card backup" :hidden="true"/>
                <card-view class="card top-card" :card="pesten.state.topCard"/>
            </div>
        </div>
        <div class="opponent-cards card-collection">
            <card-view
                    :hidden="true"
                    class="card"
                    v-for="card in pesten.state.players[computerTurn].deck"
                    :key="card.id"
                    :card="card"
                    @click.native="playCard"
            />
        </div>
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
            // this.playAiGame();
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
            playCard(e) {
                console.log(e.target)
            },
            playAiGame() {

                let repeats = 100;
                let smartWins = 0;
                let dumbWins = 0;
                for (let i = 0; i < repeats; i++) {
                    let pest = new Pesten();
                    while (true) {
                        if (pest.state.turn === 0)
                            pest.bestMove(pest.state);
                        else
                            pest.randomMove(pest.state);

                        let winner = pest.gameWinner(pest.state);
                        if (winner !== false) {
                            if (winner === 0)
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

    .card {
        width: 100px;
        height: 100%;
        display: inline-block;
    }

    .card-collection {
        height: 200px;
        overflow-x: auto;
        white-space: nowrap;
        padding: 10px 10px 10px 60px;
    }

    .card-collection .card {
        margin-left: -50px;
    }

    .table-top {
        position: fixed;
        height: calc(100% - 400px);
        width: 100%;
        background-color: green;
        top: 200px;
        box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.3);
    }

    .deck {
        display: flex;
    }

    .opponent-cards {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        padding-left: 90px;
    }

    .opponent-cards .card {
        margin-left: -80px;
        transform: rotate(6deg);
    }

    .my-cards {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
    }
</style>
