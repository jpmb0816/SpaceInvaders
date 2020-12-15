class Player {
	constructor(name, x, y, width, height, color, engine) {
		this.engine = engine;

		this.name = name;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;

		this.velX = 0;
		this.velY = 0;
		this.speed = 4;

		this.alive = true;

		this.bullets = [];
		this.bulletDelay = 10;
		this.bulletTimer = this.bulletDelay;

		this.bulletWidth = 4;
		this.bulletHeight = 20;
		this.bulletColor = "white";

		this.bulletLimit = 20;
		this.bulletCount = this.bulletLimit;
		this.bulletReloadDelay = 5;
		this.bulletReloadTimer = this.bulletReloadDelay;
		this.reloading = false;

		this.laser = null;
		this.laserEnergy = 0;
		this.laserEnergyPoints = 5;
		this.laserEnergyLimit = 200;
		this.laserDraining = false;

		this.alpha = 1;
		this.alphaValue = 0.05;
		this.alphaDir = -this.alphaValue;
	}

	update() {
		for (let i = 0; i < this.bullets.length; i++) {
			this.bullets[i].update();
		}

		this.removeDeadBullets();

		this.x += this.velX;
		this.y += this.velY;

		if (this.x < 0) {
			this.x = 0;
		}
		else if (this.x + this.width > this.engine.MAX_WIDTH) {
			this.x = this.engine.MAX_WIDTH - this.width;
		}

		if (this.y < 0) {
			this.y = 0;
		}
		else if (this.y + this.height > this.engine.MAX_HEIGHT) {
			this.y = this.engine.MAX_HEIGHT - this.height;
		}

		if (this.laser) {
			this.laser.update();
		}

		this.checkKeyPress();
	}

	render(ctx) {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);

		ctx.strokeStyle = "white";
		ctx.strokeRect(this.x, this.y, this.width, this.height);

		for (let i = 0; i < this.bullets.length; i++) {
			this.bullets[i].render(ctx);
		}

		if (this.laser) {
			ctx.globalAlpha = this.alpha;

			this.laser.render(ctx);

			if (this.alpha !== 1) {
				ctx.globalAlpha = 1;
			}
		}

		this.engine.renderText(this.name, this.x + (this.width / 2), this.y - 10, "white", "center", "15px san-serif");
	}

	checkKeyPress() {
		if (keypress[37] || keypress[65]) {
			this.velX = -this.speed;
		}
		else if (keypress[39] || keypress[68]) {
			this.velX = this.speed;
		}
		else {
			this.velX = 0;
		}

		if (keypress[38] || keypress[87]) {
			this.velY = -this.speed;
		}
		else if (keypress[40] || keypress[83]) {
			this.velY = this.speed;
		}
		else {
			this.velY = 0;
		}

		if (keypress[82] && this.bulletCount < this.bulletLimit) {
			this.reloading = true;
		}
		if (this.reloading) {
			if (keypress[32]) {
				this.reloading = false;
				this.bulletReloadTimer = 0;
			}
			else if (this.bulletCount === this.bulletLimit && this.bulletReloadTimer === 0) {
				this.reloading = false;
			}
			else if (this.bulletReloadTimer === 0) {
				this.bulletReloadTimer = this.bulletReloadDelay;
				this.bulletCount++;
			}
			else {
				this.bulletReloadTimer--;
			}
		}
		
		if (this.laserDraining) {
			if (this.laserEnergy === 0) {
				this.laserDraining = false;
				this.laser = null;
				this.alpha = 1;
			}
			else if (this.laserEnergy > 0) {
				if (keypress[32]) {
					if (!this.laser) {
						this.laser = new Laser(this.engine, this.bulletWidth, "orange");
					}

					if (this.alpha < 0.1) {
						this.alphaDir = this.alphaValue;
					}
					else if (this.alpha > 1) {
						this.alphaDir = -this.alphaValue;
					}

					this.alpha += this.alphaDir;
				}
				else {
					this.laser = null;
					this.alpha = 1;
				}

				this.laserEnergy -= 0.5;
			}
			else if (this.laserEnergy < 0) {
				this.laserEnergy = 0;
				this.alpha = 1;
			}
		}
		else if (keypress[32] && this.laserEnergy >= this.laserEnergyLimit) {
			this.laserDraining = true;
		}
		else if (keypress[32] && this.bulletTimer === this.bulletDelay && !this.reloading && this.bulletCount > 0) {
			this.bullets.push(new Bullet(this.x + ((this.width / 2) - (this.bulletWidth / 2)), this.y - this.bulletHeight, this.bulletWidth, this.bulletHeight, this.bulletColor, this.engine));
			this.bulletTimer = 0;
			this.bulletCount--;
		}
		else if (this.bulletTimer < this.bulletDelay) {
			this.bulletTimer++;
		}
		else if (this.bulletTimer > this.bulletDelay) {
			this.bulletTimer = this.bulletDelay;
		}
	}

	removeDeadBullets() {
		for (let i = this.bullets.length - 1; i >= 0; i--) {
			if (!this.bullets[i].alive) {
				this.bullets.splice(i, 1);
			}
		}
	}
}