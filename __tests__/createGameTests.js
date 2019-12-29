import mongoose from 'mongoose';
import supertest from 'supertest';
import app from './../app';
import Game from './../app/models/game';

const request = supertest(app);

describe('create game tests', () => {
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

  it('test create game', async () => {
    const response = await request.post('/api/games')
      	  .send({
            name: 'My first game'
          });

    expect(response.status).toBe(200);
    expect(response.body.name).toEqual('My first game');
    expect(response.body._id).not.toEqual(undefined);

    // Make sure the game is also stored in the database
    const gamesInDatabase = await Game.find();
    expect(gamesInDatabase[0].name).toEqual('My first game');
  });

  it('test make game without name', async () => {
    const response = await request.post('/api/games');

    expect(response.status).toBe(200);
    expect(response.body.error).toEqual("You need to provide a name for the game!");
    expect(response._id).toEqual(undefined);
  });
});
