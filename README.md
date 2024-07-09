# Server side of seasensor application
### Description: application gives ability to create or load data from redis(if it already was created) about seasensors.

## About sensor:
- each sensor has own name, position, thruster speed, water speed and temperature
- position, water speed and water speed cant be manage by user, it increments/decrements by preset value, for simulationg real situation
- thruster speed can be manage by user ***(@Post /sensor/{name}/thruster )***
- sensor data updates every second and sents to client side by websockets
## Start project:
- copy repo
- install packages: ***npm install***
- run redis: ***sudo service redis-server start***
- run project: ***run dev start***
## P.S
- sensors when application close saves to redis, if sensors lost and you want to generate new, just change if statement in ***loadSensorsFromRedis()*** in ***sensor.service.ts*** if(sensorData) to if(!sensorData) (I'll fix it in future😊)
