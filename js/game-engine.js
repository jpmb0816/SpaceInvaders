class GameEngine {
	constructor() {
		this.title = 'Space Invaders';
		this.author = 'JP Beyong';

		this.MAX_WIDTH = 600;
		this.MAX_HEIGHT = 600;

		this.centerX = Math.floor(this.MAX_WIDTH / 2);
		this.centerY = Math.floor(this.MAX_HEIGHT / 2);

		this.BG_COLOR = "black";
		this.defaultFont = "30px san-serif";

		this.canvas = null;
		this.ctx = null;

		this.score = 0;
		this.scorePoints = 100;
		this.highscore = this.score;

		this.player = null;
		this.enemies = [];

		this.enemySpawnDelay = 50;
		this.enemySpawnTimer = this.enemySpawnDelay;

		this.recentlyStarted = true;

		this.createCanvas(this.MAX_WIDTH, this.MAX_HEIGHT);
	}

	// Main Functions

	init() {
		this.player = new Player(globalName, this.centerX - 20, this.MAX_HEIGHT - 40, 40, 40, "yellow", this);
	}

	update() {
		if (!this.recentlyStarted && this.player.alive) {
			this.createEnemy();
			this.player.update();

			for (let i = 0; i < this.enemies.length; i++) {
				this.enemies[i].update();
			}

			this.removeDeadEnemies();
		}
	}

	render() {
		this.renderBackgroundScreen();

		if (this.recentlyStarted) {
			this.renderStartingScreen();
		}
		else if (this.player && this.player.alive) {
			this.renderInGameScreen();
		}
		else {
			this.renderPlayAgainScreen();
		}
	}

	// Render Screen Functions

	renderBackgroundScreen() {
		this.ctx.fillStyle = this.BG_COLOR;
		this.ctx.fillRect(0, 0, this.MAX_WIDTH, this.MAX_HEIGHT);
	}

	renderStartingScreen() {
		this.renderText(this.title, this.centerX, 240, 'white', 'center');
		this.renderText('By: ' + this.author, this.centerX, 270, 'white', 'center');

		if (globalName.length === 0) {
			this.renderText('{Please enter your name}', this.centerX, 320, 'yellow', 'center', '15px san-serif');
		}
		else {
			this.renderText(globalName, this.centerX, 320, 'yellow', 'center', '15px san-serif');
		}

		this.renderText('[Press Enter to Play]', this.centerX, 340, 'white', 'center', '15px san-serif');

		if (keypress[13] && globalName.length > 0) {
			this.recentlyStarted = false;
			this.init();
		}
	}

	renderInGameScreen() {
		for (let i = 0; i < this.enemies.length; i++) {
			this.enemies[i].render(this.ctx);
		}

		this.player.render(this.ctx);
		this.renderText(this.score, 40, 50, "white");

		for (let i = 1; i <= this.player.bulletCount; i++) {
			this.ctx.fillStyle = "yellow";
			this.ctx.fillRect(32 + (8 * i), 60, 4, 20);
		}

		for (let i = this.player.bulletCount + 1; i <= this.player.bulletLimit; i++) {
			this.ctx.fillStyle = "white";
			this.ctx.fillRect(32 + (8 * i), 60, 4, 20);
		}

		if (this.player.reloading) {
			this.renderText("RELOADING...", 40, 100, "white", "left", "15px san-serif");
		}
		else if (this.player.bulletCount === 0) {
			this.renderText("NO AMMO!", 40, 100, "white", "left", "15px san-serif");
		}

		this.ctx.globalAlpha = 0.6;

		this.ctx.fillStyle = "white";
		this.ctx.fillRect(this.MAX_WIDTH - 20, 100, 10, this.player.laserEnergyLimit * 2);

		this.ctx.fillStyle = "orange";
		this.ctx.fillRect(this.MAX_WIDTH - 20, 500 - (this.player.laserEnergy * 2), 10, this.player.laserEnergy * 2);
		
		this.ctx.globalAlpha = 1;
	}

	renderPlayAgainScreen() {
		if (this.score > this.highscore) {
			this.highscore = this.score;
		}

		this.renderText('Score: ' + this.score, this.centerX, 220, 'white', 'center');
		this.renderText('High Score: ' + this.highscore, this.centerX, 270, 'white', 'center');
		this.renderText('You died ' + globalName, this.centerX, 320, 'yellow', 'center', '15px san-serif');
		this.renderText('[Press Enter to Play Again]', this.centerX, 350, 'white', 'center', '15px san-serif');

		if (keypress[13]) {
			this.score = 0;
			this.enemies = [];
			this.init();
		}
	}

	// Canvas Functions

	createCanvas(width, height) {
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');

		this.canvas.width = width;
		this.canvas.height = height;

		document.body.appendChild(this.canvas);
	}

	renderText(text, x, y, color, alignment, font) {
		if (font === undefined) {
			font = this.defaultFont;
		}

		if (alignment === 'center') {
			this.ctx.textBaseline = 'middle';
			this.ctx.textAlign = 'center';
		}

		this.ctx.font = font;
		this.ctx.fillStyle = color;
		this.ctx.fillText(text, x, y);

		if (alignment === 'center') {
			this.ctx.textBaseline = 'alphabetic';
			this.ctx.textAlign = 'start';
		}
	}

	// Special Functions

	collide(a, b) {
		if (a.x < b.x + b.width && a.x + a.width > b.x) {
			if (a.y < b.y + b.height && a.y + a.height > b.y) {
				return true;
			}
		}

		return false;
	}

	randRange(min, max) {
		return Math.floor((Math.random() * (max - min)) + min);
	}

	createEnemy() {
		if (this.enemySpawnTimer === this.enemySpawnDelay) {
			this.enemies.push(new Enemy(this.randRange(50, this.MAX_WIDTH - 50), 0, 40, 40, "red", this));
			this.enemySpawnTimer = 0;
		}
		else if (this.enemySpawnTimer < this.enemySpawnDelay) {
			this.enemySpawnTimer++;
		}
		else if (this.enemySpawnTimer > this.enemySpawnDelay) {
			this.enemySpawnTimer = this.enemySpawnDelay;
		}
	}

	removeDeadEnemies() {
		for (let i = this.enemies.length - 1; i >= 0; i--) {
			if (!this.enemies[i].alive) {
				this.enemies.splice(i, 1);
			}
		}
	}
}