import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Since __dirname is not available in ES modules, define it like this:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Load healthQA.json
const dataPath = path.join(__dirname, 'healthQA.json');
let healthQA = [];

try {
  const fileData = fs.readFileSync(dataPath, 'utf-8');
  healthQA = JSON.parse(fileData);
} catch (err) {
  console.error('Error reading healthQA.json:', err);
}

app.get('/api/answer', (req, res) => {
  const query = (req.query.q || '').toLowerCase().trim();

  if (!query) {
    return res.status(400).json({ error: 'Query parameter q is required' });
  }

  const found = healthQA.find(item =>
    item.q.toLowerCase().includes(query) || query.includes(item.q.toLowerCase())
  );

  if (found) {
    res.json({ answer: found.a });
  } else {
    res.json({ answer: "Sorry, I don't have an answer for that question." });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
