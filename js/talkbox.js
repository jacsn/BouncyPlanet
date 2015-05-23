var TalkBox = function(img, text, btn, style, time)
{
	this.img = img;
	this.text = text;
	this.button = btn;
	this.font = (style == "fact") ? "20px Arial, sans-serif" : "20px Bitwise, Arial, sans-serif";
	this.bg = (style == "fact") ? TalkBG2Image : TalkBackgroundImage;
	this.frame = -1;
	this.timelimit = time;
}

TalkBox.prototype = {
	draw: function()
	{
		ctx.drawImage(this.bg, 0, 400);
		ctx.drawImage(this.img, 40, 440);
		FillWrapText(this.text, this.font, "left", 700, 215, 460);
	}
}

function FillWrapText(text, font, align, maxwidth, x, y)
{
	ctx.font = font;
	ctx.fillStyle = "#FFFFFF";
	ctx.textAlign = align;
	if(ctx.measureText(text).width > maxwidth)
	{
		var lines = [];
		var index = 0;
		var lineheight = parseInt(font.substring(0, 2)) * 1.5;
		while(ctx.measureText(text).width > maxwidth)
		{
			index = 1;
			while(ctx.measureText(text.substr(0, index)).width < maxwidth)
			{
				index++;
			}
			
			index = text.substr(0, index).lastIndexOf(" ") + 1;
			lines.push(text.substr(0, index));
			text = text.substr(index);
		}
		
		//write each of the lines
		for(var i = 0; i < lines.length; i++)
		{
			ctx.fillText(lines[i], x, y + (lineheight * i));
		}
		//write what's left of the text
		ctx.fillText(text, x, y + lineheight * lines.length);
		
		return y + lineheight * lines.length + lineheight * 2;
	}
	else
	{
		ctx.fillText(text, x, y);
		return y + 60;
	}
}