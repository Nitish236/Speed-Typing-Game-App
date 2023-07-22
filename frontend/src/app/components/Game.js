// components/Game.js

import { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";
import styles from "../styles/game.module.css";

const ENDPOINT = "http://localhost:3000"; // Replace with your backend server endpoint

const Game = ({ lobbyId }) => {
  const [lobby, setLobby] = useState(null);
  const [typedText, setTypedText] = useState("");
  const [accuracy, setAccuracy] = useState(0);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    fetchLobby();
    const socket = socketIOClient(ENDPOINT);
    socket.on("lobbyUpdate", (updatedLobby) => {
      setLobby(updatedLobby);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchLobby = async () => {
    try {
      const response = await axios.get(`/api/lobbies/${lobbyId}`);

      setLobby(response.data);

      if (response.data.status === "in progress") {
        startTimer();
      }
    } catch (error) {
      console.error("Error fetching lobby:", error);
    }
  };

  const startTimer = () => {
    setTimerRunning(true);
    let timeRemaining = lobby.duration;

    const interval = setInterval(() => {
      timeRemaining--;
      setTimer(timeRemaining);
      if (timeRemaining === 0) {
        clearInterval(interval);
        handleGameEnd();
      }
    }, 1000);
  };

  const handleTyping = (e) => {
    const typedValue = e.target.value;
    setTypedText(typedValue);
    updateAccuracy(typedValue, lobby.text);
  };

  const updateAccuracy = (typedText, challengeText) => {
    let correctChars = 0;
    for (let i = 0; i < typedText.length; i++) {
      if (typedText[i] === challengeText[i]) {
        correctChars++;
      }
    }

    const accuracyValue = (correctChars / challengeText.length) * 100;
    setAccuracy(accuracyValue);
  };

  const handleGameEnd = async () => {
    try {
      setTimerRunning(false);
      setGameEnded(true);

      // Calculate results
      const results = await axios.post("/api/lobbies/end", {
        lobbyId: lobby._id,
        typedText,
        challengeText: lobby.text,
        duration: lobby.duration,
      });

      // Update lobby status to "finished"
      setLobby({ ...lobby, status: "finished" });

      // Update player scores
      setPlayers(results.data.players);
    } catch (error) {
      console.log(error);
    }
  };

  if (!lobby) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.gameContainer}>
      <h1>Game Lobby</h1>
      <p>Text to Type: {lobby.text}</p>
      <p>Difficulty: {lobby.difficulty}</p>
      <p>Timer: {timer} seconds</p>
      <label>Typed Text Progress:</label>
      <textarea
        value={typedText}
        onChange={handleTyping}
        disabled={lobby.status !== "in progress"}
      />
      <label>Accuracy: {accuracy}%</label>
      <button onClick={handleGameEnd} disabled={lobby.status !== "in progress"}>
        End Game
      </button>
    </div>
  );
};

export default Game;
