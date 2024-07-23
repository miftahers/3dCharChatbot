const synth = window.speechSynthesis;
const voiceSelect = document.getElementById('voice-select');

// TTS
function populateVoiceList() {
    if (typeof synth === 'undefined') {
        return;
    }

    let voices = synth.getVoices();

    for (let i = 0; i < voices.length; i++) {
        let option = document.createElement('option');
        option.textContent = `${voices[i].name} (${voices[i].lang})`;

        option.value = i;
        voiceSelect.appendChild(option);
    }
}
populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
}

const pauseButton = document.getElementById('pause');
const resumeButton = document.getElementById('resume');
const stopButton = document.getElementById('stop');

function pauseSpeech() {
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
    }
}

// Function to resume speech
function resumeSpeech() {
    if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
    }
}

// Function to stop speech
function stopSpeech() {
    window.speechSynthesis.cancel();
}

// Event listeners for buttons
pauseButton.addEventListener('click', pauseSpeech);
resumeButton.addEventListener('click', resumeSpeech);
stopButton.addEventListener('click', stopSpeech);

// Set up slider to display speed value
document.getElementById('speedSlider').addEventListener('input', function () {
    document.getElementById('speedValue').textContent = this.value;
});

function speak(text) {
    // Ambil teks dari textarea
    if ('speechSynthesis' in window) {
        var speech = new SpeechSynthesisUtterance(text);

        var selectedVoiceIndex = voiceSelect.value;
        var voices = synth.getVoices();
        speech.voice = voices[selectedVoiceIndex];

        const speed = parseFloat(document.getElementById('speedSlider').value);
        speech.pitch = 1;
        speech.rate = speed;

        speech.onend = function (event) {
            console.log('Sintesis suara selesai.');
            // Lakukan sesuatu setelah speech synthesis selesai
            // set kembali ke animasi idle
            var character = document.getElementById('character');
            character.src = 'img/idle.gif';
        };

        synth.speak(speech);
        var character = document.getElementById('character');
        character.src = 'img/talking.gif';

    } else {
        alert('Browser Anda tidak mendukung Web Speech API.');
    }
}

document.getElementById('send-btn').addEventListener('click', async function () {
    const userInput = document.getElementById('user-input').value;
    console.log(userInput)
    if (userInput.trim() === '') {
        return;
    }
    // Set ekspresi kembali ke idle
    const character = document.getElementById('character');
    character.src = 'img/idle.gif'; // Default image

    addMessage(`${userInput}`, 'user-message');

    document.getElementById('user-input').value = '';

    const botResponse = await getAIResponse(userInput, 512);
    addMessage(`${botResponse}`, 'bot-message');
});

function addMessage(message, className) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${className} my-1`;
    messageElement.innerHTML = marked.parse(message);
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;

    // TTS for bot messages
    if (className === 'bot-message') {
        speak(message);
    }
}
// Function untuk mendapatkan respon dari AI
async function getAIResponse(userInput, maxTokens = 2048) {
    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userInput, maxTok: maxTokens }),
        });

        if (!response.ok) {
            throw new Error('Response jaringan sedang tidak baik-baik saja');
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Kesalahan:', error);
        return 'Terjadi kesalahan dalam berkomunikasi dengan AI';
    }
}
// Change Character to lookdown when user typing on input field
document.getElementById('user-input').addEventListener('input', function () {
    var character = document.getElementById('character');
    if (this.value === '') {
        character.src = 'img/idle.gif'; // Default image
    } else {
        character.src = 'img/look-at-chat.gif'; // New image
    }
});

// Toast
document.addEventListener('DOMContentLoaded', (event) => {
    const toastLiveExample = document.getElementById('liveToast');
    const toastMessageElement = document.getElementById('toast-message');

    // Function to show toast periodically
    async function showToastPeriodically() {
        try {
            let message = await getAIResponse('Berikan motivasi', 16);
            toastMessageElement.innerHTML = marked.parse(message);
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
            toastBootstrap.show();
        } catch (error) {
            console.error('Kesalahan mendapatkan respons AI:', error);
        }
        setNextInterval();
    }

    // Function to set next interval
    function setNextInterval() {
        const randomInterval = getRandomTimeInterval();
        setTimeout(showToastPeriodically, randomInterval);
    }

    // Show the first toast and set the first interval
    setNextInterval();
});

// Function to get a random time interval between 1 and 5 minutes
function getRandomTimeInterval() {
    const min = 60000;  // 1 menit dalam milidetik
    const max = 300000; // 5 menit dalam milidetik
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Toast test using button
document.addEventListener('DOMContentLoaded', (event) => {
    const toastTrigger = document.getElementById('liveToastBtn');
    const toastLiveExample = document.getElementById('liveToast');
    const toastMessageElement = document.getElementById('toast-message');

    if (toastTrigger) {
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
        toastTrigger.addEventListener('click', async () => {
            try {
                let message = await getAIResponse('Berikan kata-kata motivasi untuk menjadi lebih baik dalam belajar', 16);
                toastMessageElement.innerHTML = marked.parse(message);
                toastBootstrap.show();
            } catch (error) {
                console.error('Kesalahan mendapatkan respons AI:', error);
            }
        });
    }
});

// Function to update speed value display
document.getElementById('speedSlider').addEventListener('input', function () {
    const speedValue = this.value;
    document.getElementById('speedValue').textContent = speedValue;
});

