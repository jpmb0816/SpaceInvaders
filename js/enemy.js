class Enemy {
	constructor(x, y, width, height, color, engine) {
		this.engine = engine;

		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;

		this.velX = 0;
		this.velY = 0;
		this.speed = 2;

		this.alive = true;

		this.movements = ["l:50", "r:100", "l:50"];
		this.movementIndex = 0;

		this.origX = this.x;
		this.origY = this.y;
	}

	update() {
		if (this.engine.collide(this, this.engine.player)) {
			this.engine.player.alive = false;
			return;
		}

		this.executeMovements();

		if (this.engine.score <= 0) {
			this.velY = 0.1;
		}
		else {
			this.velY = 0.1 + (this.engine.score / (this.engine.scorePoints * 100)) * 0.5;
		}

		this.x += this.velX;
		this.y += this.velY;

		if (this.y + this.height > this.engine.MAX_HEIGHT) {
			this.alive = false;
			this.engine.player.alive = false;
			return;
		}
	}

	render(ctx) {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);

		ctx.strokeStyle = "white";
		ctx.strokeRect(this.x, this.y, this.width, this.height);
	}

	executeMovements() {
		if (this.movementIndex < this.movements.length) {
			let currentMove = this.movements[this.movementIndex].split(":");

			switch(currentMove[0]) {
				case "l":
					if (this.x === this.origX - parseInt(currentMove[1])) {
						this.origX = this.x;
						this.movementIndex++;
					}
					else {
						this.velX = -this.speed;
					}
					break;

				case "r":
					if (this.x === this.origX + parseInt(currentMove[1])) {
						this.origX = this.x;
						this.movementIndex++;
					}
					else {
						this.velX = this.speed;
					}
					break;
			}
		}
		else {
			this.movementIndex = 0;
		}
	}
}