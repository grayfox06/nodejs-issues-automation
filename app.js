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

// Create a simple 'SupportAgents' table
db.serialize(() => {
  db.run(
    'CREATE TABLE IF NOT EXISTS support_agents (id INTEGER PRIMARY KEY, isAvailable INTEGER)'
  );
});

// Initialize support agents
db.run('INSERT OR IGNORE INTO support_agents (isAvailable) VALUES (1)');

// API to report an issue
app.post('/api/issues', (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  // Find an available support agent
  db.get(
    'SELECT id FROM support_agents WHERE isAvailable = 1',
    (agentErr, agentRow) => {
      if (agentErr) {
        return res
          .status(500)
          .json({ error: 'Failed to find an available support agent' });
      }

      if (!agentRow) {
        return res.status(500).json({ error: 'No available support agents' });
      }

      const agentId = agentRow.id;

      // Simulate automatic assignment to a free agent (for simplicity)
      db.run(
        'INSERT INTO issues (description, status, agentId) VALUES (?, ?, ?)',
        [description, 'open', agentId],
        function (err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create an issue' });
          }

          // Mark the support agent as busy
          db.run('UPDATE support_agents SET isAvailable = 0 WHERE id = ?', [
            agentId,
          ]);

          res.status(201).json({ message: 'Issue reported successfully' });
        }
      );
    }
  );
});

// API to mark an issue as resolved
app.put('/api/issues/:id', (req, res) => {
  const { id } = req.params;

  // Get the agentId of the resolved issue
  db.get(
    'SELECT agentId FROM issues WHERE id = ?',
    [id],
    (agentErr, agentRow) => {
      if (agentErr) {
        return res
          .status(500)
          .json({ error: 'Failed to find the support agent' });
      }

      if (!agentRow) {
        return res.status(500).json({ error: 'Issue not found' });
      }

      const agentId = agentRow.agentId;

      // Simulate issue resolution (for simplicity)
      db.run(
        'UPDATE issues SET status = ?, agentId = ? WHERE id = ?',
        ['resolved', null, id],
        function (err) {
          if (err) {
            return res
              .status(500)
              .json({ error: 'Failed to resolve the issue' });
          }

          // Mark the specific support agent as available
          db.run('UPDATE support_agents SET isAvailable = 1 WHERE id = ?', [
            agentId,
          ]);

          res.json({ message: 'Issue marked as resolved' });
        }
      );
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

// API to get a list of all agents
app.get('/api/agents', (req, res) => {
  db.all('SELECT * FROM support_agents', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch agents' });
    }
    res.json(rows);
  });
});

// API to delete all issues
app.delete('/api/issues', (req, res) => {
  // Delete all issues from the 'issues' table
  db.run('DELETE FROM issues', function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete issues' });
    }

    // Reset support agents' availability to 'available' after deleting issues
    db.run('UPDATE support_agents SET isAvailable = 1', function (agentErr) {
      if (agentErr) {
        return res
          .status(500)
          .json({ error: 'Failed to reset agent availability' });
      }

      res.json({ message: 'All issues deleted successfully' });
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
