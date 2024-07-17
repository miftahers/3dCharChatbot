document.getElementById('send-btn').addEventListener('click', async function () {
    const userInput = document.getElementById('user-input').value;
    console.log(userInput)
    if (userInput.trim() === '') {
        return;
    }
    // Set ekspresi kembali ke idle
    const character = document.getElementById('character');
    character.src = 'img/idle.gif'; // Default image

    addMessage(`Kamu: ${userInput}`, 'user-message');

    document.getElementById('user-input').value = '';

    const botResponse = await getChatGPTResponse(userInput);
    addMessage(`Bot: ${botResponse}`, 'bot-message');


});

function addMessage(message, className) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${className}`;
    messageElement.innerText = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function getChatGPTResponse(userInput) {
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
        character.src = 'img/mengangguk sambil lihat kiri.gif'; // New image
    }
});
