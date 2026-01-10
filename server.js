const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const TALKS_FILE = path.join(__dirname, 'talks-data.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Utility functions
async function readTalksFromFile() {
    try {
        const data = await fs.readFile(TALKS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.warn('Could not read talks file, starting with empty array:', error.message);
        return [];
    }
}

async function writeTalksToFile(talks) {
    try {
        await fs.writeFile(TALKS_FILE, JSON.stringify(talks, null, 2));
    } catch (error) {
        console.error('Error writing talks file:', error);
        throw error;
    }
}

// API Routes

// GET /api/talks - Get all talks
app.get('/api/talks', async (req, res) => {
    try {
        const talks = await readTalksFromFile();
        // Sort by date (newest first)
        talks.sort((a, b) => new Date(b.date) - new Date(a.date));
        res.json(talks);
    } catch (error) {
        console.error('Error fetching talks:', error);
        res.status(500).json({ error: 'Failed to fetch talks' });
    }
});

// POST /api/talks - Add a new talk
app.post('/api/talks', async (req, res) => {
    try {
        const { presenter, date, title, description, paper, authors, pdfLink, slidesLink, recordingLink, additionalLinks } = req.body;

        // Validate required fields
        if (!presenter || !date || !title || !description) {
            return res.status(400).json({ error: 'Missing required fields: presenter, date, title, description' });
        }

        const newTalk = {
            id: Date.now(),
            presenter: presenter.trim(),
            date: date.trim(),
            title: title.trim(),
            description: description.trim(),
            paper: paper?.trim() || '',
            authors: authors?.trim() || '',
            pdfLink: pdfLink?.trim() || '',
            slidesLink: slidesLink?.trim() || '',
            recordingLink: recordingLink?.trim() || '',
            additionalLinks: additionalLinks?.trim() || ''
        };

        const talks = await readTalksFromFile();
        talks.unshift(newTalk); // Add to beginning (newest first)
        
        await writeTalksToFile(talks);
        
        res.status(201).json({ message: 'Talk added successfully', talk: newTalk });
    } catch (error) {
        console.error('Error adding talk:', error);
        res.status(500).json({ error: 'Failed to add talk' });
    }
});

// PUT /api/talks/:id - Update a talk
app.put('/api/talks/:id', async (req, res) => {
    try {
        const talkId = parseInt(req.params.id);
        const { presenter, date, title, description, paper, authors, pdfLink, slidesLink, recordingLink, additionalLinks } = req.body;

        const talks = await readTalksFromFile();
        const talkIndex = talks.findIndex(talk => talk.id === talkId);

        if (talkIndex === -1) {
            return res.status(404).json({ error: 'Talk not found' });
        }

        // Update talk
        talks[talkIndex] = {
            ...talks[talkIndex],
            presenter: presenter?.trim() || talks[talkIndex].presenter,
            date: date?.trim() || talks[talkIndex].date,
            title: title?.trim() || talks[talkIndex].title,
            description: description?.trim() || talks[talkIndex].description,
            paper: paper?.trim() || talks[talkIndex].paper,
            authors: authors?.trim() || talks[talkIndex].authors,
            pdfLink: pdfLink?.trim() || talks[talkIndex].pdfLink,
            slidesLink: slidesLink?.trim() || talks[talkIndex].slidesLink,
            recordingLink: recordingLink?.trim() || talks[talkIndex].recordingLink,
            additionalLinks: additionalLinks?.trim() || talks[talkIndex].additionalLinks
        };

        // Resort by date (newest first)
        talks.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        await writeTalksToFile(talks);
        
        res.json({ message: 'Talk updated successfully', talk: talks[talkIndex] });
    } catch (error) {
        console.error('Error updating talk:', error);
        res.status(500).json({ error: 'Failed to update talk' });
    }
});

// DELETE /api/talks/:id - Delete a talk
app.delete('/api/talks/:id', async (req, res) => {
    try {
        const talkId = parseInt(req.params.id);
        
        const talks = await readTalksFromFile();
        const filteredTalks = talks.filter(talk => talk.id !== talkId);
        
        if (filteredTalks.length === talks.length) {
            return res.status(404).json({ error: 'Talk not found' });
        }
        
        await writeTalksToFile(filteredTalks);
        
        res.json({ message: 'Talk deleted successfully' });
    } catch (error) {
        console.error('Error deleting talk:', error);
        res.status(500).json({ error: 'Failed to delete talk' });
    }
});

// DELETE /api/talks - Clear all talks
app.delete('/api/talks', async (req, res) => {
    try {
        await writeTalksToFile([]);
        res.json({ message: 'All talks cleared successfully' });
    } catch (error) {
        console.error('Error clearing talks:', error);
        res.status(500).json({ error: 'Failed to clear talks' });
    }
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/talks', (req, res) => {
    res.sendFile(path.join(__dirname, 'talks.html'));
});

app.get('/people', (req, res) => {
    res.sendFile(path.join(__dirname, 'people.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Cryptography Reading Group server running on http://localhost:${PORT}`);
    console.log(`Serving static files and API endpoints`);
});

module.exports = app;