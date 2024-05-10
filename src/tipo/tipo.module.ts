import { Module } from '@nestjs/common';
import { TipoController } from './tipo.controller';
import { TipoService } from './tipo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tipo } from './entidad/Tipo.entity';
import { Producto } from 'src/producto/entidad/Producto.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[TypeOrmModule.forFeature([Tipo, Producto]), AuthModule],
  controllers: [TipoController],
  providers: [TipoService]
})
export class TipoModule {}
