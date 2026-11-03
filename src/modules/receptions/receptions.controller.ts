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
  UnprocessableEntityException,
} from '@nestjs/common';
import { ReceptionsService } from './receptions.service.js';
import { CreateReceptionDto } from './dto/create-reception.dto.js';
import { ServiceError } from '../../common/errors/ServiceError.js';

@Controller('/receptions')
export class ReceptionsController {
  constructor(private readonly service: ReceptionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createReception(@Body() body: CreateReceptionDto) {
    let result;

    try {
      result = await this.service.create(body);
    } catch (e) {
      if (e instanceof ServiceError) {
        if (e.errorType === 'conflict') {
          throw new ConflictException(e.message);
        }
      } else if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
    }

    if (result === null) {
      throw new BadRequestException('Были отправлены некорректные данные о записи');
    } else if (result === 'P2003') {
      throw new UnprocessableEntityException('Указанного ID слота или пациента не существует');
    }

    return result;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getReception(@Param('id') id: number) {
    if (Number.isNaN(Number(id))) {
      throw new BadRequestException('В качестве ID было указано не число');
    }

    const result = await this.service.getById(id);

    if (!result) {
      throw new NotFoundException('Запись не была найдена');
    }

    return result;
  }

  @Patch(':id/confirm')
  @HttpCode(HttpStatus.OK)
  async setConfirm(@Param('id') id: number) {
    if (Number.isNaN(Number(id))) {
      throw new BadRequestException('В качестве ID было указано не число');
    }

    let result;

    try {
      result = await this.service.confirm(id);
    } catch (e) {
      if (e instanceof ServiceError) {
        if (e.errorType === 'not-found') {
          throw new NotFoundException(e.message);
        } else if (e.errorType === 'conflict') {
          throw new ConflictException(e.message);
        }
      } else if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
    }

    if (!result) {
      throw new BadRequestException('Ошибка при попытке подтвердить запись');
    }

    return result;
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async setCancelled(@Param('id') id: number) {
    if (Number.isNaN(Number(id))) {
      throw new BadRequestException('В качестве ID было указано не число');
    }
    
    let result;

    try {
      result = await this.service.cancel(id);
    } catch (e) {
      if (e instanceof ServiceError) {
        if (e.errorType === 'not-found') {
          throw new NotFoundException(e.message);
        } else if (e.errorType === 'conflict') {
          throw new ConflictException(e.message);
        }
      } else if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
    }

    if (!result) {
      throw new BadRequestException('Ошибка при попытке отменить запись');
    }

    return result;
  }
}
