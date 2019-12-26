import express from 'express';
import Game from './../app/models/game';
import initialGameData from './../app/constants/initialGameData';

const router = express.Router();

router.route('/active_games').get(async (req, res) => {
  try {
    const games = await Game.find( {winner: null} );
    // Remove history as it can be long and is not important when listing games
    games.map((game) => {
      game.history = null;
    });

    res.json(games);
  }
  catch (err) {
    res.json(err);
  }
});

router.route('/games').post(async (req, res) => {
  if (! req.body.name) {
    res.json({ error: "You need to provide a name for the game!" });
    return;
  }
  try {
    const game = new Game(initialGameData);
    game.name = req.body.name;
    await game.save();
    res.json(game);
  }
  catch (err) {
    res.json(err);
  }
});

export default router;
