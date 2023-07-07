let recognition;
let isRecording = false;
var transcript
var buttonId
var audio
var startTime;
const socket = io();
var audio = document.getElementById("myAudio");
socket.on('play', (e) => {
  audio.src = ''
  audio.src = `../public/${e}.mp3`
  audio.play();
})

// AZnzlk1XvdvUeBnXmlld  Domi  
// 21m00Tcm4TlvDq8ikWAM Rachel
// EXAVITQu4vr4xnSDxMaL Bells
// MF3mGyEYCl7XYWbV9V6O Elli
// ErXwobaYiN019PkySvjV Antoni
// TxGEqnHWrfWFTfGW9XjX Josh

const sendPrompt = async (prompt) => {
  let data = {
    prompt: prompt
  }
  fetch('http://localhost:4000/get-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
  
    })
    .catch(error => {
      // Handle any errors
    });
};

// Start Recording 
const startRecording = () => {
  audio.src = ''
  document.getElementById("voiceData").value = ''
  startTime = Date.now();
  console.log(startTime);
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event) => {
    const result = event.results[event.results.length - 1];
    transcript = result[0].transcript
    document.getElementById("voiceData").value = transcript

    console.log('Speech Recognition Result:', transcript);
  };

  recognition.onend = () => {
    console.log('Speech Recognition Ended');
    isRecording = false;
    // sendPrompt(transcript)
  };

  recognition.start();
  isRecording = true;
  console.log('Speech Recognition Started');
};

// Stop Recording
const stopRecording = () => {
  if (recognition && isRecording) {
    recognition.stop();
    isRecording = false;
    console.log('ended');
    sendPrompt(transcript)
  };
}
document.getElementById('startButton').addEventListener('click', startRecording);
document.getElementById('stopButton').addEventListener('click', stopRecording);