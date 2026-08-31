import Joi from 'joi';

export interface EnvConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  MONGODB_URI: string;
  FRONTEND_URL: string;
}

export const envValidationSchema = Joi.object<EnvConfig, true>({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().port().default(3001),
  MONGODB_URI: Joi.string()
    .uri({ scheme: ['mongodb', 'mongodb+srv'] })
    .required(),
  FRONTEND_URL: Joi.string().uri().default('http://localhost:5173'),
});
