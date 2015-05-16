window.addEventListener("mousemove", function (event) {
	var x = event.clientX - canvas.offsetLeft + document.body.scrollLeft;
	var y = event.clientY - canvas.offsetTop + document.body.scrollTop;
	
	//pick controls
	for(var c = 0; c < Controls.length; c++)
	{
		Controls[c].pick(x, y, EventType.MOVE, MouseDown, MouseDownX, MouseDownY);
	}
});

window.addEventListener("mousedown", function (event) {
    var x = event.clientX - canvas.offsetLeft + document.body.scrollLeft;
	var y = event.clientY - canvas.offsetTop + document.body.scrollTop;
	
	MouseDown = true;
	MouseDownX = x;
	MouseDownY = y;
	
	//pick controls
	for(var c = 0; c < Controls.length; c++)
	{
		Controls[c].pick(x, y, EventType.DOWN, MouseDown, MouseDownX, MouseDownY);
	}
});

window.addEventListener("mouseup", function (event) {
	var x = event.clientX - canvas.offsetLeft + document.body.scrollLeft;
	var y = event.clientY - canvas.offsetTop + document.body.scrollTop;
	
	MouseDown = false;
	
	//pick controls
	for(var c = 0; c < Controls.length; c++)
	{
		Controls[c].pick(x, y, EventType.UP, MouseDown, MouseDownX, MouseDownY);
	}
});

window.addEventListener("keydown", function (e) {
	keys[e.which] = true;
	
	if(e.which == 9 || e.which == 32 || e.which == 84 || e.which == K_DOWN || e.which == K_LEFT || e.which == K_RIGHT)
	{
		e.preventDefault();
	}
	else if(e.which == K_FIRE)
	{
		if(bindex == 1)
		{
			if(guntimer < 0)
			{
				guntimer = curframe;
			}
		}
	}
	else if(e.which == K_UP)
	{
		e.preventDefault();
		if(bindex == 1)
		{
			for(var i = 0; i < 10; i++)
			{
				scengineflames.push(CreateSCEngineFlame());
			}
		}
		else if(bindex == 2)
		{
			for(var i = 0; i < 10; i++)
			{
				gmengineflames.push(CreateGMEngineFlame());
			}
		}
	}
});

window.addEventListener("keyup", function (e) {
	keys[e.which] = false;
	
	if(e.which == 9)
	{
		e.preventDefault();
		if(++newtarget >= particles.length)
		{
			newtarget = 0;
		}
		else if(newtarget == bindex)
		{
			newtarget++;
		}
		/*
		if(++bindex >= particles.length)
		{
			bindex = 0;
			CameraX = -particles[bindex].c.x + SCREEN_WIDTH / 2;
			CameraY = -particles[bindex].c.y + SCREEN_HEIGHT / 2;
		}*/
	}
	else if(e.which == 32)
	{
		e.preventDefault();
		if(bindex == 1) //if you're Star Captain
		{
			guntimer = -1;
			newbindex = 2;
			if(target == newbindex)
			{
				newtarget = 1;
			}
		}
		else
		{
			newbindex = 1;
			if(target == newbindex)
			{
				newtarget = 2;
			}
		}
	}
	else if(e.which == 84)
	{
		e.preventDefault();
		showtrails = !showtrails;
	}
	else if(e.which == K_FIRE)
	{
		e.preventDefault();
		if(bindex == 1)
		{
			FireBullet();
			guntimer = -1;
		}
	}
	else if(e.which == K_UP || e.which == K_DOWN || e.which == K_LEFT || e.which == K_RIGHT)
	{
		e.preventDefault();
	}
});
