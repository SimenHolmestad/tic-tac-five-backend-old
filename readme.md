# Tic-tac-five
This project is an API for handling games of tic-tac-five. Normal tic-tac-toe, but with 5 in a row and a much larger board!
## The Game model
The games are stored in the database with the Game model. A game contains a board of 21*21 squares, and starts with an X in the center. Every game contains these data fields:
- `_Id`: The ID of the game.
- `name`: The name of the game (Chosen when the game was created).
- `boardState`: The state of the board. An array consisting of 21*21 values which can be "O", "X" or "-" (nothing).
- `nextToMove`: Can be either "O", "X". `null` if the game is over.
- `history`: The games history (all moves played) as a list of elements of the form `[xPos, yPos, player]`. `xPos` and `yPos` are values between 0 and 20, while `player` can be either "O" or "X".
- `winner`: "O" or "X" if the game is over, else `null`.
- `winningLine`: An array of the 5 squares included in the winning line. If the game is not won, it will be `null`.
- `timeStarted`: The time the game was created.
- `lastMoveMade`: The time recorded last time the game state was updated.

## Endpoints
To interact with the game, these endpoints should be used
### `get /api/active_games`
Returns a list of all games which are not finished. The games returned will have all information except the history.
### `post /api/games`
Requires the parameter `name`. Creates a game and returns it to the user.
### `get /api/games/:game_id`
Returns all information about the game with the given `game_id`. Returns 404 if the game does not exist.
### `post /api/games/:game_id/move`
Requires the parameters `xPos`, `yPos` and `player`. `xPos` and `yPos` should be integers between 0 and 20 (including both 0 and 20). `player` should be either "O" or "X". The API will return the next state of the game and will contain a field `"error"` if the move is illegal.

## How to setup the project
For the project to run you need to have a local mongoDB database running. On a mac, this can be done by following the steps in [here](https://github.com/mongodb/homebrew-brew).

You also need to clone this repository to your local machine and run:

```
npm install
```

Before running

```
npm start
```

## How to run tests
To run the tests, make sure a local mongoDB database is running and run the command `npm test`. The test are written with `jest` and `supertest`.
