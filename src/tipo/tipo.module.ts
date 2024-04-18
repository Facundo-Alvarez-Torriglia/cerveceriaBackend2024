import { Module } from '@nestjs/common';
import { TipoController } from './tipo.controller';
import { TipoService } from './tipo.service';

@Module({
  controllers: [TipoController],
  providers: [TipoService]
})
export class TipoModule {}
