<template>
    <div class="card-view">
        <p>{{symbol}} {{card.type}}</p>
    </div>
</template>

<script>
    import Card from "@/js/Card";

    export default {
        name: 'CardView',
        props: {
            card: Card,
        },
        computed:{
            symbol(){
                switch(this.card.color){
                    case 'spades':
                        return '♠';
                    case 'clubs':
                        return '♣';
                    case 'hearts':
                        return '♥';
                    case 'diamonds':
                        return '♦';
                }
                return 'X';
            }
        }
    }
</script>

<style scoped>

</style>
