const { StatusCodes } = require("http-status-codes");
const { lobbies } = require("../game/game");
const NotFoundError = require("../errors/not-found");

const findOpenLobbiesByDifficulty = (req, res) => {
  const { difficulty } = req.query;

  const filteredLobbies = Object.values(lobbies).filter(
    (lobby) => lobby.difficulty === difficulty
  );

  if (filteredLobbies.length == 0) {
    throw new NotFoundError("No lobby with such difficulty");
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: "Lobbies Details", lobbies: filteredLobbies });
};

module.exports = {
  findOpenLobbiesByDifficulty,
};
