import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SensorModule } from './sensor/sensor.module';
import { RedisController } from './redis.controller';

@Module({
  imports: [SensorModule],
  controllers: [AppController, RedisController],
  providers: [AppService],
})
export class AppModule {}
