document.addEventListener('DOMContentLoaded', function() {
    const talkForm = document.getElementById('talk-form');
    const talksList = document.getElementById('talks-list');
    const noTalksMessage = document.getElementById('no-talks-message');

    loadTalks();

    function loadTalksFromJson() {
        return fetch('talks-data.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load talks data');
                }
                return response.json();
            })
            .then(talks => {
                localStorage.setItem('cryptoTalks', JSON.stringify(talks));
                return talks;
            })
            .catch(error => {
                console.warn('Could not load talks from JSON, using localStorage:', error);
                return getTalksFromStorage();
            });
    }

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
        // Try to load from JSON first, fallback to localStorage
        loadTalksFromJson().then(talks => {
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

    // Data management functions
    function setupDataManagement() {
        const exportBtn = document.getElementById('export-data');
        const importBtn = document.getElementById('import-data');
        const importFile = document.getElementById('import-file');
        const clearBtn = document.getElementById('clear-data');

        if (exportBtn) {
            exportBtn.addEventListener('click', exportTalksData);
        }
        if (importBtn) {
            importBtn.addEventListener('click', () => importFile.click());
        }
        if (importFile) {
            importFile.addEventListener('change', importTalksData);
        }
        if (clearBtn) {
            clearBtn.addEventListener('click', clearAllTalks);
        }
    }

    function exportTalksData() {
        const talks = getTalksFromStorage();
        const dataStr = JSON.stringify(talks, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        const date = new Date().toISOString().split('T')[0];
        link.download = `crypto-talks-backup-${date}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showDataManagementMessage('Talks data exported successfully!', 'success');
    }

    function importTalksData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedTalks = JSON.parse(e.target.result);
                
                if (!Array.isArray(importedTalks)) {
                    throw new Error('Invalid data format: expected an array of talks');
                }

                // Validate each talk has required fields
                const validTalks = importedTalks.filter(talk => {
                    return talk.id && talk.presenter && talk.date && talk.title && talk.description;
                });

                if (validTalks.length === 0) {
                    throw new Error('No valid talks found in the file');
                }

                // Merge with existing talks (avoid duplicates)
                const existingTalks = getTalksFromStorage();
                const existingIds = new Set(existingTalks.map(talk => talk.id));
                
                const newTalks = validTalks.filter(talk => !existingIds.has(talk.id));
                const mergedTalks = [...existingTalks, ...newTalks];
                
                // Sort by date (newest first)
                mergedTalks.sort((a, b) => new Date(b.date) - new Date(a.date));
                
                localStorage.setItem('cryptoTalks', JSON.stringify(mergedTalks));
                loadTalks();
                
                const message = newTalks.length > 0 
                    ? `Successfully imported ${newTalks.length} new talks!`
                    : 'All talks already exist in the system.';
                showDataManagementMessage(message, 'success');
                
            } catch (error) {
                showDataManagementMessage(`Error importing talks: ${error.message}`, 'error');
            }
        };
        reader.readAsText(file);
    }

    function clearAllTalks() {
        if (confirm('Are you sure you want to delete all talks? This action cannot be undone.')) {
            localStorage.removeItem('cryptoTalks');
            loadTalks();
            showDataManagementMessage('All talks cleared successfully.', 'success');
        }
    }

    function showDataManagementMessage(message, type) {
        const existingMessage = document.querySelector('.data-management-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageElement = document.createElement('div');
        messageElement.className = `data-management-message ${type}`;
        messageElement.textContent = message;
        
        const formSection = document.querySelector('.form-section');
        if (formSection) {
            formSection.insertBefore(messageElement, formSection.firstChild);
        }

        setTimeout(() => {
            messageElement.style.transition = 'opacity 0.3s ease';
            messageElement.style.opacity = '0';
            setTimeout(() => messageElement.remove(), 300);
        }, 5000);
    }

    // Initialize data management
    setupDataManagement();
});
