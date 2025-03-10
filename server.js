import http from "http";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const host = "localhost";
const port = 8000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const requestListener = async (req, res) => {
    let filePath = path.join(__dirname, req.url);
    
    // Default to index.html if root is accessed
    if (req.url === "/" || req.url === "/index.html") {
        filePath = path.join(__dirname, "index.html");
    }

    // Check if file exists
    if (fs.existsSync(filePath)) {
        const ext = path.extname(filePath).toLowerCase();
        
        // Define supported content types
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

        // Serve the file with the correct content type
        res.setHeader("Content-Type", contentType);
        res.writeHead(200);
        fs.createReadStream(filePath).pipe(res);
    } else {
        // File not found, return 404
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
    }
};

const server = http.createServer(requestListener);

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});