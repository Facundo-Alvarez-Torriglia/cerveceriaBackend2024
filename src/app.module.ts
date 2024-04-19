import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { TipoModule } from './tipo/tipo.module';

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
    entities: [Sucursal,Rol,Usuario], //__dirname + "/entity/*{.js,.ts}"
    synchronize: true,
  }),
    TipoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
