$(function() {
	// Vars
	var pointsA02 = [],
		pointsB02 = [],
		$canvas02 = null,
		canvas02 = null,
		context0202 = null,
		vars02 = null,
		points02 = 8,
		viscosity02 = 20,
		mouseDist02 = 70,
		damping02 = 0.05,
		showIndicators02 = false;
		mouseX02 = 0,
		mouseY02 = 0,
		relMouseX02 = 0,
		relMouseY02 = 0,
		mouseLastX02 = 0,
		mouseLastY02 = 0,
		mouseDirectionX02 = 0,
		mouseDirectionY02 = 0,
		mouseSpeedX02 = 0,
		mouseSpeedY02 = 0;

	/**
	 * Get mouse direction
	 */
	function mouseDirection02(e) {
		if (mouseX02 < e.pageX)
			mouseDirectionX02 = 1;
		else if (mouseX02 > e.pageX)
			mouseDirectionX02 = -1;
		else
			mouseDirectionX02 = 0;

		if (mouseY02 < e.pageY)
			mouseDirectionY02 = 1;
		else if (mouseY02 > e.pageY)
			mouseDirectionY02 = -1;
		else
			mouseDirectionY02 = 0;

		mouseX02 = e.pageX;
		mouseY02 = e.pageY;

		relMouseX02 = (mouseX02 - $canvas02.offset().left);
		relMouseY02 = (mouseY02 - $canvas02.offset().top);
	}
	$(document).on('mousemove', mouseDirection02);

	/**
	 * Get mouse speed
	 */
	function mouseSpeed02() {
		mouseSpeedX02 = mouseX02 - mouseLastX02;
		mouseSpeedY02 = mouseY02 - mouseLastY02;

		mouseLastX02 = mouseX02;
		mouseLastY02 = mouseY02;

		setTimeout(mouseSpeed02, 50);
	}
	mouseSpeed02();

	/**
	 * Init button
	 */
	function initButton02() {
		// Get button
		var button02 = $('.btn-liquid02');
		var buttonWidth02 = button02.width();
		var buttonHeight02 = button02.height();

		// Create canvas
		$canvas02 = $('<canvas></canvas>');
		button02.append($canvas02);

		canvas02 = $canvas02.get(0);
		canvas02.width = buttonWidth02+100;
		canvas02.height = buttonHeight02+100;
		context02 = canvas02.getContext('2d');

		// Add points

		var x = buttonHeight02/2;
		for(var j = 1; j < points02; j++) {
			addPoints((x+((buttonWidth02-buttonHeight02)/points02)*j), 0);
		}
		addPoints(buttonWidth02-buttonHeight02/5, 0);
		addPoints(buttonWidth02+buttonHeight02/10, buttonHeight02/2);
		addPoints(buttonWidth02-buttonHeight02/5, buttonHeight02);
		for(var j = points02-1; j > 0; j--) {
			addPoints((x+((buttonWidth02-buttonHeight02)/points02)*j), buttonHeight02);
		}
		addPoints(buttonHeight02/5, buttonHeight02);

		addPoints(-buttonHeight02/10, buttonHeight02/2);
		addPoints(buttonHeight02/5, 0);
		// addPoints(x, 0);
		// addPoints(0, buttonHeight02/2);

		// addPoints(0, buttonHeight02/2);
		// addPoints(buttonHeight02/4, 0);

		// Start render
		renderCanvas02();
	}

	/**
	 * Add points
	 */
	function addPoints(x, y) {
		pointsA02.push(new Point(x, y, 1));
		pointsB02.push(new Point(x, y, 2));
	}

	/**
	 * Point
	 */
	function Point(x, y, level) {
	  this.x = this.ix = 50+x;
	  this.y = this.iy = 50+y;
	  this.vx = 0;
	  this.vy = 0;
	  this.cx1 = 0;
	  this.cy1 = 0;
	  this.cx2 = 0;
	  this.cy2 = 0;
	  this.level = level;
	}

	Point.prototype.move = function() {
		this.vx += (this.ix - this.x) / (viscosity02*this.level);
		this.vy += (this.iy - this.y) / (viscosity02*this.level);

		var dx = this.ix - relMouseX02,
			dy = this.iy - relMouseY02;
		var relDist = (1-Math.sqrt((dx * dx) + (dy * dy))/mouseDist02);

		// Move x
		if ((mouseDirectionX02 > 0 && relMouseX02 > this.x) || (mouseDirectionX02 < 0 && relMouseX02 < this.x)) {
			if (relDist > 0 && relDist < 1) {
				this.vx = (mouseSpeedX02 / 4) * relDist;
			}
		}
		this.vx *= (1 - damping02);
		this.x += this.vx;

		// Move y
		if ((mouseDirectionY02 > 0 && relMouseY02 > this.y) || (mouseDirectionY02 < 0 && relMouseY02 < this.y)) {
			if (relDist > 0 && relDist < 1) {
				this.vy = (mouseSpeedY02 / 4) * relDist;
			}
		}
		this.vy *= (1 - damping02);
		this.y += this.vy;
	};


	/**
	 * Render canvas
	 */
	function renderCanvas02() {
		// rAF
		rafID02 = requestAnimationFrame(renderCanvas02);

		// Clear scene
		context02.clearRect(0, 0, $canvas02.width(), $canvas02.height());
		context02.fillStyle = 'rgba(255, 255, 255, 0)';
		context02.fillRect(0, 0, $canvas02.width(), $canvas02.height());

		// Move points
		for (var i = 0; i <= pointsA02.length - 1; i++) {
			pointsA02[i].move();
			pointsB02[i].move();
		}

		// Create dynamic gradient
		var gradientX02 = Math.min(Math.max(mouseX02 - $canvas02.offset().left, 0), $canvas02.width());
		var gradientY02 = Math.min(Math.max(mouseY02 - $canvas02.offset().top, 0), $canvas02.height());
		var distance02 = Math.sqrt(Math.pow(gradientX02 - $canvas02.width()/2, 2) + Math.pow(gradientY02 - $canvas02.height()/2, 2)) / Math.sqrt(Math.pow($canvas02.width()/2, 2) + Math.pow($canvas02.height()/2, 2));

		var gradient02 = context02.createRadialGradient(gradientX02, gradientY02, 300+(300*distance02), gradientX02, gradientY02, 0);
		gradient02.addColorStop(0, '#FF583B');
		gradient02.addColorStop(1, '#FF583B');

		// Draw shapes
		var groups02 = [pointsA02, pointsB02]

		for (var j = 0; j <= 1; j++) {
			var points02 = groups02[j];

			if (j == 0) {
				// Background style
				context02.fillStyle = '#FF9A88';
			} else {
				// Foreground style
				context02.fillStyle = gradient02;
			}

			context02.beginPath();
			context02.moveTo(points02[0].x, points02[0].y);

			for (var i = 0; i < points02.length; i++) {
				var p02 = points02[i];
				var nextP02 = points02[i + 1];
				var val02 = 30*0.552284749831;

				if (nextP02 != undefined) {
					// if (nextP02.ix > p.ix && nextP02.iy < p.iy) {
					// 	p.cx1 = p.x;
					// 	p.cy1 = p.y-val;
					// 	p.cx2 = nextP02.x-val;
					// 	p.cy2 = nextP02.y;
					// } else if (nextP02.ix > p.ix && nextP02.iy > p.iy) {
					// 	p.cx1 = p.x+val;
					// 	p.cy1 = p.y;
					// 	p.cx2 = nextP02.x;
					// 	p.cy2 = nextP02.y-val;
					// }  else if (nextP02.ix < p.ix && nextP02.iy > p.iy) {
					// 	p.cx1 = p.x;
					// 	p.cy1 = p.y+val;
					// 	p.cx2 = nextP02.x+val;
					// 	p.cy2 = nextP02.y;
					// } else if (nextP02.ix < p.ix && nextP02.iy < p.iy) {
					// 	p.cx1 = p.x-val;
					// 	p.cy1 = p.y;
					// 	p.cx2 = nextP02.x;
					// 	p.cy2 = nextP02.y+val;
					// } else {

						p02.cx1 = (p02.x+nextP02.x)/2;
						p02.cy1 = (p02.y+nextP02.y)/2;
						p02.cx2 = (p02.x+nextP02.x)/2;
						p02.cy2 = (p02.y+nextP02.y)/2;

						context02.bezierCurveTo(p02.x, p02.y, p02.cx1, p02.cy1, p02.cx1, p02.cy1);
					// 	continue;
					// }

					// context02.bezierCurveTo(p.cx1, p.cy1, p.cx2, p.cy2, nextP02.x, nextP02.y);
				} else {
nextP02 = points02[0];
						p02.cx1 = (p02.x+nextP02.x)/2;
						p02.cy1 = (p02.y+nextP02.y)/2;

						context02.bezierCurveTo(p02.x, p02.y, p02.cx1, p02.cy1, p02.cx1, p02.cy1);
				}
			}

			// context02.closePath();
			context02.fill();
		}

		if (showIndicators02) {
			// Draw points
			context02.fillStyle = '#000';
			context02.beginPath();
			for (let i = 0; i < pointsA02.length; i++) {
				var p = pointsA02[i];

				context02.rect(p.x - 1, p.y - 1, 2, 2);
			}
			context02.fill();

			// Draw controls
			context02.fillStyle = '#f00';
			context02.beginPath();
			for (var i = 0; i < pointsA02.length; i++) {
				var p = pointsA02[i];

				context02.rect(p.cx1 - 1, p.cy1 - 1, 2, 2);
				context02.rect(p.cx2 - 1, p.cy2 - 1, 2, 2);
			}
			context02.fill();
		}
	}

	// Init
	initButton02();
});