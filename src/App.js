import React, { useState, useEffect } from 'react';
import './App.css';

const keyboardData = [
    { id: 'clear', display: 'AC', text: '0', class: 'reset' },
    { id: 'divide', display: '/', text: '/', class: 'operation' },
    { id: 'multiply', display: 'x', text: 'x', class: 'operation' },
    { id: 'seven', display: '7', text: '7', class: 'number' },
    { id: 'eight', display: '8', text: '8', class: 'number' },
    { id: 'nine', display: '9', text: '9', class: 'number' },
    { id: 'subtract', display: '-', text: '-', class: 'operation' },
    { id: 'four', display: '4', text: '4', class: 'number' },
    { id: 'five', display: '5', text: '5', class: 'number' },
    { id: 'six', display: '6', text: '6', class: 'number' },
    { id: 'add', display: '+', text: '+', class: 'operation' },
    { id: 'one', display: '1', text: '1', class: 'number' },
    { id: 'two', display: '2', text: '2', class: 'number' },
    { id: 'three', display: '3', text: '3', class: 'number' },
    { id: 'zero', display: '0', text: '0', class: 'number' },
    { id: 'decimal', display: '.', text: '.', class: 'number' },
    { id: 'equals', display: '=', text: '', class: 'result' }
];

function App() {
  const [displayText, setDisplayText] = useState('0');
  const [displayResult, setDisplayResult] = useState('0');
  const [currentValue, setCurrentValue] = useState('0');
  const [firstNumber, setFirstNumber] = useState(null);
  const [operator, setOperator] = useState(null);
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [waitingForNewNumber, setWaitingForNewNumber] = useState(false);
  const [isNegativeSequence, setIsNegativeSequence] = useState(false);


  useEffect(() => {
    setDisplayResult(currentValue || '0');
  }, [currentValue]);

  const performOperation = (num1, op, num2) => {
    switch (op) {
      case '+': return num1 + num2;
      case '-': return num1 - num2;
      case 'x': return num1 * num2;
      case '/': return num1 / num2;
      default: return NaN;
    }
  };

  const calculate = () => {
    if (firstNumber === null || operator === null) {
        if (hasEvaluated) { 
            setDisplayResult(String(firstNumber));
        } else { 
            setDisplayResult(currentValue);
        }
        return;
    }

    let num1ToCalculate = firstNumber;
    let num2ToCalculate = parseFloat(currentValue);

    if (hasEvaluated) {
        return;
    }


    if (isNaN(num2ToCalculate)) {
      setDisplayText('Erro');
      setCurrentValue('Erro');
      setFirstNumber(null);
      setOperator(null);
      setWaitingForNewNumber(true);
      setHasEvaluated(true);
      return;
    }

    if (operator === '/' && num2ToCalculate === 0) {
      setDisplayText('Divisão por zero');
      setCurrentValue('Divisão por zero');
      setFirstNumber(null);
      setOperator(null);
      setWaitingForNewNumber(true);
      setHasEvaluated(true);
      return;
    }

    let result = performOperation(num1ToCalculate, operator, num2ToCalculate);

    setDisplayText(displayText + ' = ' + String(result));
    setFirstNumber(result);
    setOperator(null);
    setWaitingForNewNumber(true);
    setHasEvaluated(true);
    setCurrentValue(String(result));
    setIsNegativeSequence(false); 
  };

  const clickedButton = (buttonId, buttonText) => {
    switch (buttonId) {
      case 'clear':
        setDisplayText('0');
        setCurrentValue('0');
        setFirstNumber(null);
        setOperator(null);
        setHasEvaluated(false);
        setWaitingForNewNumber(false);
        setIsNegativeSequence(false); 
        break;

      case 'zero':
      case 'one':
      case 'two':
      case 'three':
      case 'four':
      case 'five':
      case 'six':
      case 'seven':
      case 'eight':
      case 'nine':
        if (hasEvaluated || displayText.includes('Erro') || displayText.includes('Divisão por zero')) {
          setDisplayText(buttonText);
          setCurrentValue(buttonText);
          setFirstNumber(null);
          setOperator(null);
          setHasEvaluated(false);
          setWaitingForNewNumber(false);
          setIsNegativeSequence(false); 
        }
        // Se estamos esperando um novo número (após um operador ou resultado anterior)
        // E estamos em uma sequência de número negativo (ex: 5 * -)
        else if (waitingForNewNumber && isNegativeSequence) {
            setCurrentValue(prevVal => prevVal === '-' ? prevVal + buttonText : '-' + buttonText);
            setDisplayText(prevText => prevText + buttonText);
            setWaitingForNewNumber(false);
            setIsNegativeSequence(false); 
        }
        // Se estamos esperando um novo número, mas não uma sequência negativa
        else if (waitingForNewNumber) {
            setCurrentValue(buttonText); // Começa um novo número
            setDisplayText(prevText => prevText + buttonText); // Adiciona ao display
            setWaitingForNewNumber(false);
        }
        else {
          setCurrentValue((prevVal) => (prevVal === '0' ? buttonText : prevVal + buttonText));
          setDisplayText((prevText) => (prevText === '0' ? buttonText : prevText + buttonText));
        }
        break;

      case 'decimal':
        if (hasEvaluated || displayText.includes('Erro') || displayText.includes('Divisão por zero')) {
          setDisplayText('0.');
          setCurrentValue('0.');
          setFirstNumber(null);
          setOperator(null);
          setHasEvaluated(false);
          setWaitingForNewNumber(false);
          setIsNegativeSequence(false);
          return;
        }

        if (waitingForNewNumber) {
          setDisplayText(displayText + '0.');
          setCurrentValue('0.');
          setWaitingForNewNumber(false);
          setIsNegativeSequence(false);
          return;
        }

        if (!currentValue.includes('.')) {
          setCurrentValue((prevVal) => prevVal + buttonText);
          setDisplayText(displayText + buttonText);
        }
        break;

      case 'add':
      case 'subtract':
      case 'multiply':
      case 'divide':
        setHasEvaluated(false); 
        setIsNegativeSequence(false); 

        const lastChar = displayText.slice(-1);
        const isLastCharAnOperator = ['+', '-', 'x', '/'].includes(lastChar);
        const isCurrentButtonSubtract = buttonText === '-';

        // Lógica para permitir "5 * -" (multiplicação por negativo)
        if (isLastCharAnOperator && isCurrentButtonSubtract && lastChar !== '-') {
            setDisplayText(displayText + buttonText);
            setCurrentValue(buttonText); // Define currentValue como '-'
            setWaitingForNewNumber(true);
            setIsNegativeSequence(true); // Marca que estamos em uma sequência de número negativo
        }
        // Lógica para substituir operadores (ex: 5 + x -> 5 x)
        else if (isLastCharAnOperator && !isCurrentButtonSubtract) {
            const newDisplayText = displayText.slice(0, -1) + buttonText;
            setDisplayText(newDisplayText);
            setOperator(buttonText);
            setCurrentValue(buttonText); // Reseta currentValue para o novo operador
        }
        // Lógica para impedir múltiplos '-' consecutivos (ex: 5--)
        else if (isLastCharAnOperator && isCurrentButtonSubtract && lastChar === '-') {
            return;
        }
        else {
            if (firstNumber !== null && operator !== null) {
                // Se já há uma operação pendente, calcula antes de adicionar o novo operador
                const num2 = parseFloat(currentValue);
                if (isNaN(num2)) { return; }
                if (operator === '/' && num2 === 0) {
                    setDisplayText('Divisão por zero');
                    setCurrentValue('Divisão por zero');
                    setHasEvaluated(true);
                    return;
                }
                const result = performOperation(firstNumber, operator, num2);
                setFirstNumber(result);
                setOperator(buttonText);
                setDisplayText(String(result) + buttonText);
                setCurrentValue(buttonText); 
                setWaitingForNewNumber(true);
            } else {
                setFirstNumber(parseFloat(currentValue));
                setOperator(buttonText);
                setDisplayText(displayText + buttonText);
                setCurrentValue(buttonText); 
                setWaitingForNewNumber(true);
            }
        }
        break;

      case 'equals':
        calculate();
        break;

      default:
        setDisplayText('0');
        setCurrentValue('0');
        setFirstNumber(null);
        setOperator(null);
        setHasEvaluated(false);
        setWaitingForNewNumber(false);
        setIsNegativeSequence(false);
        break;
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
              onClick={() => clickedButton(button.id, button.text)}
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