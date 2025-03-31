/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';

const drawParams =
{
  showGradient : true,
  showBars : true,
  showSpikes : true,
  showNoise : true,
  showInvert : false,
  showEmboss : false,
  showSine : true,
  useFrequencyData : true
};

let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
let bodyElement = document.querySelector("body");

// 1 - here we are faking an enumeration
// const DEFAULTS = Object.freeze({
// 	sound1  :  "media/New Adventure Theme.mp3"
// });

const init = () => 
{
  // JSON
  fetch("./data/av-data.json").then((response) =>
  {
    if (!response.ok)
    {
      throw new Error("Network response was not ok.");
    }
    return response.json();
  }).then((data) =>
    {
      document.title = data.appTitle;
      document.querySelector('#title').innerText = data.appTitle;

      // Audio uses first track
      audio.setupWebaudio(data.audioTracks[0].file);

      // initialize UI elements w/ JSON data
      setupUI(data);

      // Set starting song title
      let trackTitle = document.querySelector('#track-title');
      trackTitle.innerHTML = `${data.audioTracks[0].title} by <a href=${data.audioTracks[0].url}>${data.audioTracks[0].artist}</a>`;
      canvas.setTimer(data.audioTracks[0].duration);
      canvas.setText(data.audioTracks[0].comment);

      // console.log("init called");
      // console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
    
      canvas.setupCanvas(canvasElement, audio.analyserNode);
      loop();
    }).catch((error) =>
    {
      console.error("Error loading JSON data: ", error);
    });
};

