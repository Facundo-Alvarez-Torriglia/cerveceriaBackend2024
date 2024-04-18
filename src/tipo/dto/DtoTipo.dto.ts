import { IsString } from "class-validator";

export class DtoTipo {
  @IsString()
  nombre:string; 
}