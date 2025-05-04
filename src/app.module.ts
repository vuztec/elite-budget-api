import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { AcceptLanguageResolver, I18nModule, I18nOptions } from 'nestjs-i18n';
import * as path from 'path';
import { JwtModule } from '@nestjs/jwt';
import { TerminusModule } from '@nestjs/terminus';
import { DataSource } from 'typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
import { AuthMiddleware } from './shared/middlewares/auth.middleware';
import { LoggerMiddleware } from './shared/middlewares/logger.middleware';
import { RootusersModule } from './rootusers/rootusers.module';
import { IncomeModule } from './income/income.module';
import { DebtModule } from './debt/debt.module';
import { ExpensesModule } from './expenses/expenses.module';
import { JointSplitModule } from './joint-split/joint-split.module';
import { SavingsRetirementsModule } from './savings-retirements/savings-retirements.module';
import { ExtraFundsTrackerModule } from './extra-funds-tracker/extra-funds-tracker.module';
import { BankAccountsModule } from './bank-accounts/bank-accounts.module';
import { LoggerModule } from './logger/logger.module';
import { AuthModule } from './auth/auth.module';
import { ExtraPayChecksModule } from './extra-pay-checks/extra-pay-checks.module';
import { GoalsModule } from './goals/goals.module';
import { PaymentModule } from './payment/payment.module';
import { CouponsModule } from './coupons/coupons.module';
import { OtpModule } from './otp/otp.module';

import 'dotenv/config';
import { PinpointModule } from './pinpoint/pinpoint.module';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false, // should be set to false when setup of migrations is done
  autoLoadEntities: true,
  logging: process.env.DEBUG ? true : false,
  extra: {
    connectionLimit: 20, // Ensure this matches poolSize
    connectTimeout: 10000, // 10 seconds
    waitForConnections: true,
    queueLimit: 0, // No limit to the queue size
  },
};

export const i18nConfig: I18nOptions = {
  fallbackLanguage: 'en',
  loaderOptions: {
    path: path.join(__dirname, '/i18n/'),
    watch: true,
  },
  resolvers: [AcceptLanguageResolver],
};

export const configModuleOptions: ConfigModuleOptions = {
  isGlobal: true,
};

export const jwtConfig = {
  global: true,
  secret: process.env.JWT_SECRET,
  // signOptions: { expiresIn: '' },
};

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    TypeOrmModule.forRoot(typeOrmConfig),
    I18nModule.forRoot(i18nConfig),
    JwtModule.register(jwtConfig),
    ScheduleModule.forRoot(),
    TerminusModule,
    LoggerModule,
    RootusersModule,
    IncomeModule,
    DebtModule,
    ExpensesModule,
    JointSplitModule,
    SavingsRetirementsModule,
    ExtraFundsTrackerModule,
    BankAccountsModule,
    AuthModule,
    ExtraPayChecksModule,
    GoalsModule,
    PaymentModule,
    CouponsModule,
    OtpModule,
    PinpointModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/auth/login', method: RequestMethod.POST },
        { path: '/otp/verify', method: RequestMethod.POST },
        { path: '/auth/signup', method: RequestMethod.POST },
        { path: '/auth/forget-password', method: RequestMethod.POST },
        { path: '/auth/reset-password', method: RequestMethod.PATCH },
        { path: '/payment/webhook', method: RequestMethod.POST },
      )
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
