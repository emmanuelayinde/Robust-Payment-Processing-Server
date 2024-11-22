import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(8000),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  SQUARE_ACCESS_TOKEN: Joi.string().required(),
  SQUARE_ENVIRONMENT: Joi.string()
    .valid('sandbox', 'production')
    .default('sandbox'),
  SQUARE_APPLICATION_ID: Joi.string().required(),
});
