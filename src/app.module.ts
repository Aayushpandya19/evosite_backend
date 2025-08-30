import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { ProjectModule } from "./project/project.module";
import { SiteModule } from "./site/site.module";
import { TaskModule } from "./task/task.module";
import { MaterialModule } from "./material/material.module";
import { VendorModule } from "./vendor/vendor.module";
import { DocumentModule } from "./document/document.module";
import { InvoiceModule } from "./invoice/invoice.module";
import { PaymentModule } from "./payment/payment.module";
import { DashboardModule } from "./dashboard/dashboard.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        url: configService.get<string>("DATABASE_URL"),
        autoLoadEntities: true,
        synchronize: true,
        ssl:
          process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
      }),
    }),

    AuthModule,
    UserModule,
    ProjectModule,
    SiteModule,
    TaskModule,
    MaterialModule,
    VendorModule,
    DocumentModule,
    InvoiceModule,
    PaymentModule,
    DashboardModule,
  ],
})
export class AppModule {}
