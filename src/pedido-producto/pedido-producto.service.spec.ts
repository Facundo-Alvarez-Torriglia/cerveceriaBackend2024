import { Test, TestingModule } from '@nestjs/testing';
import { PedidoproductoService } from './pedido-producto.service';

describe('PedidoproductoService', () => {
  let service: PedidoproductoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PedidoproductoService],
    }).compile();

    service = module.get<PedidoproductoService>(PedidoproductoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
