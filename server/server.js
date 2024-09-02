import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createReadStream, statSync } from 'fs';
import cors from 'cors';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable CORS for all routes
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/video', (req, res) => {
  const videoPath = path.join(__dirname, 'public', 'video.mp4');
  const range = req.headers.range;
  const stat = statSync(videoPath);
  const fileSize = stat.size;

  // Define the chunk size (1 MB)
  const CHUNK_SIZE = 1 * 1024 * 1024; // 1 MB

  if (range) {
    const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
    const start = parseInt(startStr, 10);
    const end = endStr ? parseInt(endStr, 10) : Math.min(start + CHUNK_SIZE - 1, fileSize - 1);

    const chunkStart = start || 0;
    const chunkEnd = Math.min(end, fileSize - 1);

    res.writeHead(206, {
      "Content-Range": `bytes ${chunkStart}-${chunkEnd}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkEnd - chunkStart + 1,
      "Content-Type": "video/mp4",
    });

    const stream = createReadStream(videoPath, { start: chunkStart, end: chunkEnd });
    stream.pipe(res);
  } else {
    // Serve the entire file if no range is specified
    res.sendFile(videoPath);
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
