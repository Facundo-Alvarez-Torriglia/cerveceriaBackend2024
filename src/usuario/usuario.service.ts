import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UsuarioDto } from './dto/create-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class UsuarioService {
  constructor(@InjectRepository(Usuario) private readonly usuarioRepository: Repository<Usuario>) { }


  private async usuarioExistente(datos: UsuarioDto): Promise<void> {
    if (!datos.name || !datos.lastname || !datos.age || !datos.username || !datos.email || !datos.password) {
      throw new BadRequestException(`No puede tener campos vacíos`);
    }
    const existente: Usuario = await this.usuarioRepository.findOne({ where: { email: datos.email } });
    if (existente) {
      throw new ConflictException(`Usuario existente en la base de datos`);
    }
  }
  public async create(userData: UsuarioDto): Promise<Usuario> {
    const existingUser = await this.usuarioRepository.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new HttpException('El correo electrónico proporcionado ya está en uso', HttpStatus.CONFLICT);
    }
   try {
      let user: Usuario;
      if (userData.email && userData.password && userData.name && userData.lastname) {
        user = new Usuario(userData.name, userData.lastname, userData.username, userData.email, userData.password, userData.age, userData.direccion);
        user = await this.usuarioRepository.save(user);
        return user;
      } else {
        throw new NotFoundException("No se proporcionaron todos los datos necesarios para crear el usuario");
      }
    } catch (error) {
      throw new HttpException('Error en la creación del usuario', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  public async findAllUser() {
    try {
      let criterio: FindManyOptions = { relations: [] };
      const user = await this.usuarioRepository.find(criterio);
      if (user) return user;
      throw new Error('El fichero de usuario está vacio. Debe realizar primero una carga de datos')
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'Se produjo un error al intentar obtener los datos. Comprueba la ruta de busqueda e intente nuevamente' + error
      }, HttpStatus.NOT_FOUND);
    }

  }
  public async findOneUser(email:string): Promise<Usuario> {
    try {

      let criterio: FindOneOptions = { relations: [], where: { email: email } };
      const user = await this.usuarioRepository.findOne(criterio);
      if (user) return user;
      throw new NotFoundException(`Es usuario al cual hace referencia el id ${email} no se encuentra 
      en la base de datos. Verifique los campos ingresados e intente nuevamente`);
    } catch (error) {
      throw new HttpException({ status: HttpStatus.NOT_FOUND, error: `Se produjo un error al
       intentar obtener el usuario con id ${email}. Compruebe los datos ingresados e intente nuevamente` },
        HttpStatus.NOT_FOUND);
    }

  }
  async findOne(id: number): Promise<Usuario> {
    try {
      let criterio: FindOneOptions = { relations: [], where: { id: id } };
      const user = await this.usuarioRepository.findOne(criterio);
      if (user) return user;
      throw new NotFoundException(`El usuario con id ${id} al cual hace referencia no existe en la base de datos`);
    } catch (error) {
      throw new HttpException({ status: HttpStatus.NOT_FOUND, error: `Se produjo un error al intentar obtener el usuario con id ${id}. Compruebe los datos ingresados e intente nuevamente` },
        HttpStatus.NOT_FOUND);
    }

  }

  async update(id: number, datos: UsuarioDto) : Promise<Usuario>{
    try{
      let updateUser: Usuario  =await this.findOne(id);
      if (updateUser){
        updateUser.name = datos.name;
        updateUser.lastname = datos.lastname;
        updateUser.username = datos.username;
        updateUser.email = datos.email;
        updateUser.password = datos.password;
        updateUser.age = datos.age;
        updateUser.direccion = datos.direccion;
        updateUser = await this.usuarioRepository.save(updateUser);
        return updateUser;
      } 
    } catch (error) {
      throw new HttpException({ status: HttpStatus.NOT_FOUND,
          error: `Error al intentar actualizar al usuario de id: ${id} con el nombre ${datos.email} en la base de datos; ${error}`},
          HttpStatus.NOT_FOUND);
  }
    
  }

  async remove(id: number) : Promise<string>{
    try{
      const removeUser : Usuario = await this.findOne(id);
      if(removeUser){
        await this.usuarioRepository.remove(removeUser);
        return `El usuario con id:${id} ha sido eliminado
        correctamente de la base de datos`;
      }
    } catch (error) {
      throw new HttpException({ status: HttpStatus.NOT_FOUND,
          error: `Error al intentar eliminar el usuario de id ${id} en la base de datos; ${error}`},
          HttpStatus.NOT_FOUND);
  }
  }
}
