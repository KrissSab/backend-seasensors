// src/redis.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import * as redis from 'ioredis';

@Controller()
export class RedisController {
  private redisClient: redis.Redis;

  constructor() {
    this.redisClient = new redis.Redis();
  }

  @MessagePattern('get_sensors')
  async getSensors(): Promise<string | null> {
    return await this.redisClient.get('sensors');
  }

  @MessagePattern('save_sensors')
  async saveSensors(sensorsData: string): Promise<'OK'> {
    return await this.redisClient.set('sensors', sensorsData);
  }
}
