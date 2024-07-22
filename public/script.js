const synth = window.speechSynthesis;
const voiceSelect = document.getElementById('voice-select');


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

    const botResponse = await getAIResponse(userInput);
    addMessage(`${botResponse}`, 'bot-message');
});

function addMessage(message, className) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${className}`;
    messageElement.innerHTML = marked.parse(message);
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;

    // TTS for bot messages
    if (className === 'bot-message') {
        speak(message);
    }
}

// Function untuk mendapat respon dari AI
async function getAIResponse(userInput) {
    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userInput }),
        });
        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Error:', error);
        return 'Error communicating with AI';
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

function speak(text) {
    // Ambil teks dari textarea
    if ('speechSynthesis' in window) {
        var speech = new SpeechSynthesisUtterance(text);

        var selectedVoiceIndex = voiceSelect.value;
        var voices = synth.getVoices();
        speech.voice = voices[selectedVoiceIndex];

        speech.pitch = 1;
        speech.rate = 1;

        speech.onend = function (event) {
            console.log('Speech synthesis finished.');
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