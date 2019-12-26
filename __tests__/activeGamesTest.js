import mongoose from 'mongoose';
import supertest from 'supertest';
import app from './../app';
import Game from './../app/models/game';
import initialGameData from './../app/constants/initialGameData';

const request = supertest(app);

describe('active_games endpoint test', () => {
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

  it('test no games returned', async done => {
    const res = await request.get('/api/active_games');
    expect(res.status).toBe(200);
    expect(res.body).toEqual( [] );
    done();
  });

  it('test game returned', async done => {
    const game = new Game(initialGameData);
    await game.save();
    const res = await request.get('/api/active_games');
    expect(res.status).toBe(200);
    expect(res.body).not.toEqual( [] );
    expect(res.body[0].name).toEqual("Untitled game");
    done();
  });

  it('test multiple games returned', async done => {
    const game1 = new Game(initialGameData);
    await game1.save();

    const game2 = new Game(initialGameData);
    await game2.save();

    const res = await request.get('/api/active_games');
    expect(res.status).toBe(200);
    expect(res.body.length).toEqual(2);
    done();
  });

  it('test only unfinished games returned', async done => {
    const game1 = new Game(initialGameData);
    await game1.save();

    // game2 should now be considered finished as it has a winner
    const game2 = new Game(initialGameData);
    game2.winner="O";
    await game2.save();

    const res = await request.get('/api/active_games');
    expect(res.status).toBe(200);
    expect(res.body.length).toEqual(1);
    done();
  });

  it('test history not returned', async done => {
    const game = new Game(initialGameData);
    game.history = ["this", "can", "get", "very", "long"];
    await game.save();

    const res = await request.get('/api/active_games');
    expect(res.status).toBe(200);
    expect(res.body[0].history).toEqual(null);
    done();
  });
});
