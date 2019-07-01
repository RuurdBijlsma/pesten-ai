<template>
    <div class="move-view">
        <card-view :card="move.card" v-if="move.card !== null"></card-view>
        <div v-else>
            <p>{{move.type}} {{move.value}}</p>
        </div>
    </div>
</template>

<script>
    import Move from "@/js/Move";
    import CardView from "@/components/CardView";

    export default {
        name: 'MoveView',
        components: {CardView},
        props: {
            move: Move,
        }
    }
</script>

<style scoped>

</style>
