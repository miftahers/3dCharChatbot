document.getElementById('send-btn').addEventListener('click', async function () {
    const userInput = document.getElementById('user-input').value;
    console.log(userInput);
    if (userInput.trim() === '') {
        return;
    }
    // Set ekspresi kembali ke idle
    const character = document.getElementById('character');
    character.src = 'gif/idle.gif'; // Default image

    addMessage(`${userInput}`, 'user-message');

    document.getElementById('user-input').value = '';

    const botResponse = await getAIResponse(userInput, 512);
    addMessage(botResponse.response, 'bot-message');
    if (botResponse.audioFile) {
        console.log(botResponse);
        playAudio("/audio/output.mp3");
    }
});

function addMessage(message, className) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${className} my-1`;
    messageElement.innerHTML = marked.parse(message);
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}
async function playAudio(audioFile) {
    try {
        const response = await fetch(audioFile, { cache: 'reload' }); // Fetch with cache reload to ensure latest version
        if (!response.ok) {
            throw new Error('Failed to load audio file');
        }
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        const audio = new Audio(audioUrl);
        const character = document.getElementById('character');

        audio.addEventListener('play', () => {
            console.log('Audio started playing');
            character.src = 'gif/talking.gif';
        });

        audio.addEventListener('ended', () => {
            console.log('Audio finished playing');
            character.src = 'gif/idle.gif';
            URL.revokeObjectURL(audioUrl); // Clean up object URL after use
        });

        audio.addEventListener('pause', () => {
            console.log('Audio paused');
            character.src = 'gif/idle.gif';
        });

        await audio.play();
    } catch (error) {
        console.error('Error playing audio:', error);
    }
}


// Function untuk mendapatkan respon dari AI
async function getAIResponse(userInput, maxTokens = 20128) {
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
        return {
            response: data.response,
            audioFile: data.audioFile
        };
    } catch (error) {
        console.error('Kesalahan:', error);
        return {
            response: 'Terjadi kesalahan dalam berkomunikasi dengan AI',
            audioFile: null
        };
    }
}

// Change Character to lookdown when user typing on input field
document.getElementById('user-input').addEventListener('input', function () {
    var character = document.getElementById('character');
    if (this.value === '') {
        character.src = 'gif/idle.gif'; // Default image
    } else {
        // Only change to lookDown if it's not already set
        if (character.src.indexOf('gif/lookDown.gif') === -1) {
            character.src = 'gif/lookDown.gif'; // New image
        }
    }
});
// Toast
document.addEventListener('DOMContentLoaded', (event) => {
    const toastLiveExample = document.getElementById('liveToast');
    const toastMessageElement = document.getElementById('toast-message');

    // Function to show toast periodically
    async function showToastPeriodically() {
        try {
            let resp = await getAIResponse('Berikan motivasi', 128);
            toastMessageElement.innerHTML = marked.parse(typeof resp.response === 'string' ? resp.response : JSON.stringify(resp.response));
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
            if (resp.audioFile) {
                console.log(resp.response);
                playAudio("/audio/output.mp3");
            }
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
    const min = 15000;  // 1 menit dalam milidetik
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
                let resp = await getAIResponse('Berikan satu kalimat motivasi', 128);
                toastMessageElement.innerHTML = marked.parse(typeof resp.response === 'string' ? resp.response : JSON.stringify(resp.response));
                if (resp.audioFile) {
                    console.log(resp.response);
                    playAudio("/audio/output.mp3");
                }
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

