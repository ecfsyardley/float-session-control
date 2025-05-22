
const express = require('express');
const bodyParser = require('body-parser');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./floats-started-tracker-ecfsyar-15d454811fea.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

async function logToGoogleSheet(room, duration) {
  const doc = new GoogleSpreadsheet('19x0oR22IqCCWWsunxbblm1AM5Kek_FV-I-iTpR6PBk8');
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

app.post('/start-float', (req, res) => {
  const { duration, room } = req.body;
  if (!duration || !room) {
    return res.status(400).json({ message: 'Missing duration or room' });
  }

  console.log(`Starting ${duration}-minute float session in ${room}`);
  logToGoogleSheet(room, duration).catch(console.error);

  console.log(`Fading out lights in ${room}...`);
  console.log(`Playing music in ${room} for 5 minutes...`);

  setTimeout(() => {
    console.log(`Stopping music in ${room}...`);
  }, 5 * 60 * 1000);

  setTimeout(() => {
    console.log(`Fading lights back in for ${room}...`);
  }, (duration - 5) * 60 * 1000);

  res.json({ message: `Float session started in ${room} for ${duration} minutes.` });
});

app.listen(PORT, () => {
  console.log(`Float Session Server running on http://localhost:${PORT}`);
});
