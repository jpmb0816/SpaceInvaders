class Laser {
	constructor(engine, width, color) {
		this.engine = engine;
		this.user = this.engine.player;
		this.x = 0;
		this.y = 0;
		this.height = 0;
		this.width = width;
		this.color = color;

		this.update();
	}

	update() {
		this.x = this.user.x + ((this.user.width / 2) - (this.width / 2));
		this.y = 0;
		this.height = this.user.y;

		let enemies = this.engine.enemies;

		for (let i = 0; i < enemies.length; i++) {
			if (this.engine.collide(this, enemies[i])) {
				enemies[i].alive = false;
				enemies.splice(i, 1);
				this.engine.score += this.engine.scorePoints;
				break;
			}
		}
	}

	render(ctx) {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}