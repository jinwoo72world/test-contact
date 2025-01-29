document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/contacts')
        .then(response => response.json())
        .then(contacts => {
            const table = document.getElementById('contacts-table').getElementsByTagName('tbody')[0];
            contacts.forEach(contact => {
                const newRow = table.insertRow();
                newRow.dataset.id = contact.id;
                const nameCell = newRow.insertCell(0);
                const phoneCell = newRow.insertCell(1);
                const createdDateCell = newRow.insertCell(2);
                const updatedDateCell = newRow.insertCell(3);
                const actionsCell = newRow.insertCell(4);
                
                nameCell.textContent = contact.name;
                phoneCell.textContent = contact.phone;
                createdDateCell.textContent = contact.createdAt || '';
                updatedDateCell.textContent = contact.updatedAt || '';
                actionsCell.innerHTML = '<button onclick="editContact(this)">Edit</button> <button onclick="deleteContact(this)">Delete</button>';
            });
        })
        .catch(error => console.error('Error fetching contacts:', error));
});

function showForm() {
    document.getElementById('contact-form').style.display = 'block';
}

document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const id = document.getElementById('contact-form').dataset.id;
    
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/contacts/${id}` : '/api/contacts';
    
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, phone })
    })
    .then(response => response.text())
    .then(() => {
        window.location.href = 'index.html';
    })
    .catch(error => console.error(`Error ${id ? 'updating' : 'adding'} contact:`, error));
});

function editContact(button) {
    const row = button.parentNode.parentNode;
    const id = row.dataset.id;
    const name = row.cells[0].textContent;
    const phone = row.cells[1].textContent;
    const createdAt = row.cells[2].textContent;
    window.location.href = `edit_contact.html?id=${id}&name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}&createdAt=${encodeURIComponent(createdAt)}`;
}

function deleteContact(button) {
    const row = button.parentNode.parentNode;
    const id = row.dataset.id;
    
    if (confirm('Are you sure you want to delete this contact?')) {
        fetch(`/api/contacts/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.text())
        .then(() => {
            row.remove();
        })
        .catch(error => console.error('Error deleting contact:', error));
    }
}