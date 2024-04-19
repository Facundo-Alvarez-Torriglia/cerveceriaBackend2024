import { PartialType } from '@nestjs/mapped-types';
import { RolDto } from './create-rol.dto';

export class UpdateRolDto extends PartialType(RolDto) {}
