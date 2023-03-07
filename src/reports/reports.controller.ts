import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { CreateReportDto } from "./dtos/create-report.dto";
import { ReportsService } from "./reports.service";
import { AuthGuard } from "../guards/auth.guard";
import { CurrentUser } from "../users/decorators/current-user.decorator";
import { User } from "../users/user.entity";
import { Serialize } from "../incerceptors/serialize.interceptor";
import { ReportDto } from "./dtos/report.dto";
import { ApproveReportDto } from "./dtos/approve-report.dto";
import { AdminGuard } from "../guards/admin.guard";
import { GetEstimateDto } from "./dtos/get-estimate.dto";

@Controller('reports')
export class ReportsController {


  constructor(private service: ReportsService) {
  }

  @Post()
  @Serialize(ReportDto)
  @UseGuards(AuthGuard)
  create(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.service.create(body, user);
  }

  @UseGuards(AdminGuard)
  @Patch('/:id')
  approve(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return this.service.changeApproval(id, body.approved)
  }

  @Get()
  getEstimate(@Query() query: GetEstimateDto) {
    return this.service.createEstimate(query)
  }
}
