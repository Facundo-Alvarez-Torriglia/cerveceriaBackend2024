import { Module, Res } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { TipoModule } from './tipo/tipo.module';
import { Sucursal } from './sucursal/entities/sucursal.entity';
import { Rol } from './rol/entities/rol.entity';
import { Usuario } from './usuario/entities/usuario.entity';
import { CategoriaModule } from './categoria/categoria.module';
import { ProductoModule } from './producto/producto.module';
import { RolModule } from './rol/rol.module';
import { SucursalModule } from './sucursal/sucursal.module';
import { UsuarioModule } from './usuario/usuario.module';
import { MetodoPagoModule } from './metodoPago/metodoPago.module';
import { ReservaModule } from './reservas/reserva.module';
import { Tipo } from './tipo/entidad/Tipo.entity';
import { Reserva } from './reservas/entities/Reserva.entity';
import { Producto } from './producto/entidad/Producto.entity';
import { MetodoPago } from './metodoPago/entities/MetodoPago.entity';
import { Categoria } from './categoria/entidad/Categoria.entity';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { Pedido } from './pedido/entity/pedido.entity';
import { PedidoModule } from './pedido/pedido.module';
import { PedidoProducto } from './pedido-producto/entity/pedido-producto';
import { PedidoProductoModule } from './pedido-producto/pedido-producto.module';


@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'app') }),
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'cerveceria',
    entities: [Sucursal,Rol,Usuario,Tipo,Reserva,Producto,MetodoPago,Categoria, Pedido, PedidoProducto], //__dirname + "/entity/*{.js,.ts}"
    synchronize: true,
  }),
    CategoriaModule,
    ProductoModule,
    RolModule,
    SucursalModule,
    TipoModule,
    UsuarioModule,
    ReservaModule,
    MetodoPagoModule,
    AuthModule, 
    PedidoModule,
    PedidoProductoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
