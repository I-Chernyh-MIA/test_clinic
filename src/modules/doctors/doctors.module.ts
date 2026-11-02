import { Module } from "@nestjs/common";
import { PrismaModule } from "../../database/prisma.module.js";
import { DoctorsController } from "./doctors.controller.js";
import { DoctorsService } from "./doctors.service.js";
import { DoctorsRepository } from "./doctors.repository.js";

@Module({
  imports: [PrismaModule],
  controllers: [DoctorsController],
  providers: [DoctorsService, DoctorsRepository],
  exports: [DoctorsRepository],
})
export class DoctorsModule {}