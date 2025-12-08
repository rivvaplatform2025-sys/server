import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import databaseConfig from './config/database/database.config';
import { createTypeOrmConfig } from './config/database';
//import { DataSource } from 'typeorm';
// import { AuthService } from './modules/auth/services/auth.service';
// import { JwtStrategy } from './modules/auth/strategies/jwt.strategy';
// //import { DataSource } from 'typeorm';
// import { AuthController } from './modules/auth/controllers/auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => createTypeOrmConfig(config),
    }),
    AuthModule,
  ],
  // providers: [AuthService, JwtStrategy],
  // controllers: [AuthController],
  // exports: [AuthService],
})
export class AppModule {}
