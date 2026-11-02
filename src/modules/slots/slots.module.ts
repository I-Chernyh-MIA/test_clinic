import { Module } from '@nestjs/common';
import { SlotsController } from './slots.controller.js';
import { SlotsService } from './slots.service.js';
import { SlotsRepository } from './slots.repository.js';
import { PrismaModule } from '../../database/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [SlotsController],
  providers: [SlotsService, SlotsRepository],
  exports: [SlotsRepository],
})
export class SlotsModule {}
