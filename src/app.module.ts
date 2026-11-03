import { Module } from '@nestjs/common';
import { PatientsModule } from './modules/patients/patients.module.js';
import { PrismaModule } from './database/prisma.module.js';
import { ConfigModule } from '@nestjs/config';
import { DoctorsModule } from './modules/doctors/doctors.module.js';
import { ReceptionsModule } from './modules/receptions/receptions.module.js';
import { SlotsModule } from './modules/slots/slots.module.js';

@Module({
  imports: [PrismaModule, PatientsModule, DoctorsModule, SlotsModule, ReceptionsModule, ConfigModule.forRoot()],
})
export class AppModule {}
