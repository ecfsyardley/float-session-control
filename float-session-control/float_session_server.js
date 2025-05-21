// float_session_server.js
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // serve your HTML file from the 'public' folder

// Endpoint to handle float session start
app.post('/start-float', (req, res) => {
  const { duration, room } = req.body;

  if (!duration || !room) {
    return res.status(400).json({ message: 'Missing duration or room' });
  }

  console.log(`Starting ${duration}-minute float session in ${room}`);

  // Simulated session logic
  console.log(`Fading out lights in ${room}...`);
  console.log(`Playing music in ${room} for 5 minutes...`);

  setTimeout(() => {
    console.log(`Stopping music in ${room}...`);
  }, 5 * 60 * 1000); // 5 minutes

  setTimeout(() => {
    console.log(`Fading lights back in for ${room}...`);
  }, (duration - 5) * 60 * 1000); // Remainder of the duration

  res.json({ message: `Float session started in ${room} for ${duration} minutes.` });
});

app.listen(PORT, () => {
  console.log(`Float Session Server running on http://localhost:${PORT}`);
});
