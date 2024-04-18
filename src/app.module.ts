import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { TipoModule } from './tipo/tipo.module';
import { CategoriaModule } from './categoria/categoria.module';

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
    entities: [__dirname + "/entity/*{.js,.ts}"], //__dirname + "/entity/*{.js,.ts}"
    synchronize: false,
  }),
    TipoModule,
    CategoriaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
