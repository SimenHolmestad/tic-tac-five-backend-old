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

router.route('/games/:game_id').get(async (req, res) => {
  try {
    const gameExists = await Game.exists({ _id: req.params.game_id });
    if (! gameExists) {
      res.status(404).send('The game was not found');
      return;
    }

    const game = await Game.findById(req.params.game_id);
    res.json(game);
  }
  catch (err) {
    res.send(err);
  }
});

router.route('/games/:game_id').get(async (req, res) => {
  try {
    const gameExists = await Game.exists({ _id: req.params.game_id });
    if (! gameExists) {
      res.status(404).send('The game was not found');
      return;
    }

    const game = await Game.findById(req.params.game_id);
    res.json(game);
  }
  catch (err) {
    res.send(err);
  }
});

router.route('/games/:game_id/move').post(async (req, res) => {
  // Check if game in database
  try {
    const gameExists = await Game.exists({ _id: req.params.game_id });
    if (! gameExists) {
      res.status(404).send('The game was not found');
      return;
    }
  }
  catch (err) {
    console.log(err);
    res.send(err);
  }

  // Check if the correct post data fields are sent
  const missingArguments = [];
  if (req.body.xPos == undefined) {
    missingArguments.push('xPos');
  }
  if (req.body.yPos == undefined) {
    missingArguments.push('yPos');
  }
  if (req.body.player == undefined) {
    missingArguments.push('player');
  }
  if (missingArguments.length != 0) {
    const errorString = "Missing argument: " + missingArguments.join(", ");
    res.json({
      error: errorString
    });
    return;
  }

  const xPos = req.body.xPos;
  const yPos = req.body.yPos;
  const player = req.body.player;

  // Find the next player and check if player string is legal
  let nextPlayer;
  if (player == "X") {
    nextPlayer = "O";
  } else if (player == "O") {
    nextPlayer = "X";
  } else {
    res.json({
      error: 'Illegal value for player. Must be "O" or "X"'
    });
    return;
  }

  // Check if position values are legal
  if (!Number.isInteger(xPos) || !Number.isInteger(yPos)) {
    res.json({
      error : 'xPos and yPos must be integers'
    });
    return;
  }

  // Check if the positions are inside the board
  if (xPos < 0 || xPos > 20 || yPos < 0 || yPos > 20) {
    const errorString = "Position was outside of board. Only values between 0 and 20 allowed. Received x:" + xPos + " and y:" + yPos;
    res.json({error : errorString});
    return;
  }

  try {
    // Get game
    const game = await Game.findById(req.params.game_id);

    // Check whether the game is won
    if (game.winner != null) {
      res.json({
        error: 'This game is finished. No more moves are allowed'
      });
      return;
    }

    // Check whether there is already done a move on the specified tile
    if (game.boardState[yPos][xPos] != "-") {
      const errorString = "There is already a cross or circle at tile x:" + xPos + ", y:" + yPos;
      res.json({
        error: errorString
      });
      return;
    }

    // Check if the right player is moving
    if (game.nextToMove != player) {
      const errorString = "It is not " + player + "'s turn.";
      res.json({
        error: errorString
      });
      return;
    }

    // Do the move
    game.boardState[yPos][xPos] = player;
    game.markModified('boardState'); // Needed to make sure mongoose knows the array is updated
    game.nextToMove = nextPlayer;
    const historyMove = [yPos, xPos, player];
    game.history.push(historyMove);
    const currentTime = Date();
    game.lastMoveMade = currentTime;
    await game.save();

    // Send the game data back to the player
    res.json(game);
  }
  catch (err) {
    console.log(err);
    res.send(err);
  }
});

export default router;
