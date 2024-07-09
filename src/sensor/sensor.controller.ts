import { Body, Controller, Param, Post } from '@nestjs/common';
import { SensorService } from './sensor.service';
import { UpdateThrusterSpeedDto } from './dto/updateThrusterSpeed.dto';

@Controller('sensor')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Post(':name/thruster')
  async updateThrusterSpeed(
    @Param('name') name: string,
    @Body() updateThrusterSpeedDto: UpdateThrusterSpeedDto,
  ) {
    try {
      this.sensorService.updateThrusterSpeed(name, updateThrusterSpeedDto);
    } catch (error) {
      console.error('Failed to update speed', error);
    }
  }
}
