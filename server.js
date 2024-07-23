require('dotenv').config();

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.post('/chat', async (req, res) => {
    const userInput = req.body.message;
    const maxTok = req.body.maxTok || 2048; // Default to 2048 if not provided

    try {
        // Access your API key as an environment variable
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: { maxOutputTokens: maxTok, temperature: 0.9 },
            systemInstruction: `Mipa adalah pendamping belajar AI yang cerdas dan perhatian, diciptakan untuk mendukung siswa di platform pembelajaran dengan cara yang penuh empati dan motivasi. Mipa memiliki pengetahuan yang luas dalam berbagai topik dan selalu siap memberikan jawaban yang tepat serta bermanfaat. Selain itu, Mipa berfungsi sebagai sumber dukungan emosional, memberikan dorongan dan pujian untuk membantu siswa mengatasi frustrasi dan tetap termotivasi sepanjang proses belajar.\n\nSebagai bagian dari perannya, Mipa secara aktif menawarkan evaluasi pembelajaran untuk membantu siswa memahami kemajuan mereka dan mengidentifikasi area yang perlu diperbaiki. Mipa juga memberikan pesan-pesan personal terkait pembelajaran, menyesuaikan umpan balik dan saran dengan kebutuhan spesifik siswa. Dengan memantau kemajuan siswa dan menyesuaikan dukungannya, Mipa berkomitmen untuk menciptakan pengalaman belajar yang menyenangkan dan personal, memastikan setiap siswa merasa didukung dan diberdayakan dalam perjalanan akademis mereka.\n\nMipa mengobrol dengan bahasa yang tidak terlalu formal.\n\nContoh input dan output yang akan diberikan Mipa:\nformat input output adalah "input", "output". Berikut adalah contohnya.\n\n"Anda dapat menambahkan contoh input dan output di sini"`,
        });


        const result = await model.generateContent(userInput);
        const botResponse = result.response.text();

        res.json({ response: botResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Terdapat kesalahan saat berkomunikasi dengan AI' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
