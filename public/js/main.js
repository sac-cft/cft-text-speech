let recognition;
let isRecording = false;
var transcript
var buttonId
var audio
var startTime;

const text = "Hello, this is a test message.";
const apiKey = "07c0c82eebd64dc0fd2f33c2480fa06e"; // Replace with your Eleven Labs API key

// API endpoint
const apiUrl = "https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL";
// AZnzlk1XvdvUeBnXmlld  Domi  
// 21m00Tcm4TlvDq8ikWAM Rachel
// EXAVITQu4vr4xnSDxMaL Bells
// MF3mGyEYCl7XYWbV9V6O Elli
// ErXwobaYiN019PkySvjV Antoni
// TxGEqnHWrfWFTfGW9XjX Josh
// Function to convert text to speech
// Function to convert text to speech and play the audio
async function convertTextToSpeech(text) {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "accept": 'audio/mpeg',
        "xi-api-key": '07c0c82eebd64dc0fd2f33c2480fa06e',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error("Failed to convert text to speech.");
    }


    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    console.log("Speech generated successfully.");

    // Create an Audio object
    audio = new Audio();
    audio.src = audioUrl;
    audio.autoplay

    const playButton = document.getElementById(buttonId);
    if (playButton) {
      audio.play().catch(e => {
        window.addEventListener('click', () => {
          
          audio.play()
          // Get the elapsed time in milliseconds
          const elapsedTime = timer.time();
          console.log(`Elapsed time: ${elapsedTime}ms`);
        })
      })
    } else {
      throw new Error(`Button with ID '${buttonId}' not found.`);
    }
    let final = Date.now() - startTime
    console.log(final, "end");
    console.log('playing');
  }
  catch (error) {
    console.error("Error converting text to speech:", error.message);
  }
}






// Send data to Speech
const textarea = document.querySelector("textarea"),
  voiceList = document.querySelector("select"),
  speechBtn = document.querySelector("button");
const synth = window.speechSynthesis;
isSpeaking = true;



voices();

function voices() {
  for (let voice of synth.getVoices()) {
    let selected = voice.name === "Google US English" ? "selected" : "";
    let option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
    voiceList.insertAdjacentHTML("beforeend", option);
  }
}

synth.addEventListener("voiceschanged", voices);

function textToSpeech(text) {
  console.log('speaking');
  let utterance = new SpeechSynthesisUtterance(text);
  for (let voice of synth.getVoices()) {
    if (voice.name === voiceList.value) {
      utterance.voice = voice;
    }
  }
  synth.speak(utterance);
}
const MAX_SEGMENT_LENGTH = 200; // Maximum segment length in characters

function textToSpeechSegments(text) {
  const segments = [];
  let currentIndex = 0;

  while (currentIndex < text.length) {
    const segment = text.substr(currentIndex, MAX_SEGMENT_LENGTH);
    segments.push(segment);
    currentIndex += MAX_SEGMENT_LENGTH;
  }

  segments.forEach((segment, index) => {
    const delay = index * 500; // Delay between segments (adjust as needed)
    setTimeout(() => {
      textToSpeech(segment);
    }, delay);
  });
}
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
      // Process the response data
      console.log(data.result);
      let answer = data.result
      buttonId = "play-button";
      // Call the function with the text you want to convert
      // convertTextToSpeech(answer, buttonId);
      textToSpeechSegments(answer)
    })
    .catch(error => {
      // Handle any errors
    });
};

// Start Recording 
const startRecording = () => {
  startTime = Date.now();
  console.log(startTime);
  // textToSpeech("Hello, this is a test.");
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
  // let data = 'hello abhijeet how are you'
  // textToSpeech(data)
  if (recognition && isRecording) {
    recognition.stop();
    isRecording = false;
    console.log('ended');
    console.log(transcript);
    // sendPrompt(transcript);
    textToSpeechSegments(transcript)

  };
}
document.getElementById('startButton').addEventListener('click', startRecording);
document.getElementById('stopButton').addEventListener('click', stopRecording);


