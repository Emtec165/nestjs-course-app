import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateReportDto } from "./dtos/create-report.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Report } from "./resport.entity";
import { User } from "../users/user.entity";
import { GetEstimateDto } from "./dtos/get-estimate.dto";

@Injectable()
export class ReportsService {

  constructor(@InjectRepository(Report) private repository: Repository<Report>) {
  }

  create(dto: CreateReportDto, creator: User) {
    const report = this.repository.create(dto);
    report.user = creator;
    return this.repository.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repository.findOneBy({ id: parseInt(id) });
    if (!report) {
      throw new NotFoundException("report not found");
    }
    report.approved = approved;
    return this.repository.save(report);
  }

  createEstimate(dto: GetEstimateDto) {
    const { make, model, lng, lat, year, mileage } = dto;
    return this.repository.createQueryBuilder()
      .select("AVG(price)", "price")
      .where("approved IS TRUE")
      .andWhere("make = :make", { make })
      .andWhere("model = :model", { model })
      .andWhere("lng - :lng BETWEEN -5 AND 5", { lng })
      .andWhere("lat - :lat BETWEEN -5 AND 5", { lat })
      .andWhere("year - :year BETWEEN -3 AND 3", { year })
      .orderBy("ABS(mileage - :mileage)", "DESC")
      .setParameters({ mileage })
      .limit(3)
      .getRawOne();
  }
}
