document.addEventListener('DOMContentLoaded', function() {
    const entryText = document.getElementById('entry-text');
    const submitEntry = document.getElementById('submit-entry');
    const entriesSection = document.getElementById('entries');

    function fetchEntries() {
        fetch('/api/entries')
            .then(response => response.json())
            .then(entries => {
                entriesSection.innerHTML = '';
                entries.forEach((entry, index) => {
                    const entryElement = document.createElement('div');
                    entryElement.classList.add('entry');
                    entryElement.innerHTML = `
                        <p>${entry.text}</p>
                        <button class="delete-entry" 
data-index="${index}">Delete</button>
                        <div id="comments-${index}">
                            ${entry.comments.map(comment => `<p 
class="comment">${comment}</p>`).join('')}
                        </div>
                        <textarea placeholder="Write your comment here..." 
class="comment-text"></textarea>
                        <button class="submit-comment" 
data-index="${index}">Submit Comment</button>
                    `;
                    entriesSection.appendChild(entryElement);
                });
            });
    }

    submitEntry.addEventListener('click', function() {
        const entry = entryText.value;
        if (entry) {
            fetch('/api/entries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ entry })
            })
            .then(() => {
                entryText.value = '';
                fetchEntries();
            });
        }
    });

    entriesSection.addEventListener('click', function(event) {
        if (event.target.classList.contains('submit-comment')) {
            const index = event.target.dataset.index;
            const comment = event.target.previousElementSibling.value;
            if (comment) {
                fetch('/api/comments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ entryIndex: parseInt(index), comment 
})
                })
                .then(() => {
                    fetchEntries();
                });
            }
        } else if (event.target.classList.contains('delete-entry')) {
            const index = event.target.dataset.index;
            fetch(`/api/entries/${index}`, {
                method: 'DELETE'
            })
            .then(() => {
                fetchEntries();
            });
        }
    });

    fetchEntries();
});

