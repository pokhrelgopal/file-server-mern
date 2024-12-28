# Simple Authentication System

This is a simple authentication system built with **Node.js** and **Express** on the backend and **Next.js** on the frontend. It demonstrates a user authentication workflow including registration, login, and secure routes using **JWT** for token-based authentication.

## Features

- User Registration and Login
- Token-based Authentication using **JWT**
- **Prisma** ORM for database interaction
- Integration with **Neon** free database (PostgreSQL)

## Tech Stack

- **Backend:** Node.js, Express, Prisma
- **Frontend:** Next.js
- **Database:** PostgreSQL (via Neon free database)

## Prerequisites

Ensure you have the following installed on your system:

- **Node.js**
- **npm**

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/pokhrelgopal/simple_auth_system
```

Navigate to the client directory and install dependencies:

````bash
cd client
npm install```
````

Navigate to the server directory and install dependencies:

```bash
cd ../server
npm install
```

### Environment Variables

For demo purposes, the .env file has been included. It contains:

- JWT_SECRET: The secret key for generating JWT tokens.
- DATABASE_URL: The URL for connecting to the Neon PostgreSQL database.

Ensure the .env file is in the server directory.

To start the backend and frontend server, navigate to respective directory and enter following command in each

```bash
npm run dev
```

The application should now be running. Access the frontend at http://localhost:3000 and the backend at http://localhost:5000.
