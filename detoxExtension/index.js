document.addEventListener('DOMContentLoaded', (event) => {
    //the event occurred
    const threshold = 0.3;

    const text = document.getElementById('text');
    let string = "";

    chrome.tabs.executeScript( {
        code: "window.getSelection().toString();"
    }, (selection) => {

        toxicity.load(threshold).then(model => {

            model.classify(selection).then(predictions => {
                predictions.forEach(prediction =>{
                    var res = '';
                    var strin = '';
                    var a = '&#129324;';
                    var b = '&#128513;';
                    strin += prediction.label.replace('_',' ') + "  &#8594;";
                    string += strin.charAt(0).toUpperCase() + strin.slice(1);
                        if(prediction.results[0].match == true || null){
                            res = a;
                        } else{
                            res = b;
                        }

                    string += (Math.round(prediction.results[0].probabilities[1]* 100))+ "% " + res + "<br>";
                    document.getElementById("text").innerHTML = string;
                })



            });
        });
    });

})
