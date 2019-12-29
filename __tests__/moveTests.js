import mongoose from 'mongoose';
import supertest from 'supertest';
import app from './../app';
import Game from './../app/models/game';
import initialGameData from './../app/constants/initialGameData';

const request = supertest(app);

function createNewGame() {
  // This is needed so the initialGameData does not change.
  return new Game(JSON.parse(JSON.stringify(initialGameData)));
};

describe('move tests', () => {
  beforeAll(async () => {
    // Connect to database
    const url = `mongodb://127.0.0.1/move-test`;
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

    // Delete every game in database
    await Game.deleteMany();
  });

  afterAll(async () => {
    // Remove the database
    mongoose.connection.db.dropDatabase();
    // Close the connection to MongoDB
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Game.deleteMany();
  });

  it('test legal first moves', async done => {
    const game = createNewGame();
    game.name = "My first game";
    await game.save();

    const response1 = await request.post('/api/games/' + game._id + '/move')
      	  .send({
            xPos: 0,
            yPos: 0,
            player: "O"
          });

    expect(response1.status).toBe(200);
    expect(response1.body.name).toEqual('My first game');
    expect(response1.body._id).not.toEqual(undefined);
    expect(response1.body.error).toEqual(undefined);

    expect(response1.body.boardState[0][0]).toEqual("O");
    expect(response1.body.nextToMove).toEqual("X");
    expect(response1.body.history).toEqual([[0, 0, "O"]]);

    const response2 = await request.post('/api/games/' + game._id + '/move')
      	  .send({
            xPos: 1,
            yPos: 0,
            player: "X"
          });

    expect(response2.status).toBe(200);
    expect(response2.body.name).toEqual('My first game');
    expect(response2.body._id).not.toEqual(undefined);
    expect(response2.body.error).toEqual(undefined);

    expect(response2.body.boardState[0][0]).toEqual("O");
    expect(response2.body.boardState[0][1]).toEqual("X");
    expect(response2.body.nextToMove).toEqual("O");
    expect(response2.body.history).toEqual([[0, 0, "O"], [0, 1, "X"]]);

    done();

  });

  it('test moves outside boards', async done => {
    const game = createNewGame();
    await game.save();

    let response = await request.post('/api/games/' + game._id + '/move')
      	.send({
          xPos: -1,
          yPos: 0,
          player: "O"
        });

    expect(response.status).toBe(200);
    expect(response.body._id).toEqual(undefined);
    expect(response.body.error).toEqual("Position was outside of board. Only values between 0 and 20 allowed. Received x:-1 and y:0");

    response = await request.post('/api/games/' + game._id + '/move')
      .send({
        xPos: 0,
        yPos: -1,
        player: "O"
      });

    expect(response.status).toBe(200);
    expect(response.body._id).toEqual(undefined);
    expect(response.body.error).toEqual("Position was outside of board. Only values between 0 and 20 allowed. Received x:0 and y:-1");

    response = await request.post('/api/games/' + game._id + '/move')
      .send({
        xPos: 22,
        yPos: 0,
        player: "O"
      });

    expect(response.status).toBe(200);
    expect(response.body._id).toEqual(undefined);
    expect(response.body.error).toEqual("Position was outside of board. Only values between 0 and 20 allowed. Received x:22 and y:0");

    response = await request.post('/api/games/' + game._id + '/move')
      .send({
        xPos: 0,
        yPos: 21,
        player: "O"
      });

    expect(response.status).toBe(200);
    expect(response.body._id).toEqual(undefined);
    expect(response.body.error).toEqual("Position was outside of board. Only values between 0 and 20 allowed. Received x:0 and y:21");

    done();
  });

  it('test moving when not your turn', async done => {
    const game = createNewGame();
    await game.save();

    let response1 = await request.post('/api/games/' + game._id + '/move')
      	.send({
          xPos: 0,
          yPos: 0,
          player: "X"
        });

    expect(response1.status).toBe(200);
    expect(response1.body._id).toEqual(undefined);
    expect(response1.body.error).toEqual("It is not X's turn.");

    await request.post('/api/games/' + game._id + '/move')
      	.send({
          xPos: 0,
          yPos: 0,
          player: "O"
        });

    let response2 = await request.post('/api/games/' + game._id + '/move')
      	.send({
          xPos: 1,
          yPos: 0,
          player: "O"
        });

    expect(response2.status).toBe(200);
    expect(response2.body._id).toEqual(undefined);
    expect(response2.body.error).toEqual("It is not O's turn.");

    done();
  });

  it('test moves on filled squares', async done => {
    const game = createNewGame();
    game.boardState[0][0] = "O";
    game.boardState[16][15] = "X";
    await game.save();

    let response1 = await request.post('/api/games/' + game._id + '/move')
      	.send({
          xPos: 0,
          yPos: 0,
          player: "O"
        });

    expect(response1.status).toBe(200);
    expect(response1.body._id).toEqual(undefined);
    expect(response1.body.error).toEqual("There is already a cross or circle at square x:0, y:0");

    let response2 = await request.post('/api/games/' + game._id + '/move')
      	.send({
          xPos: 15,
          yPos: 16,
          player: "O"
        });

    expect(response2.status).toBe(200);
    expect(response2.body._id).toEqual(undefined);
    expect(response2.body.error).toEqual("There is already a cross or circle at square x:15, y:16");

    done();
  });

  it('test moving on nonexistent board', async done => {
    const fake_game_id = "5dfcf3c43f0ed01259baaaf5";
        let response = await request.post('/api/games/' + fake_game_id + '/move')
      	.send({
          xPos: 0,
          yPos: 0,
          player: "O"
        });
    expect(response.status).toBe(404);
    done();
  });

  it('test moving on finished board', async done => {
    const game = createNewGame();
    game.winner = "X";
    await game.save();

    let response = await request.post('/api/games/' + game._id + '/move')
      	.send({
          xPos: 0,
          yPos: 0,
          player: "O"
        });

    expect(response.status).toBe(200);
    expect(response.body._id).toEqual(undefined);
    expect(response.body.error).toEqual("This game is finished. No more moves are allowed");
    done();
  });

  it('test missing post data', async done => {
    const game = createNewGame();
    await game.save();

    let response1 = await request.post('/api/games/' + game._id + '/move')
      	.send({
          yPos: 0,
          player: "O"
        });

    expect(response1.status).toBe(200);
    expect(response1.body._id).toEqual(undefined);
    expect(response1.body.error).toEqual("Missing argument: xPos");

    let response2 = await request.post('/api/games/' + game._id + '/move')
      	.send({
          yPos: 0,
        });

    expect(response2.status).toBe(200);
    expect(response2.body._id).toEqual(undefined);
    expect(response2.body.error).toEqual("Missing argument: xPos, player");

    let response3 = await request.post('/api/games/' + game._id + '/move');

    expect(response3.status).toBe(200);
    expect(response3.body._id).toEqual(undefined);
    expect(response3.body.error).toEqual("Missing argument: xPos, yPos, player");
    done();
  });

  it('test illegal player', async done => {
    const game = createNewGame();
    await game.save();

    let response1 = await request.post('/api/games/' + game._id + '/move')
      	.send({
          xPos: 0,
          yPos: 0,
          player: "Freddy"
        });

    expect(response1.status).toBe(200);
    expect(response1.body._id).toEqual(undefined);
    expect(response1.body.error).toEqual('Illegal value for player. Must be "O" or "X"');

    let response2 = await request.post('/api/games/' + game._id + '/move')
      	.send({
          xPos: 0,
          yPos: 0,
          player: "Player1"
        });

    expect(response2.status).toBe(200);
    expect(response2.body._id).toEqual(undefined);
    expect(response2.body.error).toEqual('Illegal value for player. Must be "O" or "X"');

    done();
  });

  it('test illegal coordinates', async done => {
    const game = createNewGame();
    await game.save();

    let response1 = await request.post('/api/games/' + game._id + '/move')
      	.send({
          xPos: "0.1",
          yPos: "0.4",
          player: "O"
        });

    expect(response1.status).toBe(200);
    expect(response1.body._id).toEqual(undefined);
    expect(response1.body.error).toEqual('xPos and yPos must be integers');

    let response2 = await request.post('/api/games/' + game._id + '/move')
      	.send({
          xPos: 0,
          yPos: "The first",
          player: "O"
        });

    expect(response2.status).toBe(200);
    expect(response2.body._id).toEqual(undefined);
    expect(response2.body.error).toEqual('xPos and yPos must be integers');

    done();
  });

  it('test last move made', async done => {
    const game = createNewGame();
    await game.save();

    let response = await request.post('/api/games/' + game._id + '/move')
      	.send({
          xPos: 0,
          yPos: 0,
          player: "O"
        });

    expect(response.status).toBe(200);
    expect(response.body._id).not.toEqual(undefined);
    expect(response.body.timeStarted === response.body.lastMoveMade).toEqual(false);

    done();
  });

  it('test winning horizontally', async done => {
    const game = createNewGame();
    game.boardState[0][0] = "O";
    game.boardState[0][1] = "O";
    game.boardState[0][2] = "O";
    game.boardState[0][3] = "O";
    await game.save();

    let response = await request.post('/api/games/' + game._id + '/move')
      	.send({
          xPos: 4,
          yPos: 0,
          player: "O"
        });

    expect(response.body.winner).toBe("O");
    expect(response.body.nextToMove).toBe(null);
    expect(response.body.winningLine).toEqual( [ [0,0], [0,1], [0,2], [0,3], [0,4] ] );

    done();
  });

  it('test winning vertically', async done => {
    const game = createNewGame();
    game.boardState[0][0] = "X";
    game.boardState[1][0] = "X";
    game.boardState[2][0] = "X";
    game.boardState[3][0] = "X";
    game.nextToMove = "X";
    await game.save();

    let response = await request.post('/api/games/' + game._id + '/move')
      	.send({
          xPos: 0,
          yPos: 4,
          player: "X"
        });

    expect(response.body.winner).toBe("X");
    expect(response.body.nextToMove).toBe(null);
    expect(response.body.winningLine).toEqual( [ [0,0], [1,0], [2,0], [3,0], [4,0] ] );

    done();
  });

  it('test winning diagonally', async done => {
    const game = createNewGame();
    game.boardState[0][0] = "X";
    game.boardState[1][1] = "X";
    game.boardState[2][2] = "X";
    game.boardState[3][3] = "X";
    game.nextToMove = "X";
    await game.save();

    let response = await request.post('/api/games/' + game._id + '/move')
      	.send({
          xPos: 4,
          yPos: 4,
          player: "X"
        });

    expect(response.body.winner).toBe("X");
    expect(response.body.nextToMove).toBe(null);
    expect(response.body.winningLine).toEqual( [ [0,0], [1,1], [2,2], [3,3], [4,4] ] );


    const game2 = new Game(initialGameData);
    game2.boardState[0][4] = "O";
    game2.boardState[1][3] = "O";
    game2.boardState[2][2] = "O";
    game2.boardState[3][1] = "O";
    await game2.save();

    let response2 = await request.post('/api/games/' + game2._id + '/move')
      	.send({
          xPos: 0,
          yPos: 4,
          player: "O"
        });

    expect(response2.body.winner).toBe("O");
    expect(response2.body.nextToMove).toBe(null);
    expect(response2.body.winningLine).toEqual( [ [4,0], [3,1], [2,2], [1,3], [0,4] ] );

    done();
  });
});
