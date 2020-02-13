let id = 0;

export default class Card {
    constructor(color, type) {
        this.color = color;
        this.type = type;
        this.id = Card.getId();
    }

    static getId() {
        return id++;
    }

    getImage() {
        let color = this.color;
        const nameTransforms = {
            '2': `2_of_${color}`,
            '3': `3_of_${color}`,
            '4': `4_of_${color}`,
            '5': `5_of_${color}`,
            '6': `6_of_${color}`,
            '7': `7_of_${color}`,
            '8': `8_of_${color}`,
            '9': `9_of_${color}`,
            '10': `10_of_${color}`,
            'J': `2_of_${color}`,
            'Q': `queen_of_${color}`,
            'K': `king_of_${color}`,
            'A': `ace_of_${color}`,
            'Joker': color === 'hearts' || color === 'diamonds' ? 'red_joker' : 'black_joker',
        };
        let name = nameTransforms[this.type];
        if (name === undefined)
            console.warn("Undefined name", this);
        return `./img/cards2/${name}.png`;
    }
}
