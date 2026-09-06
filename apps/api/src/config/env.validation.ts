import Joi from 'joi';

export interface EnvConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  MONGODB_URI: string;
  FRONTEND_URL: string;
  AUTH0_ISSUER_BASE_URL: string;
  AUTH0_AUDIENCE: string;
}

export const envValidationSchema = Joi.object<EnvConfig, true>({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().port().default(3000),
  MONGODB_URI: Joi.string()
    .uri({ scheme: ['mongodb', 'mongodb+srv'] })
    .required(),
  FRONTEND_URL: Joi.string().uri().default('http://localhost:5173'),
  // Your Auth0 tenant URL, e.g. https://your-tenant.eu.auth0.com
  AUTH0_ISSUER_BASE_URL: Joi.string().uri({ scheme: ['https'] }).required(),
  // The API identifier configured in Auth0; must match the audience the SPA requests.
  AUTH0_AUDIENCE: Joi.string().required(),
});
