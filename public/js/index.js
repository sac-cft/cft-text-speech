const recordBtn = document.querySelector(".record"),
  result = document.querySelector(".result"),
  downloadBtn = document.querySelector(".download"),
  inputLanguage = document.querySelector("#language"),
  clearBtn = document.querySelector(".clear");

let SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition,
  recognition,
  recording = false;


const apiKey = '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';
const endpoint = 'https://api.openai.com/v1/engines/davinci/completions';


const sendPrompt = async (prompt) => {
  const requestBody = {
    prompt: prompt,
    max_tokens: 100,
    temperature: 0.7,
    n: 1,
    stop: ['\n']
  };

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestBody)
  };

  try {
    const response = await fetch(endpoint, requestOptions);
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

function populateLanguages() {
  languages.forEach((lang) => {
    const option = document.createElement("option");
    option.value = lang.code;
    option.innerHTML = lang.name;
    inputLanguage.appendChild(option);
  });
}

populateLanguages();

function speechToText() {
  try {
    recognition = new SpeechRecognition();
    recognition.lang = inputLanguage.value;
    recognition.interimResults = true;
    recordBtn.classList.add("recording");
    recordBtn.querySelector("p").innerHTML = "Listening...";
    recognition.start();
    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      //detect when intrim results
      if (event.results[0].isFinal) {
        result.innerHTML += " " + speechResult;
        result.querySelector("p").remove();
      } else {
        //creative p with class interim if not already there
        if (!document.querySelector(".interim")) {
          const interim = document.createElement("p");
          interim.classList.add("interim");
          result.appendChild(interim);
        }
        //update the interim p with the speech result
        document.querySelector(".interim").innerHTML = " " + speechResult;
      }
      // downloadBtn.disabled = false;
    };
    recognition.onspeechend = () => {
      speechToText();
    };
    recognition.onerror = (event) => {
      stopRecording();
      if (event.error === "no-speech") {
        // alert("No speech was detected. Stopping...");
        var result = document.getElementById('result')
        result.style.display = 'block'
        console.log(result.innerText);
        
      } else if (event.error === "audio-capture") {
        alert(
          "No microphone was found. Ensure that a microphone is installed."
        );
      } else if (event.error === "not-allowed") {
        alert("Permission to use microphone is blocked.");
      } else if (event.error === "aborted") {
        alert("Listening Stopped.");
        var result = document.getElementById('result')
        result.style.display = 'block'
        console.log(result.innerText);
      } else {
        alert("Error occurred in recognition: " + event.error);
      }
    };
  } catch (error) {
    recording = false;

    console.log(error);
  }
}

recordBtn.addEventListener("click", () => {
  if (!recording) {
    speechToText();
    recording = true;
  } else {
    stopRecording();
  }
});

function stopRecording() {
  recognition.stop();
  recordBtn.querySelector("p").innerHTML = "Start Listening";
  recordBtn.classList.remove("recording");
  recording = false;
}

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

// speechBtn.addEventListener("click", e =>{
//     e.preventDefault();
//     if(textarea.value !== ""){
//         if(!synth.speaking){
//             textToSpeech(textarea.value);
//         }
//         if(textarea.value.length > 50){
//             setInterval(()=>{
//                 if(!synth.speaking && !isSpeaking){
//                     isSpeaking = true;
//                     speechBtn.innerText = "Convert To Speech";
//                 }else{
//                 }
//             }, 500);
//             if(isSpeaking){
//                 synth.resume();
//                 isSpeaking = false;
//                 speechBtn.innerText = "Pause Speech";
//             }else{
//                 synth.pause();
//                 isSpeaking = true;
//                 speechBtn.innerText = "Resume Speech";
//             }
//         }else{
//             speechBtn.innerText = "Convert To Speech";
//         }
//     }
// });
