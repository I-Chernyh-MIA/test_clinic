import { Module } from '@nestjs/common';
import { PatientModule } from './modules/patients/patients.module.js';
import { PrismaModule } from './database/prisma.module.js';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, PatientModule, ConfigModule.forRoot()],
})
export class AppModule {}
