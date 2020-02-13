export default class Move {
    constructor(type, value, card = null) {
        this.type = type;
        this.value = value;
        this.card = card;
        this.id = Move.getId();
    }

    static getId() {
        Move._id = (Move._id || -1) + 1;
        return Move._id;
    }
}
