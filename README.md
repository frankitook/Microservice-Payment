# Microservice-Payment

This project is a microservice for payment processing that is part of a microservices architecture. The service is responsible for handling payment transactions, updating their status, and ensuring transaction integrity. It is developed with Node.js for the backend.

## Features

- Process payments for orders, including verification of amounts and payment methods.
- Update the status of payments (e.g., "Paid", "Pending", "Canceled").
- Integration with the Order microservice to validate the existence and status of the order before processing the payment.
- Error handling and appropriate responses in case of payment processing failures.
- Support for different payment methods.

## Technologies Used

- **Node.js**: Backend runtime environment.
- **Express**: Framework for building RESTful APIs.
- **Sequelize**: ORM for interacting with a MySQL database.
- **MySQL**: Relational database used to store payment details.
- **JWT**: Token-based authentication mechanism for securing access to payment-related endpoints.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/frankitook/Microservice-Payment.git
   cd paymentservice
