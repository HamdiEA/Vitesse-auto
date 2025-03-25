import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from "dotenv";
import db from "./db.js";

// Load SQL env variables
dotenv.config({ path: path.resolve('./sql.env') });

const host = "localhost";
const port = 8000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const requestListener = async (req, res) => {
    // API Routes
    if (req.url === "/api/cars" && req.method === "GET") {
        try {
            const [rows] = await db.query("SELECT * FROM cars");
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(rows));
        } catch (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Database error" }));
        }
        return;
    }

    if (req.url === "/api/cars/available" && req.method === "GET") {
        try {
            const [rows] = await db.query("SELECT * FROM cars WHERE available = 1");
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(rows));
        } catch (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Database error" }));
        }
        return;
    }

    if (req.url.startsWith("/api/cars/") && req.url.endsWith("/availability") && req.method === "PUT") {
        const id = req.url.split("/")[3];
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", async () => {
            try {
                const { available } = JSON.parse(body);
                await db.query("UPDATE cars SET available = ? WHERE id = ?", [available, id]);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true }));
            } catch (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Database update error" }));
            }
        });
        return;
    }

    // Unknown API route
    if (req.url.startsWith("/api/")) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "API route not found" }));
        return;
    }

    //Static files
    let filePath = path.join(__dirname, req.url);
    if (req.url === "/" || req.url === "/index.html") {
        filePath = path.join(__dirname, "index.html");
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

// Create and start server
const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`);
});
