import { Injectable } from '@nestjs/common';
import { ReceptionsRepository } from './receptions.repository.js';
import { CreateReceptionDto } from './dto/create-reception.dto.js';
import { SlotsRepository } from '../slots/slots.repository.js';
import { ServiceError } from '../../common/errors/ServiceError.js';
import { GetReceptionsQueryDto } from './dto/get-receptions.dto.js';

@Injectable()
export class ReceptionsService {
  constructor(
    private readonly repository: ReceptionsRepository,
    private readonly slotsRepository: SlotsRepository,
  ) {}

  async create(data: CreateReceptionDto) {
    const slot = await this.slotsRepository.getById(data.slotId);

    if (slot?.status === 'occupied') {
      throw new ServiceError('conflict', `Слот (ID: ${data.slotId}) уже занят`);
    }

    const result = await this.repository.create(data);

    if (!result || typeof result === 'string') {
      return result;
    }

    return { ...result, createdAt: new Date() };
  }

  getById(id: number) {
    return this.repository.getById(id);
  }

  async confirm(id: number) {
    const result = await this.repository.confirm(id);

    if (result === null) {
      const existedReception = await this.getById(id);

      if (!existedReception) {
        throw new ServiceError('not-found', 'Запись не была найдена');
      } else if (existedReception.status === 'cancelled') {
        throw new ServiceError('conflict', 'Запись уже была отменена, подтвердить невозможно');
      }

      return existedReception;
    }

    return result;
  }

  async cancel(id: number) {
    const result = await this.repository.cancel(id);

    if (result === null) {
      const existedReception = await this.getById(id);

      if (!existedReception) {
        throw new ServiceError('not-found', 'Запись не была найдена');
      }

      return existedReception;
    }

    return result;
  }

  getByFilter(data: GetReceptionsQueryDto) {
    return this.repository.getByFilter(data);
  }
}
