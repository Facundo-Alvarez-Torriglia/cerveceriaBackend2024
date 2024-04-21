import { Module } from '@nestjs/common';
import { CategoriaController } from './categoria.controller';
import { CategoriaService } from './categoria.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from 'src/producto/entidad/Producto.entity';
import { Categoria } from './entidad/Categoria.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Producto, Categoria])],
  controllers: [CategoriaController],
  providers: [CategoriaService]
})
export class CategoriaModule {}
