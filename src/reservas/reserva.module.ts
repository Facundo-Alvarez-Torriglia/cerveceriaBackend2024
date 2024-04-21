import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './entities/Reserva.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { ReservaService } from './reserva.service';
import { ReservaController } from './reserva.controller';
import { MetodoPago } from 'src/metodoPago/entities/MetodoPago.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Reserva, Usuario, MetodoPago])],
  controllers: [ReservaController],
  providers: [ReservaService],  
})
export class ReservaModule {}