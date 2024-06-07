import { BadRequestException, ConflictException, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UsuarioDto } from './dto/create-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { FindManyOptions, FindOneOptions, Repository, UpdateResult } from 'typeorm';
import { Role } from 'src/rol/rol.enum';


@Injectable()
export class UsuarioService {
  constructor(@InjectRepository(Usuario) private readonly usuarioRepository: Repository<Usuario>) { }
  //crea un usuario
  public async create(userData: UsuarioDto): Promise<Usuario> {
    //si los datos ingresados no incluye role user o admin no deja crear
    if (userData.role && ![Role.User, Role.Admin].includes(userData.role)) {
      throw new HttpException(`El rol proporcionado no es válido`, HttpStatus.BAD_REQUEST)
    }
    //si el email ingresado coincide con uno existente no deja crear
    const existingUser = await this.usuarioRepository.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new HttpException('El correo electrónico proporcionado ya está en uso', HttpStatus.CONFLICT);
    }
    try {
      //si los datos ingresado coinciden con los de la dto y si no se proporciona un role, se asigna user por defecto
      let user: Usuario;
      if (userData.email && userData.password && userData.name && userData.lastname) {
        user = new Usuario(userData.name, userData.lastname, userData.username, userData.email, userData.password, userData.age, userData.direccion, userData.role);
        if (userData.role) {
          user.role = userData.role;
        } else {
          user.role = Role.User
        }
        //si está todo ok guarda ese user nuevo y lo retorna
        user = await this.usuarioRepository.save(user);
        return user;
      } else {
        throw new NotFoundException("No se proporcionaron todos los datos necesarios para crear el usuario");
      }
    } catch (error) {
      throw new HttpException('Error en la creación del usuario', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //obtiene todos los usuarios activos y no activos
  public async findAllUser(): Promise<Usuario[]> {
    try {
      let criterio: FindManyOptions = { relations: ['pedidos', 'reservas', 'pedidos.pedidosProducto.producto'] };
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

  //obtiene todos los usuarios activos que no han sido eliminados de la db
  async getUsuarioActivo(): Promise<Usuario[]> {
    try {
      const criterio: FindManyOptions = { relations: ['pedidos', 'reservas', 'pedidos.pedidosProducto.producto'], where: { deleted: false } };
      const usuario: Usuario[] = await this.usuarioRepository.find(criterio);
      if (usuario) return usuario;
      throw new NotFoundException(`No hay usuarios registrados en la base de datos`);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: `Error al intentar leer los usuarios en la base de datos; ${error}`
      },
        HttpStatus.NOT_FOUND);
    }
  }

  //obtiene un usuario según el email ingresado. método utilizado para el login
  public async findOneUser(email: string): Promise<Usuario> {
    try {
      let criterio: FindOneOptions = { where: { email: email } };
      const user = await this.usuarioRepository.findOne(criterio);
      if (user) return user;
      throw new NotFoundException(`Es usuario al cual hace referencia el id ${email} no se encuentra en la base de datos. Verifique los campos ingresados e intente nuevamente`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        // Si el error es NotFoundException, simplemente lo relanzamos
        throw error;
      } else if (error.name === 'QueryFailedError') {
        // Manejar errores específicos de TypeORM
        throw new HttpException(
          { status: HttpStatus.INTERNAL_SERVER_ERROR, error: `Error en la consulta a la base de datos. Detalles: ${error.message}` },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      } else {
        // Manejar cualquier otro tipo de error
        throw new InternalServerErrorException(
          `Se produjo un error inesperado al intentar obtener el usuario con email ${email}. Compruebe los datos ingresados e intente nuevamente. Detalles: ${error.message}`
        );
      }
    }
  }

  //obtiene un usuario según el id ingresado haya sido eliminado o no
  async findOne(id: number): Promise<Usuario> {
    try {
      //busca según los 2 criterios ingresados, relaciones y coincidencia por id
      let criterio: FindOneOptions = { 
        relations: ['pedidos', 'reservas', 'pedidos.pedidosProducto.producto'], 
        where: { id: id },
        order: {
          pedidos: {
            id: 'DESC' // Cambia 'fecha' por la columna que quieras usar para ordenar
          }
        } 
      };
      //si existe coincidencia lo guarda en la const user y lo retorna
      const user = await this.usuarioRepository.findOne(criterio);
      if (user) {

        return user
      } else {
        throw new NotFoundException(`El usuario con id ${id} al cual hace referencia no existe en la base de datos`);

      }
    } catch (error) {
      throw new HttpException({ status: HttpStatus.NOT_FOUND, error: `Se produjo un error al intentar obtener el usuario con id ${id}. Compruebe los datos ingresados e intente nuevamente` },
        HttpStatus.NOT_FOUND);
    }
  }

  //obtener el usuario que no ha sido removido según el id
  async getUsuarioByIdActivo(id: number): Promise<Usuario> {
    try {
      //utiliza 3 criterios de búsqueda, que esten relacionados con las entidades mensionadas, 
      //que el id ingresado coincida con el buscado y donde no ha sido elimanado
      const criterio: FindOneOptions = {
        relations: ['pedidos', 'reservas'],
        where: { idUsuario: id, where: { deleted: false } }
      }
      //busca un usuario según el criterio anterior utilizando el repositorio de typeOrm
      const usuario: Usuario = await this.usuarioRepository.findOne(criterio);
      //si el usuario ha sido encontrado lo retorna
      if (usuario) return usuario;
      throw new NotFoundException(`No se encontre el usuario con el id ${id}`);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: `Error al intentar leer el usuario de id ${id} en la base de datos; ${error}`
      },
        HttpStatus.NOT_FOUND);
    }
  }

  //actualizar datos
  async update(id: number, datos: UsuarioDto): Promise<Usuario> {
    try {
      //busco un usuario por id
      let updateUser: Usuario = await this.findOne(id);
      //si coinciden los datos obtenidos con los agregados guarda los cambios
      if (updateUser) {
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
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: `Error al intentar actualizar al usuario de id: ${id} con el nombre ${datos.email} en la base de datos; ${error}`
      },
        HttpStatus.NOT_FOUND);
    }

  }

  async softDelete(id: number) {
    // Busco el producto
    const usuarioExists: Usuario = await this.findOne(id);
    // Si el producto no existe, lanzamos una excepcion
    if (!usuarioExists) {
      throw new ConflictException('El usuario con el id ' + id + ' no existe');
    }
    // Si el producto esta borrado, lanzamos una excepcion
    if (usuarioExists.deleted) {
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

}