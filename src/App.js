import './App.css';
import { useEffect, useRef, useState } from 'react';

function App() {
	// const mainString = useRef("abcdefghijklmnopqrstuvwxyz");
	const mainString = useRef("abc");
	const [chars, setChars] = useState(mainString.current);
	const [running, setRunning] = useState(false);
	const [currChar, setCurrChar] = useState("");
	const [inputValue, setInputValue] = useState("");
	const [timeTaken, setTimeTaken] = useState(0);
	const [intervalId, setIntervalId] = useState(false);
	const [bRandom, setRandom] = useState(false);
	const [bWon, setWon] = useState(false);
	const [bUpdatLetterPending, setUpdatLetterPending] = useState(false);

	const getLetter = (bRandomLetter) => {
		let newCurrChar = "";
		if(chars.length) {
			let index = bRandomLetter ? (Math.floor(Math.random() * chars.length)) : 0;
			newCurrChar = chars[index];
			setChars(chars.slice(0, index) + chars.slice(index + 1));
		}
		setCurrChar(newCurrChar);
		return newCurrChar;
	}

	useEffect(() => {
		getLetter(bRandom);
	}, []);

	useEffect(() => {
		if(chars == mainString.current || bUpdatLetterPending)
		{
			getLetter(bRandom);
			if(bUpdatLetterPending)
				setUpdatLetterPending(false);
		}
	}, [chars]);

	const startGame = () => {
		let time = new Date().getTime();
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
		setCurrChar("Done!");
		setWon(true);
		clearTimer();
		let inputbox = document.getElementById("inputbox");
		if(inputbox)
			inputbox.blur();
	}

	const clearTimer = () => {
		if(intervalId) {
			clearInterval(intervalId);
		}
		setIntervalId(0);
	}

	const onInput = (evt) => {
		if(evt.target.value[evt.target.value.length - 1].toLowerCase() == currChar.toLowerCase()) {
			if(!running)
				startGame();

			let char = currChar;
			let newCurrChar = getLetter(bRandom);
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
		setWon(false);
		setRunning(false);
		setTimeTaken(0);
		setInputValue("");
		setChars(mainString.current);
		let inputbox = document.getElementById("inputbox");
		if(inputbox)
			inputbox.focus();
	}

	const onRandomCheckChange = (evt) => {
		if(running) {
			evt.preventDefault();
			evt.target.checked = !evt.target.checked;
			return;
		}
		setUpdatLetterPending(true);
		setRandom(evt.target.checked);
		setChars(mainString.current);
	}

	let shareElement = null;
	if(bWon) {
		let shareHref = "whatsapp://send?text=Can you beat my score in Typing Speed Challenge? " +
		"I completed the " + (bRandom ? "random" : "ordered") + " alphabets challenge within " + (timeTaken / 1000).toFixed(3) + " seconds.%0A%0A" +
			"Try now! - https://pradeep17jadhav.github.io/TypingSpeedChallenge";
		shareElement =
			<p id="share">Great! Now let's challenge your friends to beat you!
				<a href={shareHref}>
					<svg viewBox="0 0 32 32" className="whatsapp-icon">
						<path d=" M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.478-1.318.13-.33.244-.73.244-1.088 0-.058 0-.144-.03-.215-.1-.172-2.434-1.39-2.678-1.39zm-2.908 7.593c-1.747 0-3.48-.53-4.942-1.49L7.793 24.41l1.132-3.337a8.955 8.955 0 0 1-1.72-5.272c0-4.955 4.04-8.995 8.997-8.995S25.2 10.845 25.2 15.8c0 4.958-4.04 8.998-8.998 8.998zm0-19.798c-5.96 0-10.8 4.842-10.8 10.8 0 1.964.53 3.898 1.546 5.574L5 27.176l5.974-1.92a10.807 10.807 0 0 0 16.03-9.455c0-5.958-4.842-10.8-10.802-10.8z" fillRule="evenodd">
						</path>
					</svg>
				</a>
			</p>
	}



	return (
		<div className="App">
			<h1 id="title">Typing Speed Challenge</h1>
			<p id="tagline">Let's see how fast you can type the {bRandom ? "random" : "ordered"} alphabets!</p>

			<label className="switch">
				<input id="randomcheck" type="checkbox" onChange={evt => onRandomCheckChange(evt)} />
				<span className="slider round"></span>
			</label>

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

			<p id="timer" className={bWon ? "won" : ""}>Time: {(timeTaken / 1000).toFixed(3)}s</p>
			{shareElement}
			<p id="credit">Created by <a href="https://www.linkedin.com/in/pradeep-jadhav/" target="_blank">Pradeep Jadhav</a></p>
		</div>
	);
}

export default App;
