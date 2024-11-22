# NestJS Payment Processing System

## Description

A robust payment processing system built with NestJS, integrating Square API for secure transactions.

## Prerequisites

- Node.js (v18+)
- Yarn
- PostgreSQL
- Square Developer Account

## Installation

1. Clone the repository

```bash
git clone https://your-repo-url.git
cd nestjs-payment-system
```

2. Install dependencies

```bash
yarn install
```

3. Set up environment variables

- Copy `.env.example` to `.env`
- Fill in your Square API credentials
- Configure database connection

4. Set up PostgreSQL database

```bash
createdb payment_system_db
```

5. Run database migrations

```bash
yarn typeorm migration:run
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
