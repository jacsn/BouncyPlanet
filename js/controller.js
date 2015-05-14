window.addEventListener("mousemove", function (e) {

});

window.addEventListener("mousedown", function (e) {
    mouse.p.x = e.pageX - canvas.getBoundingClientRect().left - CameraX;
    mouse.p.y = e.pageY - canvas.getBoundingClientRect().top - CameraY;
	//removed because I don't want planets appearing when you click anymore. It gets annoying.
	/*
	var removed = false;
	for(var i = 1; i < particles.length; i++)
	{
		var diff = mouse.p.sub(particles[i].c);
		var r = particles[i].r;
		
		if(diff.lengthSq() <= r * r)
		{
			particles.splice(i, 1);
			trails.splice(i, 1);
			while(bindex >= particles.length)
			{
				bindex--;
			}
			removed = true;
		}
	}

	if(!removed)
	{
		var body = new Circle(mouse.p.clone(), Math.random() * 10 + 15, 0.95, 0.95);
		body.v = new Vector(0, -10);
		newParticles.push(body);
	}
	*/
});

window.addEventListener("mouseup", function (e) {

});

window.addEventListener("keydown", function (e) {
	keys[e.which] = true;
	
	if(e.which == 9)
	{
		e.preventDefault();
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
	else if(e.which == 84)
	{
		showtrails = !showtrails;
	}
	else if(e.which == K_FIRE)
	{
		if(bindex == 1)
		{
			FireBullet();
		}
	}
});
