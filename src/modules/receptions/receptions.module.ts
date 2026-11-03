import { Module } from '@nestjs/common';
import { ReceptionsController } from './receptions.controller.js';
import { ReceptionsService } from './receptions.service.js';
import { ReceptionsRepository } from './receptions.repository.js';
import { PrismaModule } from '../../database/prisma.module.js';
import { SlotsModule } from '../slots/slots.module.js';

@Module({
  imports: [PrismaModule, SlotsModule],
  controllers: [ReceptionsController],
  providers: [ReceptionsService, ReceptionsRepository],
  exports: [ReceptionsRepository],
})
export class ReceptionsModule {}