const setupUI = (data) => {
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#btn-fs");
  const playButton = document.querySelector("#btn-play");
	
  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("goFullscreen() called");
    utils.goFullscreen(canvasElement);
  };
	
  // B
  playButton.onclick = e => 
  {
    console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

    // If audio is in a suspended state (audio policy)
    if (audio.audioCtx.state == "suspended")
    {
      audio.audioCtx.resume();
    }
    console.log(`audioCtx.state after = ${audio.audioCtx.state}`);

    if (e.target.dataset.playing == "no")
    {
      // If track is currently paused, then play it
      audio.playCurrentSound();
      e.target.dataset.playing = "yes"; // Our CSS will set the the text to "Pause"
    }
    else
    {
      // If track IS playing, pause it
      audio.pauseCurrentSound();
      e.target.dataset.playing = "no"; // Our css will set the text to "Play"
    }
  };

  // C - Hookup slider and label
  let volumeSlider = document.querySelector('#slider-volume');
  let volumeLabel = document.querySelector('#label-volume');

  volumeSlider.value = data.startingState.volume;
  volumeLabel.innerHTML = data.startingState.volume;

  // Add .oninput event to slider
  volumeSlider.oninput = e =>
  {
    // set the gain
    audio.setVolume(e.target.value);

    // update value of label to match value of slider
    volumeLabel.innerHTML = Math.round((e.target.value/2 * 100));
  };

  // set value of label to match intial slider value
  volumeSlider.dispatchEvent(new Event("input"));

  // D - Hookup track <select>
  const trackSelect = document.querySelector('#select-track');
  let trackTitle = document.querySelector('#track-title');

  data.audioTracks.forEach((track) =>
  {
    const option = document.createElement("option");
    option.value = track.file;
    option.textContent = `${track.title}`;

    trackSelect.appendChild(option);
  });

  // Music change
  trackSelect.onchange = (e) =>
  {
    audio.loadSoundFile(e.target.value);

    // pause if current track is playing
    if (playButton.dataset.playing == "yes") 
    {
      playButton.dispatchEvent(new MouseEvent("click"));
    }

    data.audioTracks.forEach((track) =>
    {
      if (track.file == e.target.value)
      {
        trackTitle.innerHTML = `${track.title} by <a href=${track.url}>${track.artist}</a>`;
        canvas.setTimer(track.duration);
        canvas.setText(track.comment);
      }
    });

    blinkies(2);
  };

  // Setting up blinkies
  blinkies(2);

  // E - Checkboxes
  const checkGradient = document.querySelector('#cb-gradient');
  const checkBars = document.querySelector('#cb-bars');
  const checkSpikes = document.querySelector('#cb-spikes');
  const checkNoise = document.querySelector('#cb-noise');
  const checkInvert = document.querySelector('#cb-invert');
  const checkEmboss = document.querySelector('#cb-emboss');

  checkGradient.addEventListener('change', (e) => { drawParams["showGradient"] = !drawParams["showGradient"]; })

  checkBars.addEventListener('change', (e) => { drawParams["showBars"] = !drawParams["showBars"];  })

  checkSpikes.addEventListener('change', (e) => { drawParams["showSpikes"] = !drawParams["showSpikes"]; })

  checkNoise.addEventListener('change', (e) => { drawParams["showNoise"] = !drawParams["showNoise"]; })

  checkInvert.addEventListener('change', (e) => { drawParams["showInvert"] = !drawParams["showInvert"]; })

  checkEmboss.addEventListener('change', (e) => { drawParams["showEmboss"] = !drawParams["showEmboss"]; })

  // F - Highshelf / Lowshelf / Distortion
  // I. set the initial state of the high shelf checkbox
  const checkHighshelf = document.querySelector('#cb-highshelf');
  const checkLowshelf = document.querySelector('#cb-lowshelf');
  const checkDistortion = document.querySelector('#cb-distortion');
  const distortionSlider = document.querySelector('#slider-distortion');
  const distortionAmt = document.querySelector('#distortion-amt');

  // II. change the value of `highshelf` every time the high shelf checkbox changes state
  // turn on or turn off the filter, depending on the value of `highshelf`!
  checkHighshelf.addEventListener('change', (e) => { audio.toggleHighshelf(e.target.checked); })
  checkLowshelf.addEventListener('change', (e) => { audio.toggleLowshelf(e.target.checked); })
  checkDistortion.addEventListener('change', (e) => { audio.toggleDistortion(e.target.checked); })

  // III. 
  // when the app starts up, turn on or turn off the filter, depending on the value of `highshelf`!
  checkHighshelf.checked = data.startingState.highshelf;
  checkLowshelf.checked = data.startingState.lowshelf;
  checkDistortion.checked = data.startingState.distortion;

  distortionSlider.value = data.startingState.distortionAmount;
  distortionAmt.innerHTML = data.startingState.distortionAmount;

  audio.toggleHighshelf(checkHighshelf.checked); 
  audio.toggleLowshelf(checkLowshelf.checked);
  audio.toggleDistortion(checkDistortion.checked);

  distortionSlider.oninput = e => 
  {
    audio.updateDistortion(Number(e.target.value));

    distortionAmt.innerHTML = Math.round((e.target.value));
  };

  // Visualizer <select>
  let visualizerSelect = document.querySelector('#select-visualizer');

  // add .onchange event to <select>
  visualizerSelect.onclick = e =>
  {
    drawParams["useFrequencyData"] = !drawParams["useFrequencyData"];

    if (drawParams["useFrequencyData"] == true)
    {
      visualizerSelect.innerHTML = "Frequency Data";
    }
    else
    {
      visualizerSelect.innerHTML = "Time Domain";
    }
  }

  const checkSine = document.querySelector('#cb-sine');

  checkSine.addEventListener('change', (e) => { drawParams["showSine"] = !drawParams["showSine"]; })

  // Setting JSON values ...
  checkGradient.checked = data.startingState.showGradient;
  checkBars.checked = data.startingState.showBars;
  checkSpikes.checked = data.startingState.showSpikes;
  checkNoise.checked = data.startingState.showNoise;
  checkInvert.checked = data.startingState.showInvert;
  checkEmboss.checked = data.startingState.showEmboss;
  checkSine.checked = data.startingState.showSine;

  // Setup default params
  drawParams["showGradient"] = checkGradient.checked,
  drawParams["showBars"] = checkBars.checked,
  drawParams["showSpikes"] = checkSpikes.checked,
  drawParams["showNoise"] = checkNoise.checked,
  drawParams["showInvert"] = checkInvert.checked,
  drawParams["showEmboss"] = checkEmboss.checked,
  drawParams["showSine"] = checkSine.checked,

  drawParams["useFrequencyData"] = !data.startingState.useFrequencyData;
  visualizerSelect.click();

} // end setupUI

let i = 0;
const loop = () => {
  requestAnimationFrame(loop);
  // 1) create a byte array (values of 0-255) to hold the audio data
  // normally, we do this once when the program starts up, NOT every frame
  let audioData = new Uint8Array(audio.analyserNode.fftSize/2);
  
  // 2) populate the array of audio data *by reference* (i.e. by its address)
  audio.analyserNode.getByteFrequencyData(audioData);

  canvasElement.style.filter = `saturate(1) hue-rotate(${i}deg)`;
  bodyElement.style.filter = `saturate(1) hue-rotate(${i}deg)`;
  bodyElement.style.backdropFilter = `saturate(1) hue-rotate(${i}deg)`;

  i += 0.2;

  canvas.draw(drawParams);
}

const blinkies = (num = 1) =>
{
  // D - Hookup blinkies
  const blinkies = document.querySelector('#blinkies');
  blinkies.innerHTML = "";

  for (let i = 0; i < num; i++)
  {
    const blinkiesImg = document.createElement("img");
    blinkiesImg.src = `./img/blinkies/blinkies${(Math.floor(Math.random() * 8)) + 1}.gif`;
    blinkies.appendChild(blinkiesImg);
  }
}

export {init};