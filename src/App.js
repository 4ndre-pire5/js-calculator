import React, { useState, useEffect } from 'react';

import './App.css';

const keyboardData = [
  { id:'clear', display: 'AC', text:'0', class: 'reset' },
  { id:'divide', display: '/', text:'', class: 'operation' },
  { id:'multiply', display: 'x', text:'', class: 'operation' },

  { id:'seven', display: '7', text:'7', class: 'number' },
  { id:'eight', display: '8', text:'8', class: 'number' },
  { id:'nine', display: '9', text:'9', class: 'number' },
  { id:'subtract', display: '-', text:'', class: 'operation' },

  { id:'four', display: '4', text:'4', class: 'number' },
  { id:'five', display: '5', text:'5', class: 'number' },
  { id:'six', display: '6', text:'6', class: 'number' },
  { id:'add', display: '+', text:'', class: 'operation' },

  { id:'one', display: '1', text:'1', class: 'number' },
  { id:'two', display: '2', text:'2', class: 'number' },
  { id:'three', display: '3', text:'3', class: 'number' },

  { id:'zero', display: '0', text:'0', class: 'number' },
  { id:'decimal', display: '.', text:'.', class: 'number' },
  { id:'equals', display: '=', text:'', class: 'result' }
];

function App() {

  const [displayText, setDisplayText] = useState('');
  const [displayResult, setDisplayResult] = useState('');

  const clickedButton = (buttonId, displayText, displayResult) => {
    switch (buttonId) {
      case 'clear':
        setDisplayText(displayText);
        setDisplayResult(displayText);
      break;
      case 'zero' :
      case 'one' :
      case 'two' :
      case 'three' :
      case 'four' :
      case 'five' :
      case 'six' :
      case 'seven' :
      case 'eight' :
      case 'nine' :
      case 'decimal' :
        setDisplayText(displayText);
        setDisplayResult(displayResult);
      break;

      default:
        setDisplayText('');        
    }
  };

  return (
    <>
      <div id='calc-body'>
        <div id='display'>{displayText}</div>
        <div id='result'>{displayResult}</div>
        <div id='keyboard'>
          {keyboardData.map((button) => (
            <button
              key={button.id}
              id={button.id}
              className={`button ${button.class}`}
              onClick={() => clickedButton(button.id, button.text, button.display)}
            >
              {button.display}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
