'use strict';

window.addEventListener("blur", function (event) {
	if(!MenuShowing)
	{
		ChangeMenu(Menus.Pause);
	}

	/*
	keys[K_UP] = false;
	keys[K_DOWN] = false;
	keys[K_LEFT] = false;
	keys[K_RIGHT] = false;
	keys[A_UP] = false;
	keys[A_DOWN] = false;
	keys[A_LEFT] = false;
	keys[A_RIGHT] = false;
	keys[K_FIRE] = false;
	keys[K_SPACE] = false;
	keys[K_ESC] = false;
	keys[K_TAB] = false;
	keys[K_TRAILS] = false;
	keys[K_RADAR] = false;
	guntimer = -1;
	*/
});

window.addEventListener("mousemove", function (event) {
	var left = (window.pageXOffset || document.body.scrollLeft) - (document.body.clientLeft || 0);
	var top = (window.pageYOffset || document.body.scrollTop)  - (document.body.clientTop || 0);
	var x = event.clientX - canvas.offsetLeft + left;
	var y = event.clientY - canvas.offsetTop + top;
	LastX = x;
	LastY = y;
	
	//pick controls
	for(var c = 0; c < Controls.length; c++)
	{
		Controls[c].pick(x, y, EventType.MOVE, MouseDown, MouseDownX, MouseDownY);
	}
});

window.addEventListener("mousedown", function (event) {
    var left = (window.pageXOffset || document.body.scrollLeft) - (document.body.clientLeft || 0);
	var top = (window.pageYOffset || document.body.scrollTop)  - (document.body.clientTop || 0);
	var x = event.clientX - canvas.offsetLeft + left;
	var y = event.clientY - canvas.offsetTop + top;
	
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
	var left = (window.pageXOffset || document.body.scrollLeft) - (document.body.clientLeft || 0);
	var top = (window.pageYOffset || document.body.scrollTop)  - (document.body.clientTop || 0);
	var x = event.clientX - canvas.offsetLeft + left;
	var y = event.clientY - canvas.offsetTop + top;
	
	MouseDown = false;
	
	//pick controls
	for(var c = 0; c < Controls.length; c++)
	{
		Controls[c].pick(x, y, EventType.UP, MouseDown, MouseDownX, MouseDownY);
	}
});

window.addEventListener("keydown", function (e) {
	keys[e.which] = true;
	
	if(e.which == K_TAB || e.which == K_SHIFT || e.which == K_ENTER || e.which == K_SPACE || e.which == K_TRAILS || e.which == K_RADAR || e.which == K_ESC || e.which == K_DOWN || e.which == K_LEFT || e.which == K_RIGHT || e.which == A_DOWN || e.which == A_LEFT || e.which == A_RIGHT)
	{
		e.preventDefault();
	}
	else if(e.which == K_FIRE || e.which == A_FIRE)
	{
		if(bindex == 1)
		{
			if(guntimer < 0)
			{
				guntimer = curframe;
			}
		}
	}
	else if(e.which == K_UP || e.which == A_UP)
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
	
	if(e.which == K_TAB)
	{
		e.preventDefault();
		
		if(keys[K_SHIFT])
		{
			if(--newtarget < 0)
			{
				newtarget = particles.length - 1;
			}
			else if(newtarget == bindex)
			{
				newtarget--;
			}
		}
		else
		{
			if(++newtarget >= particles.length)
			{
				newtarget = 0;
			}
			else if(newtarget == bindex)
			{
				newtarget++;
			}
		}
		/*
		if(++bindex >= particles.length)
		{
			bindex = 0;
			CameraX = -particles[bindex].c.x + SCREEN_WIDTH / 2;
			CameraY = -particles[bindex].c.y + SCREEN_HEIGHT / 2;
		}*/
	}
	else if(e.which == K_SPACE)
	{
		e.preventDefault();
		if(bindex == 1) //if you're Star Captain
		{
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
	else if(e.which == K_TRAILS)
	{
		e.preventDefault();
		showtrails = !showtrails;
	}
	else if(e.which == K_RADAR)
	{
		e.preventDefault();
		showradar = !showradar;
	}
	else if(e.which == K_FIRE || e.which == A_FIRE)
	{
		e.preventDefault();
		if(bindex == 1)
		{
			if(!keys[K_FIRE] && !keys[A_FIRE])
			{
				FireBullet();
				guntimer = -1;
			}
		}
	}
	else if(e.which == K_ESC)
	{
		if(MenuShowing && MenuID == Menus.Pause)
		{
			ChangeMenu(Menus.None);
		}
		else if(!MenuShowing)
		{
			ChangeMenu(Menus.Pause);
		}
	}
	else if(e.which == K_ENTER)
	{
		if(curTB >= 0)
		{
			TalkBoxes[curTB].button.event();
		}
	}
	else if(e.which == K_UP || e.which == K_DOWN || e.which == K_LEFT || e.which == K_RIGHT || e.which == A_UP || e.which == A_DOWN || e.which == A_LEFT || e.which == A_RIGHT || e.which == K_SHIFT)
	{
		e.preventDefault();
	}
});
