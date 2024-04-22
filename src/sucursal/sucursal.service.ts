import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { SucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';
import { Sucursal } from './entities/sucursal.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class SucursalService {
  constructor(@InjectRepository(Sucursal) private readonly sucursalRepository: Repository<Sucursal>){}
 public async create(datos: SucursalDto):Promise<Sucursal> {
   const existingSucursal = await this.sucursalRepository.findOne({where:{nombre: datos.nombre}});
     if(existingSucursal) {
       throw new HttpException(`La sucursal ${datos.nombre} ya se encuentra en la base de datos`, HttpStatus.CONFLICT);
     }
  try{
  let sucursal : Sucursal;
  if(datos.nombre && datos.direccion && datos.telefono) {
    sucursal = new Sucursal(datos.nombre, datos.telefono,datos.direccion, datos.imagen)
    sucursal = await this.sucursalRepository.save(sucursal);
    return sucursal;
  } else {
    throw new NotFoundException(`No se proporcionaron los datos necesarios para crear la sucursal`);
  }
  }catch(error){
    throw new HttpException(`Error en la creación de la sucursal ${datos.nombre}`, HttpStatus.INTERNAL_SERVER_ERROR);

  }
  } 

  public async findAll():Promise<Sucursal[]> {
    try {
      let criterio: FindManyOptions = { relations: [] };
      const sucursal = await this.sucursalRepository.find(criterio);
      if (sucursal) return sucursal;
      throw new Error('El fichero de sucursales está vacio. Debe realizar primero una carga de datos')
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'Se produjo un error al intentar obtener los datos. Comprueba la ruta de busqueda e intente nuevamente' + error
      }, HttpStatus.NOT_FOUND);
    }
  }

  async findOne(id: number): Promise<Sucursal> {
    try {
      let criterio: FindOneOptions = { relations: [], where: { id: id } };
      const sucursal = await this.sucursalRepository.findOne(criterio);
      if (sucursal) return sucursal;
      throw new NotFoundException(`La sucursal con id ${id} al cual hace referencia no existe en la base de datos`);
    } catch (error) {
      throw new HttpException({ status: HttpStatus.NOT_FOUND, error: `Se produjo un error al intentar obtener la sucursal con id ${id}. Compruebe los datos ingresados e intente nuevamente` },
        HttpStatus.NOT_FOUND);
    }
  }

  async update(id: number, datos: SucursalDto) : Promise<Sucursal>{
    try{
      let updateSucursal: Sucursal  =await this.findOne(id);
      if (updateSucursal){
        updateSucursal.nombre = datos.nombre;
        updateSucursal.dirección = datos.direccion;
        updateSucursal.telefono = datos.telefono;
        updateSucursal.imagen = datos.imagen;
        updateSucursal = await this.sucursalRepository.save(updateSucursal);
        return updateSucursal;
      } 
    } catch (error) {
      throw new HttpException({ status: HttpStatus.NOT_FOUND,
          error: `Error al intentar actualizar la sucursal de id: ${id} con el nombre ${datos.nombre} en la base de datos; ${error}`},
          HttpStatus.NOT_FOUND);
  }
    
  }

  public async remove(id: number) : Promise<string>{
    try{
      const removeSucursal : Sucursal = await this.findOne(id);
      if(removeSucursal){
        await this.sucursalRepository.remove(removeSucursal);
        return `La sucursal ${removeSucursal.nombre} con id:${id} ha sido eliminado correctamente de la base de datos`;
      }
    } catch (error) {
      throw new HttpException({ status: HttpStatus.NOT_FOUND,
          error: `Error al intentar eliminar la sucursal de id ${id} en la base de datos; ${error}`},
          HttpStatus.NOT_FOUND);
  }
  }
}
