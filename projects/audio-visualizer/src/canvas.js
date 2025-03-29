/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';
import { Tangerine } from './tangerine.js';
import { Sine } from './sine.js';

let ctx,canvasWidth,canvasHeight,gradient,analyserNode,audioData, visualizer;

let duration = 0;
let comment = "";
let scale = 1;

let tangerine = new Tangerine(130, 100, 130, 100, 0);

let sine;
let sines = []; 
let sineAmount = 60;

const setupCanvas = (canvasElement,analyserNodeRef) => {
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
	// create a gradient that runs top to bottom
	gradient = utils.getLinearGradient(ctx,0,0,canvasWidth,0,[{percent:0,color:"#5a0000"},{percent:.5,color:"#ff0000"},{percent:1,color:"#ffbf00"}]);
	// keep a reference to the analyser node
	analyserNode = analyserNodeRef;
	// this is the array where the analyser data will be stored
	audioData = new Uint8Array(analyserNode.fftSize/2);

    for (let i = 0; i < sineAmount; i++)
    {
        sine = new Sine(
            ((Math.random() * 10) - 5), 
            ((Math.random() * 20) - 10), 
            ((Math.random() * 6)),
            ((Math.random() * 2.5) + .5));
        sines.push(sine);
    }
}

const draw = (params={}) => {
  // 1 - populate the audioData array with the frequency data from the analyserNode
	// notice these arrays are passed "by reference" 
    if(params.useFrequencyData)
    {
        analyserNode.getByteFrequencyData(audioData); 
    }
    else
    {
        analyserNode.getByteTimeDomainData(audioData); 
    }
	// OR
	//analyserNode.getByteTimeDomainData(audioData); // waveform data
	
	// 2 - draw background
	ctx.save();
    ctx.fillStyle = "black";
    ctx.globalAlpha = .3;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();
		
	// 3 - draw gradient
    if (params.showGradient)
    {
        ctx.save();
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 1;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.restore();
    }

	// 4 - draw bars
	if (params.showBars)
    {
        let barSpacing = 4;
        let margin = 5;
        let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin;
        let barWidth = screenWidthForBars / audioData.length;
        let barHeight = 100;
        let topSpacing = 150;

        ctx.save();

        ctx.lineWidth = 2.2;
        if (params.showGradient) { ctx.fillStyle = gradient; }
        else { ctx.fillStyle = 'rgba(255, 232, 215, 0.5)'; }
        ctx.strokeStyle = 'rgba(255, 232, 215, 0.5)';

        // loop through the data and draw!
        for (let i = 0; i < audioData.length; i++)
        {
            ctx.fillRect(margin + i * (barWidth + barSpacing), topSpacing  - audioData[i] /2 , barWidth, barHeight);
            ctx.strokeRect(margin + i * (barWidth + barSpacing), topSpacing - audioData[i] / 2, barWidth, barHeight);
        }
        ctx.restore();
    }

	// 5 - draw spikes
	if (params.showSpikes)
    {
        let maxRadius = canvasHeight / 4;
        ctx.save();
        ctx.globalAlpha = 0.5;
        for (let i = 0; i < audioData.length; i++)
        {
            let percent = audioData[i] / 255;

            let outerCircleRadius = percent * maxRadius;
            let innerCircleRadius = outerCircleRadius / 1.5;
         
            // UNDER TANGERINE

            // red-ish circles
            ctx.fillStyle = utils.makeColor(255, 0, 255, 0.5 - percent / 5.0);
            drawSpikes(ctx, canvasWidth - tangerine.posX, tangerine.posY, 5, outerCircleRadius, innerCircleRadius);
            ctx.fill();
            
            // blue-ish cricles, bigger, more transparent

            ctx.fillStyle = utils.makeColor(255, 100, 255, 0.10 - percent / 10.0);
            drawSpikes(ctx, canvasWidth - tangerine.posX, tangerine.posY, 8, outerCircleRadius * 1.5, innerCircleRadius * 1.5);
            ctx.fill();

            // yellow-ish circles, smaller

            ctx.fillStyle = utils.makeColor(255, 255, 0, 0.5 - percent / 5.0);
            drawSpikes(ctx, canvasWidth - tangerine.posX, tangerine.posY, 12, outerCircleRadius * 0.80, innerCircleRadius * 0.80);
            ctx.fill();

            // OTHER SPIKES
            
            // SPIKES 1
            ctx.fillStyle = utils.makeColor(255, 0, 255, 0.5 - percent / 5.0);
            drawSpikes(ctx, 400, 300, 5, outerCircleRadius, innerCircleRadius);
            ctx.fill();
            
            ctx.fillStyle = utils.makeColor(255, 100, 255, 0.10 - percent / 10.0);
            drawSpikes(ctx, 400, 300, 8, outerCircleRadius * 1.5, innerCircleRadius * 1.5);
            ctx.fill();

            ctx.fillStyle = utils.makeColor(255, 255, 0, 0.5 - audioData[1] / 255 / 5.0);
            drawSpikes(ctx, 400, 300, 12, outerCircleRadius * 0.80, innerCircleRadius * 0.80);
            ctx.fill();

            // SPIKES 2
            outerCircleRadius = percent * maxRadius / 4;
            innerCircleRadius = outerCircleRadius / 1.5;

            ctx.fillStyle = utils.makeColor(0, 255, 255, 0.5 - percent / 5.0);
            drawSpikes(ctx, 500, 230, 7, outerCircleRadius, innerCircleRadius);
            ctx.fill();
            
            ctx.fillStyle = utils.makeColor(0, 0, 255, 0.10 - percent / 10.0);
            drawSpikes(ctx, 500, 230, 10, outerCircleRadius * 1.5, innerCircleRadius * 1.5);
            ctx.fill();

            ctx.fillStyle = utils.makeColor(255, 255, 0, 0.5 - audioData[1] / 255 / 5.0);
            drawSpikes(ctx, 500, 230, 16, outerCircleRadius * 0.50, innerCircleRadius * 0.50);
            ctx.fill();

            // SPIKE 3
            ctx.fillStyle = utils.makeColor(0, 255, 255, 0.5 - percent / 5.0);
            drawSpikes(ctx, 300, 350, 7, outerCircleRadius, innerCircleRadius);
            ctx.fill();
            
            ctx.fillStyle = utils.makeColor(0, 0, 255, 0.10 - percent / 10.0);
            drawSpikes(ctx, 300, 350, 10, outerCircleRadius * 1.5, innerCircleRadius * 1.5);
            ctx.fill();

            ctx.fillStyle = utils.makeColor(255, 255, 0, 0.5 - percent / 5.0);
            drawSpikes(ctx, 300, 350, 16, outerCircleRadius * 0.50, innerCircleRadius * 0.50);
            ctx.fill();

            // SPIKE 4
            ctx.fillStyle = utils.makeColor(0, 255, 255, 0.5 - percent / 5.0);
            drawSpikes(ctx, canvasWidth - 200, 30, 7, outerCircleRadius, innerCircleRadius);
            ctx.fill();
            
            ctx.fillStyle = utils.makeColor(0, 0, 255, 0.10 - percent / 10.0);
            drawSpikes(ctx, canvasWidth - 200, 30, 10, outerCircleRadius * 1.5, innerCircleRadius * 1.5);
            ctx.fill();

            ctx.fillStyle = utils.makeColor(255, 255, 0, 0.5 - percent / 5.0);
            drawSpikes(ctx, canvasWidth - 200, 30, 16, outerCircleRadius * 0.50, innerCircleRadius * 0.50);
            ctx.fill();

            // SPIKE 5
            ctx.fillStyle = utils.makeColor(0, 255, 255, 0.5 - percent / 5.0);
            drawSpikes(ctx, canvasWidth - 40, 120, 7, outerCircleRadius, innerCircleRadius);
            ctx.fill();
            
            ctx.fillStyle = utils.makeColor(0, 0, 255, 0.10 - percent / 10.0);
            drawSpikes(ctx, canvasWidth - 40, 120, 10, outerCircleRadius * 1.5, innerCircleRadius * 1.5);
            ctx.fill();

            ctx.fillStyle = utils.makeColor(255, 255, 0, 0.5 - percent / 5.0);
            drawSpikes(ctx, canvasWidth - 40, 120, 16, outerCircleRadius * 0.50, innerCircleRadius * 0.50);
            ctx.fill();
        }
        ctx.restore();
    }

    // 6 - bitmap manipulation
	// TODO: right now. we are looping though every pixel of the canvas (320,000 of them!), 
	// regardless of whether or not we are applying a pixel effect
	// At some point, refactor this code so that we are looping though the image data only if
	// it is necessary

	// A) grab all of the pixels on the canvas and put them in the `data` array
	// `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
	// the variable `data` below is a reference to that array 
	let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width; // not using here

	// B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
    for (let i = 0; i < length; i += 4)
    {
		// C) randomly change every 20th pixel to very light red
        if (params.showNoise && Math.random() < .05)
        {
			// data[i] is the red channel
			// data[i+1] is the green channel
			// data[i+2] is the blue channel
			// data[i+3] is the alpha channel
			// zero out the red and green and blue channels
			// make the red channel 100% red
            data[i] = data[i+1] = data[i+2] = 200;
            data[i] = 255;
        }   // end if
        // Make every 20th pixel to red
        if (params.showNoise && Math.random() > .05 && Math.random() < .10)
        {
            // data[i] is the red channel
			// data[i+1] is the green channel
			// data[i+2] is the blue channel
			// data[i+3] is the alpha channel
			// zero out the red and green and blue channels
			// make the red channel 100% red
            data[i] = data[i+1] = data[i+2] = 0;
            data[i] = 255;
        }
        if (params.showInvert)
        {
            let red = data[i], green = data[i + 1], blue = data[i+2];
            data[i] = 255 - red;
            data[i + 1] = 255 - green;
            data[i + 2] = 255 - blue;
            //data[i+3] is the alpha, but we're leaving that alone
        }
    } // end for

    if (params.showEmboss)
    {
        // note we are stepping through *each* sub-pixel
        for (let i = 0; i < length; i++)
        {
            if (i%4 == 3) continue; // skip alpha channel
            data[i] = 127 + 2*data[i] - data[i + 4] - data[i + width * 4];
        }
    }
	// D) copy image data back to canvas
    ctx.putImageData(imageData, 0, 0);

    // Sine Stuff !!!
    if (params.showSine)
    {
        for(let i = 0; i < sineAmount; i++)
        {
            sines[i].update();
            sines[i].draw(ctx, canvasHeight, canvasWidth);
        }
    }

    // Tangerine
    tangerine.update(audioData);
    tangerine.draw(ctx);

    // Duration
    ctx.save();
    ctx.font = "bold 15px tahoma";

    ctx.lineWidth = 3;
    ctx.strokeStyle = 'white'; 
    ctx.fillStyle = 'black';

    ctx.strokeText(duration, canvasWidth - 50, canvasHeight - 20);
    ctx.fillText(duration, canvasWidth - 50, canvasHeight - 20);
    ctx.restore();

    // Comment
    ctx.save();

    ctx.font = "bold 15px verdana";
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'deeppink'; 
    ctx.fillStyle = 'white';

    scale = 0.9 + Math.abs(Math.cos(tangerine.degrees / 2));

    ctx.translate(300, 100);
    ctx.scale(scale, scale);
    ctx.translate(-300, -100);

    ctx.textAlign = "center";
    ctx.strokeText(comment, 300, 100);
    ctx.fillText(comment, 300, 100);
    ctx.restore();
}

// Drawing the spikes
const drawSpikes = (ctx, x, y, spikes, outerRadius, innerRadius) =>
{
    // Setting some variables up...
    let rotation = Math.PI / 2 * 3;
    let spikeX = x;
    let spikeY = y;
    let step = Math.PI / spikes;

    // Beginning path...
    ctx.beginPath();
    ctx.moveTo(x, y - outerRadius)
    // Determening how the spikes look and are drawn!
    for (let i = 0; i < spikes; i++) 
    {
        spikeX = x + Math.cos(rotation) * outerRadius;
        spikeY = y + Math.sin(rotation) * outerRadius;
        ctx.lineTo(spikeX, spikeY);

        rotation += step;

        spikeX = x + Math.cos(rotation) * innerRadius;
        spikeY = y + Math.sin(rotation) * innerRadius;
        ctx.lineTo(spikeX, spikeY);

        rotation += step;

    }
    ctx.lineTo(x, y - outerRadius)
    ctx.closePath();
}

const setTimer = (time) =>
{
    duration = time;
}

const setText = (trackComment) =>
{
    comment = trackComment;
}

export {setupCanvas, draw, visualizer, setTimer, setText};