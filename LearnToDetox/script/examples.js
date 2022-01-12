const samples = [
  {
    'id': '1',
    'text':
        'Stupid stop deleting my stuff asshole go die and fall in a hole go to hell!'
  },
  {
    'id': '2',
    'text':
        'you are a big poo poo face and smell like a frog'
  },
  
  {
    'id': '3',
    'text':
        'I respect your point of view, and when this discussion originated on 8th April I would have tended to agree with you.'
  },
  {
    'id': '4',
    'text':
        'Let’s remember - you’re so stupid and indeed pathetic you don’t even use your own name'
  }
];

let model, labels;
const threshold = 0.5;
const classify = async (inputs) => {
  const results = await model.classify(inputs);
  return inputs.map((d, i) => {
    const obj = {'text': d};
    results.forEach((classification) => {
      var x = obj[classification.label] =(Math.round(classification.results[i].probabilities[1] * 100)+ '%')
    });
return obj;
  });
};

const addPredictions = (predictions) => {
  const tableWrapper = document.querySelector('#table-wrapper');

  predictions.forEach(d => {
    const predictionDom = `<div class="rowt">
      <div class="text">${d.text}</div>
      ${
        labels
            .map(
                label => {return `<div class="${
                                 'label' +
                    (d[label] === true ? ' positive' :
                                         '')}">${d[label]}</div>`})
            .join('')}
    </div>`;
    tableWrapper.insertAdjacentHTML('beforeEnd', predictionDom);
  });
};

const predict = async () => {
  model = await toxicity.load(threshold);
  labels = model.model.outputNodes.map(d => d.split('/')[0]);

  const tableWrapper = document.querySelector('#table-wrapper');
  tableWrapper.insertAdjacentHTML(
      'beforeend', `<div class="rowt">
    <div class="text">TEXT</div>
    ${labels.map(label => {
              return `<div class="label">${label.replace('_', ' ')}</div>`;
            }).join('')}
  </div>`);

  const predictions = await classify(samples.map(d => d.text));
  addPredictions(predictions);
  
};

predict();
