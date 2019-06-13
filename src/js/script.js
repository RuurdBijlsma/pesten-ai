//todo
//ai strategies
//gui maken

document.addEventListener('DOMContentLoaded', init, false);

function init() {
    pesten = new Pesten();
    let now = performance.now();

    let results = [];
    let n = 100;
    for (let i = 0; i < n; i++)
        results.push(computerPlay(false));

    let wins = Math.round((results.reduce((a, b) => a + b) / n) * 1000) / 10;
    console.log('0', 100 - wins, '1', wins, performance.now() - now);
}

function computerPlay(log = true) {

    pesten.newGame();
    while (pesten.gameWinner(pesten.state) === false)
        pesten.randomMove(pesten.state, log);

    if (log) console.info("THE WINNER IS.............", pesten.gameWinner(pesten.state), "!!!!!!");
    return pesten.gameWinner(pesten.state);
}

