import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetodoPago } from './entities/MetodoPago.entity';
import { MetodoPagoDto } from './dto/metodoPago.dto';

@Injectable()
export class MetodoPagoService {
  constructor(
    @InjectRepository(MetodoPago)
    private readonly metodoPagoRepository: Repository<MetodoPago>,
  ) {}

  async findAll(): Promise<MetodoPago[]> {
    return await this.metodoPagoRepository.find();
  }

  async create(metodoPagoDTO: MetodoPagoDto): Promise<MetodoPago> {
    const metodoPago = new MetodoPago();
    metodoPago.metodoPago = metodoPagoDTO.metodoPago;
    return await this.metodoPagoRepository.save(metodoPago);
}

  async findOne(id: number): Promise<MetodoPago> {
    return await this.metodoPagoRepository.findOne({ where: { id } });
  }

  async update(id: number, metodoPagoDTO: MetodoPagoDto): Promise<MetodoPago> {
    const metodoPago = await this.metodoPagoRepository.findOne({ where: { id } });
    metodoPago.metodoPago = metodoPagoDTO.metodoPago;
    return await this.metodoPagoRepository.save(metodoPago);
  }

  async remove(id: number): Promise<void> {
    await this.metodoPagoRepository.delete(id);
  }
}
