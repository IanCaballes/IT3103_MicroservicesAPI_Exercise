# IT3103_MicroservicesAPI_Exercise
IT 3103 Exercise 3: Microservices API

Exercise 3: Designing and Building a Microservices APIObjective:
The goal of this exercise is to help students gain hands-on experience with microservice API design by implementing a simple system of intercommunicating services. Students will focus on designing, developing, and testing a system with multiple microservices, each with its own responsibilities and communicating through HTTP requests.
System Overview:
You will design a system to manage Products, Customers, and Orders. This will involve three independent microservices:
Product Service: Handles product-related data.
Customer Service: Handles customer-related data.
Order Service: Handles order-related data and communicates with the other services to validate customers and products.
Each service should expose a RESTful API to allow CRUD (Create, Read, Update, Delete) operations for the relevant data. The Order Service must interact with both the Product Service and the Customer Service to ensure valid customer and product data before creating an order.
Step 1: Define the APIs for Each Service
1. Product Service
POST /products: Add a new product.
GET /products/:productId: Get product details by ID.
PUT /products/:productId: Update a product.
DELETE /products/:productId: Delete a product.
2. Customer Service
POST /customers: Add a new customer.
GET /customers/:customerId: Get customer details by ID.
PUT /customers/:customerId: Update customer information.
DELETE /customers/:customerId: Delete a customer.
3. Order Service
POST /orders: Create a new order. This service will:
Verify that the customer exists by communicating with the Customer Service.
Verify that the product exists by communicating with the Product Service.
Create the order only if the customer and product are valid.
GET /orders/:orderId: Get order details.
PUT /orders/:orderId: Update an order.
DELETE /orders/:orderId: Delete an order.
Part 2: Implement the MicroservicesStep 2: Set up the Project Structure
Create three separate Node.js services using Express.js: Product Service, Customer Service, and Order Service.
Each service should run on a different port (e.g., Product Service on 3001, Customer Service on 3002, Order Service on 3003)