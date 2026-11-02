import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PatientsService } from './patients.service.js';
import { CreatePatientDto } from './dto/create-patient.dto.js';
import { PatchPatientDto } from './dto/patch-patient.dto.js';

@Controller('/patients')
export class PatientController {
  constructor(private readonly service: PatientsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPatient(@Body() body: CreatePatientDto) {
    const result = await this.service.create(body);

    if (result === null) {
      throw new BadRequestException(
        'Были отправлены некорректные данные о пациенте',
      );
    } else if (!result) {
      throw new ConflictException('Пациент с указанным номером уже существует');
    }

    return result;
  }

  @Get('/phone')
  @HttpCode(HttpStatus.OK)
  async getPatientByPhone(@Query('phone') phone: string) {
    if (!phone || phone.length === 0) {
      throw new BadRequestException('Номер телефона не был указан');
    }

    const result = await this.service.getByPhone(phone);

    if (!result) {
      throw new NotFoundException('Пациент с таким номером не был найден');
    }

    return result;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getPatient(@Param('id') id: number) {
    if (Number.isNaN(Number(id))) {
      throw new BadRequestException('В качестве ID было указано не число');
    }

    const result = await this.service.getById(id);

    if (!result) {
      throw new NotFoundException('Пациент не был найден');
    }

    return result;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async patchPatient(@Param('id') id: number, @Body() body: PatchPatientDto) {
    if (Object.values(body).filter((value) => value !== undefined).length === 0) {
      throw new UnprocessableEntityException(
        'Тело запроса не было передано или оно пустое',
      );
    }

    const result = await this.service.patch(id, body);

    if (result === null) {
      throw new NotFoundException('Пациент не был найден');
    } else if (!result) {
      throw new BadRequestException(
        'Были отправлены некорректные данные о пациенте',
      );
    }

    return result;
  }
}
