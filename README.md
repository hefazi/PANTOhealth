# PANTOhealth Backend Developer Technical Assessment
This project is a solution to the **PANTOhealth** technical assessment. It is composed of two NestJS applications:
- **panto-health-backend**: The main backend application that serves as a RabbitMQ consumer, processes x-ray data, stores it in MongoDB, and exposes a RESTFULL API.
- **panto-health-producer**: A simple producer application that simulates an IoT device sending x-ray data to the RabbitMQ queue.

## Part 1: RabbitMQ Consumer and Module
- _panto-health-backend_ is a NestJS application configured as a hybrid application, listening for both HTTP requests (for the API) and microservice events (from RabbitMQ).
- The _XRayModule_ contains the _XRayService_ which is decorated as a MessagePattern consumer, listening on the x-ray-data queue.
- It uses @nestjs/microservices and @nestjs/mongoose for integration.

## Part 2: Data Processing and Collections
- A Mongoose schema (xray.schema.ts) is defined to model the x-ray data with fields like deviceId, time, dataLength, and dataVolume.
- The XRayService implements the processing logic to parse the incoming data and save it to the signals collection in the MongoDB database.

## Part 3: API Development
- The XRayController exposes a RESTful API for CRUD operations on the signals collection.
- It includes a GET /signals/filter endpoint that allows filtering by deviceId and a time range.

## Part 4: Producer Application
- A separate NestJS application, panto-health-producer, is created to simulate the IoT device.
- It contains a simple ProducerService that injects a ClientProxy to connect to RabbitMQ and sends the provided sample data to the x-ray-data queue.

# Project Setup
## Prerequisites

- Node.js (v18 or higher)
- NestJS CLI: npm install -g @nestjs/cli
- A running instance of RabbitMQ and MongoDB. You can use Docker for this:
  - Run RabbitMQ:
    - `docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
`
  - Run MongoDB:
     - `docker run -d --name mongodb -p 27017:27017 mongo`

Running the Applications
Backend Application (panto-health-backend)

## 1. Navigate to the backend directory
`cd panto-health-backend`

## 2. Install dependencies
`yarn install`

## 3. Create a .env file from .env.example
`cp .env.example .env`

## 4. Start the application
`yarn run start:dev`

Producer Application (panto-health-producer)

## 1. Navigate to the producer directory
`cd panto-health-producer`

## 2. Install dependencies
`yarn install`

## 3. Create a .env file from .env.example
`cp .env.example .env`

## 4. Start the application (It will send the data once and exit)
`yarn start`

The producer will send the data, and the backend consumer will process and save it to the MongoDB database. You can then use tools like Postman to test the backend API endpoints.