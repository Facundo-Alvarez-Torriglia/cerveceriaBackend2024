import { Module } from '@nestjs/common';
import { ProductoController } from './producto.controller';
import { ProductoService } from './producto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tipo } from 'src/tipo/entidad/Tipo.entity';
import { Producto } from './entidad/Producto.entity';
import { Categoria } from 'src/categoria/entidad/Categoria.entity';
import { TipoService } from 'src/tipo/tipo.service';
import { CategoriaService } from 'src/categoria/categoria.service';

@Module({
  imports:[TypeOrmModule.forFeature([Tipo, Producto, Categoria])],
  controllers: [ProductoController],
  providers: [ProductoService, TipoService, CategoriaService]
})
export class ProductoModule {}
