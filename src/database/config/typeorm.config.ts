import { DataSourceOptions, DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const getTypeOrmConfig = (configService: ConfigService): DataSourceOptions => {
  const isProduction = configService.get('NODE_ENV') === 'production';

  return {
    type: 'postgres',
    url: configService.get('DATABASE_URL'),
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/database/migrations/**/*{.ts,.js}'],
    migrationsTableName: 'migrations',
    migrationsRun: true,
    synchronize: false,
    logging: !isProduction,
    logger: 'advanced-console',
    ssl: isProduction ? { rejectUnauthorized: false } : false,
    extra: {
      max: 20,
      min: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    },
  };
};

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/**/*.ts'],
  migrationsTableName: 'migrations',
  migrationsRun: false,
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
