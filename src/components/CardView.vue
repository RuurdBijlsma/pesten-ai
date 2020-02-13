<template>
    <div class="card-view" v-if="card">
        <div class="center-y">
            <div class="center-x">
                <img v-if="hidden" :src="cardBackImage()" alt="Card image">
                <img v-else :src="card.getImage()" alt="Card image">
            </div>
        </div>
    </div>
</template>

<script>
    const backCardColors = ['purple', 'blue', 'gray', 'green', 'red', 'yellow'];
    const backCardColor = backCardColors[Math.floor(Math.random() * backCardColors.length)];
    import Card from "@/js/Card";

    export default {
        name: 'CardView',
        props: {
            card: {
                type: Card,
                default: () => new Card('spades', 'A')
            },
            hidden: {
                type: Boolean,
                default: false,
            }
        },
        methods: {
            cardBackImage() {
                return `./img/cards2/${backCardColor}_back.png`;
            }
        }
    }
</script>

<style scoped>
    .card-view {

    }

    img {
        box-shadow: 0 0 25px 0px rgba(0, 0, 0, 0.15);
        pointer-events: none;
    }

    .center-x, .center-y {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        /*pointer-events: none;*/
    }

    .center-x {
        flex-direction: column;
    }

    .center-y {
        flex-direction: column;
    }
</style>
