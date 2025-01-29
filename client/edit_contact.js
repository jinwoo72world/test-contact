document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const contactId = urlParams.get('id');
  const contactName = urlParams.get('name');
  const contactPhone = urlParams.get('phone');
  const contactCreatedAt = urlParams.get('createdAt');

  if (contactId) {
    document.getElementById('contact-id').value = contactId;
    document.getElementById('name').value = contactName;
    document.getElementById('phone').value = contactPhone;
    document.getElementById('createdAt').value = contactCreatedAt;
  }

  document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const id = document.getElementById('contact-id').value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const createdAt = document.getElementById('createdAt').value;
    const updatedAt = new Date().toLocaleString();

    fetch(`/api/contacts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, phone, createdAt, updatedAt })
    })
    .then(response => response.text())
    .then(() => {
      window.location.href = 'index.html';
    })
    .catch(error => console.error('Error updating contact:', error));
  });
});
