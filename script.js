// Audio Context for white noise generation
let audioContext;
let whiteNoiseNode;
let gainNode;
let isPlaying = false;
let isPaused = false;

// Timer variables
let timerInterval;
let remainingSeconds;
let totalSeconds;
let startTime;
let pausedTime = 0;

// DOM Elements
const bookingScreen = document.getElementById('bookingScreen');
const flightScreen = document.getElementById('flightScreen');
const completionScreen = document.getElementById('completionScreen');
const destinationSelect = document.getElementById('destination');
const passengerNameInput = document.getElementById('passengerName');
const bookButton = document.getElementById('bookButton');
const flightDestination = document.getElementById('flightDestination');
const passengerInfo = document.getElementById('passengerInfo');
const timeRemaining = document.getElementById('timeRemaining');
const progressFill = document.getElementById('progressFill');
const pauseButton = document.getElementById('pauseButton');
const resumeButton = document.getElementById('resumeButton');
const stopButton = document.getElementById('stopButton');
const volumeSlider = document.getElementById('volumeSlider');
const newFlightButton = document.getElementById('newFlightButton');
const completionMessage = document.getElementById('completionMessage');

// Initialize Audio Context
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);
        gainNode.gain.value = 0.7;
    }
}

// Generate airplane cabin white noise
function createWhiteNoise() {
    const bufferSize = 4096;
    whiteNoiseNode = audioContext.createScriptProcessor(bufferSize, 1, 1);
    
    whiteNoiseNode.onaudioprocess = function(e) {
        const output = e.outputBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            // Generate pink noise (more pleasant than pure white noise)
            // Simulates airplane cabin ambiance
            output[i] = (Math.random() * 2 - 1) * 0.5;
        }
    };
    
    whiteNoiseNode.connect(gainNode);
}

// Start playing white noise
function startWhiteNoise() {
    if (!isPlaying) {
        initAudio();
        createWhiteNoise();
        isPlaying = true;
        isPaused = false;
    }
}

// Stop white noise
function stopWhiteNoise() {
    if (whiteNoiseNode) {
        whiteNoiseNode.disconnect();
        whiteNoiseNode = null;
        isPlaying = false;
        isPaused = false;
    }
}

// Format time display
function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Update timer display
function updateTimer() {
    const now = Date.now();
    const elapsed = Math.floor((now - startTime - pausedTime) / 1000);
    remainingSeconds = totalSeconds - elapsed;
    
    if (remainingSeconds <= 0) {
        remainingSeconds = 0;
        completeFlight();
        return;
    }
    
    timeRemaining.textContent = formatTime(remainingSeconds);
    
    // Update progress bar
    const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
    progressFill.style.width = progress + '%';
}

// Start flight
function startFlight(duration, destination, passengerName) {
    // Hide booking screen, show flight screen
    bookingScreen.classList.add('hidden');
    flightScreen.classList.remove('hidden');
    completionScreen.classList.add('hidden');
    
    // Set flight info
    const destinationText = destination.split(' - ')[0];
    flightDestination.textContent = destinationText;
    passengerInfo.textContent = `乘客：${passengerName}`;
    
    // Initialize timer
    totalSeconds = duration * 60;
    remainingSeconds = totalSeconds;
    startTime = Date.now();
    pausedTime = 0;
    
    timeRemaining.textContent = formatTime(remainingSeconds);
    progressFill.style.width = '0%';
    
    // Start white noise
    startWhiteNoise();
    
    // Start timer
    timerInterval = setInterval(updateTimer, 1000);
}

// Pause flight
function pauseFlight() {
    if (!isPaused) {
        isPaused = true;
        clearInterval(timerInterval);
        pauseButton.classList.add('hidden');
        resumeButton.classList.remove('hidden');
        
        // Pause audio
        if (audioContext) {
            audioContext.suspend();
        }
    }
}

// Resume flight
function resumeFlight() {
    if (isPaused) {
        isPaused = false;
        const pauseEndTime = Date.now();
        const pauseStartTime = startTime + (totalSeconds - remainingSeconds) * 1000 + pausedTime;
        pausedTime += (pauseEndTime - pauseStartTime);
        
        timerInterval = setInterval(updateTimer, 1000);
        pauseButton.classList.remove('hidden');
        resumeButton.classList.add('hidden');
        
        // Resume audio
        if (audioContext) {
            audioContext.resume();
        }
    }
}

// Stop flight early
function stopFlight() {
    clearInterval(timerInterval);
    stopWhiteNoise();
    
    // Show completion screen
    flightScreen.classList.add('hidden');
    completionScreen.classList.remove('hidden');
    
    const minutesStudied = Math.floor((totalSeconds - remainingSeconds) / 60);
    completionMessage.textContent = `您已专注学习 ${minutesStudied} 分钟`;
}

// Complete flight
function completeFlight() {
    clearInterval(timerInterval);
    stopWhiteNoise();
    
    // Show completion screen
    flightScreen.classList.add('hidden');
    completionScreen.classList.remove('hidden');
    
    const minutesStudied = Math.floor(totalSeconds / 60);
    completionMessage.textContent = `恭喜！您完成了 ${minutesStudied} 分钟的专注学习`;
}

// Reset to booking screen
function resetToBooking() {
    completionScreen.classList.add('hidden');
    bookingScreen.classList.remove('hidden');
    
    // Reset form
    destinationSelect.value = '';
    passengerNameInput.value = '';
    bookButton.disabled = true;
}

// Event Listeners
destinationSelect.addEventListener('change', function() {
    updateBookButtonState();
});

passengerNameInput.addEventListener('input', function() {
    updateBookButtonState();
});

function updateBookButtonState() {
    const hasDestination = destinationSelect.value !== '';
    const hasName = passengerNameInput.value.trim() !== '';
    bookButton.disabled = !(hasDestination && hasName);
}

bookButton.addEventListener('click', function() {
    const duration = parseInt(destinationSelect.value);
    const destination = destinationSelect.options[destinationSelect.selectedIndex].text;
    const passengerName = passengerNameInput.value.trim();
    
    if (duration && passengerName) {
        startFlight(duration, destination, passengerName);
    }
});

pauseButton.addEventListener('click', pauseFlight);
resumeButton.addEventListener('click', resumeFlight);
stopButton.addEventListener('click', stopFlight);

volumeSlider.addEventListener('input', function() {
    if (gainNode) {
        gainNode.gain.value = this.value / 100;
    }
});

newFlightButton.addEventListener('click', resetToBooking);

// Handle page visibility change (pause when tab is hidden)
document.addEventListener('visibilitychange', function() {
    if (document.hidden && isPlaying && !isPaused) {
        // Optionally pause when tab is hidden
        // pauseFlight();
    }
});

// Initialize on load
window.addEventListener('load', function() {
    console.log('专注飞机已准备就绪');
});
