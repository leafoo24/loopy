window.Mouse = {};
Mouse.init = function(target){

	Mouse.screenToWorld = function(screenX, screenY, scale, offsetX, offsetY){
		var canvasses = document.getElementById("canvasses");
		var tx = 0;
		var ty = 0;
		var s = 1/scale;
		var CW = canvasses.clientWidth - _PADDING - _PADDING;
		var CH = canvasses.clientHeight - _PADDING_BOTTOM - _PADDING;

		if(loopy.embedded){
			tx -= _PADDING/2;
			ty -= _PADDING/2;
		}

		tx -= (CW+_PADDING)/2;
		ty -= (CH+_PADDING)/2;

		tx = s*tx;
		ty = s*ty;

		tx += (CW+_PADDING)/2;
		ty += (CH+_PADDING)/2;

		tx -= offsetX;
		ty -= offsetY;

		return {
			x: screenX*s + tx,
			y: screenY*s + ty
		};
	};

	// Events!
	var _onmousedown = function(event){
		Mouse.moved = false;
		Mouse.pressed = true;
		Mouse.startedOnTarget = true;
		publish("mousedown");
	};
	var _onmousemove = function(event){

		Mouse.screenX = event.x;
		Mouse.screenY = event.y;

		var world = Mouse.screenToWorld(event.x, event.y, loopy.offsetScale, loopy.offsetX, loopy.offsetY);

		// Mouse!
		Mouse.x = world.x;
		Mouse.y = world.y;

		Mouse.moved = true;
		publish("mousemove");

	};
	var _onmouseup = function(){
		Mouse.pressed = false;
		if(Mouse.startedOnTarget){
			publish("mouseup");
			if(!Mouse.moved) publish("mouseclick");
		}
		Mouse.moved = false;
		Mouse.startedOnTarget = false;
	};

	// Add mouse & touch events!
	_addMouseEvents(target, _onmousedown, _onmousemove, _onmouseup);
	target.addEventListener("wheel", function(event){
		event.preventDefault();
		Mouse.screenX = event.offsetX;
		Mouse.screenY = event.offsetY;
		var world = Mouse.screenToWorld(event.offsetX, event.offsetY, loopy.offsetScale, loopy.offsetX, loopy.offsetY);
		Mouse.x = world.x;
		Mouse.y = world.y;
		Mouse.wheelDelta = -event.deltaY;
		publish("mousewheel");
	}, { passive:false });

	// Cursor & Update
	Mouse.target = target;
	Mouse.showCursor = function(cursor){
		Mouse.target.style.cursor = cursor;
	};
	Mouse.update = function(){
		Mouse.showCursor("");
	};

};
