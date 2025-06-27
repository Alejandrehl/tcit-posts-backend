// Mock environment variables before importing the module
process.env.DATABASE_HOST = 'localhost';
process.env.DATABASE_USER = 'test_user';
process.env.DATABASE_PASSWORD = 'test_password';
process.env.DATABASE_NAME = 'test_db';
process.env.NODE_ENV = 'test';

// Type for the configuration returned by getTypeormConfig
type TypeOrmConfig = {
  type: string;
  url?: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
  ssl?: boolean | { rejectUnauthorized: boolean };
  entities: string[];
  migrations: string[];
  synchronize: boolean;
  logging: boolean;
};

describe('typeorm.config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should use DATABASE_URL and set ssl in production', async () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@host:5432/db';
    process.env.NODE_ENV = 'production';
    const { default: getTypeormConfig } = await import('../typeorm.config');
    const typeormConfig = getTypeormConfig() as TypeOrmConfig;
    expect(typeormConfig.type).toBe('postgres');
    expect(typeormConfig.url).toBe('postgresql://user:pass@host:5432/db');
    expect(typeormConfig.ssl).toEqual({ rejectUnauthorized: false });
    expect(typeormConfig.entities).toBeDefined();
    expect(typeormConfig.migrations).toBeDefined();
  });

  it('should use DATABASE_URL and not set ssl in development', async () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@host:5432/db';
    process.env.NODE_ENV = 'development';
    const { default: getTypeormConfig } = await import('../typeorm.config');
    const typeormConfig = getTypeormConfig() as TypeOrmConfig;
    expect(typeormConfig.type).toBe('postgres');
    expect(typeormConfig.url).toBe('postgresql://user:pass@host:5432/db');
    expect(typeormConfig.ssl).toBe(false);
  });

  it('should use separated variables if DATABASE_URL is not set', async () => {
    delete process.env.DATABASE_URL;
    process.env.DATABASE_HOST = 'localhost';
    process.env.DATABASE_PORT = '5432';
    process.env.DATABASE_USER = 'test_user';
    process.env.DATABASE_PASSWORD = 'test_password';
    process.env.DATABASE_NAME = 'test_db';
    const { default: getTypeormConfig } = await import('../typeorm.config');
    const typeormConfig = getTypeormConfig() as TypeOrmConfig;
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
