require('dotenv').config();

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT;

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(bodyParser.json());
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.post('/chat', async (req, res) => {
    const userInput = req.body.message;

    try {
        const result = await model.generateContent(userInput);
        const response = result.response;
        const text = response.text();
        console.log(text);

        const botResponse = text;
        res.json({ response: botResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error communicating with AI' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
