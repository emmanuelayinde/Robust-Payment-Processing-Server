# NestJS Payment Processing System

## Description

A robust payment processing system built with NestJS, integrating Square API for secure transactions.

## Prerequisites

- Node.js (v18+)
- Yarn
- PostgreSQL
- Square Credit Card SDK

## Installation

1. Clone the repository

```bash
git clone https://github.com/emmanuelayinde/Robust-Payment-Processing-Server.git
cd Robust-Payment-Processing-Server
```

2. Install dependencies

```bash
yarn install
```

3. Set up environment variables

- Copy `.env.example` to `.env`
- Fill in your Square API credentials
- Configure database connection
- Fill your JWT secret and TTL (Time To Live)

4. Set up PostgreSQL database

Follow [this docs](https://render.com/docs/postgresql-creating-connecting) to set up PostgreSQL databse on render account for free.

5. Run database migrations

```bash
# First generate your migrations
yarn migration:generate -- ./src/migrations/your-migration-name

# The, apply the migrations
yarn migration:run
```

## Running the Application

```bash
yarn start:dev
```

### Production

```bash
yarn build
yarn start:prod
```

## Testing

```bash
# Unit tests
yarn test

# Test coverage
yarn test:cov
```

## API Documentation

Access Swagger UI at `/api-docs` when the application is running

## Payment APIs

The `/payment` - POST endpoint requires these parameter.

```
{
  "amount": Amount debitted in credit card by square from the frontend,
  "currency": Currency in which the amount was debitted,
  "sourceId": The token (also source id) generated from the frontend after payment has been made.
}
```

### Credit Card Payment

Head over to the [frontend url](https://payment-card-processing-ui.vercel.app/) and fill in the following data:

```
Card Number: 4111 1111 1111 1111
Expire Date: 12/27
CVV Number: 111
ZIP: 100001
```

On you click on the pay button, a payment token that looks like this `cnon:CA4SEB5LzLyROpd9qKXnv4DbX7kYASgC` will be generated for you. Copy the token and use it on the [server payment endpoint](https://payment-card-processing-server.onrender.com/api-docs#/Payments/PaymentsController_createPayment) as the `sourceId`

That is all.

## Key Features

- Square Payment Integration
- JWT Authentication
- Logging with Winston
- Rate Limiting
- Error Handling
- Comprehensive Test Coverage

## Security

- Input validation
- Secure handling of sensitive data
- HTTPS/CORS protection
- JWT-based authentication

## License

MIT License
