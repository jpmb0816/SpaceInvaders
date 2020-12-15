const game = new GameEngine();
let keypress = [];
let globalName = "";

function render() {
	requestAnimationFrame(render);
	game.render();
	game.update();
}

document.addEventListener('keydown', (e) => {
	keypress[e.keyCode] = true;

	if (game.recentlyStarted) {
		if (e.keyCode === 8) {
			globalName = globalName.substring(0, globalName.length - 1);
		}
		else if (globalName.length < 17 && e.key.length === 1 || e.keyCode === 32) {
			globalName += e.key;
		}
	}
});

document.addEventListener('keyup', (e) => {
	keypress[e.keyCode] = false;
});

render();