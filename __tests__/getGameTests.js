import mongoose from 'mongoose';
import supertest from 'supertest';
import app from './../app';
import Game from './../app/models/game';
import initialGameData from './../app/constants/initialGameData';

const request = supertest(app);

describe('get game tests', () => {
  beforeAll(async () => {
    // Connect to database
    const url = `mongodb://127.0.0.1/create-game-test`;
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

  it('test get existing game', async () => {
    const game = new Game(initialGameData);
    game.name = "Halla";
    await game.save();

    const response = await request.get('/api/games/' + game._id);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Halla");
    expect(response.body.history).toEqual([]);
  });

  it('test get nonexisting game', async () => {
    const fake_game_id = "5dfcf3c43f0ed01259baaaf5";
    const response = await request.get('/api/games/' + fake_game_id);
    expect(response.status).toBe(404);
  });
});
