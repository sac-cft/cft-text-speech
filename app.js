const express = require("express");
const app = express();
// const server = require("http").createServer(app);
const server = require('http').Server(app);
const io = require('socket.io')(server);
const PORT = 4000;
const path = require("path");
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const perf = require('execution-time')();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use("/public", express.static(path.join(__dirname, "public")));
const { Configuration, OpenAIApi } = require('openai');

server.listen(PORT, () => { console.log(`server started on ${PORT} `) })

app.use(cors());


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.get('/', function (req, res) {
  res.render("main.ejs");
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const voice = require('elevenlabs-node');
const fs = require('fs');

const apiKey = process.env.ELEVEN_LAB_API_KEY; // Your API key from Eleven Labs
const voiceID = '21m00Tcm4TlvDq8ikWAM';            // The ID of the voice you want to get
const textInput = `Hey this on eis tetsing`

io.on('connection', function (socket) {
  console.log("connceted");

})

app.post('/get-data', async (req, res) => {
  console.log(req.body);
  try {
    const { messages } = {
      "messages": [
        { "role": "system", "content": "Provide a short answer." },
        { "role": "user", "content":`${req.body.prompt}` }
      ]
    };

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
      // max_tokens: 50,
      temperature: 0
    });

    const response = completion.data.choices[0].message;
    console.log(response.content);
    let result = response.content
    voice.textToSpeechStream(apiKey, voiceID, result,0.2,0.7).then(res => {
      var fileName = ''
      var num = ''
      num = Date.now()
      fileName = `./public/${num}.mp3`
      const writeStream = fs.createWriteStream(fileName);
      res.pipe(writeStream);
      writeStream.on('finish', () => {
        console.log('Speech generated successfully.');
        io.emit('play',num)
      });
    });
    // res.json({ result });
    return
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Something went wrong' });
  }

  // const prompt = req.body.prompt; // Assuming prompt is available in the request body
  // const endpoint = 'https://api.openai.com/v1/engines/davinci/completions';
  // const requestBody = {
  //   prompt: prompt,
  // max_tokens: 100,
  // temperature: 0.7,
  // n: 1,
  //   // model: 'text-davinci-003', 
  //   // stop: ['\n']
  // };

  // const requestOptions = {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
  //   },
  //   body: JSON.stringify(requestBody)
  // };

  // try {
  //   const response = await fetch(endpoint, requestOptions); // Assuming 'endpoint' is defined
  //   const data = await response.json();
  //   const answer = data.choices[0].text.trim();
  //   console.log('Answer:', answer);
  //   const regex = /[^\w\s]/gi;
  //   const result = answer.replace(regex, '');
  //   res.json({ result });

  // } catch (error) {
  //   console.error('Error:', error);
  // }
});
