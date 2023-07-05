let recognition;
let isRecording = false;
var transcript
// Send data to Speech
const textarea = document.querySelector("textarea"),
voiceList = document.querySelector("select"),
speechBtn = document.querySelector("button");
const synth = window.speechSynthesis;
isSpeaking = true;

voices();

function voices(){
    for(let voice of synth.getVoices()){
        let selected = voice.name === "Google US English" ? "selected" : "";
        let option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
        voiceList.insertAdjacentHTML("beforeend", option);
    }
}

synth.addEventListener("voiceschanged", voices);

function textToSpeech(text){
  console.log('speaking');
    let utterance = new SpeechSynthesisUtterance(text);
    for(let voice of synth.getVoices()){
        if(voice.name === voiceList.value){
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
    prompt:prompt
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
      
      textToSpeechSegments(answer)
    })
    .catch(error => {
      // Handle any errors
    });
};

// Start Recording 
const startRecording = () => {
  // textToSpeech("Hello, this is a test.");
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event) => {
    const result = event.results[event.results.length - 1];
    transcript =result[0].transcript
    document.getElementById("voiceData").value = transcript
    
    console.log('Speech Recognition Result:', transcript);
  };

  recognition.onend = () => {
    console.log('Speech Recognition Ended');
    isRecording = false;
    sendPrompt(transcript)
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
    console.log(transcript);
    sendPrompt(transcript);
  }
};

document.getElementById('startButton').addEventListener('click', startRecording);
document.getElementById('stopButton').addEventListener('click', stopRecording);


