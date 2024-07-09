import { PartialType } from '@nestjs/swagger';
import { ThrusterSpeedDto } from './thrusterSpeed.dto';

export class UpdateThrusterSpeedDto extends PartialType(ThrusterSpeedDto) {}
