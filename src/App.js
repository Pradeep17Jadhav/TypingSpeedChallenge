import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
	const [chars, setChars] = useState("abcdefghijklmnopqrstuvwxyz");
	const [currChar, setCurrChar] = useState("");
	const [inputValue, setInputValue] = useState("");
	const [startTime, setStartTime] = useState(0);
	const [endTime, setEndTime] = useState(0);
	let finishMessage = null;

	const GetLetter = () => {
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
		GetLetter();
	}, []);

	useEffect(()=>{
		console.log("Ended at ", startTime);
	}, [endTime]);

	const CheckInput = (evt) => {
		if(evt.nativeEvent.data == currChar) {
			if(startTime == 0) {
				setStartTime(new Date().getTime());
			}

			let char = currChar;
			let newCurrChar = GetLetter();
			if(newCurrChar == "") {
				setEndTime(new Date().getTime());
			}

			setInputValue(inputValue + char);
		}
	}

	return (
		<div className="App">
			<h1>Typing Speed Challenge</h1>
			<div id="board">
				{currChar}
			</div>
			<input type="text" id="inputbox" value={inputValue} onChange={evt => CheckInput(evt)}></input>
			<button id="reset">Reset</button>
			{endTime != 0 ? <div>You took {endTime - startTime} milliseconds to complete.</div> : null}
		</div>
	);
}

export default App;
