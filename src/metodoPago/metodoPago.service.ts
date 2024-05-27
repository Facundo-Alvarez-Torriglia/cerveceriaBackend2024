import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetodoPago } from './entities/MetodoPago.entity';
import { MetodoPagoDto } from './dto/metodoPago.dto';
import { MetodoPagoTipo } from './metodoPagoEnum/metodoPago.enum';

@Injectable()
export class MetodoPagoService implements OnModuleInit{
  constructor(
    @InjectRepository(MetodoPago)
    private readonly metodoPagoRepository: Repository<MetodoPago>,
  ) {}

  async onModuleInit() {
    await this.initializeMetodosPago();
  }

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

  private async initializeMetodosPago() {
    const existingMetodos = await this.metodoPagoRepository.find();
    const existingMetodosNames = existingMetodos.map((metodo) => metodo.metodoPago);

    const metodosToCreate = Object.values(MetodoPagoTipo).filter(
      (metodo) => !existingMetodosNames.includes(metodo),
    );

    for (const metodo of metodosToCreate) {
      const newMetodo = this.metodoPagoRepository.create({ metodoPago: metodo });
      await this.metodoPagoRepository.save(newMetodo);
    }
  }
}
