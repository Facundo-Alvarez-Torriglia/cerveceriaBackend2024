import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, ParseIntPipe, HttpStatus, ConflictException, HttpCode } from '@nestjs/common';
import { MetodoPagoService } from './metodoPago.service';
import { MetodoPagoDto } from './dto/metodoPago.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { AdminGuard } from 'src/auth/guard/admin.guard';
import { RequestLoginDto } from 'src/pedido/dto/request-login-dto.dto';
import { MetodoPago } from './entities/MetodoPago.entity';

@Controller('metodoPago')
export class MetodoPagoController {
  constructor(private readonly metodoPagoService: MetodoPagoService) {}

  @Get()
  async findAll(): Promise<MetodoPagoDto[]> {
    const metodoPagos: MetodoPago[] = await this.metodoPagoService.findAll();
    return metodoPagos.map(metodoPago => ({
      metodoPago: metodoPago.metodoPago,
      usuario: metodoPago.usuario
    }));
  }

  @Post()
  @HttpCode(201)
  @UseGuards(AdminGuard)
  async create( @Body() datos: MetodoPagoDto): Promise<MetodoPagoDto> {
    return this.metodoPagoService.create(datos);
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id', new ParseIntPipe ({
    errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
  })) id: number): Promise<MetodoPagoDto> {
    return await this.metodoPagoService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @UseGuards(AdminGuard)
  async update(@Request() req: Request & { user: RequestLoginDto }, @Param('id', new ParseIntPipe({
    errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
  })) id: number, @Body() datos: MetodoPagoDto): Promise<MetodoPago> {
    const usuarioAutenticado = req.user;
    if (datos.usuario === usuarioAutenticado.sub) {
      return this.metodoPagoService.update(id, datos);
    }
    throw new ConflictException(`El usuario ${datos.usuario} es distinto al usuario logueado.`)
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @UseGuards(AdminGuard)
  async remove(@Request() req: Request & { user: RequestLoginDto }, @Param('id', new ParseIntPipe({
    errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
  })) id: number, @Body() datos: MetodoPagoDto): Promise<void> {
    const usuarioAutenticado = req.user;
    if (datos.usuario === usuarioAutenticado.sub) {
      return await this.metodoPagoService.remove(id);
    }
  }
}