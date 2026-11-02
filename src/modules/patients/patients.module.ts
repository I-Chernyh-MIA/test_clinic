import { Module } from '@nestjs/common';
import { PatientController } from './patients.controller.js';
import { PatientService } from './patients.service.js';
import { PatientRepository } from './patients.repository.js';
import { PrismaModule } from '../../database/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [PatientController],
  providers: [PatientService, PatientRepository],
  exports: [PatientRepository],
})
export class PatientModule {}
