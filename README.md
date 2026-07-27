# BackendBank

BackendBank is a simple banking backend built with Node.js, Express, and MongoDB.

The goal of this project is to learn how a real backend works. It includes user authentication, bank accounts, transactions, and email notifications. Every feature was built step by step while learning backend development.

## Features

- User registration and login
- JWT authentication
- Password hashing with bcrypt
- Create and manage bank accounts
- Send money between accounts
- Transaction history
- Email notifications for transactions
- Token blacklist for logout
- MongoDB database using Mongoose

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcrypt
- Nodemailer
- dotenv

## Project Structure

```
src/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
└── app.js
```

## Getting Started

Clone the repository.

```bash
git clone https://github.com/vireshanand278/backendBank.git
```

Go to the project folder.

```bash
cd backendBank
```

Install dependencies.

```bash
npm install
```

Create a `.env` file and add your environment variables.

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

Start the server.

```bash
npm run dev
```

The server will run at:

```
http://localhost:3000
```

## API

### Authentication

- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/logout`
- GET `/api/auth/profile`

### Accounts

- Create account
- Get account details
- View account balance

### Transactions

- Transfer money
- View transaction history

## Future Plans

- Simple frontend
- Better input validation
- Swagger API documentation
- Unit testing
- Docker support
- Role-based authorization

## Why I Built This

I built this project to understand backend development by creating something practical instead of only following tutorials. It helped me learn how authentication, APIs, databases, and transactions work together in a real application.
