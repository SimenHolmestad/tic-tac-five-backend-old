import mongoose from 'mongoose';
import Game from './../app/models/game';
import initialGameData from './../app/constants/initialGameData';

describe('Game model tests', () => {
  beforeAll(async () => {
    // Connect to database
    const url = `mongodb://127.0.0.1/game-model-test`;
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
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

  it('should load from database', async () => {
    const game = new Game(initialGameData);
    await game.save();

    const fetchedGame = await Game.findById(game._id);
    expect(fetchedGame.nextToMove).toBe("O");
    expect(fetchedGame.boardState[0][0]).toBe("-");
    expect(fetchedGame.boardState[20][20]).toBe("-");
    expect(fetchedGame.boardState[10][10]).toBe("X");
  });
});
