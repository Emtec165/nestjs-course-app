import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class TypeOrmConfig implements TypeOrmOptionsFactory {

  constructor(private configService: ConfigService) {
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: "sqlite",
      synchronize: false,
      database: this.configService.get<string>("DB_NAME"),
      autoLoadEntities: true,
      entities: ["**/*.entity.ts"],
      migrations: ["migrations/*.ts"],
      migrationsRun: this.configService.get<boolean>("DB_MIGRATIONS_RUN")
    };
  }
}