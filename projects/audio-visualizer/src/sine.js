export class Sine
{
    x = 0;
    y = 0;
    counter = 0;
    xChange = 2;

    degrees = 1;

    difference = 1;
    change = 1;

    size = 2;
    
    constructor(difference, change, xChange, size)
    {
        this.difference = difference;
        this.change = change;
        this.xChange = xChange;
        this.size = size;
    }

    update()
    {
        this.counter += .05;
        this.x += this.xChange;
    }

    draw(ctx, canvasHeight, canvasWidth)
    {        
        // this.y = canvasHeight / 2 + Math.sin(this.counter) * 100;
        // drawSineCircle(ctx, x, y, 1, "white");

        // this.y = canvasHeight / 4 + Math.sin(this.counter - 1) * 100;
        // drawSineCircle(ctx, x - 100, y+2, 2, "white");

        // this.y = canvasHeight + Math.sin(this.counter + 10) * 100;
        // drawSineCircle(ctx, x - 50, y-2, 2, "white");

        // this.y = canvasHeight / 2 + Math.sin(this.counter - 2) * 100;
        // drawSineCircle(ctx, x - 200, y, 2, "white");

        // this.y = canvasHeight / 2 + Math.sin(this.counter -3) * 100;
        // drawSineCircle(ctx, x, y - 100, 1, "white");

        // this.y = canvasHeight / 4 + Math.sin(this.counter - 1) * 100;
        // drawSineCircle(ctx, x - 250, y+2, 2, "white");

        // this.y = setY(canvasHeight, 2, 10);
        // this.y = canvasHeight + Math.sin(this.counter + 20) * 100;
        // drawSineCircle(ctx, x - 200, y-2, 2, "white");

        this.y = canvasHeight / this.difference + Math.sin(this.counter - this.change) * 100;
        this.drawSineCircle(ctx, this.x - 150, this.y, this.size, "white");

        if (this.x > canvasWidth + 250) this.x = 0;
    }

    drawSineCircle = (ctx,x,y,radius,color) =>
    {
        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}