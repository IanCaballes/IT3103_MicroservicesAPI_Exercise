const express = require('express');
const app = express();
const PORT = 3002;

app.use(express.json());

let customers = [];

// create
app.post('/customers', (req, res) => {
    const customer = { id: customers.length + 1, ...req.body };
    customers.push(customer);
    res.status(201).json(customer);
});

app.get('/customers', (req, res) => {
    res.json(customers);
});

// read by id
app.get('/customers/:id', (req, res) => {
    const customer = customers.find(c => c.id == req.params.id);
    if (customer) {
        res.json(customer);
    } else {
        res.status(404).json({ error: 'Customer doesnt exist' });
    }
});

// update by id
app.put('/customers/:id', (req, res) => {
    const customer = customers.find(c => c.id == req.params.id);
    if (customer) {
        Object.assign(customer, req.body);
        res.json(customer);
    } else {
        res.status(404).json({ error: 'Customer doesnt exist' });
    }
});

// delete by id
app.delete('/customers/:id', (req, res) => {
    const index = customers.findIndex(c => c.id == req.params.id);
    if (index !== -1) {
        customers.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Customer doesnt exist' });
    }
});

app.listen(PORT, () => {
    console.log(`Customer service listening on http://localhost:${PORT}`);
});