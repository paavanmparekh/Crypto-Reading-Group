# Crypto-Reading-Group Website

A professional website for the Cryptography Reading Group at Stony Brook University with cross-browser sync functionality.

## About

This website serves as the digital home for our cryptography reading group, where PhD students and researchers meet weekly to discuss cutting-edge research papers in cryptography and related areas of computer science.

## Features

- **Home Page**: Overview of the reading group and meeting information
- **Talks Page**: Archive of previous presentations with resources and a form to add new talks
- **People Page**: Meet our team members and faculty advisor
- **Contact Page**: Location, contact information, and meeting details
- **Cross-Browser Sync**: Talks added on any browser/device are instantly available across all browsers
- **Offline Support**: LocalStorage fallback when server is unavailable

## Cross-Browser Sync

The website now includes a Node.js backend that enables true cross-browser synchronization:

- **Server-Side Storage**: Talks are stored centrally on the server, accessible from any browser
- **Real-Time Sync**: Add a talk in Chrome, see it immediately in Firefox, Safari, or any device
- **Offline Fallback**: Uses localStorage as backup when server is unavailable
- **Data Management**: Export/import functionality for backups

## Technology Stack

- **Frontend**: HTML5, CSS3 (with CSS Grid and Flexbox), Vanilla JavaScript
- **Backend**: Node.js with Express.js
- **Data Storage**: JSON file storage with localStorage fallback
- **API**: RESTful endpoints for CRUD operations

## Getting Started

### Option 1: Run with Node.js Server (Recommended for Cross-Browser Sync)

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Server**:
   ```bash
   npm start
   ```

3. **Access the Website**:
   Open http://localhost:3000 in any browser

### Option 2: Static File Hosting (LocalStorage Only)

Simply open `index.html` in a web browser to view the website locally.

For deployment, you can host these files on any static web hosting service such as:
- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Azure Static Web Apps

**Note**: Static hosting will only use localStorage (no cross-browser sync)

## API Endpoints

When running with the Node.js server, the following API endpoints are available:

- `GET /api/talks` - Retrieve all talks
- `POST /api/talks` - Add a new talk
- `PUT /api/talks/:id` - Update a specific talk
- `DELETE /api/talks/:id` - Delete a specific talk
- `DELETE /api/talks` - Clear all talks

## Project Structure

```
.
├── server.js           # Node.js Express server
├── package.json        # Node.js dependencies
├── index.html          # Home page
├── talks.html          # Talks archive and submission form
├── people.html         # Team members page
├── contact.html        # Contact information
├── styles.css          # Main stylesheet
├── script.js           # JavaScript for talks functionality
├── talks-data.json     # Talks data storage
├── .gitignore          # Git ignore file
└── README.md           # This file
```

## Testing Cross-Browser Sync

To test the cross-browser synchronization:

1. Start the server: `npm start`
2. Open http://localhost:3000 in Chrome
3. Add a new talk
4. Open http://localhost:3000 in Firefox/Safari/Edge
5. Verify the talk appears immediately

## Contact

For inquiries, please contact:
- Email: pmparekh@cs.stonybrook.edu
- Phone: +1 (934) 255-3277

## Faculty Advisor

Prof. Omkant Pandey

## License

© 2024 Cryptography Reading Group, Stony Brook University. All rights reserved.
