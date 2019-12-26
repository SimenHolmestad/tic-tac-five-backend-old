import express from 'express';
import Game from './../app/models/game';

const router = express.Router();

router.route('/active_games').get(async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  }
  catch (err) {
    res.send(err);
  }
});

export default router;
