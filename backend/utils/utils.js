const NotFoundError = require("../errors/not-found");

const Challenge = require("../models/challengeModel");

/* -------------------------------------------------------------------------------------------------- */

//                                         Function to Get Challenge for the Game

async function generateTypingChallenge(difficulty) {
  try {
    // Find all challenges with the chosen difficulty level
    const challenges = await Challenge.aggregate([
      { $match: { difficulty } },
      { $sample: { size: 1 } }, // Select a random challenge from the filtered set
    ]);

    if (challenges.length > 0) {
      return challenges[0].challengeText;
    } else {
      throw new NotFoundError(
        "Challenge not found for the selected difficulty"
      );
    }
  } catch (error) {
    // console.log("Error fetching typing challenge:", error);

    // In case of error Sending a Sentence
    return "The evolution of technology has revolutionized the way we live, work, and connect. From the invention of the telephone by Alexander Graham Bell to the internet's advent, communication has transcended boundaries and connected people across the globe. Social media platforms have transformed the way we share our lives, and artificial intelligence is driving innovations that seemed impossible a few decades ago. Embrace the digital age and witness the wonders it unfolds!";
  }
}

/*  Note:- IMP  --  The below functions are not accurate in comparison to Practice Mode functions */

//                                           Function to calculate Accuracy

function calculateAccuracy(originalText, typedText) {
  if (!originalText || !typedText) {
    throw new NotFoundError(
      "Both originalText and typedText must be provided."
    );
  }

  const originalWords = originalText.trim().split(" ");
  const typedWords = typedText.trim().split(" ");

  const totalWords = originalWords.length;

  let correctWords = 0;
  for (let i = 0; i < totalWords; i++) {
    if (originalWords[i] === typedWords[i]) {
      correctWords++;
    }
  }

  const accuracy = (correctWords / totalWords) * 100;
  return accuracy.toFixed(2);
}

//                                           Function to calculate Typing Speed

function calculateTypingSpeed(text, timeDuration) {
  if (!text || !timeDuration) {
    throw new Error("Yext and Time Duration must be provided.");
  }

  const CPM = text.length / timeDuration; // Characters Per Minute

  return CPM.toFixed(2);
}

// Export Functionality

module.exports = {
  generateTypingChallenge,
  calculateAccuracy,
  calculateTypingSpeed,
};
