require("express-async-errors");
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { createServer } = require("http");
const { Server } = require("socket.io");

// Create Express app
const app = express();

// Create http server
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: `http://localhost:${process.env.PORT}`,
  },
});

// Import Database connection
const connectToDatabase = require("./database/connection");

// Importing error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Importing Route
const challengeRoutes = require("./routes/challengeRoutes");

// Import initGame function to listen
const { initGame } = require("./game/game");

// Handle socket connections
io.on("connection", (socket) => {
  initGame(socket, io);
});

/* --------------------------------------------------------------------------------------------------------- */

app.use("/api/challenge", challengeRoutes);

/* ---------------------------------------------------------------------------------------------------------- */

// Middleware when route is not found
app.use(notFoundMiddleware);
// Middleware for error handler
app.use(errorHandlerMiddleware);

/*  ---------------------------------------------------------------------- */

// Function to start the server

async function startServer() {
  try {
    await connectToDatabase();
    console.log("Connected to Database -- ");

    httpServer.listen(process.env.PORT, () => {
      console.log(`Server listening on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Error : ", error);
  }
}

startServer();
