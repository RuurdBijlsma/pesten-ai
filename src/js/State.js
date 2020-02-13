import Player from "@/js/Player";

export default class State {
    constructor(playerCount = 2) {
        this.activeDeck = [];
        this.backupDeck = [];
        this.players = [...new Array(playerCount)].map(() => new Player);
        this.turn = 0;
        this.direction = 1;
    }

    get topCard(){
        return this.activeDeck[this.activeDeck.length - 1];
    }
}
