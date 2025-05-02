import { IsString } from 'class-validator';

export class EmailDto {
  @IsString()
  Title: string;

  @IsString()
  Message: string;
}
