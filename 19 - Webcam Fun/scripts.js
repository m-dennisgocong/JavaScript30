const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap'); // audio for snap

function getVideo() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
        || navigator.mozGetUserMedia;
    //enabling video and audio channels 
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(stream => {
        console.log(stream);
        video.srcObject = stream;
        video.play();
    })
    .catch(error => {
        console.error(`Enable the camera`, error);
    });
}

function paintToCanvas() {
    [canvas.width,canvas.height] = [video.videoWidth, video.videoHeight];
    return setInterval(() => {
        // put the image to the canvas
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight); 
        // take the pixels data 
        let pixels = ctx.getImageData(0,0,video.videoWidth, video.videoHeight);
        
        // mess with them
        
        // pixels = redEffect(pixels);
        // pixels = rgbSplit(pixels);
        // ctx.globalAlpha = 0.8;
        
        pixels = greenScreen(pixels);

        // return the pixels data
        ctx.putImageData(pixels,0,0);
    }, 16);
}

function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
      pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
      pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
      pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
    }
    return pixels;
}

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
      pixels.data[i - 150] = pixels.data[i + 0]; // RED
      pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
      pixels.data[i - 550] = pixels.data[i + 2]; // Blue
    }
    return pixels;
}

function greenScreen(pixels) {
    const levels = {};
  
    document.querySelectorAll('.rgb input').forEach((input) => {
      levels[input.name] = input.value;
    });
  
    for (i = 0; i < pixels.data.length; i = i + 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3];
  
      if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // take it out!
        pixels.data[i + 3] = 0;
      }
    }
  
    return pixels;
}

function takePhoto() {

    // play snap sound effect
    snap.currentTime = 0;
    snap.play();

    // get data from a canvas
    const data = canvas.toDataURL('image/jpeg');
    // create link for data
    const link = document.createElement('a');
    link.href = data;
    /* 
        automatically download the file by setting download instead of redirecting the file link
        and set the file name to picture
    */
    link.setAttribute('download', 'picture');

    // link.textContent = 'Download Image';
    link.innerHTML = `<img src=${data} alt='picture'>`;
    strip.insertBefore(link, strip.firstChild); // insert before the first child 
}


getVideo();
video.addEventListener('canplay', paintToCanvas);
