import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DoctorsService } from './doctors.service.js';
import { DoctorsQueryDto } from './dto/doctors-query.dto.js';
import { CreateDoctorDto } from './dto/create-doctor.dto.js';

@Controller('/doctors')
export class DoctorsController {
  constructor(private readonly service: DoctorsService) {}

  @Post('/specialty')
  @HttpCode(HttpStatus.CREATED)
  async createDoctorSpecialty(@Body() body: { name: string }) {
    if (!body) {
      throw new BadRequestException('Тело запроса не может быть пустым');
    } else if (body.name?.length === 0) {
      throw new BadRequestException(
        'Название специальности не может быть пустым',
      );
    }

    const result = await this.service.createSpecialty(body?.name);

    if (!result) {
      throw new BadRequestException(
        'Были отправлены некорректные данные о специальности',
      );
    }

    return result;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createDoctor(@Body() body: CreateDoctorDto) {
    const result = await this.service.create(body);

    if (result === null) {
      throw new BadRequestException(
        'Были отправлены некорректные данные о докторе',
      );
    } else if (result === false) {
      throw new UnprocessableEntityException(
        `Специальности с ID: ${body.specialtyId} не существует`,
      );
    }

    return result;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getDoctors(@Query() params: DoctorsQueryDto) {
    const result = await this.service.getAll(params);

    return result;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getDoctorById(@Param('id') id: number) {
    if (Number.isNaN(Number(id))) {
      throw new BadRequestException('В качестве ID было указано не число');
    }

    const result = await this.service.getById(id);

    if (!result) {
      throw new NotFoundException('Доктор не был найден');
    }

    return result;
  }
}
