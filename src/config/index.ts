export default () => ({
  port: parseInt(process.env.PORT, 10) || 8000,
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  square: {
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
    environment: process.env.SQUARE_ENVIRONMENT || 'sandbox',
    applicationId: process.env.SQUARE_APPLICATION_ID,
  },
  rateLimit: {
    ttl: 60,
    limit: 100,
  },
});
