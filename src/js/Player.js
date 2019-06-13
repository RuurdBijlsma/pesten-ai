export default class Player {
    constructor() {
        this.deck = [];
        this.takeIfNoMoves = true;
        this.takeCards = 0;
        this.canPlayAfterTake = true;
        this.changeColor = false;
    }
}
