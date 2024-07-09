import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Sensor } from 'src/interfaces/sensor.interface';
import {
  generateForEachAxis,
  getRandomNumber,
  updateAxisSpeed,
  updateSensorPostion,
  updateSensorTemperature,
  updateSensorWaterSpeed,
} from './calculations';
import * as cron from 'node-cron';
import { UpdateThrusterSpeedDto } from './dto/updateThrusterSpeed.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class SensorService implements OnModuleInit, OnModuleDestroy {
  private sensors: Sensor[] = [];
  private cronJob: cron.ScheduledTask;

  constructor(
    @Inject('SENSOR_SERVICE') private readonly redisClient: ClientProxy,
  ) {}

  private createSensors(): void {
    this.sensors = [];
    const sensorAmount = Number(process.env.SENSOR_AMOUNT);
    const sensorsName: string[] = process.env.SENSORS_NAMES?.split(',') || [];

    for (let sensorCount = 0; sensorCount < sensorAmount; sensorCount++) {
      this.sensors.push(this.generateSensor(sensorsName[sensorCount]));
    }
  }

  private generateSensor(name: string): Sensor {
    const position: number[] = generateForEachAxis(
      Number(process.env.MIN_POSITION),
      Number(process.env.MAX_POSITION),
    );

    const waterSpeed: number[] = generateForEachAxis(
      Number(process.env.MIN_WATER_SPEED),
      Number(process.env.MAX_WATER_SPEED),
    );

    const thrustersSpeed: number[] = waterSpeed.map((speed) => -speed);

    const temperature: number = getRandomNumber(
      Number(process.env.MIN_TEMPERATURE),
      Number(process.env.MAX_TEMPERATURE),
    );

    return { name, position, waterSpeed, thrustersSpeed, temperature };
  }

  private startSensorsUpdates(): void {
    this.cronJob = cron.schedule('*/1 * * * * *', () => {
      this.sensors.forEach((sensor) => {
        updateSensorPostion(sensor);
        updateSensorWaterSpeed(sensor);
        updateSensorTemperature(sensor);
      });
    });
  }
  private stopSensorUpdates() {
    if (this.cronJob) {
      this.cronJob.stop();
    }
  }

  private async loadSensorsFromRedis() {
    try {
      const sensorsData = await lastValueFrom(
        this.redisClient.send<string>('get_sensors', {}),
      );
      if (sensorsData) {
        this.sensors = JSON.parse(sensorsData);
        console.log('Sensors were loaded');
      } else {
        this.createSensors();
        console.log('Sensors were created');
      }
    } catch (error) {
      console.error('Failed to get sensors from Redis', error);
      this.createSensors();
    }
  }

  private async saveSensorsToRedis() {
    try {
      await lastValueFrom(
        this.redisClient.send('save_sensors', JSON.stringify(this.sensors)),
      );
      console.log('Sensors were saved');
    } catch (error) {
      console.error('Failed to save sensors data!', error);
    }
  }

  public async onModuleInit(): Promise<void> {
    await this.loadSensorsFromRedis();
    this.startSensorsUpdates();
    console.log('Module Init');
  }

  public async onModuleDestroy(): Promise<void> {
    this.stopSensorUpdates();
    await this.saveSensorsToRedis();
    console.log('Module Destroyed');
  }

  public getSensors(): Sensor[] {
    return this.sensors;
  }

  public updateThrusterSpeed(
    name: string,
    updateThrusterSpeedDto: UpdateThrusterSpeedDto,
  ) {
    const sensor: Sensor = this.sensors.find((sensor) => sensor.name === name);
    if (!sensor) {
      console.log('No such sensor');
      return null;
    }
    console.log('Hello');
    console.log(sensor);
    console.log('Hello');

    let { xAxisSpeed, yAxisSpeed, zAxisSpeed } = updateThrusterSpeedDto;

    if (xAxisSpeed != null) {
      sensor.thrustersSpeed[0] = sensor.thrustersSpeed[0] + xAxisSpeed;
    }
    if (yAxisSpeed != null) {
      sensor.thrustersSpeed[1] = sensor.thrustersSpeed[1] + yAxisSpeed;
    }
    if (zAxisSpeed != null) {
      sensor.thrustersSpeed[2] = sensor.thrustersSpeed[2] + zAxisSpeed;
    }

    return sensor;
  }
}
