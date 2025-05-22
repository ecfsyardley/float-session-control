
const express = require('express');
const bodyParser = require('body-parser');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./floats-started-tracker-ecfsyar-15d454811fea.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const sessions = {};

async function logToGoogleSheet(room, duration) {
  const doc = new GoogleSpreadsheet('YOUR_SHEET_ID_HERE');
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  await sheet.addRow({
    Room: room,
    Duration: duration,
    Timestamp: new Date().toLocaleString(),
    Note: ''
  });
  console.log('✅ Session logged to Google Sheet');
}

function scheduleFadeIn(room) {
  const session = sessions[room];
  if (!session) return;

  const durationMs = (session.duration - 5) * 60 * 1000;
  const remaining = session.startedAt + durationMs - Date.now();

  if (remaining > 0) {
    setTimeout(() => {
      console.log(`⏱️ Fading lights back in for ${room} after ${session.duration} minutes.`);
      delete sessions[room]; // Clear session after fade in
    }, remaining);
  }
}

app.post('/start-float', (req, res) => {
  const { duration, room } = req.body;
  if (!duration || !room) {
    return res.status(400).json({ message: 'Missing duration or room' });
  }

  const isNew = !sessions[room];
  sessions[room] = {
    startedAt: isNew ? Date.now() : sessions[room].startedAt,
    duration: duration
  };

  console.log(`${isNew ? '▶️ Starting' : '🔁 Updating'} ${duration}-minute float session in ${room}`);
  logToGoogleSheet(room, duration).catch(console.error);

  if (isNew) {
    console.log(`🎵 Fading out lights in ${room}...`);
    console.log(`🎶 Playing music in ${room} for 5 minutes...`);

    setTimeout(() => {
      console.log(`🔇 Stopping music in ${room}...`);
    }, 5 * 60 * 1000);
  }

  scheduleFadeIn(room);

  res.json({ message: `Float session ${isNew ? 'started' : 'updated'} in ${room} for ${duration} minutes.` });
});

app.listen(PORT, () => {
  console.log(`Float Session Server running on http://localhost:${PORT}`);
});
