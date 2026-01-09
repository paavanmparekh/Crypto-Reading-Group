document.addEventListener('DOMContentLoaded', function() {
    const talkForm = document.getElementById('talk-form');
    const talksList = document.getElementById('talks-list');
    const noTalksMessage = document.getElementById('no-talks-message');

    loadTalks();

    talkForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            id: Date.now(),
            presenter: document.getElementById('presenter').value,
            date: document.getElementById('date').value,
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            paper: document.getElementById('paper').value,
            authors: document.getElementById('authors').value,
            pdfLink: document.getElementById('pdf-link').value,
            slidesLink: document.getElementById('slides-link').value,
            recordingLink: document.getElementById('recording-link').value,
            additionalLinks: document.getElementById('additional-links').value
        };

        saveTalk(formData);
        talkForm.reset();
        
        showSuccessMessage();
        loadTalks();
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    function saveTalk(talkData) {
        let talks = getTalksFromStorage();
        talks.unshift(talkData);
        localStorage.setItem('cryptoTalks', JSON.stringify(talks));
    }

    function getTalksFromStorage() {
        const talks = localStorage.getItem('cryptoTalks');
        return talks ? JSON.parse(talks) : [];
    }

    function loadTalks() {
        const talks = getTalksFromStorage();
        
        if (talks.length === 0) {
            noTalksMessage.style.display = 'block';
            const existingTalks = document.querySelectorAll('.talk-item');
            existingTalks.forEach(talk => talk.remove());
            return;
        }

        noTalksMessage.style.display = 'none';
        
        const existingTalks = document.querySelectorAll('.talk-item');
        existingTalks.forEach(talk => talk.remove());
        
        talks.forEach(talk => {
            const talkElement = createTalkElement(talk);
            talksList.appendChild(talkElement);
        });
    }

    function createTalkElement(talk) {
        const talkDiv = document.createElement('div');
        talkDiv.className = 'talk-item';
        
        const date = new Date(talk.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

        let html = `
            <div class="talk-header">
                <div>
                    <h3 class="talk-title">${escapeHtml(talk.title)}</h3>
                    <p class="talk-date">${formattedDate}</p>
                </div>
            </div>
            <p class="talk-presenter">Presented by: ${escapeHtml(talk.presenter)}</p>
            <p class="talk-description">${escapeHtml(talk.description)}</p>
        `;

        if (talk.paper && talk.paper.trim()) {
            html += `
                <div class="talk-paper">
                    <p class="paper-title">📚 Paper: ${escapeHtml(talk.paper)}</p>
                    ${talk.authors && talk.authors.trim() ? `<p class="paper-authors">Authors: ${escapeHtml(talk.authors)}</p>` : ''}
                </div>
            `;
        }

        const resources = [];
        if (talk.pdfLink && talk.pdfLink.trim()) {
            resources.push(`<a href="${escapeHtml(talk.pdfLink)}" target="_blank" rel="noopener noreferrer" class="resource-link">PDF</a>`);
        }
        if (talk.slidesLink && talk.slidesLink.trim()) {
            resources.push(`<a href="${escapeHtml(talk.slidesLink)}" target="_blank" rel="noopener noreferrer" class="resource-link slides">Slides</a>`);
        }
        if (talk.recordingLink && talk.recordingLink.trim()) {
            resources.push(`<a href="${escapeHtml(talk.recordingLink)}" target="_blank" rel="noopener noreferrer" class="resource-link recording">Recording</a>`);
        }

        if (talk.additionalLinks && talk.additionalLinks.trim()) {
            const links = talk.additionalLinks.split('\n').filter(link => link.trim());
            links.forEach(link => {
                resources.push(`<a href="${escapeHtml(link.trim())}" target="_blank" rel="noopener noreferrer" class="resource-link other">Resource</a>`);
            });
        }

        if (resources.length > 0) {
            html += `<div class="talk-resources">${resources.join('')}</div>`;
        }

        talkDiv.innerHTML = html;
        return talkDiv;
    }

    function showSuccessMessage() {
        const existingMessage = document.querySelector('.success-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = '✓ Talk added successfully!';
        
        talksList.insertBefore(successMessage, talksList.firstChild);

        setTimeout(() => {
            successMessage.style.transition = 'opacity 0.3s ease';
            successMessage.style.opacity = '0';
            setTimeout(() => successMessage.remove(), 300);
        }, 3000);
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
