var EventType = new function()
{
	this.UP = 0;
	this.DOWN = 1;
	this.MOVE = 2;
}

var ButtonState = new function()
{
	this.UP = 0;
	this.DOWN = 1;
	this.HOVER = 2;
}

var Button = function(t, x, y, w, h, e, i)
{
	this.text = t;
	this.x = x;
	this.y = y;
	this.imgx = x;
	this.imgy = y;
	this.width = w;
	this.height = h;
	this.imgw = w;
	this.imgh = h;
	this.event = e;
	this.img = (typeof(i) === "undefined") ? null : i;
	this.state = ButtonState.UP;
}

Button.prototype = {
	pick: function(x, y, type, down, dx, dy)
	{
		var hittest = true;
		var dval = true;
		if(x < this.x)
		{
			hittest = false;
		}
		else if(y < this.y)
		{
			hittest = false;
		}
		else if(x > this.x + this.width)
		{
			hittest = false;
		}
		else if(y > this.y + this.height)
		{
			hittest = false;
		}
		
		//hit check on dx and dy
		if(dx < this.x)
		{
			dval = false;
		}
		else if(dy < this.y)
		{
			dval = false;
		}
		else if(dx > this.x + this.width)
		{
			dval = false;
		}
		else if(dy > this.y + this.height)
		{
			dval = false;
		}
		
		if(this.state == ButtonState.UP)
		{
			if(type == EventType.MOVE)
			{
				if(hittest)
				{
					if(down)
					{
						if(dval)
						{
							this.state = ButtonState.DOWN;
						}
						else
						{
							this.state = ButtonState.HOVER;
						}
					}
					else
					{
						this.state = ButtonState.HOVER;
					}
				}
			}
			else if(type == EventType.UP)
			{
				if(hittest)
				{
					this.state = ButtonState.HOVER;
					hittest = false;
				}
			}
		}
		else if(this.state == ButtonState.DOWN)
		{
			if(hittest)
			{
				if(type == EventType.UP)
				{
					//this time they actually clicked it
					this.state = ButtonState.HOVER;
					this.event();
				}
			}
			else
			{
				if(type == EventType.MOVE)
				{
					this.state = ButtonState.UP;
				}
			}
		}
		else
		{
			if(hittest)
			{
				if(type == EventType.DOWN)
				{
					this.state = ButtonState.DOWN;
				}
				else if(type == EventType.UP)
				{
					hittest = false;
				}
			}
			else
			{
				this.state = ButtonState.UP;
			}
		}
	},
	draw: function(canvas)
	{
		if(this.img !== null)
		{
			if(this.state == ButtonState.UP)
			{
				canvas.drawImage(this.img, 0, 0, this.imgw, this.imgh, this.imgx, this.imgy, this.imgw, this.imgh);
				
				if(this.text.length > 0)
				{
					canvas.fillStyle = "#000000";
					canvas.textAlign = "center";
					canvas.font = "48px Arial, sans-serif";
					canvas.fillText(this.text, this.imgx + this.imgw / 2, this.y + 60);
				}
			}
			else if(this.state == ButtonState.DOWN)
			{
				canvas.drawImage(this.img, 0, this.imgh, this.imgw, this.imgh, this.imgx, this.imgy, this.imgw, this.imgh);
				
				if(this.text.length > 0)
				{
					canvas.fillStyle = "#000000";
					canvas.textAlign = "center";
					canvas.font = "48px Arial, sans-serif";
					canvas.fillText(this.text, this.imgx + this.imgw / 2, this.y + 60);
				}
			}
			else
			{
				canvas.drawImage(this.img, 0, this.imgh * 2, this.imgw, this.imgh, this.imgx, this.imgy, this.imgw, this.imgh);
				
				if(this.text.length > 0)
				{
					canvas.fillStyle = "#000000";
					canvas.textAlign = "center";
					canvas.font = "48px Arial, sans-serif";
					canvas.fillText(this.text, this.imgx + this.imgw / 2, this.y + 60);
				}
			}
		}
		else
		{
			canvas.lineWidth = 2;
			canvas.strokeStyle = "#000000";
			canvas.fillStyle = (this.state == ButtonState.UP) ? "#CCCCCC" : (this.state == ButtonState.HOVER) ? "#FFFFFF" : "#AAAAAA";
			canvas.strokeRect(this.x, this.y, this.width, this.height);
			canvas.fillRect(this.x, this.y, this.width, this.height);
			
			canvas.fillStyle = "#000000";
			canvas.textAlign = "center";
			canvas.font = "50px Arial, sans-serif";
			canvas.fillText(this.text, this.x + this.width / 2, this.y + 60);
		}
	}
}