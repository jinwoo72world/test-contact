// add_contact.js
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const createdAt = new Date().toLocaleString();
    
    fetch('/api/contacts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, phone, createdAt })
    })
    .then(response => response.text())
    .then(() => {
        window.location.href = 'index.html';
    })
    .catch(error => console.error('Error adding contact:', error));
});