import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenModule } from './token/token.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [TokenModule, NotificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
