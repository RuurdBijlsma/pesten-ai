<template>
    <div class="card-view" v-if="card">
        <p><span :style="`color: ${symbol.color}`">{{symbol.string}}</span> {{card.type}}</p>
    </div>
</template>

<script>
    import Card from "@/js/Card";

    export default {
        name: 'CardView',
        props: {
            card: Card,
        },
        computed: {
            symbol() {
                if (this.card)
                    switch (this.card.color) {
                        case 'spades':
                            return {color: 'black', string: '♠'};
                        case 'clubs':
                            return {color: 'black', string: '♣'};
                        case 'hearts':
                            return {color: 'red', string: '♥'};
                        case 'diamonds':
                            return {color: 'red', string: '♦'};
                    }
                return 'X';
            }
        }
    }
</script>

<style scoped>

</style>
