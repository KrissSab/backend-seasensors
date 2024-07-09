import { Sensor } from 'src/interfaces/sensor.interface';

function getRandomNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function generateForEachAxis(min: number, max: number): number[] {
  const vector: number[] = [];

  for (let axis = 0; axis < 3; axis++) {
    const value = getRandomNumber(min, max);
    vector.push(value);

    if (axis == 0 && min == Number(process.env.MIN_POSITION)) {
      vector.push(getRandomNumber(min, 0));
      axis += 1;
    }
  }
  return vector;
}

function updateSensorPostion(sensor: Sensor): void {
  for (let axis = 0; axis < 3; axis++) {
    sensor.position[axis] +=
      sensor.waterSpeed[axis] + sensor.thrustersSpeed[axis];
  }
}
function updateSensorWaterSpeed(sensor: Sensor): void {
  const possibleWaterSpeedChange = Number(
    process.env.POSSIBLE_WATER_SPEED_CHANGE,
  );
  for (let axis = 0; axis < 3; axis++) {
    sensor.waterSpeed[axis] += getRandomNumber(
      -possibleWaterSpeedChange,
      possibleWaterSpeedChange,
    );
  }
}
function updateSensorTemperature(sensor: Sensor): void {
  const possibleTemperatureChange = Number(
    process.env.POSSIBLE_TEMPERATURE_CHANGE,
  );
  sensor.temperature += getRandomNumber(
    -possibleTemperatureChange,
    possibleTemperatureChange,
  );
}

function updateAxisSpeed(axisSpeed: number, increment: number): number {
  if (increment !== undefined) {
    axisSpeed = +increment;
  }
  return axisSpeed;
}

export {
  getRandomNumber,
  generateForEachAxis,
  updateSensorPostion,
  updateSensorTemperature,
  updateSensorWaterSpeed,
  updateAxisSpeed,
};
