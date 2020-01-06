import express from 'express';
import gameRouter from "./routes/gameRoutes.js";
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();

// Allow all cors requests
app.use(cors());

// Configure app to use bodyParser()
// This will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Register the routes
app.use('/api', gameRouter);

export default app;
