const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// SQLite Database Setup (for simplicity)
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// Create a simple 'Issues' table
db.serialize(() => {
  db.run(
    'CREATE TABLE IF NOT EXISTS issues (id INTEGER PRIMARY KEY, description TEXT, status TEXT, agentId INTEGER)'
  );
});

// API to report an issue
app.post('/api/issues', (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  // Simulate automatic assignment to a free agent (for simplicity)
  db.run(
    'INSERT INTO issues (description, status, agentId) VALUES (?, ?, ?)',
    [description, 'open', 1],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create an issue' });
      }
      res.status(201).json({ message: 'Issue reported successfully' });
    }
  );
});

// API to mark an issue as resolved
app.put('/api/issues/:id', (req, res) => {
  const { id } = req.params;

  // Simulate issue resolution (for simplicity)
  db.run(
    'UPDATE issues SET status = ?, agentId = ? WHERE id = ?',
    ['resolved', null, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to resolve the issue' });
      }
      res.json({ message: 'Issue marked as resolved' });
    }
  );
});

// API to get a list of all issues
app.get('/api/issues', (req, res) => {
  db.all('SELECT * FROM issues', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch issues' });
    }
    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
