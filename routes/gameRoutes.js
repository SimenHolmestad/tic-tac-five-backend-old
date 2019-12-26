import express from 'express';
import Game from './../app/models/game';

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

export default router;
