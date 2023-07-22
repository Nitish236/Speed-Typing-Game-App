const Router = require("express").Router;

const router = Router();

// Controllers
const {
  getChallenge,
  createChallenge,
} = require("../controllers/challengeController");

// Routers

router.route("/").get(getChallenge).post(createChallenge);

// Export router

module.exports = router;
