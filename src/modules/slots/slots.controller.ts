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
    let result;

    try {
      result = await this.service.create(body);
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
    }

    if (result === null) {
      throw new BadRequestException(
        'Были отправлены некорректные данные о слотах',
      );
    } else if (!result) {
      throw new ConflictException('Слоты в указанном промежутке времени уже существуют');
    }

    return result;
  }
}
