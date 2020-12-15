class Bullet {
	constructor(x, y, width, height, color, engine) {
		this.engine = engine;

		this.x = x;
		this.y = y;
		this.height = height;
		this.width = width;
		this.color = color;

		this.velY = -4;
		this.alive = true;
	}

	update() {
		this.y += this.velY;

		if (this.y < -this.height) {
			this.alive = false;
		}
		else {
			let enemies = this.engine.enemies;

			for (let i = 0; i < enemies.length; i++) {
				if (this.engine.collide(this, enemies[i])) {
					enemies[i].alive = false;
					enemies.splice(i, 1);
					this.engine.score += this.engine.scorePoints;

					if (this.engine.player.laserEnergy < this.engine.player.laserEnergyLimit && !this.engine.player.laserDraining) {
						this.engine.player.laserEnergy += this.engine.player.laserEnergyPoints;
					}
					
					break;
				}
			}
		}
	}

	render(ctx) {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}