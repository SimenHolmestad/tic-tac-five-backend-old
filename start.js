import app from './app.js';
import mongoose from 'mongoose';

// Connect to the database
const url = 'mongodb://127.0.0.1:27017/tic-tac-five';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.once('open', _ => {
  console.log('Database connected:', url);
});

db.on('error', err => {
  console.error('connection error:', err);
});

const port = process.env.PORT || 8080; // Set the port

app.listen(port);
console.log('Listening for requests on port ' + port);
