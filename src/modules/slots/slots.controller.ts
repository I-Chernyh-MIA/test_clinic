import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SlotsService } from './slots.service.js';
import { CreateSlotsDto } from './dto/create-slots.dto.js';
import { GetSlotsQueryDto } from './dto/get-slots-query.dto.js';
import { ServiceError } from '../../common/errors/ServiceError.js';

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
      if (e instanceof ServiceError) {
        throw new UnprocessableEntityException(e.message);
      }

      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
    }

    if (!result) {
      throw new BadRequestException('Были отправлены некорректные данные о слотах');
    }

    return result;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getSlots(@Query() queries: GetSlotsQueryDto) {
    return this.service.getByFilter(queries);
  }
}
