const { StatusCodes } = require("http-status-codes");
const {
  NotFoundError,
  BadRequestError,
  CustomAPIError,
} = require("../errors/allErr");

// Model
const Challenge = require("../models/challengeModel");

/* ------------------------------------------------------------------------------------------------------ */

//                                        Function to get random challenge

const getChallenge = async (req, res) => {
  const { difficulty } = req.query;

  if (!difficulty) {
    throw new BadRequestError("Difficulty is required");
  }

  // Find all challenges with the chosen difficulty level
  const challenges = await Challenge.aggregate([
    { $match: { difficulty } },
    { $sample: { size: 1 } }, // Select a random challenge from the filtered set
  ]);

  if (challenges.length === 0) {
    throw new NotFoundError("No challenges found for the chosen difficulty");
  }

  const challenge = challenges[0];

  // Send the challenge
  res.status(StatusCodes.OK).json({ msg: "Challenge Details", challenge });
};

//                                       Function to create Challenge

const createChallenge = async (req, res) => {
  const { text, difficulty } = req.body;

  // Validate the input data
  if (!text || !difficulty) {
    throw new BadRequestError("Text and difficulty are required");
  }

  // Create a new challenge
  const newChallenge = await Challenge.create({ text, difficulty });

  if (!newChallenge) {
    throw new CustomAPIError("Server error try after sometime");
  }

  // Send acknowledged
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Challenge created successfully", newChallenge });
};

// EXport Functionality

module.exports = {
  getChallenge,
  createChallenge,
};
