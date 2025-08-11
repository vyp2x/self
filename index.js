const { Client } = require('discord.js-selfbot-v13');
const express = require('express');
const fs = require('fs');
const path = require('path');

const client = new Client({ checkUpdate: false });
const app = express();

const texts = fs.readFileSync(path.join(__dirname, 'text.txt'), 'utf-8')
  .split('\n')
  .filter(line => line.trim() !== '');

const rawEmojis = fs.readFileSync(path.join(__dirname, 'emoji.txt'), 'utf-8')
  .split('\n')
  .filter(line => line.trim() !== '');

function parseEmoji(raw) {
  const parts = raw.split(':');
  if (parts.length === 2 && /^\d+$/.test(parts[1])) {
    return {
      id: parts[1],
      name: parts[0],
      animated: false
    };
  } else {
    return { name: raw };
  }
}

const emojis = rawEmojis.map(e => parseEmoji(e));

const count = Math.min(texts.length, emojis.length);

let currentIndex = 0;

app.get('/', (req, res) => {
  res.send('<h1>Selfbot is Online 24/7!</h1>');
});

app.listen(3000, () => {
  console.log('Express server is running on port 3000');
});

client.on('ready', () => {
  console.log(`${client.user.tag} is Online and Ready!`);
  changeStatus();
});

function changeStatus() {
  const text = texts[currentIndex];
  const emoji = emojis[currentIndex];

client.user.setPresence({
  activities: [{
    name: text,
    type: 4, // Watching <text>
    emoji: emoji
  }],
  status: 'online'
});

  currentIndex = (currentIndex + 1) % count;
  setTimeout(changeStatus, 15000);
}

client.login(process.env.token);