const { calculateAccuracy, calculateTypingSpeed } = require("../utils/utils");

// Stores session Information
const sessions = {};

/* ------------------------------------------------------------------------------------------- */

//                                       Function to create Session

function createSession(difficulty) {
  const sessionId = generateSessionId(); // Random Generation

  // adding a new Session
  sessions[sessionId] = {
    difficulty,
    players: [],
    startTime: null,
    endTime: null,
  };

  return sessionId; // Return the session Id
}

//                                       Function to Add Player to a Session

function addPlayerToSession(sessionId, player) {
  if (sessions[sessionId]) {
    sessions[sessionId].players.push(player); // Add the Player
  }
}

//                                       Function to Remove Player from a Session

function removePlayerFromSession(sessionId, playerId) {
  if (sessions[sessionId]) {
    sessions[sessionId].players = sessions[sessionId].players.filter(
      (player) => player.id !== playerId
    );
    // Filter it
  }
}

//                                       Function to Start Session Timer

function startSessionTimer(sessionId) {
  if (sessions[sessionId]) {
    sessions[sessionId].startTime = new Date().getTime();
  }
}

//                                       Function to End Session

function endSession(sessionId) {
  if (sessions[sessionId]) {
    sessions[sessionId].endTime = new Date().getTime();
  }
}

//                                       Function to Calculate Results

function calculateResults(sessionId) {
  if (sessions[sessionId]) {
    const session = sessions[sessionId]; // Get the session

    const { startTime, endTime } = session;

    if (!startTime || !endTime) {
      // If start and end time are not given
      return [];
    }

    const durationInSeconds = (endTime - startTime) / 1000;

    const results = session.players.map((player) => ({
      username: player.username,
      accuracy: calculateAccuracy(player.text, player.challenge),
      typingSpeed: calculateTypingSpeed(player.text, durationInSeconds),
    }));

    return results;
  }

  return []; // If no session is present
}

//                                       Function to Random Session ID

function generateSessionId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// Export Functionality

module.exports = {
  createSession,
  addPlayerToSession,
  removePlayerFromSession,
  startSessionTimer,
  endSession,
  calculateResults,
};
