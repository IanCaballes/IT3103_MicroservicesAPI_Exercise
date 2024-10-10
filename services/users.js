const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult, param } = require('express-validator');
const rateLimiter = require('./ratelimiter');
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

app.post('/login', [
    body('username').isString().trim().escape().notEmpty().withMessage('Username is required'),
    body('password').isString().trim().notEmpty().withMessage('Password is required')
], rateLimiter, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    if (!user) {
        return res.status(401).json({ error: 'Wrong user or pass' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: 'Wrong user or pass' });
    }

    const token = generateToken(user);
    res.json({ token });
});

// create
app.post('/users', [
    body('username').isString().trim().escape().notEmpty().withMessage('Username is required'),
    body('password').isString().isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
    body('role').isIn(['admin', 'customer']).withMessage('Role must be either admin or customer')
], rateLimiter, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // encrypt passwords
    const hashedPass = await bcrypt.hash(req.body.password, 10);

    const user = { id: users.length + 1, username: req.body.username, password: hashedPass, role: req.body.role };
    users.push(user);
    res.status(201).json({ id: user.id, username: user.username, role: user.role });
});

app.get('/users', rateLimiter, (req, res) => {
    const safeUsers = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });
    res.json(safeUsers);
});

// read by id
app.get('/users/:id', [
    param('id').isInt().withMessage('ID must be an integer')
], rateLimiter, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const user = users.find(c => c.id == req.params.id);
    if (user) {
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } else {
        res.status(404).json({ error: 'User doesnt exist' });
    }
});

// update by id
app.put('/users/:id', [
    param('id').isInt().withMessage('ID must be an integer'),
    body('username').optional().isString().trim().escape(),
    body('password').optional().isString().isLength({ min: 5 }).withMessage('Pass must be 5 chars or more'),
    body('role').optional().isIn(['admin', 'customer']).withMessage('Role must be either admin or customer')
], rateLimiter, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const user = users.find(c => c.id == req.params.id);
    if (user) {
        Object.assign(user, req.body);
        res.json(user);
    } else {
        res.status(404).json({ error: 'User doesnt exist' });
    }
});

// delete by id
app.delete('/users/:id', [
    param('id').isInt().withMessage('ID must be an integer')
], rateLimiter, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

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