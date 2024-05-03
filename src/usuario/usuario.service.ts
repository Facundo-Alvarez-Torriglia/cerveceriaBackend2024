import { BadRequestException, ConflictException, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UsuarioDto } from './dto/create-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { FindManyOptions, FindOneOptions, Repository, UpdateResult } from 'typeorm';
import { Role } from 'src/rol/rol.enum';


@Injectable()
export class UsuarioService {
  constructor(@InjectRepository(Usuario) private readonly usuarioRepository: Repository<Usuario>) { }
  async softDelete(id: number){

    // Busco el producto
    const usuarioExists: Usuario = await this.findOne(id);

    // Si el producto no existe, lanzamos una excepcion
    if(!usuarioExists){
        throw new ConflictException('El usuario con el id ' + id + ' no existe');
    }

    // Si el producto esta borrado, lanzamos una excepcion
    if(usuarioExists.deleted){
        throw new ConflictException('El usuario esta ya borrado');
    }
    // Actualizamos la propiedad deleted
    const rows: UpdateResult = await this.usuarioRepository.update(
      { id },
      { deleted: true }
  );

  // Si afecta a un registro, devolvemos true
  return rows.affected == 1;
}

  public async create(userData: UsuarioDto): Promise<Usuario> {
    if (userData.role && ![Role.User, Role.Admin].includes(userData.role)){
      throw new HttpException(`El rol proporcionado no es válido`, HttpStatus.BAD_REQUEST)
    }
    
    const existingUser = await this.usuarioRepository.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new HttpException('El correo electrónico proporcionado ya está en uso', HttpStatus.CONFLICT);
    }
    try {
      let user: Usuario;
      if (userData.email && userData.password && userData.name && userData.lastname) {
        user = new Usuario(userData.name, userData.lastname, userData.username, userData.email, userData.password, userData.age, userData.direccion, userData.role);
        if(userData.role){
          user.role = userData.role;
        } else {
          user.role = Role.User
        }
        user = await this.usuarioRepository.save(user);
        return user;
      } else {
        throw new NotFoundException("No se proporcionaron todos los datos necesarios para crear el usuario");
      }
    } catch (error) {
      throw new HttpException('Error en la creación del usuario', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async findAllUser():Promise<Usuario[]> {
    try {
      let criterio: FindManyOptions = { relations: ['pedidos', 'reservas'] };
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
      let criterio: FindOneOptions = { relations: ['pedidos', 'reservas'], where: { email: email } };
      const user = await this.usuarioRepository.findOne(criterio);
      if (user) return user;
      throw new NotFoundException(`Es usuario al cual hace referencia el id ${email} no se encuentra en la base de datos. Verifique los campos ingresados e intente nuevamente`);
    } catch (error) {
      throw new HttpException({ status: HttpStatus.NOT_FOUND, error: `Se produjo un error al intentar obtener el usuario con id ${email}. Compruebe los datos ingresados e intente nuevamente` },
        HttpStatus.NOT_FOUND);
    }
  }

  async findOne(id: number): Promise<Usuario> {
    try {
      let criterio: FindOneOptions = { relations: ['pedidos','reservas'], where: { id: id } };
      const user = await this.usuarioRepository.findOne(criterio);
      if (user) {
        console.log("Estoy aqui");
        
        return user} else {
          throw new NotFoundException(`El usuario con id ${id} al cual hace referencia no existe en la base de datos`);

        }
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

  public async remove(id: number) : Promise<string>{
    try{
      const removeUser : Usuario = await this.findOne(id);
      if(removeUser){
        await this.usuarioRepository.remove(removeUser);
        return `El usuario ${removeUser.name} ${removeUser.lastname} con id:${id} ha sido eliminado correctamente de la base de datos`;
      }
    } catch (error) {
      throw new HttpException({ status: HttpStatus.NOT_FOUND,
          error: `Error al intentar eliminar el usuario de id ${id} en la base de datos; ${error}`},
          HttpStatus.NOT_FOUND);
  }
  }
}