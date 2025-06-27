// Mock environment variables before importing the module
process.env.DATABASE_HOST = 'localhost';
process.env.DATABASE_USER = 'test_user';
process.env.DATABASE_PASSWORD = 'test_password';
process.env.DATABASE_NAME = 'test_db';
process.env.NODE_ENV = 'test';

import { AppModule } from '../app.module';

describe('AppModule', () => {
  it('should be defined', () => {
    expect(AppModule).toBeDefined();
  });
});
