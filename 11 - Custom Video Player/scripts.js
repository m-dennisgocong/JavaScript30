//  Select Elements

const player = document.querySelector('.player');
const video = document.querySelector('.viewer');
const progress = document.querySelector('.progress');
const progressBar = document.querySelector('.progress__filled');
const toggle = document.querySelector('.toggle'); // play or pause button
const skipButtons = document.querySelectorAll('button[data-skip]');
const ranges = document.querySelectorAll('input[type=range]');
let isScrubbing = false;

// Functions

// play/pause video
const togglePlay = () => video[video.paused ? 'play' : 'pause']();

// update play/pause icon
const updateButton = function(){
    return toggle.textContent = this.paused ? '►' : '❚ ❚';
}

// skip forward/backward
const skip = function(){
    return video.currentTime += parseFloat(this.dataset.skip);
}

// handle range update
const handleRangeUpdate = function(){
    return video[this.name] = this.value;
}

// handle progress bar
const handleProgress = function(){
    const percent = (video.currentTime / video.duration) * 100;
    // console.log(`${video.currentTime} / ${video.duration} * 100 = ${percent}`)
    return progressBar.style.flexBasis = `${percent}%`;
}

const scrub = function(e){
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    return video.currentTime = scrubTime;
}

// Event Listner

// play/pause video
video.addEventListener('click', togglePlay);
toggle.addEventListener('click', togglePlay);

// update play/pause icon
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);

// handle progress 
video.addEventListener('timeupdate',handleProgress);

// skip forward/backward
skipButtons.forEach(skipButton => skipButton.addEventListener('click', skip));

// handle range update
ranges.forEach(range => range.addEventListener('change',handleRangeUpdate)); // update when changing the value range
ranges.forEach(range => range.addEventListener('mousemove',handleRangeUpdate)); // update when moving tha range button

progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => {
    if(isScrubbing){
        scrub(e);
    }
});
// progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => isScrubbing = !isScrubbing);
progress.addEventListener('mouseup', () => isScrubbing = false);
progress.addEventListener('mouseout', () => isScrubbing = false);

