const express = require('express');
const app = express();
const PORT = 3001;
const authenticateToken = require('./middleware');

app.use(express.json());
app.use(authenticateToken);

let products = [];

// create
app.post('/products', (req, res) => {
    const product = { id: products.length + 1, ...req.body };
    products.push(product);
    res.status(201).json(product);
});

app.get('/products', (req, res) => {
    res.json(products);
});

// read by id
app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id == req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Product doesnt exist' });
    }
});

// update by id
app.put('/products/:id', (req, res) => {
    const product = products.find(p => p.id == req.params.id);
    if (product) {
        Object.assign(product, req.body);
        res.json(product);
    } else {
        res.status(404).json({ error: 'Product doesnt exist' });
    }
});

// delete by id
app.delete('/products/:id', (req, res) => {
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