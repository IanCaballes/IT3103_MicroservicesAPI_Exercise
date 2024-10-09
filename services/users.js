const express = require('express');
const app = express();
const PORT = 3002;

app.use(express.json());

let users = [];

// create
app.post('/users', (req, res) => {
    const user = { id: users.length + 1, ...req.body };
    users.push(user);
    res.status(201).json(user);
});

app.get('/users', (req, res) => {
    res.json(users);
});

// read by id
app.get('/users/:id', (req, res) => {
    const user = users.find(c => c.id == req.params.id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: 'User doesnt exist' });
    }
});

// update by id
app.put('/users/:id', (req, res) => {
    const user = users.find(c => c.id == req.params.id);
    if (user) {
        Object.assign(user, req.body);
        res.json(user);
    } else {
        res.status(404).json({ error: 'User doesnt exist' });
    }
});

// delete by id
app.delete('/users/:id', (req, res) => {
    const index = users.findIndex(c => c.id == req.params.id);
    if (index !== -1) {
        users.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'User doesnt exist' });
    }
});

app.listen(PORT, () => {
    console.log(`User service listening on http://localhost:${PORT}`);
});