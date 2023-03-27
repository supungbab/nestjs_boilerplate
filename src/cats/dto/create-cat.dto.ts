import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateCatDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNumber()
  @Min(0)
  readonly age: number;

  @IsString()
  @IsOptional()
  readonly breed: string;
}
