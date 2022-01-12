
const recording_button = document.getElementById('recording_button')
const recording_icon = document.getElementById('recording_icon')
const text_show = document.getElementById('voice-to-text-show')
const toxicity_result = document.getElementById('toxicity_result')
const threshold = 0.5
let recording = false
let final_result = ''
let label_results = [
    'Identity attack',
    'Insult',
    'Obscene',
    'Severe toxicity',
    'Sexual explicit',
    'Threat',
    'Toxicity'
]
recognition.continuous = true
recognition.interimResults = false
const recognition = new webkitSpeechRecognition()
recognition.lang = 'en-US'
recognition.onresult = function(event) {
    let final_transcript = ''
    
    for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            final_transcript += event.results[i][0].transcript
        }
    }
    
    text_show.innerHTML = final_transcript
    toxicity.load(threshold).then(model => {
        model.classify([final_transcript]).then(predictions => {
            predictions.forEach((pred, index) => {
                if(pred.results[0].match === null || pred.results[0].match === true){
                    final_result = final_result === '' ? 
                                    `${label_results[index]}`
                                    
                                    :`${final_result}, ${label_results[index]}`

                }
            })
    
            toxicity_result.innerHTML = final_result === '' ? 
                                        'No toxicity'
                                        : final_result
                                        
            final_result = ''
        })
    })
}

recording_button.addEventListener('click', () => {
    recording = !recording
    toggle_recording(
        recording_button, 
        recording_icon,
        recognition,
        recording
    )
    toggle_start_opacity(text_show)
    toggle_start_opacity(toxicity_result)
})

function toggle_recording(recording_button, recording_icon, recognition, recording) {
    recording_button.classList.toggle('recording')

    if(recording) {
        recording_icon.src = './assets/microphone-recording.svg'
        recognition.start()
        return
    }

    recording_icon.src = './assets/microphone.svg'
    recognition.stop()
}

function toggle_start_opacity(el) {
    el.classList.toggle('start_opacity')
}
    