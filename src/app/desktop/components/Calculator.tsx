import { useState } from 'react';
import styles from '../page.module.css'

export default function Calculator() {
  const [inputValue, setInputValue] = useState('0')
  const [operator, setOperator] = useState('')

  const handleNumberClick = (number: string) => {
    if (inputValue === '0') {
      setInputValue(number)
    } else {
      setInputValue(inputValue + number)
    }
  }
  const handleMC = () => {
    setInputValue('0')
  }

  const handleOperator = (operator: string) => {
    if (inputValue !== '0') {
      setInputValue(inputValue + operator)
      setOperator(operator)
    }
  }

  const handleEqual = () => {
    const result = eval(inputValue)
    setInputValue(result.toString())
    setOperator('')
  }

  const handleSin = () => {
    if (inputValue !== '0') {
      const result = Math.sin(Number(inputValue))
      setInputValue(result.toString())
    }
  }

  const handleCos = () => {
    if (inputValue !== '0') {
      const result = Math.cos(Number(inputValue))
      setInputValue(result.toString())
    }
  }

  const handleTan = () => {
    if (inputValue !== '0') {
      const result = Math.tan(Number(inputValue))
      setInputValue(result.toString())
    }
  }

  const handleLn = () => {
    if (inputValue !== '0') {
      const result = Math.log(Number(inputValue))
      setInputValue(result.toString())
    } 
  }

  const handleLog = () => {
    if (inputValue !== '0') {
      const result = Math.log10(Number(inputValue))
      setInputValue(result.toString())
    } 
  }
  
  const handlePi = () => {
    if (inputValue === '0') {
      setInputValue(Math.PI.toString())
    } else {
      setInputValue(inputValue + Math.PI.toString())
    }
  }

  const handleE = () => {
    if (inputValue === '0') {
      setInputValue(Math.E.toString())
    } else {
      setInputValue(inputValue + Math.E.toString())
    }
  }

  const handleSqrt = () => {
    if (inputValue !== '0') {
      const result = Math.sqrt(Number(inputValue))
      setInputValue(result.toString())
    }
  }

  const handleDot = () => {
    if (!inputValue.includes('.')) {
      if (inputValue === '0') {
        setInputValue('0.')
      } else {
        setInputValue(inputValue + '.')
      }
    }
  }


  return (
    <div className={styles.calculator}>
      <div className={styles.display}>
        <input className={styles.input} type="text" value={inputValue} readOnly />
      </div>
      <div className={styles.keys}>
        <div className={styles.row}>
          <button className={styles.button} onClick={() => handleMC()}>MC</button>
          <button className={styles.button} disabled>MR</button>
          <button className={styles.button} disabled>M+</button>
          <button className={styles.button} disabled>M-</button>
        </div>
        <div className={styles.row}>
          <button className={styles.button} onClick={() => handleNumberClick('7')}>7</button>
          <button className={styles.button} onClick={() => handleNumberClick('8')}>8</button>
          <button className={styles.button} onClick={() => handleNumberClick('9')}>9</button>
          <button className={styles.button} onClick={() => handleOperator('/')}>/</button>
        </div>
        <div className={styles.row}>
          <button className={styles.button} onClick={() => handleNumberClick('4')}>4</button>
          <button className={styles.button} onClick={() => handleNumberClick('5')}>5</button>
          <button className={styles.button} onClick={() => handleNumberClick('6')}>6</button>
          <button className={styles.button} onClick={() => handleOperator('*')}>*</button>
        </div>
        <div className={styles.row}>
          <button className={styles.button} onClick={() => handleNumberClick('1')}>1</button>
          <button className={styles.button} onClick={() => handleNumberClick('2')}>2</button>
          <button className={styles.button} onClick={() => handleNumberClick('3')}>3</button>
          <button className={styles.button} onClick={() => handleOperator('-')}>-</button>
        </div>
        <div className={styles.row}>
          <button className={styles.button} onClick={() => handleNumberClick('0')}>0</button>
          <button className={styles.button} onClick={() => handleDot()}>.</button>
          <button className={styles.button} onClick={() => handleEqual()}>=</button>
          <button className={styles.button} onClick={() => handleOperator('+')}>+</button>
        </div>
        <div className={styles.row}>
          <button className={styles.button} onClick={() => handleSin()}>sin</button>
          <button className={styles.button} onClick={() => handleCos()}>cos</button>
          <button className={styles.button} onClick={() => handleTan()}>tan</button>
          <button className={styles.button} onClick={() => handleSqrt()}>√</button>
        </div>
        <div className={styles.row}>
          <button className={styles.button} onClick={() => handleLog()}>log</button>
          <button className={styles.button} onClick={() => handleLn()}>ln</button>
          <button className={styles.button} onClick={() => handleE()}>e</button>
          <button className={styles.button} onClick={() => handlePi()}>π</button>
        </div>
      </div>
    </div>
  );
}