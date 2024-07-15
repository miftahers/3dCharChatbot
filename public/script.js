document.getElementById('send-btn').addEventListener('click', async function () {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') {
        return;
    }

    addMessage(userInput, 'user-message');

    document.getElementById('user-input').value = '';

    const botResponse = await getChatGPTResponse(userInput);
    addMessage(botResponse, 'bot-message');
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
        return 'Error communicating with ChatGPT';
    }
}
