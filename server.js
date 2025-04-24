import express from 'express';
import mysql from 'mysql2';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 8000;

// ES module-friendly __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable CORS
app.use(cors());

// Serve everything from the root directory (HTML, JS, CSS, images, etc.)
app.use(express.static(__dirname));

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // change if needed
  database: 'car_rental'
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection failed:', err.message);
  } else {
    console.log('Connected to MySQL');
  }
});

// API: Check availability of a car by model
app.get('/api/car', (req, res) => {
  const model = req.query.model;
  if (!model) return res.status(400).json({ error: 'Missing model parameter' });

  db.query('SELECT available FROM cars WHERE model = ?', [model], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(404).json({ available: false });

    res.json({ available: !!results[0].available });
  });
});

// Serve index.html by default on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

// 404 fallback for unknown paths
app.use((req, res) => {
  res.status(404).send(`
    <h1>404 - Page Not Found</h1>
    <p>The page or resource you requested does not exist.</p>
    <a href="/html/index.html">Go to Home</a>
  `);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
