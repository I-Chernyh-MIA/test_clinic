import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { SlotsService } from './slots.service.js';
import { CreateSlotsDto } from './dto/create-slots.dto.js';

@Controller('/slots')
export class SlotsController {
  constructor(private readonly service: SlotsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createReception(@Body() body: CreateSlotsDto) {
    const result = await this.service.create(body);

    if (result === null) {
      throw new BadRequestException(
        'Были отправлены некорректные данные о слотах',
      );
    } else if (!result) {
      throw new ConflictException('Слоты на указанный промежуток времени уже существуют');
    }

    return result;
  }
}
