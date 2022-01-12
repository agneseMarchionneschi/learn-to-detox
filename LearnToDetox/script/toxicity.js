const optionsForm = document.querySelector(".options");
const textarea = document.querySelector("textarea");
const wordCountEl = document.querySelector("#info-word_count");
const charCountEl = document.querySelector("#info-char_count");
const loadingEl = document.querySelector(".loading");
const toxicBtn = document.querySelector("#toxic");
const enableToxic = document.querySelector("#enable_toxicity");
let model;
let charCount = 0;
let wordCount = 0;
let words = 0;
let isToxicEnabled = false;
let isToxicLoaded = false;


function handleOptions(e){
    e.preventDefault();
}

function clearToxicityLabels(){
    document.querySelectorAll(".cat").forEach( cat =>{
      cat.style.background = "lightgray";
    });
}

function handleTextInput(e){
  if ( isToxicEnabled ){ clearToxicityLabels(); }
  const content = e.target.value;
  charCount     = content.length;
  words         = content.split(/\s/g); // split(" ");
  wordCount     = words.length;
  wordCountEl.textContent = wordCount;
  charCountEl.textContent = charCount;

}

async function enableToxicityCheck(){

  toxicBtn.toggleAttribute("disabled");

  clearToxicityLabels();
  
  if ( isToxicLoaded ){ 
    isToxicEnabled = !isToxicEnabled;
    return; 
  }
  

  const labelsToInclude = ['identity_attack', 'insult', 'threat', 'toxicity', 'severe_toxicity', 'sexual_explicit', 'obscene' ];
  var soglia = document.getElementById("soglia");
  let threshold = soglia.value;
  loadingEl.style.opacity = 1;
  
  model = await toxicity.load( threshold, labelsToInclude);
  loadingEl.style.opacity = 0;
  isToxicEnabled = true;
  isToxicLoaded = true;
} 

async function checkToxicity(){
  if ( !isToxicEnabled || !isToxicLoaded ){ return; }  
  toxicBtn.classList.add("checking");  
  const predictions = await model.classify([textarea.value]);
  toxicBtn.classList.remove("checking");
  predictions.forEach( prediction => {
    if ( prediction.results[0].match ){
      const probability = Math.round(prediction.results[0].probabilities[1] * 100 );
      document.querySelector(`.${prediction.label}`).style.background = `linear-gradient(90deg, red ${probability}%, lightgray ${100-probability}%)`;

    }
  })
} 

function enableTextarea(){
  textarea.removeAttribute("disabled");
}

optionsForm.addEventListener( "submit", handleOptions );
textarea.addEventListener( "input", handleTextInput );
enableToxic.addEventListener( "click", enableToxicityCheck );

toxicBtn.addEventListener( "click", checkToxicity ); // TFJS