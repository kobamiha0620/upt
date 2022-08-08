$(function() {
	// Vars
	var pointsA03 = [],
		pointsB03 = [],
		$canvas03 = null,
		canvas03 = null,
		context0303 = null,
		vars03 = null,
		points03 = 8,
		viscosity03 = 20,
		mouseDist03 = 70,
		damping03 = 0.05,
		showIndicators03 = false;
		mouseX03 = 0,
		mouseY03 = 0,
		relMouseX03 = 0,
		relMouseY03 = 0,
		mouseLastX03 = 0,
		mouseLastY03 = 0,
		mouseDirectionX03 = 0,
		mouseDirectionY03 = 0,
		mouseSpeedX03 = 0,
		mouseSpeedY03 = 0;

	/**
	 * Get mouse direction
	 */
	function mouseDirection03(e) {
		if (mouseX03 < e.pageX)
			mouseDirectionX03 = 1;
		else if (mouseX03 > e.pageX)
			mouseDirectionX03 = -1;
		else
			mouseDirectionX03 = 0;

		if (mouseY03 < e.pageY)
			mouseDirectionY03 = 1;
		else if (mouseY03 > e.pageY)
			mouseDirectionY03 = -1;
		else
			mouseDirectionY03 = 0;

		mouseX03 = e.pageX;
		mouseY03 = e.pageY;

		relMouseX03 = (mouseX03 - $canvas03.offset().left);
		relMouseY03 = (mouseY03 - $canvas03.offset().top);
	}
	$(document).on('mousemove', mouseDirection03);

	/**
	 * Get mouse speed
	 */
	function mouseSpeed03() {
		mouseSpeedX03 = mouseX03 - mouseLastX03;
		mouseSpeedY03 = mouseY03 - mouseLastY03;

		mouseLastX03 = mouseX03;
		mouseLastY03 = mouseY03;

		setTimeout(mouseSpeed03, 50);
	}
	mouseSpeed03();

	/**
	 * Init button
	 */
	function initButton03() {
		// Get button
		var button03 = $('.btn-liquid03');
		var buttonWidth03 = button03.width();
		var buttonHeight03 = button03.height();

		// Create canvas
		$canvas03 = $('<canvas></canvas>');
		button03.append($canvas03);

		canvas03 = $canvas03.get(0);
		canvas03.width = buttonWidth03+100;
		canvas03.height = buttonHeight03+100;
		context03 = canvas03.getContext('2d');

		// Add points

		var x = buttonHeight03/2;
		for(var j = 1; j < points03; j++) {
			addPoints((x+((buttonWidth03-buttonHeight03)/points03)*j), 0);
		}
		addPoints(buttonWidth03-buttonHeight03/5, 0);
		addPoints(buttonWidth03+buttonHeight03/10, buttonHeight03/2);
		addPoints(buttonWidth03-buttonHeight03/5, buttonHeight03);
		for(var j = points03-1; j > 0; j--) {
			addPoints((x+((buttonWidth03-buttonHeight03)/points03)*j), buttonHeight03);
		}
		addPoints(buttonHeight03/5, buttonHeight03);

		addPoints(-buttonHeight03/10, buttonHeight03/2);
		addPoints(buttonHeight03/5, 0);
		// addPoints(x, 0);
		// addPoints(0, buttonHeight03/2);

		// addPoints(0, buttonHeight03/2);
		// addPoints(buttonHeight03/4, 0);

		// Start render
		renderCanvas03();
	}

	/**
	 * Add points
	 */
	function addPoints(x, y) {
		pointsA03.push(new Point(x, y, 1));
		pointsB03.push(new Point(x, y, 2));
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
		this.vx += (this.ix - this.x) / (viscosity03*this.level);
		this.vy += (this.iy - this.y) / (viscosity03*this.level);

		var dx = this.ix - relMouseX03,
			dy = this.iy - relMouseY03;
		var relDist = (1-Math.sqrt((dx * dx) + (dy * dy))/mouseDist03);

		// Move x
		if ((mouseDirectionX03 > 0 && relMouseX03 > this.x) || (mouseDirectionX03 < 0 && relMouseX03 < this.x)) {
			if (relDist > 0 && relDist < 1) {
				this.vx = (mouseSpeedX03 / 4) * relDist;
			}
		}
		this.vx *= (1 - damping03);
		this.x += this.vx;

		// Move y
		if ((mouseDirectionY03 > 0 && relMouseY03 > this.y) || (mouseDirectionY03 < 0 && relMouseY03 < this.y)) {
			if (relDist > 0 && relDist < 1) {
				this.vy = (mouseSpeedY03 / 4) * relDist;
			}
		}
		this.vy *= (1 - damping03);
		this.y += this.vy;
	};


	/**
	 * Render canvas
	 */
	function renderCanvas03() {
		// rAF
		rafID03 = requestAnimationFrame(renderCanvas03);

		// Clear scene
		context03.clearRect(0, 0, $canvas03.width(), $canvas03.height());
		context03.fillStyle = 'rgba(255, 255, 255, 0)';
		context03.fillRect(0, 0, $canvas03.width(), $canvas03.height());

		// Move points
		for (var i = 0; i <= pointsA03.length - 1; i++) {
			pointsA03[i].move();
			pointsB03[i].move();
		}

		// Create dynamic gradient
		var gradientX03 = Math.min(Math.max(mouseX03 - $canvas03.offset().left, 0), $canvas03.width());
		var gradientY03 = Math.min(Math.max(mouseY03 - $canvas03.offset().top, 0), $canvas03.height());
		var distance03 = Math.sqrt(Math.pow(gradientX03 - $canvas03.width()/2, 2) + Math.pow(gradientY03 - $canvas03.height()/2, 2)) / Math.sqrt(Math.pow($canvas03.width()/2, 2) + Math.pow($canvas03.height()/2, 2));

		var gradient03 = context03.createRadialGradient(gradientX03, gradientY03, 300+(300*distance03), gradientX03, gradientY03, 0);
		gradient03.addColorStop(0, '#FF583B');
		gradient03.addColorStop(1, '#FF583B');

		// Draw shapes
		var groups03 = [pointsA03, pointsB03]

		for (var j = 0; j <= 1; j++) {
			var points03 = groups03[j];

			if (j == 0) {
				// Background style
				context03.fillStyle = '#FF9A88';
			} else {
				// Foreground style
				context03.fillStyle = gradient03;
			}

			context03.beginPath();
			context03.moveTo(points03[0].x, points03[0].y);

			for (var i = 0; i < points03.length; i++) {
				var p03 = points03[i];
				var nextP03 = points03[i + 1];
				var val03 = 30*0.552284749831;

				if (nextP03 != undefined) {
					// if (nextP03.ix > p.ix && nextP03.iy < p.iy) {
					// 	p.cx1 = p.x;
					// 	p.cy1 = p.y-val;
					// 	p.cx2 = nextP03.x-val;
					// 	p.cy2 = nextP03.y;
					// } else if (nextP03.ix > p.ix && nextP03.iy > p.iy) {
					// 	p.cx1 = p.x+val;
					// 	p.cy1 = p.y;
					// 	p.cx2 = nextP03.x;
					// 	p.cy2 = nextP03.y-val;
					// }  else if (nextP03.ix < p.ix && nextP03.iy > p.iy) {
					// 	p.cx1 = p.x;
					// 	p.cy1 = p.y+val;
					// 	p.cx2 = nextP03.x+val;
					// 	p.cy2 = nextP03.y;
					// } else if (nextP03.ix < p.ix && nextP03.iy < p.iy) {
					// 	p.cx1 = p.x-val;
					// 	p.cy1 = p.y;
					// 	p.cx2 = nextP03.x;
					// 	p.cy2 = nextP03.y+val;
					// } else {

						p03.cx1 = (p03.x+nextP03.x)/2;
						p03.cy1 = (p03.y+nextP03.y)/2;
						p03.cx2 = (p03.x+nextP03.x)/2;
						p03.cy2 = (p03.y+nextP03.y)/2;

						context03.bezierCurveTo(p03.x, p03.y, p03.cx1, p03.cy1, p03.cx1, p03.cy1);
					// 	continue;
					// }

					// context03.bezierCurveTo(p.cx1, p.cy1, p.cx2, p.cy2, nextP03.x, nextP03.y);
				} else {
nextP03 = points03[0];
						p03.cx1 = (p03.x+nextP03.x)/2;
						p03.cy1 = (p03.y+nextP03.y)/2;

						context03.bezierCurveTo(p03.x, p03.y, p03.cx1, p03.cy1, p03.cx1, p03.cy1);
				}
			}

			// context03.closePath();
			context03.fill();
		}

		if (showIndicators03) {
			// Draw points
			context03.fillStyle = '#000';
			context03.beginPath();
			for (let i = 0; i < pointsA03.length; i++) {
				var p = pointsA03[i];

				context03.rect(p.x - 1, p.y - 1, 2, 2);
			}
			context03.fill();

			// Draw controls
			context03.fillStyle = '#f00';
			context03.beginPath();
			for (var i = 0; i < pointsA03.length; i++) {
				var p = pointsA03[i];

				context03.rect(p.cx1 - 1, p.cy1 - 1, 2, 2);
				context03.rect(p.cx2 - 1, p.cy2 - 1, 2, 2);
			}
			context03.fill();
		}
	}

	// Init
	initButton03();
});