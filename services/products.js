const express = require('express');
const { body, param, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const app = express();
const PORT = 3001;
const authenticateToken = require('./middleware');

app.use(express.json());
app.use(authenticateToken);

let products = [];

// create
app.post('/products', [
    body('name').isString().trim().notEmpty().withMessage('Name is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be positive'),
    body('description').optional().isString().trim()
], authorizeRoles('admin'), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const product = { id: products.length + 1, ...req.body };
    products.push(product);
    res.status(201).json(product);
});

app.get('/products', (req, res) => {
    res.json(products);
});

// read by id
app.get('/products/:id', [
    param('id').isInt().withMessage('ID must be an integer')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const product = products.find(p => p.id == req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Product doesnt exist' });
    }
});

// update by id
app.put('/products/:id', [
    param('id').isInt().withMessage('ID must be an integer'),
    body('name').optional().isString().trim().notEmpty().withMessage('Name is required'),
    body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be positive'),
    body('description').optional().isString().trim()
], authorizeRoles('admin'), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const product = products.find(p => p.id == req.params.id);
    if (product) {
        Object.assign(product, req.body);
        res.json(product);
    } else {
        res.status(404).json({ error: 'Product doesnt exist' });
    }
});

// delete by id
app.delete('/products/:id', [
    param('id').isInt().withMessage('ID must be an integer')
], authorizeRoles('admin'), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const index = products.findIndex(p => p.id == req.params.id);
    if (index !== -1) {
        products.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Product doesnt exist' });
    }
});

app.listen(PORT, () => {
    console.log(`Product service listening on http://localhost:${PORT}`);
});