"use client";

// Practice.css
import css from "@/app/styles/practice.module.css";

// Hooks
import { useState, useEffect, useRef } from "react";

// Components
import Challenge from "../components/Challenge";
import Timer from "../components/Timer";

// Axios
import axios from "axios";

/* --------------------------------------------------------------------------------------------------------------------- */

//                                               Practice Page

export default function Practice() {
  const [customText, setCustomText] = useState(""); // Used for taking custom input
  const [challengeText, setChallengeText] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [timerDuration, setTimerDuration] = useState(60);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [CPM, setCPM] = useState(0);
  const [WPM, setWPM] = useState(0);
  const [highlightedChars, setHighlightedChars] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [gameEnded, setGameEnded] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [mistakes, setMistakes] = useState(0);

  const typedTextRef = useRef("");

  // Auto Generate Text
  const handleAutoGenerate = async () => {
    try {
      // alert(`${process.env.URL}api/challenge?difficulty=${difficulty}`);
      const response = await axios.get(
        `${process.env.URL}api/challenge?difficulty=${difficulty}`
      );

      if (response.status === 200) {
        setCustomText(response.data.challenge.text);
      } else {
        setErrorMessage("Failed to fetch auto-generated challenge.");
      }
    } catch (error) {
      setErrorMessage("Failed to fetch auto-generated challenge.");
    }
  };

  // Timer duration Input
  const handleTimerInput = (e) => {
    const value = e.target.value;

    if (!isNaN(value) && value >= 60 && value <= 600) {
      setTimerDuration(Number(value));
    }
  };

  // Start Game
  const handleStartGame = () => {
    if (customText.trim() !== "") {
      setGameStarted(true);
      setChallengeText(customText);
      setGameEnded(false);
    } else {
      setErrorMessage("Please enter some text before starting the game.");
    }
  };

  // When timer ends
  const handleTimerEnd = () => {
    setGameStarted(false);
    setGameEnded(true);

    calculateResults(); // Calculate result
  };

  // Sets the time elapsed from when the timer has started
  const handleElapsedTimeUpdate = (time) => {
    setElapsedTime(timerDuration - time);
  };

  // Starts a timer, which will run out and stop the upcoming input
  useEffect(() => {
    if (gameStarted) {
      const timeout = setTimeout(() => {
        handleTimerEnd();
      }, timerDuration * 1000);
      return () => clearTimeout(timeout);
    }
  }, [gameStarted, timerDuration]);

  // Handles the the text typed by the user, in response to challenge text
  const handleTextCheckInput = (e) => {
    const typedValue = e.target.value;
    typedTextRef.current = typedValue;

    // Each time update variblaes
    setTypedText(typedValue);
    updateAccuracy(typedValue, challengeText);
    updateCPM(typedValue);

    // Check if given length of challenge text is met with all correct input
    if (
      typedValue === challengeText &&
      typedValue.length === challengeText.length
    ) {
      handleTimerEnd();
    }

    // Used to highlight the charaters in the sentence
    updateHighlightedChars(typedValue, challengeText);
  };

  // To update accuracy while user is typing
  const updateAccuracy = (typedText, challengeText) => {
    let correctChars = 0; // Used to display accuracy while user types
    let newMistakes = 0;

    for (let i = 0; i < typedText.length; i++) {
      if (typedText[i] === challengeText[i]) {
        correctChars++;
      } else if (
        highlightedChars[i] == undefined ||
        highlightedChars[i] == true
      )
        newMistakes++; // Counting mistakes that user has done overall, even if he corrects them we will use it the Overall accuracy
    }

    const accuracyValue = (correctChars / challengeText.length) * 100;

    setMistakes(mistakes + newMistakes); // Set mistakes
    setAccuracy(accuracyValue); // Set accuracy
  };

  // To update CPM
  const updateCPM = (typedText) => {
    const minutes = elapsedTime / 60; // Calculated using elapsedTime
    const CPMValue = Math.round(typedText.length / minutes);

    setCPM(CPMValue);
  };

  // To update characters of the challenge text
  const updateHighlightedChars = (typedText, challengeText) => {
    let highlighted = [];
    for (let i = 0; i < typedText.length; i++) {
      if (typedText[i] === challengeText[i]) {
        highlighted.push(true); // vice-versa of below
      } else {
        highlighted.push(false); // Represents character is typed wrong
      }
    }

    setHighlightedChars(highlighted);
  };

  // To caluculate Results
  const calculateResults = () => {
    const text = typedTextRef.current;

    const accuracyValue =
      ((text.length - (text.length == 0 ? 0 : mistakes)) /
        challengeText.length) *
      100;

    const minutes = elapsedTime / 60;
    const CPMValue = Math.round(text.length / minutes);

    const words = text.split(" "); // Calculate the words
    const WPMValue = Math.round(words.length / minutes);

    console.log(minutes + " " + text.length + " " + words.length);
    // Using alert to see values
    // alert("min - " +minutes +" timerTime - " +timerDuration +" CPM - " +CPMValue +" Elpased - " +elapsedTime +" Mistakes - " +mistakes +" Words length - " + words.length );

    // Set overall accuracy, CPM and WPM
    setAccuracy(accuracyValue);
    setCPM(CPMValue);
    setWPM(WPMValue);
  };

  // When restart button is clicked
  const handleRestart = () => {
    setGameStarted(false);
    setGameEnded(false);
    setCustomText("");
    setChallengeText("");
    setTimerDuration(60);
    setTypedText("");
    setAccuracy(0);
    setCPM(0);
    setWPM(0);
    setHighlightedChars([]);
    setErrorMessage("");
    setMistakes(0);
    setElapsedTime(0);
  };

  return (
    <div className={css.challenge}>
      <h1>Solo Mode</h1>
      <div>
        {gameEnded ? (
          // Displayed When game has Ended
          <div className={css.end_region}>
            <h2>Game Has Ended !</h2>
            <label>
              Accuracy: <span>{accuracy.toFixed(2)}%</span>
            </label>
            <label>
              Typing Speed: <span>{CPM} CPM (Characters Per Minute)</span>
            </label>
            <label>
              Typing Speed : <span>{WPM} WPM (Words Per Minute)</span>
            </label>

            <button onClick={handleRestart}>Restart Game</button>
          </div>
        ) : !gameStarted ? (
          // Displayed before Game is Started
          <div className={css.userInputArea}>
            <label htmlFor="custom-text-input">Enter Text to practice :</label>
            <textarea
              id="custom-text-input"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              disabled={gameStarted}
              autoComplete="off"
              spellCheck="false"
            />

            {errorMessage && <p>{errorMessage}</p>}

            <button className={css.autoButton} onClick={handleAutoGenerate}>
              Auto Generate
            </button>

            <label htmlFor="difficulty-select">Select Difficulty:</label>
            <select
              id="difficulty-select"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              disabled={gameStarted}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="expert">Expert</option>
            </select>

            <label htmlFor="timer-duration-input">
              Set Timer Duration (in seconds, 60 to 600):
            </label>
            <input
              id="timer-duration-input"
              type="number"
              value={timerDuration}
              onChange={handleTimerInput}
              disabled={gameStarted}
            />

            <button onClick={handleStartGame} disabled={gameStarted}>
              Start Game
            </button>
          </div>
        ) : (
          // Displayed During Game
          <div className={css.check_region}>
            {gameStarted && (
              <Timer
                duration={timerDuration}
                onTimerEnd={handleTimerEnd}
                update={handleElapsedTimeUpdate}
              />
            )}

            <label>Text to Type :</label>
            <Challenge
              text={challengeText}
              highlightedChars={highlightedChars}
            />

            <label>Typed Text Progress :</label>
            <textarea
              value={typedText}
              onChange={handleTextCheckInput}
              disabled={!gameStarted}
              autoComplete="off"
              spellCheck="false"
              autoFocus
            />

            <label>
              Accuracy : <span>{accuracy.toFixed(2)}%</span>
            </label>
            <label>
              Typing Speed : <span>{CPM} CPM (Characters Per Minute)</span>
            </label>

            <h5>Game in Progress</h5>
          </div>
        )}
      </div>
    </div>
  );
}
