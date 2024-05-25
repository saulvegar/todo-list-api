import { IsString, MinLength } from 'class-validator';

export class CreateTodoDto {

  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(1)
  description: string;
}
