<template>
    <div class="home">
        <md-content class="content">
            <h1>Pesten!</h1>
            <p v-for="gameLine in gamePlay">{{gameLine}}</p>
        </md-content>
    </div>
</template>

<script>
    import pesten from '@/js/Pesten';
    import Card from "@/js/Card";

    export default {
        name: 'home',
        components: {},
        data() {
            return {
                gamePlay: ''
            }
        },
        async mounted() {
            this.computerPlay();
        },
        methods: {
            computerPlay(log = true) {

                pesten.newGame();
                let moveStrings = [];
                while (pesten.gameWinner(pesten.state) === false)
                    moveStrings.push(pesten.randomMove(pesten.state, log));

                moveStrings.push(["THE WINNER IS.............", pesten.gameWinner(pesten.state), "!!!!!!"]);

                this.gamePlay = moveStrings.map(a => a.map(p => p instanceof Card ? JSON.stringify(p) : p).join(' '));
            }
        }
    }
</script>

<style scoped>
    .content {
        max-width:500px;
        width:100%;
        margin:0 auto;
        margin-top:50px;
        padding: 25px;
    }
</style>
