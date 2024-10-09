const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 3002;

app.use(express.json());

let users = [
    { id: 1, username: 'admin', password: 'adminpass', role: 'admin' },
    { id: 2, username: 'customer', password: 'custpass', role: 'customer' }
];

const JWT_SECRET = 'yourSecretKey';

// generate token
function generateToken(user) {
    const payload = {
        id: user.id,
        role: user.role,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ error: 'Wrong user or pass' });
    }
    const token = generateToken(user);
    res.json({ token });
});

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
app.get('/users/:id', (req, res) => {
    const user = users.find(c => c.id == req.params.id);
    if (user) {
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