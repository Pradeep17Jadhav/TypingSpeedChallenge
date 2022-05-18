import './App.css';
import { useEffect, useRef, useState } from 'react';

function App() {
	const mainString = useRef("abcdefghijklmnopqrstuvwxyz");
	// setChars("abcdefghijklmnopqrstuvwxyz");

	const [chars, setChars] = useState(mainString.current);
	const [running, setRunning] = useState(false);
	const [currChar, setCurrChar] = useState("");
	const [inputValue, setInputValue] = useState("");
	const [startTime, setStartTime] = useState(0);
	const [endTime, setEndTime] = useState(0);
	const [timeTaken, setTimeTaken] = useState(0);
	const [intervalId, setIntervalId] = useState(false);
	const [bWon, setWon] = useState(false);


	const getLetter = () => {
		console.log(chars, chars.length);
		let newCurrChar = "";
		if(chars.length) {
			let index = Math.floor(Math.random() * chars.length);
			newCurrChar = chars[index];
			setChars(chars.slice(0, index) + chars.slice(index + 1));
		}
		setCurrChar(newCurrChar);
		return newCurrChar;
	}

	useEffect(() => {
		getLetter();
	}, []);

	useEffect(() => {
		if(chars == mainString.current)
			getLetter();
	}, [chars]);

	const startGame = () => {
		let time = new Date().getTime();
		setStartTime(time);
		setRunning(true);

		if(intervalId) {
			clearInterval(intervalId);
		}

		const id = setInterval(() => {
			setTimeTaken(new Date().getTime() - time);
		}, 1);
		setIntervalId(id);
	}

	const endGame = () => {
		setEndTime(new Date().getTime());
		setCurrChar("Done!");
		clearTimer();
	}

	const clearTimer = () => {
		if(intervalId) {
			clearInterval(intervalId);
		}
		setIntervalId(0);
	}

	const onInput = (evt) => {
		if(evt.target.value[evt.target.value.length - 1] == currChar) {
			if(!running)
				startGame();

			let char = currChar;
			let newCurrChar = getLetter();
			if(newCurrChar == "") {
				endGame();
			}
			setInputValue(inputValue + char);
		}
	}

	const onTextCopyPaste = (evt) => {
		evt.preventDefault();
		return false;
    };

	const onReset = () => {
		clearTimer();
		setStartTime(0);
		setEndTime(0);
		setRunning(false);
		setTimeTaken(0);
		setWon(false);
		setInputValue("");
		setChars(mainString.current);
		let inputbox = document.getElementById("inputbox");
		if(inputbox)
			inputbox.focus();
	}

	return (
		<div className="App">
			<h1 id="title">Typing Speed Challenge</h1>
			<p id="tagline">Let's see how fast you can type the random alphabets!</p>
			<div id="board">
				{currChar}
			</div>
			<input 
				type="text" 
				id="inputbox" 
				value={inputValue} 
				placeholder="Type here to start..."
				onInput={evt => onInput(evt)} 
				onPaste={evt => onTextCopyPaste(evt)} 
				onCopy={evt => onTextCopyPaste(evt)}>
			</input>

			<button 
				id="btnreset"
				onClick={evt => onReset(evt)}
			>
				Reset
			</button>

			<p id="timer">Time: {(timeTaken / 1000).toFixed(3)} s</p>
			<p id="credit">Created by <a href="https://www.linkedin.com/in/pradeep-jadhav/" target="_blank"><b>Pradeep Jadhav</b></a></p>
		</div>
	);
}

export default App;
