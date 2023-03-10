import { Expose, Transform } from "class-transformer";

export class ReportDto {

  @Expose()
  id: number

  @Expose()
  approved: boolean

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  mileage: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  price: number;

  @Expose()
  @Transform(({ obj }) => obj.user.id)
  userId: number;

}