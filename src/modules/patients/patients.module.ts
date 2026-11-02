import { Module } from '@nestjs/common';
import { PatientsController } from './patients.controller.js';
import { PatientsService } from './patients.service.js';
import { PatientsRepository } from './patients.repository.js';
import { PrismaModule } from '../../database/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [PatientsController],
  providers: [PatientsService, PatientsRepository],
  exports: [PatientsRepository],
})
export class PatientsModule {}
