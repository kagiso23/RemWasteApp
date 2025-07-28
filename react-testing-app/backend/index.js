
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

let users = [{ username: 'admin', password: 'admin' }];
let items = [];

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const found = users.find(u => u.username === username && u.password === password);
  if (found) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.get('/items', (req, res) => res.json(items));

app.post('/create', (req, res) => {
  const item = { id: Date.now(), text: req.body.text };
  items.push(item);
  res.status(201).json(item);
});

app.put('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  items = items.map(item => item.id === id ? { ...item, text: req.body.text } : item);
  res.json({ success: true });
});

app.delete('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  items = items.filter(item => item.id !== id);
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
