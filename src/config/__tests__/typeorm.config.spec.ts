// Mock environment variables before importing the module
process.env.DATABASE_HOST = 'localhost';
process.env.DATABASE_USER = 'test_user';
process.env.DATABASE_PASSWORD = 'test_password';
process.env.DATABASE_NAME = 'test_db';
process.env.NODE_ENV = 'test';

import * as typeormConfig from '../typeorm.config';

describe('typeorm.config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should use DATABASE_URL and set ssl in production', () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@host:5432/db';
    process.env.NODE_ENV = 'production';
    const typeormConfig = require('../typeorm.config').default();
    expect(typeormConfig.type).toBe('postgres');
    expect(typeormConfig.url).toBe('postgresql://user:pass@host:5432/db');
    expect(typeormConfig.ssl).toEqual({ rejectUnauthorized: false });
    expect(typeormConfig.entities).toBeDefined();
    expect(typeormConfig.migrations).toBeDefined();
  });

  it('should use DATABASE_URL and not set ssl in development', () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@host:5432/db';
    process.env.NODE_ENV = 'development';
    const typeormConfig = require('../typeorm.config').default();
    expect(typeormConfig.type).toBe('postgres');
    expect(typeormConfig.url).toBe('postgresql://user:pass@host:5432/db');
    expect(typeormConfig.ssl).toBe(false);
  });

  it('should use separated variables if DATABASE_URL is not set', () => {
    delete process.env.DATABASE_URL;
    process.env.DATABASE_HOST = 'localhost';
    process.env.DATABASE_PORT = '5432';
    process.env.DATABASE_USER = 'test_user';
    process.env.DATABASE_PASSWORD = 'test_password';
    process.env.DATABASE_NAME = 'test_db';
    const typeormConfig = require('../typeorm.config').default();
    expect(typeormConfig.type).toBe('postgres');
    expect(typeormConfig.host).toBe('localhost');
    expect(typeormConfig.port).toBe(5432);
    expect(typeormConfig.username).toBe('test_user');
    expect(typeormConfig.password).toBe('test_password');
    expect(typeormConfig.database).toBe('test_db');
    expect(typeormConfig.entities).toBeDefined();
    expect(typeormConfig.migrations).toBeDefined();
  });
});
