const CustomAPIError = require("../errors/custom-api");

const {
  createSession,
  addPlayerToSession,
  removePlayerFromSession,
  startSessionTimer,
  endSession,
  calculateResults,
} = require("./session");

const { generateTypingChallenge } = require("../utils/utils");
const { v4: uuidv4 } = require("uuid");

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 10;
const MAX_LOBBIES = 20;
const LOBBY_WAIT_TIME = 120000; // 2 minutes

// Stores Lobbies Information
let lobbies = {};

/* ------------------------------------------------------------------------------------------------------------------ */

//                                  Function to Find and create a Lobby is no lobby found

function findOrCreateLobby(difficulty, socket) {
  // Find a lobby with the same difficulty and space for more players
  const existingLobby = Object.values(lobbies).find(
    (lobby) =>
      lobby.difficulty === difficulty && lobby.players.length < MAX_PLAYERS
  );

  // If such a lobby exists
  if (existingLobby) {
    // Pushing the Username generated and socket.id
    existingLobby.players.push({ id: socket.id, username: socket.username });

    return existingLobby.id; // Send Existing Lobby Id
  }

  // If there is no existing lobby, creating new one
  if (Object.keys(lobbies).length >= MAX_LOBBIES) {
    throw new CustomAPIError("Maximum number of lobbies reached.");
  }

  const lobbyId = generateRandomId(); // Get Random Id

  lobbies[lobbyId] = {
    id: lobbyId, // Store lobby id
    difficulty, // Store difficulty
    players: [{ id: socket.id, username: socket.username }], // Store 1st player
  };

  return lobbyId; // Send the new lobby ID
}

//                                  Function to Find the player connected to a lobby

function findPlayerLobby(socket) {
  for (const lobbyId in lobbies) {
    const lobby = lobbies[lobbyId];
    if (lobby.players.some((player) => player.id === socket.id)) {
      return lobbyId; // Return Lobby ID
    }
  }

  return null; // Return null if not found
}

//                                  Function to Remove Player from the Lobby

function removePlayerFromLobby(lobbyId, socket) {
  if (lobbies[lobbyId]) {
    // Remove player from the Lobby
    lobbies[lobbyId].players = lobbies[lobbyId].players.filter(
      (player) => player.id !== socket.id
    );
    // Using filter

    // Remove Player from Session
    removePlayerFromSession(lobbies[lobbyId].sessionId, socket.id);
  }
}

//                                  Function to Start Game when required Players are there

function startGame(lobbyId, io) {
  const lobby = lobbies[lobbyId];

  // Get the challenge Text
  const challenge = generateTypingChallenge(lobby.difficulty);

  // Create a new session for the lobby
  const sessionId = createSession(lobby.difficulty);

  // Store the session ID in the lobby
  lobby.sessionId = sessionId;

  // Add all players to the session
  lobby.players.forEach((player) => {
    addPlayerToSession(sessionId, player);
  });

  // Notify all players in the lobby to start the game with the same challenge
  io.to(lobbyId).emit("startGame", { challenge });

  // Start the session timer
  startSessionTimer(sessionId);
}

//                                  Function to Check if Players have Finished or not

function checkGameEnd(lobbyId, io) {
  const lobby = lobbies[lobbyId];

  // Checking If all Players have finished or Not
  if (lobby.players.every((player) => player.finish)) {
    // Calculate Results
    const results = calculateResults(lobbyId);

    // If All have finished, End the session
    endSession(lobbyId);

    // Notify all players in the lobby of the game end and send the results
    io.to(lobbyId).emit("gameEnd", { results });

    // Reset players finish status for the next game
    lobby.players.forEach((player) => (player.finish = false));
  }
}

// Generate username

function generatePlayerId() {
  return uuidv4();
}

// Generate Lobby ID

function generateRandomId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

//                                    Main Function to listen

function initGame(socket, io) {
  // Storing player data in the socket object
  socket.username = `Player-${generatePlayerId()}`;

  // Handle player join lobby event
  socket.on("joinLobby", (difficulty, cb) => {
    const lobbyId = findOrCreateLobby(difficulty, socket);

    // Attach the Player to the Lobby
    socket.join(lobbyId);

    // Notify all players in the lobby that a new player has joined
    io.to(lobbyId).emit("playerJoined", { username: socket.username });

    // If the lobby has enough players, start the game
    if (lobbies[lobbyId].players.length >= MIN_PLAYERS) {
      startGame(lobbyId, io);
    }

    // Callback to send lobby ID to the frontend
    cb(lobbyId);
  });

  // Handle player typing event
  socket.on("playerTyping", (text) => {
    const lobbyId = findPlayerLobby(socket);

    if (lobbyId) {
      io.to(lobbyId).emit("playerTyping", { username: socket.username, text });
    }
  });

  // Handle player finish event
  socket.on("playerFinish", (text) => {
    const lobbyId = findPlayerLobby(socket);

    // At same time check if others have finished or not
    if (lobbyId) {
      io.to(lobbyId).emit("playerFinish", { username: socket.username, text });

      checkGameEnd(lobbyId, io);
    }
  });

  // Handle player disconnect event
  socket.on("disconnect", () => {
    const lobbyId = findPlayerLobby(socket);

    if (lobbyId) {
      removePlayerFromLobby(lobbyId, socket);

      // Notify Players about leaving of a player
      io.to(lobbyId).emit("playerLeft", { username: socket.username });

      // If the lobby is empty, remove it after a delay
      if (lobbies[lobbyId].players.length === 0) {
        setTimeout(() => delete lobbies[lobbyId], LOBBY_WAIT_TIME);
      }
    }
  });
}

// Export the Functionality

module.exports = {
  initGame,
  findOrCreateLobby,
  findPlayerLobby,
  removePlayerFromLobby,
  startGame,
  checkGameEnd,
  generatePlayerId,
  lobbies,
};
