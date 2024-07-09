export interface Sensor {
  readonly name: string;
  position: number[];
  waterSpeed: number[];
  thrustersSpeed: number[];
  temperature: number;
}
