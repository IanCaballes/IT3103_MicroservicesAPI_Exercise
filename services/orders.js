const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3003;
const authenticateToken = require('./middleware');
const { body, param, validationResult } = require('express-validator');

app.use(express.json());
app.use(authenticateToken);

let orders = [];

// create order
app.post('/orders', [
    body('productId').isInt().withMessage('ID must be an integer'),
    body('userId').isInt().withMessage('ID must be an integer')
], authorizeRoles('customer'), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { productId, userId } = req.body;
    try {
        // check if product exists
        let product;
        try {
            const productResponse = await axios.get(`http://localhost:3001/products/${productId}`);
            product = productResponse.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return res.status(404).json({ error: `Product doesnt exist` });
            } else {
                return res.status(500).json({ error: 'Failed to retrieve product' });
            }
        }

        // check if user exists
        let user;
        try {
            const userResponse = await axios.get(`http://localhost:3002/users/${userId}`);
            user = userResponse.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return res.status(404).json({ error: `user doesnt exist` });
            } else {
                return res.status(500).json({ error: 'Failed to retrieve user' });
            }
        }

        //order if both exists
        const order = { id: orders.length + 1, product, user };
        orders.push(order);
        res.status(201).json(order);

    } catch (error) {
        res.status(500).json({ error: 'I dont know why this failed' });
    }
});

app.get('/orders', authorizeRoles('admin'), (req, res) => {
    res.json(orders);
});

// read by id
app.get('/orders/:id', [
    param('id').isInt().withMessage('ID must be an integer')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const order = orders.find(o => o.id == req.params.id);
    if (order) {
        res.json(order);
    } else {
        res.status(404).json({ error: 'Order doesnt exist' });
    }
});

app.listen(PORT, () => {
    console.log(`Order service listening on http://localhost:${PORT}`);
});