export class Tangerine
{
    img = new Image();

    maxX = 120;
    maxY = 100;

    x = 120;
    y = 100;

    posX = 120;
    posY = 100;

    degrees = 0;

    constructor(maxX, maxY, posX, posY, startingDegrees)
    {
        this.maxX = maxX;
        this.maxY = maxY;

        this.x = maxX;
        this.y = maxY;

        this.posX = posX;
        this.posY = posY;

        this.degrees = startingDegrees;

        // Tangerine
        this.loadImage();
    }
    
    update(audioData)
    {
        this.degrees += audioData[0] / 2000;

        let percent = audioData[50] / 255;

        if (percent != 0)
        {
            this.x = percent * this.maxX * 2.5;
            this.y = percent * this.maxY * 2.5;
        }
        if (percent == 0 || this.x < this.maxX || this.y < this.maxY)
        {
            this.x = this.maxX;
            this.y = this.maxY;
        }
    }

    draw(ctx)
    {
        ctx.save();

        ctx.globalAlpha = 1;

        // move to the center of the canvas
        ctx.translate(800 - this.posX, this.posY);

        // rotate the canvas to the specified degrees
        ctx.rotate(this.degrees);

        // draw the image
        // since the context is rotated, the image will be rotated also
        ctx.drawImage(this.img, this.x / -2, this.y / -2, this.x, this.y);

        ctx.restore();
    }

    loadImage = () => 
    {
        this.img.onload = function()
        {
            // Render image!!!
            this.img = this;
            // Load new one in 2 sec :)
            setTimeout(this.loadImage, 2000);
        }
        this.img.onerror = this.loadImage;
        this.img.src = "./img/tangerine.png";
    }
}