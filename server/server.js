const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 4040;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

const contactsFilePath = path.join(__dirname, '../contacts.json');

const readContactsFile = (callback) => {
    fs.readFile(contactsFilePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File does not exist, create an empty file
                return fs.writeFile(contactsFilePath, JSON.stringify([]), (writeErr) => {
                    if (writeErr) {
                        return callback(writeErr);
                    }
                    callback(null, []);
                });
            }
            return callback(err);
        }
        try {
            const contacts = JSON.parse(data);
            callback(null, contacts);
        } catch (parseErr) {
            callback(parseErr);
        }
    });
};

const writeContactsFile = (contacts, callback) => {
    fs.writeFile(contactsFilePath, JSON.stringify(contacts, null, 2), callback);
};

app.get('/api/contacts', (req, res) => {
    readContactsFile((err, contacts) => {
        if (err) {
            return res.status(500).send('Error reading contacts file');
        }
        res.json(contacts);
    });
});

app.post('/api/contacts', (req, res) => {
    const newContact = { 
        id: Date.now(), 
        ...req.body, 
        createdAt: new Date().toLocaleString() 
    };
    readContactsFile((err, contacts) => {
        if (err) {
            return res.status(500).send('Error reading contacts file');
        }
        contacts.push(newContact);
        writeContactsFile(contacts, (writeErr) => {
            if (writeErr) {
                return res.status(500).send('Error saving contact');
            }
            res.status(201).send('Contact added');
        });
    });
});

app.put('/api/contacts/:id', (req, res) => {
    const updatedContact = { 
        ...req.body, 
        updatedAt: new Date().toLocaleString() 
    };
    const contactId = parseInt(req.params.id, 10);
    readContactsFile((err, contacts) => {
        if (err) {
            return res.status(500).send('Error reading contacts file');
        }
        contacts = contacts.map(contact => contact.id === contactId ? { ...contact, ...updatedContact, createdAt: contact.createdAt } : contact);
        writeContactsFile(contacts, (writeErr) => {
            if (writeErr) {
                return res.status(500).send('Error updating contact');
            }
            res.send('Contact updated');
        });
    });
});

app.delete('/api/contacts/:id', (req, res) => {
    const contactId = parseInt(req.params.id, 10);
    readContactsFile((err, contacts) => {
        if (err) {
            return res.status(500).send('Error reading contacts file');
        }
        contacts = contacts.filter(contact => contact.id !== contactId);
        writeContactsFile(contacts, (writeErr) => {
            if (writeErr) {
                return res.status(500).send('Error deleting contact');
            }
            res.send('Contact deleted');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});