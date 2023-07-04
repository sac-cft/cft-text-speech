let recognition;
let isRecording = false;
var transcript


// // ChatGPT API 
// const apiKey = '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';
// // const endpoint = 'https://api.openai.com/v1/engines/davinci/completions';
// const { Configuration, OpenAIApi } = require('openai');

// const configuration = new Configuration({
//   apiKey: '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',
// });
// const openai = new OpenAIApi(configuration);

const sendPrompt = async (prompt) => {
//   const requestBody = {
//     prompt: prompt,
//     max_tokens: 100,
//     temperature: 0.7,
//     n: 1,
//     model: 'text-davinci-003', 
//     // stop: ['\n']
//   };

  // const requestOptions = {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${apiKey}`
  //   },
  //   body: JSON.stringify(requestBody)
  // };

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 100,
      temperature: 1,
    });
    // const response = await fetch(endpoint, requestOptions);
    const data = await response.json();
    const answer = data.choices[0].text.trim();
    console.log('Answer:', answer);
    if(!answer){
      textToSpeech('My name is sac')
    }else{
      textToSpeech(answer)
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
};

// Start Recording 
const startRecording = () => {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event) => {
    const result = event.results[event.results.length - 1];
    transcript =result[0].transcript
    console.log('Speech Recognition Result:', transcript);
  };

  recognition.onend = () => {
    console.log('Speech Recognition Ended');
    isRecording = false;
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
    console.log(transcript);
    sendPrompt(transcript);
  //   const finalResultPromise = new Promise((resolve) => {
  //     recognition.onend = () => {
  //       console.log('Speech Recognition Ended');
  //       const finalResult = recognition.result;
  //       console.log(finalResult);
  //       resolve(finalResult);
  //     };
  //   });

  //   finalResultPromise.then((finalResult) => {
  //     console.log('Final Result:', finalResult);
  //     // Perform further actions with the final result
  //   });
  }
};

document.getElementById('startButton').addEventListener('click', startRecording);
document.getElementById('stopButton').addEventListener('click', stopRecording);


// Send data to Speech
const textarea = document.querySelector("textarea"),
voiceList = document.querySelector("select"),
speechBtn = document.querySelector("button");
let synth = speechSynthesis,
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
    let utterance = new SpeechSynthesisUtterance(text);
    for(let voice of synth.getVoices()){
        if(voice.name === voiceList.value){
            utterance.voice = voice;
        }
    }
    synth.speak(utterance);
}
