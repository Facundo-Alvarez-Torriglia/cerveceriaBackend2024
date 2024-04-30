import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetodoPagoService } from './metodoPago.service';
import { MetodoPagoController } from './metodoPago.controller';
import { MetodoPago } from './entities/MetodoPago.entity';
import { Reserva } from 'src/reservas/entities/Reserva.entity';
import { Pedido } from 'src/pedido/entity/pedido.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MetodoPago,Reserva, Pedido])],
  providers: [MetodoPagoService],
  controllers: [MetodoPagoController],
})
export class MetodoPagoModule {}