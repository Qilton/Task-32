import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createReadStream, statSync } from 'fs';
import cors from 'cors';  // Import the cors package

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable CORS for all routes
app.use(cors({
  origin: 'http://example.com',  // Allow requests only from this origin
  methods: ['GET', 'POST'],      // Allow only specific methods
  allowedHeaders: ['Content-Type'], // Allow only specific headers
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/video', (req, res) => {
  const videoPath = path.join(__dirname, 'public', 'video.mp4');
  const range = req.headers.range;
  const stat = statSync(videoPath);
  const fileSize = stat.size;
  
  if (range) {
    const [start, end] = range.replace(/bytes=/, "").split("-").map(Number);
    const chunkStart = start || 0;
    const chunkEnd = Math.min(end || fileSize - 1, fileSize - 1);

    res.writeHead(206, {
      "Content-Range": `bytes ${chunkStart}-${chunkEnd}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkEnd - chunkStart + 1,
      "Content-Type": "video/mp4",
    });

    const stream = createReadStream(videoPath, { start: chunkStart, end: chunkEnd });
    stream.pipe(res);
  } else {
    res.sendFile(videoPath);
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
