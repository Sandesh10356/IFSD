// Import required modules
const express = require('express');
const mongoose = require('mongoose');

// Create an Express.js app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define the MongoDB schema and model
const scoreSchema = new mongoose.Schema({
  score: {
    type: Number,
    required: true,
  },
});
const Score = mongoose.model('Score', scoreSchema);

// Connect to MongoDB
mongoose.connect('mongodb+srv://kirank:kiran123@cluster0.ta3czbi.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Handle API endpoints
app.get('/scores', async (req, res) => {
  try {
    const scores = await Score.find();
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch scores' });
  }
});

app.post('/scores', async (req, res) => {
  const { score } = req.body;
  try {
    const newScore = new Score({ score });
    await newScore.save();
    res.status(201).json(newScore);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create score' });
  }
});

app.put('/scores/:id', async (req, res) => {
  const { id } = req.params;
  const { score } = req.body;
  try {
    const updatedScore = await Score.findByIdAndUpdate(
      id,
      { score },
      { new: true }
    );
    res.json(updatedScore);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update score' });
  }
});

app.delete('/scores/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Score.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete score' });
  }
});

// Serve the HTML form
app.get('/', (req, res) => {
  res.send(`
    <html>
      <body>
        <h2>Add Score</h2>
        <form action="/scores" method="post">
          <input type="number" name="score" placeholder="Enter score" required />
          <button type="submit">Add Score</button>
        </form>
      </body>
    </html>
  `);
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});