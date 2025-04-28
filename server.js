import express from 'express';
import mysql from 'mysql2';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import fs from 'fs';
import http from 'http';

const app = express();
const host = "localhost";
const port = 8000;

// ES module-friendly __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable CORS
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // change if needed
  database: 'car_rental'
});

db.connect(err => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.message);
  } else {
    console.log('✅ Connected to MySQL');
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

// Serve static files and handle requests
const requestListener = async (req, res) => {
  // Let Express handle API routes
  if (req.url.startsWith("/api")) {
    app(req, res);
    return;
  }

  let filePath = path.join(__dirname, req.url);

  if (req.url === "/" || req.url === "/html/index.html") {
    filePath = path.join(__dirname, "/html/index.html");
  }

  // Ensure the file path is valid and within the allowed directory
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("403 Forbidden");
    return;
  }

  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath).toLowerCase();

    const contentTypes = {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "text/javascript",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".gif": "image/gif",
    };

    const contentType = contentTypes[ext] || "application/octet-stream";

    res.setHeader("Content-Type", contentType);
    res.writeHead(200);
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
};

// Serve static files
//app.use(express.static(path.join(__dirname, 'html')));

// Start the server
const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
