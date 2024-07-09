# Server side of seasensor application
### Description: application gives ability to create or load data from redis(if it already was created) about seasensors.

## About sensor:
- each sensor has own name, position, thruster speed, water speed and temperature
- position, water speed and water speed cant be manage by user, it increments/decrements by preset value, for simulationg real situation
- thruster speed can be manage by user ***(@Post /sensor/{name}/thruster )***
- sensor data updates every second and sents to client side by websockets
